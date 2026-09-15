<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WorksheetGeneratorTest extends TestCase
{
    use RefreshDatabase;

    public function test_students_cannot_open_image_lesson_generator(): void
    {
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $this->actingAs($student)->get(route('worksheets.create'))->assertForbidden();
    }

    public function test_teacher_can_upload_worksheet_image_and_create_lesson_with_answer_zones(): void
    {
        Storage::fake('public');
        [$teacher, $course] = $this->context();

        $upload = $this->actingAs($teacher)->post(route('worksheets.images.store'), [
            'image' => $this->jpegUpload(),
        ]);

        $upload->assertOk();
        $path = $upload->json('path');
        Storage::disk('public')->assertExists($path);

        $response = $this->actingAs($teacher)->post(route('worksheets.store'), [
            'course_id' => $course->id,
            'title' => 'قصة حرف الباء',
            'content' => 'لون الكلمات التي تبدأ بحرف ب',
            'is_published' => true,
            'stars_reward' => 4,
            'interactive_payload' => $this->payload($path),
        ]);

        $lesson = Lesson::query()->where('title', 'قصة حرف الباء')->firstOrFail();
        $response->assertRedirect(route('lessons.show', $lesson));
        $this->assertTrue($lesson->isImageWorksheet());
        $this->assertSame(3, $lesson->worksheetZoneCount());
        $this->assertArrayNotHasKey('image_url', $lesson->interactive_payload['pages'][0]);
        $this->assertSame(12.5, $lesson->interactive_payload['pages'][0]['zones'][0]['x']);
    }

    public function test_teacher_can_reposition_answer_zone_when_updating_worksheet(): void
    {
        [$teacher, $course] = $this->context();
        $lesson = $this->worksheet($course, 'worksheets/ba.jpg');

        $payload = $this->payload('worksheets/ba.jpg');
        $payload['pages'][0]['zones'][0]['x'] = 40.2;
        $payload['pages'][0]['zones'][0]['y'] = 55.8;

        $this->actingAs($teacher)->put(route('worksheets.update', $lesson), [
            'course_id' => $course->id,
            'title' => $lesson->title,
            'interactive_payload' => $payload,
        ])->assertRedirect(route('lessons.show', $lesson));

        $this->assertEquals(40.2, $lesson->fresh()->interactive_payload['pages'][0]['zones'][0]['x']);
        $this->assertEquals(55.8, $lesson->fresh()->interactive_payload['pages'][0]['zones'][0]['y']);
    }

    public function test_enrolled_student_can_view_worksheet_lesson_and_image_url_is_resolved(): void
    {
        Storage::fake('public');
        [$teacher, $course] = $this->context();
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);
        Enrollment::query()->create(['user_id' => $student->id, 'course_id' => $course->id]);
        $lesson = $this->worksheet($course, 'worksheets/ba.jpg', true);

        $this->actingAs($student)
            ->get(route('lessons.show', $lesson))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Lessons/Show')
                ->where('lesson.interactive_payload.pages.0.image_url', Storage::disk('public')->url('worksheets/ba.jpg'))
                ->where('lesson.interactive_payload.pages.0.zones.0.x', 12.5));
    }

    public function test_image_delete_rejects_paths_outside_worksheets_folder(): void
    {
        [$teacher] = $this->context();

        $this->actingAs($teacher)->delete(route('worksheets.images.destroy'), [
            'path' => '../secret.txt',
        ])->assertStatus(422);
    }

    public function test_teacher_cannot_create_worksheet_in_another_teachers_course(): void
    {
        [, $course] = $this->context();
        $other = User::factory()->create(['role' => User::ROLE_TEACHER]);

        $this->actingAs($other)->post(route('worksheets.store'), [
            'course_id' => $course->id,
            'title' => 'درس دخيل',
            'interactive_payload' => $this->payload('worksheets/ba.jpg'),
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

    private function worksheet(Course $course, string $path, bool $published = false): Lesson
    {
        return Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'نشاط حرف ب',
            'slug' => 'ba-worksheet-'.str()->random(4),
            'is_published' => $published,
            'is_interactive' => true,
            'interactive_payload' => $this->payload($path),
        ]);
    }

    private function jpegUpload(): UploadedFile
    {
        $path = sys_get_temp_dir().DIRECTORY_SEPARATOR.'letter-ba.jpg';
        file_put_contents($path, base64_decode(
            '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAAEAAQMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAABAgME/8QAFhABAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIQAxAAAAGdAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Af//Z'
        ));

        return new UploadedFile($path, 'letter-ba.jpg', 'image/jpeg', null, true);
    }

    private function payload(string $path): array
    {
        return [
            'type' => 'image_worksheet',
            'skill' => 'الحروف والأصوات',
            'objective' => 'تمييز الكلمات التي تبدأ بحرف ب',
            'instruction' => 'لون الكلمات التي تبدأ بحرف ب',
            'show_outlines' => true,
            'pages' => [[
                'id' => 'page_1',
                'image' => $path,
                'image_url' => 'http://example.test/should-be-stripped',
                'title' => 'قصة حرف ب',
                'zones' => [
                    ['id' => 'z1', 'type' => 'click', 'x' => 12.5, 'y' => 62.0, 'w' => 14.0, 'h' => 10.0, 'correct' => true, 'label' => 'بالون'],
                    ['id' => 'z2', 'type' => 'click', 'x' => 42.0, 'y' => 62.0, 'w' => 14.0, 'h' => 10.0, 'correct' => true, 'label' => 'باب'],
                    ['id' => 'z3', 'type' => 'fill', 'x' => 20.0, 'y' => 84.0, 'w' => 10.0, 'h' => 8.0, 'answer' => 'ب', 'label' => 'اكتب الحرف'],
                ],
            ]],
        ];
    }
}
