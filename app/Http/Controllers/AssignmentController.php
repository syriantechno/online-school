<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $assignments = Assignment::query()
            ->with(['course:id,title', 'creator:id,name', 'lesson:id,title'])
            ->withCount('submissions')
            ->when($user->isTeacher(), function ($q) use ($user) {
                $q->where(function ($inner) use ($user) {
                    $inner->where('created_by', $user->id)
                        ->orWhereHas('course', fn ($c) => $c->where('teacher_id', $user->id));
                });
            })
            ->when($user->isStudent(), function ($q) use ($user) {
                $q->where('is_published', true)
                    ->whereHas('course', fn ($c) => $c->where('is_published', true))
                    ->whereHas('course.enrollments', fn ($e) => $e->where('user_id', $user->id));
            })
            ->latest()
            ->paginate(12);

        $mySubmissions = $user->isStudent()
            ? AssignmentSubmission::query()
                ->where('user_id', $user->id)
                ->get()
                ->keyBy('assignment_id')
            : collect();

        return Inertia::render('Assignments/Index', [
            'assignments' => $assignments,
            'mySubmissions' => $mySubmissions,
            'canManage' => $user->isAdmin() || $user->isTeacher(),
            'courses' => ($user->isAdmin() || $user->isTeacher())
                ? Course::query()
                    ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
                    ->orderBy('title')
                    ->get(['id', 'title'])
                : [],
        ]);
    }

    public function store(Request $request, NotificationService $notifications): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'lesson_id' => [
                'nullable',
                Rule::exists('lessons', 'id')->where(
                    fn ($query) => $query->where('course_id', $request->input('course_id'))
                ),
            ],
            'title' => ['required', 'string', 'max:255'],
            'instructions' => ['nullable', 'string'],
            'max_score' => ['nullable', 'integer', 'min:1', 'max:100'],
            'stars_reward' => ['nullable', 'integer', 'min:1', 'max:20'],
            'due_at' => ['nullable', 'date'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        if ($request->user()->isTeacher()) {
            abort_unless(
                Course::query()->where('id', $data['course_id'])->where('teacher_id', $request->user()->id)->exists(),
                403
            );
        }

        $assignment = Assignment::query()->create([
            ...$data,
            'max_score' => $data['max_score'] ?? 100,
            'stars_reward' => $data['stars_reward'] ?? 5,
            'is_published' => $data['is_published'] ?? true,
            'created_by' => $request->user()->id,
        ]);

        if ($assignment->is_published) {
            $students = User::query()
                ->whereIn('id', Enrollment::query()->where('course_id', $assignment->course_id)->pluck('user_id'))
                ->get();

            $notifications->sendMany(
                $students,
                'assignment',
                'واجب جديد: '.$assignment->title,
                'تم نشر واجب جديد في دورتك.',
                route('assignments.show', $assignment->id)
            );
        }

        return redirect()->route('assignments.show', $assignment)->with('success', 'تم إنشاء الواجب.');
    }

    public function show(Request $request, Assignment $assignment): Response
    {
        $assignment->load(['course:id,title,teacher_id,is_published', 'lesson:id,title', 'creator:id,name']);

        $user = $request->user();
        $canManage = $user->isAdmin()
            || ($user->isTeacher() && $assignment->course?->teacher_id === $user->id)
            || ($user->isTeacher() && $assignment->created_by === $user->id);

        if ($user->isStudent()) {
            abort_unless($assignment->is_published && $assignment->course?->is_published, 404);
            abort_unless(
                Enrollment::query()->where('user_id', $user->id)->where('course_id', $assignment->course_id)->exists(),
                403
            );
        } elseif (! $canManage) {
            abort(403);
        }

        $submission = null;
        $submissions = collect();

        if ($user->isStudent()) {
            $submission = AssignmentSubmission::query()
                ->where('assignment_id', $assignment->id)
                ->where('user_id', $user->id)
                ->first();
        }

        if ($user->isAdmin() || $user->isTeacher()) {
            $submissions = $assignment->submissions()->with('user:id,name')->latest()->get();
        }

        return Inertia::render('Assignments/Show', [
            'assignment' => $assignment,
            'submission' => $submission,
            'submissions' => $submissions,
            'canManage' => $canManage,
            'canSubmit' => $user->isStudent(),
        ]);
    }

    public function destroy(Request $request, Assignment $assignment): RedirectResponse
    {
        abort_unless(
            $request->user()->isAdmin()
            || ($request->user()->isTeacher() && $assignment->created_by === $request->user()->id),
            403
        );

        $assignment->delete();

        return redirect()->route('assignments.index')->with('success', 'تم حذف الواجب.');
    }

    public function update(Request $request, Assignment $assignment, NotificationService $notifications): RedirectResponse
    {
        $assignment->loadMissing('course:id,teacher_id');
        abort_unless(
            $request->user()->isAdmin()
            || ($request->user()->isTeacher() && ($assignment->created_by === $request->user()->id || $assignment->course?->teacher_id === $request->user()->id)),
            403
        );

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'instructions' => ['nullable', 'string'],
            'max_score' => ['required', 'integer', 'min:1', 'max:100'],
            'stars_reward' => ['required', 'integer', 'min:1', 'max:20'],
            'due_at' => ['nullable', 'date'],
            'is_published' => ['required', 'boolean'],
        ]);
        $wasPublished = $assignment->is_published;
        $assignment->update($data);

        if (! $wasPublished && $assignment->is_published) {
            $students = User::query()->whereIn('id', Enrollment::query()->where('course_id', $assignment->course_id)->pluck('user_id'))->get();
            $notifications->sendMany($students, 'assignment', 'واجب جديد: '.$assignment->title, 'تم نشر واجب جديد في دورتك.', route('assignments.show', $assignment));
        }

        return back()->with('success', 'تم تحديث الواجب.');
    }

    public function duplicate(Request $request, Assignment $assignment): RedirectResponse
    {
        $assignment->loadMissing('course:id,teacher_id');
        abort_unless($request->user()->isAdmin() || ($request->user()->isTeacher() && $assignment->course?->teacher_id === $request->user()->id), 403);

        $copy = $assignment->replicate(['is_published']);
        $copy->title = 'نسخة من '.$assignment->title;
        $copy->created_by = $request->user()->id;
        $copy->is_published = false;
        $copy->due_at = null;
        $copy->save();

        return redirect()->route('assignments.show', $copy)->with('success', 'تم نسخ الواجب كمسودة جديدة.');
    }
}
