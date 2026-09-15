<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $courses = Course::query()
            ->with(['teacher:id,name', 'lessons:id,course_id'])
            ->withCount(['lessons', 'enrollments'])
            ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
            ->when($user->isStudent(), fn ($q) => $q->where('is_published', true))
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only('search'),
            'canManage' => $user->isAdmin() || $user->isTeacher(),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        return Inertia::render('Courses/Form', [
            'course' => null,
            'teachers' => $request->user()->isAdmin()
                ? User::query()->where('role', User::ROLE_TEACHER)->orderBy('name')->get(['id', 'name'])
                : [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['title']);
        $data['teacher_id'] = $request->user()->isAdmin()
            ? ($data['teacher_id'] ?? $request->user()->id)
            : $request->user()->id;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        } else {
            unset($data['cover_image']);
        }

        Course::create($data);

        return redirect()->route('courses.index')->with('success', 'تم إنشاء الدورة بنجاح.');
    }

    public function show(Request $request, Course $course): Response
    {
        $user = $request->user();
        $canManage = $user->isAdmin() || ($user->isTeacher() && $course->teacher_id === $user->id);

        if (! $canManage) {
            abort_unless($course->is_published, 404);
        }

        $course->load([
            'teacher:id,name',
            'lessons' => fn ($query) => $query
                ->when(! $canManage, fn ($lessons) => $lessons->where('is_published', true))
                ->orderBy('sort_order'),
            'books' => fn ($query) => $query
                ->when(! $canManage, fn ($books) => $books->where('is_published', true)),
            'reviews.user:id,name',
        ]);

        $enrollment = $user
            ? $course->enrollments()->where('user_id', $user->id)->first()
            : null;

        $myReview = $user
            ? $course->reviews->firstWhere('user_id', $user->id)
            : null;

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'canManage' => $canManage,
            'isEnrolled' => (bool) $enrollment,
            'enrollment' => $enrollment,
            'canEnroll' => $user->isStudent() && $course->is_published,
            'averageReview' => $course->averageReview(),
            'reviewsCount' => $course->reviews->count(),
            'myReview' => $myReview,
            'reviews' => $course->reviews->take(10)->values(),
        ]);
    }

    public function edit(Request $request, Course $course): Response
    {
        $this->authorizeManage($request, $course);

        return Inertia::render('Courses/Form', [
            'course' => $course,
            'teachers' => $request->user()->isAdmin()
                ? User::query()->where('role', User::ROLE_TEACHER)->orderBy('name')->get(['id', 'name'])
                : [],
        ]);
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $this->authorizeManage($request, $course);

        $data = $this->validated($request);
        if ($data['title'] !== $course->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $course->id);
        }
        if (! $request->user()->isAdmin()) {
            unset($data['teacher_id']);
        }

        if ($request->hasFile('cover_image')) {
            if ($course->cover_image) {
                Storage::disk('public')->delete($course->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        } else {
            unset($data['cover_image']);
        }

        $course->update($data);

        return redirect()->route('courses.index')->with('success', 'تم تحديث الدورة.');
    }

    public function destroy(Request $request, Course $course): RedirectResponse
    {
        $this->authorizeManage($request, $course);
        if ($course->cover_image) {
            Storage::disk('public')->delete($course->cover_image);
        }
        $course->delete();

        return redirect()->route('courses.index')->with('success', 'تم حذف الدورة.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'level' => ['nullable', 'string', 'max:100'],
            'subject' => ['nullable', 'string', 'max:100'],
            'teacher_id' => ['nullable', 'exists:users,id'],
            'is_published' => ['sometimes', 'boolean'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
        ]);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: Str::random(8);
        $slug = $base;
        $i = 1;
        while (
            Course::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    private function authorizeManage(Request $request, Course $course): void
    {
        $user = $request->user();
        abort_unless(
            $user->isAdmin() || ($user->isTeacher() && $course->teacher_id === $user->id),
            403
        );
    }
}
