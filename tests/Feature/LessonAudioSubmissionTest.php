<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LessonAudioSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_create_grade_seven_text_lab_lesson(): void
    {
        [$teacher, $course] = $this->context();

        $payload = [
            'type' => 'generated_worksheet',
            'template' => 'text_lab',
            'letter' => '',
            'grade_level' => 7,
            'theme' => 'sky_play',
            'title' => 'قيمة الوقت',
            'blocks' => [
                [
                    'id' => 'text_1',
                    'kind' => 'text_lab',
                    'title' => 'قيمة الوقت',
                    'text' => 'الوقت أثمن ما يملكه الإنسان.',
                    'prompt' => 'أجب',
                    'items' => [
                        [
                            'id' => 'q1',
                            'question' => 'لماذا الوقت ثمين؟',
                            'options' => ['لأنه لا يعود', 'لأنه رخيص', 'لأنه طويل'],
                            'correct_index' => 0,
                        ],
                    ],
                ],
                [
                    'id' => 'voice_1',
                    'kind' => 'voice_reading',
                    'mode' => 'reading',
                    'prompt' => 'اقرأ',
                    'passage' => 'الوقت أثمن ما نملك',
                    'max_seconds' => 60,
                ],
            ],
        ];

        $response = $this->actingAs($teacher)->post(route('lesson-generator.store'), [
            'course_id' => $course->id,
            'title' => 'درس الصف السابع',
            'is_published' => true,
            'interactive_payload' => $payload,
        ]);

        $lesson = Lesson::query()->where('title', 'درس الصف السابع')->firstOrFail();
        $response->assertRedirect(route('lessons.show', $lesson));
        $this->assertSame(7, (int) $lesson->interactive_payload['grade_level']);
        $this->assertSame('text_lab', $lesson->interactive_payload['blocks'][0]['kind']);
        $this->assertSame('voice_reading', $lesson->interactive_payload['blocks'][1]['kind']);
    }

    public function test_enrolled_student_can_upload_voice_recording(): void
    {
        Storage::fake('public');
        [$teacher, $course] = $this->context();
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);
        Enrollment::query()->create(['user_id' => $student->id, 'course_id' => $course->id]);
        $lesson = Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'قراءة مسموعة',
            'slug' => 'voice-'.str()->random(5),
            'is_published' => true,
            'is_interactive' => true,
            'interactive_payload' => [
                'type' => 'generated_worksheet',
                'template' => 'voice_reading',
                'grade_level' => 5,
                'blocks' => [
                    [
                        'id' => 'voice_block',
                        'kind' => 'voice_reading',
                        'passage' => 'نص قصير',
                        'mode' => 'reading',
                    ],
                ],
            ],
        ]);

        $file = UploadedFile::fake()->create('reading.webm', 120, 'audio/webm');

        $response = $this->actingAs($student)
            ->post(route('lessons.audio.store', $lesson), [
                'block_id' => 'voice_block',
                'kind' => 'voice_reading',
                'audio' => $file,
            ], [
                'Accept' => 'application/json',
            ]);

        $response->assertOk()->assertJsonPath('ok', true);

        $this->assertDatabaseHas('lesson_submissions', [
            'lesson_id' => $lesson->id,
            'user_id' => $student->id,
            'block_id' => 'voice_block',
            'kind' => 'voice_reading',
            'status' => 'submitted',
        ]);
    }

    public function test_teacher_can_grade_voice_submission(): void
    {
        [$teacher, $course] = $this->context();
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);
        $lesson = Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'درس صوت',
            'slug' => 'voice-grade-'.str()->random(4),
            'is_published' => true,
            'is_interactive' => true,
            'interactive_payload' => [
                'type' => 'generated_worksheet',
                'template' => 'voice_reading',
                'grade_level' => 4,
                'blocks' => [['id' => 'v1', 'kind' => 'voice_reading', 'passage' => 'نص']],
            ],
        ]);

        $submission = LessonSubmission::query()->create([
            'lesson_id' => $lesson->id,
            'user_id' => $student->id,
            'block_id' => 'v1',
            'kind' => 'voice_reading',
            'file_path' => 'lessons/1/audio/demo.webm',
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        $this->actingAs($teacher)
            ->post(route('lessons.audio.grade', [$lesson, $submission]), [
                'score' => 9,
                'teacher_feedback' => 'قراءة واضحة',
            ])
            ->assertRedirect();

        $this->assertSame('graded', $submission->fresh()->status);
        $this->assertSame(9, (int) $submission->fresh()->score);
    }

    private function context(): array
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);
        $course = Course::query()->create([
            'title' => 'العربية',
            'slug' => 'arabic-'.str()->random(6),
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        return [$teacher, $course];
    }
}
