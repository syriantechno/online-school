<?php

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\QuestionBankItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionBankTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_teachers_and_admins_can_access_question_bank(): void
    {
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);

        $this->actingAs($student)->get(route('question-bank.index'))->assertForbidden();
        $this->actingAs($teacher)->get(route('question-bank.index'))->assertOk();
    }

    public function test_teacher_can_generate_exam_from_question_bank_as_draft(): void
    {
        [$teacher, $course] = $this->context();
        $this->questions($teacher, $course, 3);

        $response = $this->actingAs($teacher)->post(route('question-bank.generate'), [
            'target' => 'exam', 'course_id' => $course->id, 'title' => 'فحص مولّد',
            'count' => 3, 'duration_minutes' => 15, 'pass_percent' => 60,
        ]);

        $exam = Exam::query()->where('title', 'فحص مولّد')->firstOrFail();
        $response->assertRedirect(route('exams.show', $exam));
        $this->assertFalse($exam->is_published);
        $this->assertSame(3, $exam->questions()->count());
    }

    public function test_teacher_can_generate_assignment_and_duplicate_existing_templates(): void
    {
        [$teacher, $course] = $this->context();
        $this->questions($teacher, $course, 2);

        $this->actingAs($teacher)->post(route('question-bank.generate'), [
            'target' => 'assignment', 'course_id' => $course->id, 'title' => 'واجب مولّد', 'count' => 2,
        ])->assertRedirect();

        $assignment = Assignment::query()->where('title', 'واجب مولّد')->firstOrFail();
        $this->assertFalse($assignment->is_published);
        $this->assertStringContainsString('1.', $assignment->instructions);

        $this->actingAs($teacher)->post(route('assignments.duplicate', $assignment))->assertRedirect();
        $this->assertDatabaseHas('assignments', ['title' => 'نسخة من واجب مولّد', 'is_published' => false]);
    }

    public function test_teacher_can_generate_questions_from_studio_lesson(): void
    {
        [$teacher, $course] = $this->context();

        $lesson = Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'مغامرة حرف الباء',
            'slug' => 'letter-ba-'.str()->random(5),
            'is_published' => true,
            'is_interactive' => true,
            'interactive_payload' => [
                'type' => 'generated_worksheet',
                'template' => 'letter_story',
                'letter' => 'ب',
                'grade_level' => 1,
                'skill' => 'الحروف والأصوات',
                'blocks' => [
                    [
                        'kind' => 'vocab_grid',
                        'items' => [
                            ['label' => 'باب', 'starts_with' => true],
                            ['label' => 'بيت', 'starts_with' => true],
                        ],
                    ],
                    [
                        'kind' => 'pick_grid',
                        'items' => [
                            ['label' => 'باب', 'starts_with' => true],
                            ['label' => 'شمس', 'starts_with' => false],
                        ],
                    ],
                    [
                        'kind' => 'story_quiz',
                        'items' => [
                            [
                                'question' => 'أي كلمة تبدأ بحرف الباء؟',
                                'options' => ['باب', 'شمس', 'قمر'],
                                'correct_index' => 0,
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($teacher)->post(route('question-bank.from-lesson'), [
            'lesson_id' => $lesson->id,
            'max' => 10,
            'also_exam' => true,
            'exam_title' => 'فحص حرف الباء',
        ]);

        $exam = Exam::query()->where('title', 'فحص حرف الباء')->firstOrFail();
        $response->assertRedirect(route('exams.show', $exam));
        $this->assertFalse($exam->is_published);
        $this->assertGreaterThan(0, QuestionBankItem::query()->where('lesson_id', $lesson->id)->count());
        $this->assertGreaterThan(0, $exam->questions()->count());
    }

    private function context(): array
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);
        $course = Course::query()->create([
            'title' => 'العربية', 'slug' => 'arabic-'.str()->random(6),
            'teacher_id' => $teacher->id, 'is_published' => true,
        ]);

        return [$teacher, $course];
    }

    private function questions(User $teacher, Course $course, int $count): void
    {
        foreach (range(1, $count) as $index) {
            QuestionBankItem::query()->create([
                'created_by' => $teacher->id, 'course_id' => $course->id,
                'skill' => 'قواعد', 'difficulty' => 'medium', 'type' => 'single',
                'prompt' => 'سؤال رقم '.$index, 'options' => ['أ', 'ب'],
                'correct_answers' => ['0'], 'points' => 1,
            ]);
        }
    }
}
