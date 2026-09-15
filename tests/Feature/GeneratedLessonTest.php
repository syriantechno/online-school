<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GeneratedLessonTest extends TestCase
{
    use RefreshDatabase;

    public function test_students_cannot_open_generated_lesson_builder(): void
    {
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $this->actingAs($student)->get(route('lesson-generator.create'))->assertForbidden();
    }

    public function test_teacher_can_create_generated_letter_lesson(): void
    {
        [$teacher, $course] = $this->context();

        $response = $this->actingAs($teacher)->post(route('lesson-generator.store'), [
            'course_id' => $course->id,
            'title' => 'رحلة حرف الباء',
            'content' => 'درس مولّد داخلياً',
            'is_published' => true,
            'stars_reward' => 4,
            'interactive_payload' => $this->payload('ب'),
        ]);

        $lesson = Lesson::query()->where('title', 'رحلة حرف الباء')->firstOrFail();
        $response->assertRedirect(route('lessons.show', $lesson));
        $this->assertTrue($lesson->isGeneratedWorksheet());
        $this->assertGreaterThan(0, $lesson->generatedAnswerCount());
        $this->assertSame('letter_story', $lesson->interactive_payload['template']);
        $this->assertSame('ب', $lesson->interactive_payload['letter']);
    }

    public function test_teacher_can_update_generated_lesson_letter_and_blocks(): void
    {
        [$teacher, $course] = $this->context();
        $lesson = $this->generated($course, 'ب');

        $payload = $this->payload('ت');
        $payload['blocks'][0]['text'] = 'قصة حرف التاء المعدّلة';

        $this->actingAs($teacher)->put(route('lesson-generator.update', $lesson), [
            'course_id' => $course->id,
            'title' => 'رحلة حرف التاء',
            'interactive_payload' => $payload,
        ])->assertRedirect(route('lessons.show', $lesson));

        $fresh = $lesson->fresh();
        $this->assertSame('ت', $fresh->interactive_payload['letter']);
        $this->assertSame('قصة حرف التاء المعدّلة', $fresh->interactive_payload['blocks'][0]['text']);
    }

    public function test_enrolled_student_can_view_generated_lesson(): void
    {
        [$teacher, $course] = $this->context();
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);
        Enrollment::query()->create(['user_id' => $student->id, 'course_id' => $course->id]);
        $lesson = $this->generated($course, 'ب', true);

        $this->actingAs($student)
            ->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $lesson->id]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Lessons/Show')
                ->where('publicMode', true)
                ->where('lesson.interactive_payload.type', 'generated_worksheet')
                ->where('lesson.interactive_payload.letter', 'ب'));
    }

    public function test_teacher_cannot_create_generated_lesson_in_foreign_course(): void
    {
        [, $course] = $this->context();
        $other = User::factory()->create(['role' => User::ROLE_TEACHER]);

        $this->actingAs($other)->post(route('lesson-generator.store'), [
            'course_id' => $course->id,
            'title' => 'درس دخيل',
            'interactive_payload' => $this->payload('ب'),
        ])->assertForbidden();
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

    private function generated(Course $course, string $letter, bool $published = false): Lesson
    {
        return Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'رحلة حرف '.$letter,
            'slug' => 'generated-'.str()->random(5),
            'is_published' => $published,
            'is_interactive' => true,
            'interactive_payload' => $this->payload($letter),
        ]);
    }

    private function payload(string $letter): array
    {
        return [
            'type' => 'generated_worksheet',
            'template' => 'letter_story',
            'letter' => $letter,
            'theme' => 'clay_pink',
            'skill' => 'الحروف والأصوات',
            'objective' => 'تمييز حرف '.$letter,
            'instruction' => 'اقرأ ولون واكتب',
            'title' => 'رحلة حرف '.$letter,
            'blocks' => [
                [
                    'id' => 'story_1',
                    'kind' => 'story',
                    'title' => 'قصة حرف '.$letter,
                    'text' => 'قصة قصيرة عن حرف '.$letter,
                    'highlight' => [$letter],
                ],
                [
                    'id' => 'pick_1',
                    'kind' => 'pick_grid',
                    'prompt' => 'لون ما يبدأ بـ '.$letter,
                    'items' => [
                        ['id' => 'i1', 'icon' => 'balloon', 'label' => 'بالون', 'starts_with' => $letter === 'ب'],
                        ['id' => 'i2', 'icon' => 'apple', 'label' => 'تفاحة', 'starts_with' => $letter === 'ت'],
                    ],
                ],
                [
                    'id' => 'trace_1',
                    'kind' => 'trace_letter',
                    'prompt' => 'اكتب الحرف',
                    'letter' => $letter,
                    'count' => 4,
                ],
            ],
        ];
    }
}
