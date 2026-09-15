<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GeneratedLessonController extends Controller
{
    public function create(Request $request): Response
    {
        return $this->renderStudio($request);
    }

    public function studio(Request $request): Response
    {
        return $this->renderStudio($request);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeManager($request);
        $data = $this->validatedLesson($request);
        $this->assertCourseAccess($request, (int) $data['course_id']);

        $lesson = Lesson::query()->create([
            ...$data,
            'slug' => Lesson::uniqueSlug((int) $data['course_id'], $data['title']),
            'is_interactive' => true,
            'interactive_payload' => $data['interactive_payload'],
        ]);

        return redirect()->route('lessons.show', $lesson)->with('success', 'تم إنشاء الدرس التفاعلي من القالب.');
    }

    public function edit(Request $request, Lesson $lesson): Response
    {
        $this->assertCourseAccess($request, $lesson->course_id);
        abort_unless($lesson->isGeneratedWorksheet(), 404);

        return $this->renderStudio($request, $lesson);
    }

    public function update(Request $request, Lesson $lesson): RedirectResponse
    {
        $this->assertCourseAccess($request, $lesson->course_id);
        $data = $this->validatedLesson($request);
        $this->assertCourseAccess($request, (int) $data['course_id']);

        if ($data['title'] !== $lesson->title || (int) $data['course_id'] !== $lesson->course_id) {
            $data['slug'] = Lesson::uniqueSlug((int) $data['course_id'], $data['title'], $lesson->id);
        }

        $lesson->update([
            ...$data,
            'is_interactive' => true,
            'interactive_payload' => $data['interactive_payload'],
        ]);

        return redirect()->route('lessons.show', $lesson)->with('success', 'تم حفظ الدرس التفاعلي.');
    }

    private function renderStudio(Request $request, ?Lesson $lesson = null): Response
    {
        $this->authorizeManager($request);

        return Inertia::render('Lessons/Studio', [
            'lesson' => $lesson,
            'courses' => $this->manageableCourses($request),
            'recent' => $this->recentGenerated($request),
            'initialMode' => $request->query('mode'),
        ]);
    }

    private function validatedLesson(Request $request): array
    {
        $data = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
            'stars_reward' => ['nullable', 'integer', 'min:1', 'max:20'],
            'interactive_payload' => ['required', 'array'],
            'interactive_payload.type' => ['required', 'in:generated_worksheet'],
            'interactive_payload.template' => ['required', 'in:letter_adventure,letter_story,story_tap,story_quiz,pick_only,find_letter,build_word,match_pairs,trace_only,grade_track,text_lab,grammar_fix,writing_workshop,voice_reading'],
            'interactive_payload.letter' => ['nullable', 'string', 'max:4'],
            'interactive_payload.grade_level' => ['nullable', 'integer', 'min:1', 'max:9'],
            'interactive_payload.theme' => ['nullable', 'string', 'max:40'],
            'interactive_payload.skill' => ['nullable', 'string', 'max:50'],
            'interactive_payload.objective' => ['nullable', 'string', 'max:500'],
            'interactive_payload.instruction' => ['nullable', 'string', 'max:1000'],
            'interactive_payload.title' => ['nullable', 'string', 'max:255'],
            'interactive_payload.blocks' => ['required', 'array', 'min:1', 'max:20'],
            'interactive_payload.blocks.*.id' => ['nullable', 'string', 'max:80'],
            'interactive_payload.blocks.*.kind' => ['required', 'in:story,vocab_grid,pick_grid,trace_letter,match_pairs,story_tap,story_quiz,find_letter,build_word,text_lab,grammar_fix,writing_workshop,voice_reading'],
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
        ]);

        $data['is_interactive'] = true;
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['stars_reward'] = $data['stars_reward'] ?? 3;
        $data['duration_minutes'] = $data['duration_minutes'] ?? 10;
        $data['interactive_payload']['grade_level'] = (int) ($data['interactive_payload']['grade_level'] ?? 1);
        $data['interactive_payload']['letter'] = $data['interactive_payload']['letter'] ?? '';

        return $data;
    }

    private function recentGenerated(Request $request)
    {
        $user = $request->user();

        return Lesson::query()
            ->with('course:id,title,teacher_id')
            ->when($user->isTeacher(), fn ($q) => $q->whereHas('course', fn ($c) => $c->where('teacher_id', $user->id)))
            ->where('is_interactive', true)
            ->latest()
            ->take(40)
            ->get(['id', 'title', 'course_id', 'is_published', 'updated_at', 'interactive_payload'])
            ->filter(fn (Lesson $lesson) => $lesson->isGeneratedWorksheet())
            ->take(8)
            ->values();
    }

    private function manageableCourses(Request $request)
    {
        $user = $request->user();

        return Course::query()
            ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
            ->orderBy('title')
            ->get(['id', 'title', 'level', 'subject']);
    }

    private function authorizeManager(Request $request): void
    {
        abort_unless($request->user()?->isAdmin() || $request->user()?->isTeacher(), 403);
    }

    private function assertCourseAccess(Request $request, int $courseId): void
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return;
        }

        abort_unless(
            $user->isTeacher() && Course::query()->where('id', $courseId)->where('teacher_id', $user->id)->exists(),
            403
        );
    }
}
