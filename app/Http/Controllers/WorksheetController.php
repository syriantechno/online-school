<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WorksheetController extends Controller
{
    public function create(Request $request): Response
    {
        $this->authorizeManager($request);

        return Inertia::render('Worksheets/Generator', [
            'lesson' => null,
            'courses' => $this->manageableCourses($request),
            'recent' => $this->recentWorksheets($request),
        ]);
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
            'interactive_payload' => Lesson::sanitizeInteractivePayload($data['interactive_payload']),
        ]);

        return redirect()->route('lessons.show', $lesson)->with('success', 'تم إنشاء درس الورقة المصوّرة.');
    }

    public function edit(Request $request, Lesson $lesson): Response
    {
        $this->assertCourseAccess($request, $lesson->course_id);
        abort_unless($lesson->isImageWorksheet(), 404);
        $lesson->resolveWorksheetMedia();

        return Inertia::render('Worksheets/Generator', [
            'lesson' => $lesson,
            'courses' => $this->manageableCourses($request),
            'recent' => $this->recentWorksheets($request),
        ]);
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
            'interactive_payload' => Lesson::sanitizeInteractivePayload($data['interactive_payload']),
        ]);

        return redirect()->route('lessons.show', $lesson)->with('success', 'تم حفظ مناطق الإجابة على الصورة.');
    }

    public function upload(Request $request): JsonResponse
    {
        $this->authorizeManager($request);

        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
        ]);

        $path = $request->file('image')->store('worksheets', 'public');

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ]);
    }

    public function destroyImage(Request $request): JsonResponse
    {
        $this->authorizeManager($request);

        $data = $request->validate([
            'path' => ['required', 'string', 'max:500'],
        ]);

        $path = str_replace('\\', '/', $data['path']);
        abort_unless((bool) preg_match('#^worksheets/[A-Za-z0-9._/-]+$#', $path), 422);

        Storage::disk('public')->delete($path);

        return response()->json(['ok' => true]);
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
            'interactive_payload.type' => ['required', 'in:image_worksheet'],
            'interactive_payload.skill' => ['nullable', 'string', 'max:50'],
            'interactive_payload.objective' => ['nullable', 'string', 'max:500'],
            'interactive_payload.instruction' => ['nullable', 'string', 'max:1000'],
            'interactive_payload.show_outlines' => ['nullable', 'boolean'],
            'interactive_payload.pages' => ['required', 'array', 'min:1', 'max:20'],
            'interactive_payload.pages.*.id' => ['nullable', 'string', 'max:80'],
            'interactive_payload.pages.*.image' => ['required', 'string', 'max:500'],
            'interactive_payload.pages.*.title' => ['nullable', 'string', 'max:255'],
            'interactive_payload.pages.*.zones' => ['nullable', 'array', 'max:80'],
            'interactive_payload.pages.*.zones.*.id' => ['nullable', 'string', 'max:80'],
            'interactive_payload.pages.*.zones.*.type' => ['required', 'in:click,fill,select'],
            'interactive_payload.pages.*.zones.*.x' => ['required', 'numeric', 'min:0', 'max:100'],
            'interactive_payload.pages.*.zones.*.y' => ['required', 'numeric', 'min:0', 'max:100'],
            'interactive_payload.pages.*.zones.*.w' => ['required', 'numeric', 'min:0', 'max:100'],
            'interactive_payload.pages.*.zones.*.h' => ['required', 'numeric', 'min:0', 'max:100'],
            'interactive_payload.pages.*.zones.*.correct' => ['nullable', 'boolean'],
            'interactive_payload.pages.*.zones.*.answer' => ['nullable', 'string', 'max:500'],
            'interactive_payload.pages.*.zones.*.label' => ['nullable', 'string', 'max:255'],
            'interactive_payload.pages.*.zones.*.hint' => ['nullable', 'string', 'max:500'],
            'interactive_payload.pages.*.zones.*.options' => ['nullable', 'array', 'max:8'],
            'interactive_payload.pages.*.zones.*.options.*' => ['nullable', 'string', 'max:255'],
            'interactive_payload.pages.*.zones.*.correct_index' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['is_interactive'] = true;
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['stars_reward'] = $data['stars_reward'] ?? 3;
        $data['duration_minutes'] = $data['duration_minutes'] ?? 10;

        return $data;
    }

    private function recentWorksheets(Request $request)
    {
        $user = $request->user();

        return Lesson::query()
            ->with('course:id,title,teacher_id')
            ->when($user->isTeacher(), fn ($q) => $q->whereHas('course', fn ($c) => $c->where('teacher_id', $user->id)))
            ->where('is_interactive', true)
            ->latest()
            ->take(40)
            ->get(['id', 'title', 'course_id', 'is_published', 'updated_at', 'interactive_payload'])
            ->filter(fn (Lesson $lesson) => $lesson->isImageWorksheet())
            ->take(8)
            ->values();
    }

    private function manageableCourses(Request $request)
    {
        $user = $request->user();

        return Course::query()
            ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
            ->orderBy('title')
            ->get(['id', 'title']);
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
