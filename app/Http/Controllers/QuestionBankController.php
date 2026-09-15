<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\QuestionBankItem;
use App\Services\LessonQuestionGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class QuestionBankController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorizeManager($request);
        $user = $request->user();

        $base = QuestionBankItem::query()
            ->when($user->isTeacher(), fn ($q) => $q->where('created_by', $user->id));

        $items = (clone $base)
            ->with(['course:id,title', 'lesson:id,title'])
            ->when($request->filled('course_id'), fn ($q) => $q->where('course_id', $request->integer('course_id')))
            ->when($request->filled('skill'), fn ($q) => $q->where('skill', $request->string('skill')))
            ->when($request->filled('difficulty'), fn ($q) => $q->where('difficulty', $request->string('difficulty')))
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            ->when($request->filled('search'), fn ($q) => $q->where('prompt', 'like', '%'.$request->string('search').'%'))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $courses = Course::query()
            ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
            ->with(['lessons' => fn ($q) => $q->orderBy('sort_order')->orderBy('id')->select('id', 'course_id', 'title', 'is_interactive', 'interactive_payload')])
            ->orderBy('title')
            ->get(['id', 'title', 'level']);

        $studioLessons = $courses
            ->flatMap(fn (Course $course) => $course->lessons
                ->filter(fn (Lesson $lesson) => $lesson->isGeneratedWorksheet())
                ->map(fn (Lesson $lesson) => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'course_id' => $course->id,
                    'course_title' => $course->title,
                ]))
            ->values();

        return Inertia::render('QuestionBank/Index', [
            'items' => $items,
            'courses' => $courses,
            'studioLessons' => $studioLessons,
            'filters' => $request->only('course_id', 'skill', 'difficulty', 'type', 'search'),
            'skills' => (clone $base)->whereNotNull('skill')->distinct()->orderBy('skill')->pluck('skill'),
            'stats' => [
                'total' => (clone $base)->count(),
                'easy' => (clone $base)->where('difficulty', 'easy')->count(),
                'medium' => (clone $base)->where('difficulty', 'medium')->count(),
                'hard' => (clone $base)->where('difficulty', 'hard')->count(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeManager($request);
        $data = $this->validatedQuestion($request);
        $this->assertCourseAccess($request, $data['course_id'] ?? null);

        QuestionBankItem::query()->create([...$data, 'created_by' => $request->user()->id]);

        return back()->with('success', 'تم حفظ السؤال في البنك ويمكن استخدامه مرات غير محدودة.');
    }

    public function update(Request $request, QuestionBankItem $question): RedirectResponse
    {
        $this->authorizeQuestion($request, $question);
        $data = $this->validatedQuestion($request);
        $this->assertCourseAccess($request, $data['course_id'] ?? null);
        $question->update($data);

        return back()->with('success', 'تم تحديث السؤال.');
    }

    public function destroy(Request $request, QuestionBankItem $question): RedirectResponse
    {
        $this->authorizeQuestion($request, $question);
        $question->delete();

        return back()->with('success', 'تم حذف السؤال من البنك.');
    }

    public function generate(Request $request): RedirectResponse
    {
        $this->authorizeManager($request);
        $data = $request->validate([
            'target' => ['required', Rule::in(['exam', 'assignment'])],
            'course_id' => ['required', 'exists:courses,id'],
            'lesson_id' => ['nullable', Rule::exists('lessons', 'id')->where(fn ($q) => $q->where('course_id', $request->input('course_id')))],
            'title' => ['required', 'string', 'max:255'],
            'count' => ['required', 'integer', 'min:1', 'max:50'],
            'difficulty' => ['nullable', Rule::in(['easy', 'medium', 'hard'])],
            'skill' => ['nullable', 'string', 'max:100'],
            'duration_minutes' => ['nullable', 'integer', 'min:1', 'max:600'],
            'pass_percent' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
        $this->assertCourseAccess($request, (int) $data['course_id']);

        $query = QuestionBankItem::query()
            ->where('is_active', true)
            ->where(fn ($q) => $q->where('course_id', $data['course_id'])->orWhereNull('course_id'))
            ->when($request->user()->isTeacher(), fn ($q) => $q->where('created_by', $request->user()->id))
            ->when($data['lesson_id'] ?? null, fn ($q, $lesson) => $q->where(fn ($inner) => $inner->where('lesson_id', $lesson)->orWhereNull('lesson_id')))
            ->when($data['difficulty'] ?? null, fn ($q, $difficulty) => $q->where('difficulty', $difficulty))
            ->when($data['skill'] ?? null, fn ($q, $skill) => $q->where('skill', $skill));

        $questions = $query->inRandomOrder()->limit((int) $data['count'])->get();
        if ($questions->count() < (int) $data['count']) {
            return back()->withErrors(['count' => "المتوفر حسب الفلاتر {$questions->count()} سؤال فقط. خفف العدد أو غيّر الفلاتر."]);
        }

        return DB::transaction(function () use ($request, $data, $questions) {
            $questions->each->increment('times_used');

            if ($data['target'] === 'exam') {
                $exam = Exam::query()->create([
                    'course_id' => $data['course_id'],
                    'lesson_id' => $data['lesson_id'] ?? null,
                    'created_by' => $request->user()->id,
                    'title' => $data['title'],
                    'description' => 'تم إنشاؤه تلقائياً من بنك الأسئلة — راجعه ثم انشره.',
                    'duration_minutes' => $data['duration_minutes'] ?? 20,
                    'pass_percent' => $data['pass_percent'] ?? 60,
                    'max_attempts' => 2,
                    'stars_reward' => 5,
                    'is_published' => false,
                ]);

                foreach ($questions as $index => $question) {
                    $exam->questions()->create([
                        'type' => $question->type,
                        'prompt' => $question->prompt,
                        'options' => $question->options,
                        'correct_answers' => $question->correct_answers,
                        'points' => $question->points,
                        'sort_order' => $index + 1,
                        'explanation' => $question->explanation,
                    ]);
                }

                return redirect()->route('exams.show', $exam)->with('success', 'تم تجهيز مسودة الفحص. راجع الأسئلة ثم انشرها.');
            }

            $instructions = $questions->values()->map(function ($question, $index) {
                $line = ($index + 1).'. '.$question->prompt;
                if ($question->options) {
                    $line .= "\n   ".collect($question->options)->map(fn ($option, $i) => chr(65 + $i).') '.$option)->implode('   ');
                }

                return $line;
            })->implode("\n\n");

            $assignment = Assignment::query()->create([
                'course_id' => $data['course_id'],
                'lesson_id' => $data['lesson_id'] ?? null,
                'created_by' => $request->user()->id,
                'title' => $data['title'],
                'instructions' => "أجب عن الأسئلة الآتية:\n\n".$instructions,
                'max_score' => min(100, max(1, (int) $questions->sum('points'))),
                'stars_reward' => 5,
                'is_published' => false,
            ]);

            return redirect()->route('assignments.show', $assignment)->with('success', 'تم تجهيز مسودة الواجب. راجعها قبل النشر.');
        });
    }

    public function generateFromLesson(Request $request, LessonQuestionGenerator $generator): RedirectResponse
    {
        $this->authorizeManager($request);
        $data = $request->validate([
            'lesson_id' => ['required', 'exists:lessons,id'],
            'max' => ['nullable', 'integer', 'min:1', 'max:30'],
            'also_exam' => ['sometimes', 'boolean'],
            'exam_title' => ['nullable', 'string', 'max:255'],
        ]);

        $lesson = Lesson::query()->with('course:id,title,teacher_id')->findOrFail($data['lesson_id']);
        $this->assertCourseAccess($request, (int) $lesson->course_id);
        abort_unless($lesson->isGeneratedWorksheet(), 422, 'هذا الدرس ليس من استوديو الدروس التفاعلية.');

        $drafts = $generator->fromLesson($lesson, (int) ($data['max'] ?? 12));
        if ($drafts === []) {
            return back()->withErrors(['lesson_id' => 'ما قدرنا نستخرج أسئلة من هذا الدرس. جرّب درساً فيه قصة أو أسئلة أو كلمات.']);
        }

        $created = 0;
        $savedIds = [];

        DB::transaction(function () use ($request, $lesson, $drafts, &$created, &$savedIds) {
            foreach ($drafts as $draft) {
                $exists = QuestionBankItem::query()
                    ->where('created_by', $request->user()->id)
                    ->where('lesson_id', $lesson->id)
                    ->where('prompt', $draft['prompt'])
                    ->exists();
                if ($exists) {
                    continue;
                }

                $item = QuestionBankItem::query()->create([
                    ...$draft,
                    'created_by' => $request->user()->id,
                    'course_id' => $lesson->course_id,
                    'lesson_id' => $lesson->id,
                    'is_active' => true,
                    'times_used' => 0,
                ]);
                $savedIds[] = $item->id;
                $created++;
            }
        });

        if ($created === 0) {
            return redirect()
                ->route('question-bank.index', ['course_id' => $lesson->course_id])
                ->with('success', 'الأسئلة مستخرجة مسبقاً لهذا الدرس. يمكنك توليد فحص منها من البنك.');
        }

        if (! empty($data['also_exam']) && count($savedIds) > 0) {
            $questions = QuestionBankItem::query()->whereIn('id', $savedIds)->get();
            $exam = Exam::query()->create([
                'course_id' => $lesson->course_id,
                'lesson_id' => $lesson->id,
                'created_by' => $request->user()->id,
                'title' => $data['exam_title'] ?: ('فحص · '.$lesson->title),
                'description' => 'مسودة مولّدة من درس الاستوديو — راجعها ثم انشرها.',
                'duration_minutes' => max(10, min(40, $questions->count() * 2)),
                'pass_percent' => 60,
                'max_attempts' => 2,
                'stars_reward' => 5,
                'is_published' => false,
            ]);

            foreach ($questions as $index => $question) {
                $exam->questions()->create([
                    'type' => $question->type,
                    'prompt' => $question->prompt,
                    'options' => $question->options,
                    'correct_answers' => $question->correct_answers,
                    'points' => $question->points,
                    'sort_order' => $index + 1,
                    'explanation' => $question->explanation,
                ]);
                $question->increment('times_used');
            }

            return redirect()
                ->route('exams.show', $exam)
                ->with('success', "أُضيف {$created} سؤالاً للبنك وتجهيزت مسودة فحص للمراجعة.");
        }

        return redirect()
            ->route('question-bank.index', ['course_id' => $lesson->course_id])
            ->with('success', "أُضيف {$created} سؤالاً إلى بنك الأسئلة من الدرس «{$lesson->title}».");
    }

    private function validatedQuestion(Request $request): array
    {
        $data = $request->validate([
            'course_id' => ['nullable', 'exists:courses,id'],
            'lesson_id' => ['nullable', Rule::exists('lessons', 'id')->where(fn ($q) => $q->where('course_id', $request->input('course_id')))],
            'grade_level' => ['nullable', 'string', 'max:100'],
            'skill' => ['required', 'string', 'max:100'],
            'difficulty' => ['required', Rule::in(['easy', 'medium', 'hard'])],
            'type' => ['required', Rule::in(['single', 'multiple', 'true_false', 'short'])],
            'prompt' => ['required', 'string', 'max:2000'],
            'options' => ['nullable', 'array', 'max:6'],
            'options.*' => ['nullable', 'string', 'max:500'],
            'correct_answers' => ['nullable', 'array'],
            'correct_answers.*' => ['nullable', 'string', 'max:500'],
            'points' => ['required', 'integer', 'min:1', 'max:100'],
            'explanation' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($data['type'] === 'true_false') {
            $data['options'] = ['صح', 'خطأ'];
        } elseif ($data['type'] === 'short') {
            $data['options'] = null;
            $data['correct_answers'] = null;
        } else {
            $data['options'] = array_values(array_filter($data['options'] ?? [], fn ($value) => filled($value)));
            abort_if(count($data['options']) < 2, 422, 'أضف خيارين على الأقل.');
        }

        return $data;
    }

    private function authorizeManager(Request $request): void
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);
    }

    private function authorizeQuestion(Request $request, QuestionBankItem $question): void
    {
        $this->authorizeManager($request);
        abort_unless($request->user()->isAdmin() || $question->created_by === $request->user()->id, 403);
    }

    private function assertCourseAccess(Request $request, ?int $courseId): void
    {
        if (! $courseId || $request->user()->isAdmin()) {
            return;
        }

        abort_unless(Course::query()->whereKey($courseId)->where('teacher_id', $request->user()->id)->exists(), 403);
    }
}
