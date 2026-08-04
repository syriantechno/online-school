<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Enrollment;
use App\Services\NotificationService;
use App\Services\StarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssignmentSubmissionController extends Controller
{
    public function store(Request $request, Assignment $assignment): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isStudent(), 403);
        abort_unless($assignment->is_published, 403);
        abort_unless(
            Enrollment::query()->where('user_id', $user->id)->where('course_id', $assignment->course_id)->exists(),
            403,
            'يجب التسجيل في الدورة أولاً.'
        );

        $data = $request->validate([
            'content' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png,zip'],
        ]);

        abort_unless(! empty($data['content']) || $request->hasFile('file'), 422, 'أضف نصاً أو ملفاً.');

        $path = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('assignments/'.$assignment->id, 'public');
        }

        AssignmentSubmission::query()->updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'user_id' => $user->id,
            ],
            [
                'content' => $data['content'] ?? null,
                'file_path' => $path,
                'status' => 'submitted',
                'submitted_at' => now(),
                'score' => null,
                'teacher_feedback' => null,
                'graded_at' => null,
            ]
        );

        return back()->with('success', 'تم تسليم الواجب.');
    }

    public function grade(
        Request $request,
        Assignment $assignment,
        AssignmentSubmission $submission,
        StarService $stars,
        NotificationService $notifications
    ): RedirectResponse {
        abort_unless($submission->assignment_id === $assignment->id, 404);
        $assignment->load('course:id,teacher_id');
        abort_unless(
            $request->user()->isAdmin()
            || ($request->user()->isTeacher() && $assignment->course?->teacher_id === $request->user()->id)
            || $assignment->created_by === $request->user()->id,
            403
        );

        $data = $request->validate([
            'score' => ['required', 'integer', 'min:0', 'max:'.$assignment->max_score],
            'teacher_feedback' => ['nullable', 'string'],
        ]);

        $wasGraded = $submission->status === 'graded';

        $submission->update([
            'score' => $data['score'],
            'teacher_feedback' => $data['teacher_feedback'] ?? null,
            'status' => 'graded',
            'graded_at' => now(),
        ]);

        $student = $submission->user;
        if (! $wasGraded && $student) {
            $reward = (int) $assignment->stars_reward;
            if ($data['score'] >= ($assignment->max_score * 0.5) && ! $stars->alreadyAwarded($student, $submission, 'assignment')) {
                $stars->award($student, $reward, 'assignment', $submission, 'درجة واجب: '.$assignment->title);
            }

            $notifications->send(
                $student,
                'grade',
                'تم تصحيح واجبك',
                'حصلت على '.$data['score'].' من '.$assignment->max_score.' في: '.$assignment->title,
                route('assignments.show', $assignment->id)
            );
        }

        return back()->with('success', 'تم حفظ الدرجة.');
    }
}
