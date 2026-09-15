<?php

namespace Tests\Feature;

use App\Models\AppNotification;
use App\Models\Assignment;
use App\Models\Book;
use App\Models\BookChapter;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Lesson;
use App\Models\User;
use App\Services\ExamService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LearningIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_access_requires_published_content_and_enrollment(): void
    {
        [$teacher, $student, $course] = $this->learningContext();
        $lesson = $this->lesson($course);
        $assignment = Assignment::query()->create([
            'course_id' => $course->id,
            'lesson_id' => $lesson->id,
            'created_by' => $teacher->id,
            'title' => 'واجب تجريبي',
            'is_published' => true,
        ]);
        $book = Book::query()->create([
            'title' => 'كتاب تجريبي',
            'slug' => 'integration-book',
            'file_path' => 'books/test.pdf',
            'course_id' => $course->id,
            'uploaded_by' => $teacher->id,
            'is_published' => true,
        ]);

        $this->actingAs($student)->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $lesson->id]))
            ->assertRedirect(route('explore.show', $course->slug));
        $this->actingAs($student)->get(route('courses.path', $course))->assertForbidden();
        $this->actingAs($student)->get(route('assignments.show', $assignment))->assertForbidden();
        $this->actingAs($student)->get(route('books.show', $book))->assertForbidden();

        Enrollment::query()->create(['user_id' => $student->id, 'course_id' => $course->id]);

        $this->actingAs($student)->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $lesson->id]))->assertOk();
        $this->actingAs($student)->get(route('lessons.show', $lesson))->assertRedirect(route('explore.learn', ['course' => $course->slug, 'lesson' => $lesson->id]));
        $this->actingAs($student)->get(route('courses.path', $course))->assertOk();
        $this->actingAs($student)->get(route('assignments.show', $assignment))->assertOk();
        $this->actingAs($student)->get(route('books.show', $book))->assertOk();

        $lesson->update(['is_published' => false]);
        $this->actingAs($student)->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $lesson->id]))->assertNotFound();

        $lesson->update(['is_published' => true]);
        $course->update(['is_published' => false]);
        $this->actingAs($student)->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $lesson->id]))->assertNotFound();
        $this->actingAs($student)->get(route('assignments.show', $assignment))->assertNotFound();
        $this->actingAs($student)->get(route('books.show', $book))->assertNotFound();
    }

    public function test_teacher_can_preview_own_unpublished_course_and_student_cannot(): void
    {
        [$teacher, $student, $course] = $this->learningContext(false);
        $lesson = $this->lesson($course, false);

        $this->actingAs($teacher)->get(route('courses.show', $course))->assertOk();
        $this->actingAs($teacher)->get(route('lessons.show', $lesson))->assertOk();
        $this->actingAs($student)->get(route('courses.show', $course))->assertNotFound();
        $this->actingAs($student)->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $lesson->id]))->assertNotFound();
    }

    public function test_draft_assignment_does_not_notify_students_but_published_assignment_does(): void
    {
        [$teacher, $student, $course] = $this->learningContext();
        Enrollment::query()->create(['user_id' => $student->id, 'course_id' => $course->id]);

        $payload = [
            'course_id' => $course->id,
            'title' => 'واجب مسودة',
            'max_score' => 100,
            'stars_reward' => 5,
            'is_published' => false,
        ];
        $this->actingAs($teacher)->post(route('assignments.store'), $payload)->assertRedirect();
        $this->assertDatabaseCount('app_notifications', 0);

        $this->actingAs($teacher)->post(route('assignments.store'), [
            ...$payload,
            'title' => 'واجب منشور',
            'is_published' => true,
        ])->assertRedirect();
        $this->assertDatabaseHas('app_notifications', ['user_id' => $student->id, 'type' => 'assignment']);
    }

    public function test_publishing_an_existing_exam_notifies_enrolled_students_once(): void
    {
        [$teacher, $student, $course] = $this->learningContext();
        Enrollment::query()->create(['user_id' => $student->id, 'course_id' => $course->id]);
        $exam = $this->exam($teacher, $course, false);
        $payload = $this->examPayload($course, true);

        $this->actingAs($teacher)->put(route('exams.update', $exam), $payload)->assertRedirect();
        $this->assertDatabaseHas('app_notifications', ['user_id' => $student->id, 'type' => 'exam_published']);

        $this->actingAs($teacher)->put(route('exams.update', $exam), $payload)->assertRedirect();
        $this->assertSame(1, AppNotification::query()->where('user_id', $student->id)->where('type', 'exam_published')->count());
    }

    public function test_manual_exam_result_is_not_sent_until_teacher_finishes_grading(): void
    {
        [$teacher, $student, $course] = $this->learningContext();
        $exam = $this->exam($teacher, $course, true);
        $question = ExamQuestion::query()->create([
            'exam_id' => $exam->id,
            'type' => ExamQuestion::TYPE_SHORT,
            'prompt' => 'اكتب جملة مفيدة',
            'points' => 10,
        ]);
        $service = app(ExamService::class);
        $attempt = $service->startAttempt($exam, $student);
        $attempt = $service->submitAttempt($attempt, [$question->id => 'العلم نور']);

        $this->assertSame('submitted', $attempt->status);
        $this->assertDatabaseMissing('app_notifications', ['user_id' => $student->id, 'type' => 'exam_result']);

        $service->gradeShortAnswer($attempt->answers()->first(), 10, true, 'إجابة ممتازة');
        $this->assertDatabaseHas('app_notifications', ['user_id' => $student->id, 'type' => 'exam_result']);
        $this->assertSame('graded', $attempt->fresh()->status);
    }

    public function test_assignment_and_exam_reject_a_lesson_from_another_course(): void
    {
        [$teacher, , $course] = $this->learningContext();
        $otherCourse = Course::query()->create([
            'title' => 'دورة أخرى', 'slug' => 'other-course', 'teacher_id' => $teacher->id, 'is_published' => true,
        ]);
        $foreignLesson = $this->lesson($otherCourse);

        $this->actingAs($teacher)->post(route('assignments.store'), [
            'course_id' => $course->id,
            'lesson_id' => $foreignLesson->id,
            'title' => 'واجب خاطئ',
        ])->assertSessionHasErrors('lesson_id');

        $this->actingAs($teacher)->post(route('exams.store'), [
            ...$this->examPayload($course, false),
            'lesson_id' => $foreignLesson->id,
        ])->assertSessionHasErrors('lesson_id');
    }

    public function test_unenrolled_student_cannot_complete_a_book_chapter_for_stars(): void
    {
        [$teacher, $student, $course] = $this->learningContext();
        $book = Book::query()->create([
            'title' => 'كتاب نجوم', 'slug' => 'stars-book', 'file_path' => 'books/stars.pdf',
            'course_id' => $course->id, 'uploaded_by' => $teacher->id, 'is_published' => true,
        ]);
        $chapter = BookChapter::query()->create([
            'book_id' => $book->id, 'title' => 'الفصل الأول', 'page_from' => 1, 'stars_reward' => 3,
        ]);

        $this->actingAs($student)->post(route('books.chapters.complete', [$book, $chapter]), [
            'score' => 1, 'total' => 1,
        ])->assertForbidden();
        $this->assertSame(0, $student->fresh()->stars);
    }

    private function learningContext(bool $published = true): array
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);
        $student = User::factory()->create(['role' => User::ROLE_STUDENT, 'stars' => 0]);
        $course = Course::query()->create([
            'title' => 'مغامرة العربية',
            'slug' => 'arabic-journey-'.str()->random(5),
            'teacher_id' => $teacher->id,
            'is_published' => $published,
        ]);

        return [$teacher, $student, $course];
    }

    private function lesson(Course $course, bool $published = true): Lesson
    {
        return Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'اللام الشمسية',
            'slug' => 'lesson-'.str()->random(5),
            'is_published' => $published,
        ]);
    }

    private function exam(User $teacher, Course $course, bool $published): Exam
    {
        return Exam::query()->create([
            ...$this->examPayload($course, $published),
            'created_by' => $teacher->id,
        ]);
    }

    private function examPayload(Course $course, bool $published): array
    {
        return [
            'course_id' => $course->id,
            'title' => 'فحص تجريبي',
            'duration_minutes' => 10,
            'pass_percent' => 60,
            'max_attempts' => 1,
            'stars_reward' => 5,
            'shuffle_questions' => false,
            'show_correct_answers' => true,
            'is_published' => $published,
        ];
    }
}
