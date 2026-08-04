<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\DiscussionThread;
use App\Models\Enrollment;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiscussionController extends Controller
{
    public function index(Request $request, Course $course): Response
    {
        $this->assertCanView($request, $course);

        $threads = DiscussionThread::query()
            ->with(['user:id,name,role'])
            ->where('course_id', $course->id)
            ->orderByDesc('is_pinned')
            ->orderByDesc('last_replied_at')
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Discussions/Index', [
            'course' => $course->only(['id', 'title']),
            'threads' => $threads,
            'canPost' => $request->user()->isStudent()
                || $request->user()->isTeacher()
                || $request->user()->isAdmin(),
        ]);
    }

    public function store(Request $request, Course $course, NotificationService $notifications): RedirectResponse
    {
        $this->assertCanView($request, $course);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $thread = DiscussionThread::query()->create([
            'course_id' => $course->id,
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'body' => $data['body'],
            'last_replied_at' => now(),
        ]);

        $course->loadMissing('teacher');
        if ($course->teacher && $course->teacher_id !== $request->user()->id) {
            $notifications->send(
                $course->teacher,
                'discussion',
                'سؤال جديد في '.$course->title,
                $thread->title,
                route('discussions.show', [$course->id, $thread->id])
            );
        }

        return redirect()
            ->route('discussions.show', [$course->id, $thread->id])
            ->with('success', 'تم نشر النقاش.');
    }

    public function show(Request $request, Course $course, DiscussionThread $thread): Response
    {
        abort_unless($thread->course_id === $course->id, 404);
        $this->assertCanView($request, $course);

        $thread->load([
            'user:id,name,role',
            'replies.user:id,name,role',
        ]);

        return Inertia::render('Discussions/Show', [
            'course' => $course->only(['id', 'title', 'teacher_id']),
            'thread' => $thread,
            'canReply' => ! $thread->is_locked && (
                $request->user()->isStudent()
                || $request->user()->isTeacher()
                || $request->user()->isAdmin()
            ),
            'canModerate' => $request->user()->isAdmin()
                || ($request->user()->isTeacher() && $course->teacher_id === $request->user()->id),
        ]);
    }

    public function destroy(Request $request, Course $course, DiscussionThread $thread): RedirectResponse
    {
        abort_unless($thread->course_id === $course->id, 404);
        abort_unless(
            $request->user()->isAdmin()
            || $thread->user_id === $request->user()->id
            || ($request->user()->isTeacher() && $course->teacher_id === $request->user()->id),
            403
        );

        $thread->delete();

        return redirect()
            ->route('discussions.index', $course->id)
            ->with('success', 'تم حذف النقاش.');
    }

    private function assertCanView(Request $request, Course $course): void
    {
        $user = $request->user();

        if ($user->isAdmin() || ($user->isTeacher() && $course->teacher_id === $user->id)) {
            return;
        }

        abort_unless(
            $user->isStudent()
            && Enrollment::query()->where('user_id', $user->id)->where('course_id', $course->id)->exists(),
            403
        );
    }
}
