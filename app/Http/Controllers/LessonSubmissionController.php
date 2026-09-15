<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonSubmission;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LessonSubmissionController extends Controller
{
    public function store(Request $request, Lesson $lesson): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isStudent() || $user->isAdmin(), 403);
        $lesson->load('course:id,teacher_id,is_published');
        abort_unless($lesson->is_published && $lesson->course?->is_published, 404);
        abort_unless(
            $user->isAdmin()
            || Enrollment::query()->where('user_id', $user->id)->where('course_id', $lesson->course_id)->exists(),
            403,
            'يجب التسجيل في الدورة أولاً.'
        );

        $data = $request->validate([
            'block_id' => ['required', 'string', 'max:80'],
            'kind' => ['nullable', 'in:voice_reading,writing_workshop'],
            'content' => ['nullable', 'string', 'max:20000'],
            'audio' => ['nullable', 'file', 'max:20480'],
        ]);

        $kind = $data['kind'] ?? 'voice_reading';
        if (! $request->hasFile('audio') && empty($data['content'])) {
            if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
                return response()->json(['message' => 'أضف تسجيلاً صوتياً أو نصاً.'], 422);
            }

            return back()->withErrors(['audio' => 'أضف تسجيلاً صوتياً أو نصاً.']);
        }

        $path = null;
        if ($request->hasFile('audio')) {
            $path = $request->file('audio')->store('lessons/'.$lesson->id.'/audio', 'public');
        }

        $existing = LessonSubmission::query()
            ->where('lesson_id', $lesson->id)
            ->where('user_id', $user->id)
            ->where('block_id', $data['block_id'])
            ->first();

        if ($existing?->file_path && $path) {
            Storage::disk('public')->delete($existing->file_path);
        }

        $submission = LessonSubmission::query()->updateOrCreate(
            [
                'lesson_id' => $lesson->id,
                'user_id' => $user->id,
                'block_id' => $data['block_id'],
            ],
            [
                'kind' => $kind,
                'file_path' => $path ?: $existing?->file_path,
                'content' => $data['content'] ?? $existing?->content,
                'status' => 'submitted',
                'submitted_at' => now(),
                'score' => null,
                'teacher_feedback' => null,
                'graded_at' => null,
            ]
        );

        if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
            return response()->json([
                'ok' => true,
                'submission_id' => $submission->id,
                'file_url' => $submission->fileUrl(),
                'message' => 'تم إرسال التسجيل بنجاح.',
            ]);
        }

        return back()->with('success', 'تم إرسال التسجيل بنجاح.');
    }

    public function grade(
        Request $request,
        Lesson $lesson,
        LessonSubmission $submission,
        NotificationService $notifications
    ): RedirectResponse {
        abort_unless($submission->lesson_id === $lesson->id, 404);
        $lesson->load('course:id,teacher_id');
        abort_unless(
            $request->user()->isAdmin()
            || ($request->user()->isTeacher() && $lesson->course?->teacher_id === $request->user()->id),
            403
        );

        $data = $request->validate([
            'score' => ['required', 'integer', 'min:0', 'max:10'],
            'teacher_feedback' => ['nullable', 'string', 'max:2000'],
        ]);

        $submission->update([
            'score' => $data['score'],
            'teacher_feedback' => $data['teacher_feedback'] ?? null,
            'status' => 'graded',
            'graded_at' => now(),
        ]);

        if ($submission->user) {
            $notifications->send(
                $submission->user,
                'grade',
                'تم تقييم تسجيلك الصوتي',
                'حصلت على '.$data['score'].' من 10 في درس: '.$lesson->title,
                route('lessons.show', $lesson->id)
            );
        }

        return back()->with('success', 'تم حفظ تقييم التسجيل.');
    }
}
