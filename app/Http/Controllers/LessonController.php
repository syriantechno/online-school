<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonNote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $lessons = Lesson::query()
            ->with('course:id,title,teacher_id')
            ->when($user->isTeacher(), fn ($q) => $q->whereHas('course', fn ($c) => $c->where('teacher_id', $user->id)))
            ->when($user->isStudent(), fn ($q) => $q->where('is_published', true))
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
        $data['slug'] = $this->uniqueSlug((int) $data['course_id'], $data['title']);

        Lesson::create($data);

        return redirect()->route('lessons.index')->with('success', 'تم إنشاء الدرس.');
    }

    public function show(Request $request, Lesson $lesson): Response
    {
        $user = $request->user();
        $lesson->load('course:id,title,teacher_id');

        $completed = $user
            ? $lesson->completions()->where('user_id', $user->id)->exists()
            : false;

        $enrolled = $user
            ? Enrollment::query()
                ->where('user_id', $user->id)
                ->where('course_id', $lesson->course_id)
                ->exists()
            : false;

        $note = $user
            ? LessonNote::query()
                ->where('user_id', $user->id)
                ->where('lesson_id', $lesson->id)
                ->first()
            : null;

        return Inertia::render('Lessons/Show', [
            'lesson' => $lesson,
            'completed' => $completed,
            'enrolled' => $enrolled || $user->isAdmin() || $user->isTeacher(),
            'canComplete' => $user->isStudent() || $user->isAdmin(),
            'note' => $note,
            'canTakeNotes' => $user->isStudent() || $user->isAdmin(),
        ]);
    }

    public function edit(Request $request, Lesson $lesson): Response
    {
        $this->assertCourseAccess($request, $lesson->course_id);

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
            $data['slug'] = $this->uniqueSlug((int) $data['course_id'], $data['title'], $lesson->id);
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
            $data['interactive_payload'] = ['questions' => []];
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

    private function uniqueSlug(int $courseId, string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: Str::random(8);
        $slug = $base;
        $i = 1;
        while (
            Lesson::query()
                ->where('course_id', $courseId)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
