<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\BuildsLessonShowResponse;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    use BuildsLessonShowResponse;

    public function index(Request $request): Response
    {
        $user = $request->user();

        $lessons = Lesson::query()
            ->with('course:id,title,teacher_id')
            ->when($user->isTeacher(), fn ($q) => $q->whereHas('course', fn ($c) => $c->where('teacher_id', $user->id)))
            ->when($user->isStudent(), fn ($q) => $q
                ->where('is_published', true)
                ->whereHas('course', fn ($c) => $c->where('is_published', true))
                ->whereHas('course.enrollments', fn ($e) => $e->where('user_id', $user->id)))
            ->when($request->course_id, fn ($q) => $q->where('course_id', $request->course_id))
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Lessons/Index', [
            'lessons' => $lessons,
            'courses' => $this->manageableCourses($request),
            'filters' => $request->only('course_id'),
            'canManage' => $user->isAdmin() || $user->isTeacher(),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        return Inertia::render('Lessons/Form', [
            'lesson' => null,
            'courses' => $this->manageableCourses($request),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $this->validated($request);
        $this->assertCourseAccess($request, (int) $data['course_id']);
        $data['slug'] = Lesson::uniqueSlug((int) $data['course_id'], $data['title']);

        Lesson::create($data);

        return redirect()->route('lessons.index')->with('success', 'تم إنشاء الدرس.');
    }

    public function show(Request $request, Lesson $lesson): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();

        if ($user->isStudent()) {
            $lesson->loadMissing('course:id,slug,is_published');
            if ($lesson->course?->slug) {
                return redirect()->route('explore.learn', [
                    'course' => $lesson->course->slug,
                    'lesson' => $lesson->id,
                ]);
            }
        }

        $canManage = $user->isAdmin()
            || ($user->isTeacher() && $lesson->course?->teacher_id === $user->id);

        if ($user->isStudent()) {
            abort_unless($lesson->is_published && $lesson->course?->is_published, 404);
            abort_unless(
                Enrollment::query()->where('user_id', $user->id)->where('course_id', $lesson->course_id)->exists(),
                403
            );
        } elseif (! $canManage) {
            abort(403);
        }

        return Inertia::render('Lessons/Show', [
            ...$this->lessonShowData($request, $lesson),
            'publicMode' => false,
            'courseSlug' => null,
        ]);
    }

    public function edit(Request $request, Lesson $lesson): Response
    {
        $this->assertCourseAccess($request, $lesson->course_id);
        $lesson->resolveWorksheetMedia();

        return Inertia::render('Lessons/Form', [
            'lesson' => $lesson,
            'courses' => $this->manageableCourses($request),
        ]);
    }

    public function update(Request $request, Lesson $lesson): RedirectResponse
    {
        $this->assertCourseAccess($request, $lesson->course_id);
        $data = $this->validated($request);
        $this->assertCourseAccess($request, (int) $data['course_id']);

        if ($data['title'] !== $lesson->title || (int) $data['course_id'] !== $lesson->course_id) {
            $data['slug'] = Lesson::uniqueSlug((int) $data['course_id'], $data['title'], $lesson->id);
        }

        $lesson->update($data);

        return redirect()->route('lessons.index')->with('success', 'تم تحديث الدرس.');
    }

    public function destroy(Request $request, Lesson $lesson): RedirectResponse
    {
        $this->assertCourseAccess($request, $lesson->course_id);
        $lesson->delete();

        return redirect()->route('lessons.index')->with('success', 'تم حذف الدرس.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
            'is_interactive' => ['sometimes', 'boolean'],
            'stars_reward' => ['nullable', 'integer', 'min:1', 'max:20'],
            'interactive_payload' => ['nullable', 'array'],
            'interactive_payload.type' => ['nullable', 'in:'.implode(',', Lesson::ACTIVITY_TYPES)],
            'interactive_payload.instruction' => ['nullable', 'string', 'max:1000'],
            'interactive_payload.show_outlines' => ['nullable', 'boolean'],
            'interactive_payload.pages' => ['nullable', 'array', 'max:20'],
            'interactive_payload.pages.*.id' => ['nullable', 'string', 'max:80'],
            'interactive_payload.pages.*.image' => ['nullable', 'string', 'max:500'],
            'interactive_payload.pages.*.title' => ['nullable', 'string', 'max:255'],
            'interactive_payload.pages.*.zones' => ['nullable', 'array', 'max:80'],
            'interactive_payload.pages.*.zones.*.id' => ['nullable', 'string', 'max:80'],
            'interactive_payload.pages.*.zones.*.type' => ['nullable', 'in:click,fill,select'],
            'interactive_payload.pages.*.zones.*.x' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'interactive_payload.pages.*.zones.*.y' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'interactive_payload.pages.*.zones.*.w' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'interactive_payload.pages.*.zones.*.h' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'interactive_payload.pages.*.zones.*.correct' => ['nullable', 'boolean'],
            'interactive_payload.pages.*.zones.*.answer' => ['nullable', 'string', 'max:500'],
            'interactive_payload.pages.*.zones.*.label' => ['nullable', 'string', 'max:255'],
            'interactive_payload.pages.*.zones.*.hint' => ['nullable', 'string', 'max:500'],
            'interactive_payload.pages.*.zones.*.options' => ['nullable', 'array', 'max:8'],
            'interactive_payload.pages.*.zones.*.options.*' => ['nullable', 'string', 'max:255'],
            'interactive_payload.pages.*.zones.*.correct_index' => ['nullable', 'integer', 'min:0'],
            'interactive_payload.template' => ['nullable', 'in:letter_adventure,letter_story,story_tap,story_quiz,pick_only,find_letter,build_word,match_pairs,trace_only,grade_track,text_lab,grammar_fix,writing_workshop,voice_reading'],
            'interactive_payload.letter' => ['nullable', 'string', 'max:4'],
            'interactive_payload.grade_level' => ['nullable', 'integer', 'min:1', 'max:9'],
            'interactive_payload.theme' => ['nullable', 'string', 'max:40'],
            'interactive_payload.title' => ['nullable', 'string', 'max:255'],
            'interactive_payload.blocks' => ['nullable', 'array', 'max:20'],
            'interactive_payload.blocks.*.id' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.kind' => ['nullable', 'in:story,vocab_grid,pick_grid,trace_letter,match_pairs,story_tap,story_quiz,find_letter,build_word,text_lab,grammar_fix,writing_workshop,voice_reading'],
            'interactive_payload.blocks.*.title' => ['nullable', 'string', 'max:255'],
            'interactive_payload.blocks.*.text' => ['nullable', 'string', 'max:8000'],
            'interactive_payload.blocks.*.prompt' => ['nullable', 'string', 'max:1000'],
            'interactive_payload.blocks.*.letter' => ['nullable', 'string', 'max:4'],
            'interactive_payload.blocks.*.count' => ['nullable', 'integer', 'min:1', 'max:12'],
            'interactive_payload.blocks.*.min_words' => ['nullable', 'integer', 'min:1', 'max:500'],
            'interactive_payload.blocks.*.rubric' => ['nullable', 'string', 'max:500'],
            'interactive_payload.blocks.*.passage' => ['nullable', 'string', 'max:4000'],
            'interactive_payload.blocks.*.mode' => ['nullable', 'in:reading,dictation'],
            'interactive_payload.blocks.*.max_seconds' => ['nullable', 'integer', 'min:10', 'max:300'],
            'interactive_payload.blocks.*.highlight' => ['nullable', 'array', 'max:40'],
            'interactive_payload.blocks.*.highlight.*' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.paragraphs' => ['nullable', 'array', 'max:40'],
            'interactive_payload.blocks.*.paragraphs.*' => ['nullable', 'string', 'max:2000'],
            'interactive_payload.blocks.*.tokens' => ['nullable', 'array', 'max:400'],
            'interactive_payload.blocks.*.tokens.*.id' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.tokens.*.text' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.tokens.*.clean' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.tokens.*.correct' => ['nullable', 'boolean'],
            'interactive_payload.blocks.*.items' => ['nullable', 'array', 'max:24'],
            'interactive_payload.blocks.*.items.*.id' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.items.*.icon' => ['nullable', 'string', 'max:40'],
            'interactive_payload.blocks.*.items.*.label' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.items.*.starts_with' => ['nullable', 'boolean'],
            'interactive_payload.blocks.*.items.*.question' => ['nullable', 'string', 'max:500'],
            'interactive_payload.blocks.*.items.*.sentence' => ['nullable', 'string', 'max:500'],
            'interactive_payload.blocks.*.items.*.options' => ['nullable', 'array', 'max:6'],
            'interactive_payload.blocks.*.items.*.options.*' => ['nullable', 'string', 'max:200'],
            'interactive_payload.blocks.*.items.*.correct_index' => ['nullable', 'integer', 'min:0'],
            'interactive_payload.blocks.*.items.*.scrambled' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.items.*.answer' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.items.*.letter' => ['nullable', 'string', 'max:4'],
            'interactive_payload.blocks.*.items.*.positions' => ['nullable', 'array', 'max:20'],
            'interactive_payload.blocks.*.items.*.positions.*' => ['nullable', 'integer', 'min:0'],
            'interactive_payload.skill' => ['nullable', 'string', 'max:50'],
            'interactive_payload.objective' => ['nullable', 'string', 'max:500'],
            'interactive_payload.items' => ['nullable', 'array'],
            'interactive_payload.items.*.prompt' => ['nullable', 'string', 'max:500'],
            'interactive_payload.items.*.sentence' => ['nullable', 'string', 'max:500'],
            'interactive_payload.items.*.answer' => ['nullable', 'string', 'max:500'],
            'interactive_payload.questions' => ['nullable', 'array'],
            'interactive_payload.questions.*.id' => ['nullable', 'string', 'max:50'],
            'interactive_payload.questions.*.question' => ['required_with:interactive_payload.questions', 'string', 'max:1000'],
            'interactive_payload.questions.*.options' => ['required_with:interactive_payload.questions', 'array', 'min:2'],
            'interactive_payload.questions.*.options.*' => ['required', 'string', 'max:500'],
            'interactive_payload.questions.*.correct_index' => ['required_with:interactive_payload.questions', 'integer', 'min:0'],
            'interactive_payload.questions.*.explanation' => ['nullable', 'string', 'max:1000'],
        ]);

        if (! ($data['is_interactive'] ?? false)) {
            $data['interactive_payload'] = null;
        } elseif (! isset($data['interactive_payload'])) {
            $data['interactive_payload'] = ['type' => 'quiz', 'questions' => []];
        } else {
            $data['interactive_payload'] = Lesson::sanitizeInteractivePayload($data['interactive_payload']);
        }

        if (! empty($data['video_url'])) {
            $data['video_url'] = trim($data['video_url']);
        }

        return $data;
    }

    private function manageableCourses(Request $request)
    {
        $user = $request->user();

        return Course::query()
            ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
            ->orderBy('title')
            ->get(['id', 'title']);
    }

    private function assertCourseAccess(Request $request, int $courseId): void
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return;
        }

        abort_unless(
            $user->isTeacher() && Course::where('id', $courseId)->where('teacher_id', $user->id)->exists(),
            403
        );
    }

}
