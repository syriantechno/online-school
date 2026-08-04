<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\DiscussionReply;
use App\Models\DiscussionThread;
use App\Models\Enrollment;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DiscussionReplyController extends Controller
{
    public function store(
        Request $request,
        Course $course,
        DiscussionThread $thread,
        NotificationService $notifications
    ): RedirectResponse {
        abort_unless($thread->course_id === $course->id, 404);
        abort_unless(! $thread->is_locked, 403, 'النقاش مقفل.');

        $user = $request->user();
        $can = $user->isAdmin()
            || ($user->isTeacher() && $course->teacher_id === $user->id)
            || (
                $user->isStudent()
                && Enrollment::query()->where('user_id', $user->id)->where('course_id', $course->id)->exists()
            );
        abort_unless($can, 403);

        $data = $request->validate([
            'body' => ['required', 'string'],
            'is_answer' => ['sometimes', 'boolean'],
        ]);

        $isAnswer = ($data['is_answer'] ?? false)
            && ($user->isAdmin() || ($user->isTeacher() && $course->teacher_id === $user->id));

        if ($isAnswer) {
            $thread->replies()->where('is_answer', true)->update(['is_answer' => false]);
        }

        DiscussionReply::query()->create([
            'discussion_thread_id' => $thread->id,
            'user_id' => $user->id,
            'body' => $data['body'],
            'is_answer' => $isAnswer,
        ]);

        $thread->update([
            'replies_count' => $thread->replies()->count(),
            'last_replied_at' => now(),
        ]);

        if ($thread->user_id !== $user->id) {
            $notifications->send(
                $thread->user,
                'discussion',
                'رد جديد على نقاشك',
                $thread->title,
                route('discussions.show', [$course->id, $thread->id])
            );
        }

        return back()->with('success', 'تم إضافة الرد.');
    }
}
