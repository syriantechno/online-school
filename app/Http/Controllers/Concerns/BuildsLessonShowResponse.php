<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonNote;
use Illuminate\Http\Request;

trait BuildsLessonShowResponse
{
    protected function lessonShowData(Request $request, Lesson $lesson): array
    {
        $user = $request->user();
        $lesson->load('course:id,title,teacher_id,is_published,slug');

        $canManage = $user->isAdmin()
            || ($user->isTeacher() && $lesson->course?->teacher_id === $user->id);

        $completed = $lesson->completions()->where('user_id', $user->id)->exists();

        $enrolled = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $lesson->course_id)
            ->exists();

        $note = LessonNote::query()
            ->where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->first();

        $lesson->resolveWorksheetMedia();

        $audioSubmissions = [];
        if ($canManage) {
            $audioSubmissions = $lesson->submissions()
                ->with('user:id,name')
                ->where('kind', 'voice_reading')
                ->latest()
                ->get()
                ->map(fn ($submission) => [
                    'id' => $submission->id,
                    'user' => $submission->user,
                    'block_id' => $submission->block_id,
                    'status' => $submission->status,
                    'score' => $submission->score,
                    'teacher_feedback' => $submission->teacher_feedback,
                    'file_url' => $submission->fileUrl(),
                    'submitted_at' => $submission->submitted_at,
                ]);
        }

        return [
            'lesson' => $lesson,
            'completed' => $completed,
            'enrolled' => $enrolled || $canManage,
            'canComplete' => $user->isStudent() || $user->isAdmin(),
            'note' => $note,
            'canTakeNotes' => $user->isStudent() || $user->isAdmin(),
            'canManage' => $canManage,
            'audioSubmissions' => $audioSubmissions,
        ];
    }
}
