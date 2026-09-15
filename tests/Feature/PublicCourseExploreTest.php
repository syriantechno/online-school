<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicCourseExploreTest extends TestCase
{
    use RefreshDatabase;

    public function test_explore_index_lists_published_courses(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);

        $published = Course::query()->create([
            'title' => 'دورة القراءة',
            'slug' => 'reading-'.str()->random(5),
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        Course::query()->create([
            'title' => 'مسودة',
            'slug' => 'draft-'.str()->random(5),
            'teacher_id' => $teacher->id,
            'is_published' => false,
        ]);

        Lesson::query()->create([
            'course_id' => $published->id,
            'title' => 'الدرس الأول',
            'slug' => 'lesson-'.str()->random(5),
            'is_published' => true,
            'duration_minutes' => 15,
        ]);

        $response = $this->get(route('explore.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Public/Explore/Index')
            ->has('courses.data', 1)
            ->where('courses.data.0.title', 'دورة القراءة')
        );
    }

    public function test_explore_show_displays_course_syllabus(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);

        $course = Course::query()->create([
            'title' => 'دورة القراءة',
            'slug' => 'reading-course',
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'الدرس الأول',
            'slug' => 'lesson-one',
            'is_published' => true,
            'duration_minutes' => 20,
            'sort_order' => 1,
        ]);

        $response = $this->get(route('explore.show', $course->slug));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Public/Explore/Show')
            ->where('course.title', $course->title)
            ->where('stats.lessons_count', 1)
            ->where('stats.total_minutes', 20)
            ->where('isEnrolled', false)
        );
    }

    public function test_homepage_includes_published_courses(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);

        Course::query()->create([
            'title' => 'دورة الصف الأول',
            'slug' => 'grade-one-'.str()->random(5),
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->has('courses', 1)
            ->has('stats', 4)
        );
    }

    public function test_enrolled_student_can_open_public_lesson_page(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $course = Course::query()->create([
            'title' => 'دورة القراءة',
            'slug' => 'reading-course-public',
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        $lesson = Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'الدرس الأول',
            'slug' => 'lesson-one-public',
            'is_published' => true,
        ]);

        \App\Models\Enrollment::query()->create(['user_id' => $student->id, 'course_id' => $course->id]);

        $this->actingAs($student)
            ->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $lesson->id]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Lessons/Show')
                ->where('publicMode', true)
                ->where('courseSlug', 'reading-course-public')
                ->has('lessonPath')
            );
    }

    public function test_student_cannot_open_locked_lesson_before_previous_is_completed(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $course = Course::query()->create([
            'title' => 'مسار متسلسل',
            'slug' => 'sequential-course',
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        $first = Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'الأول',
            'slug' => 'lesson-a',
            'is_published' => true,
            'sort_order' => 1,
        ]);

        $second = Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'الثاني',
            'slug' => 'lesson-b',
            'is_published' => true,
            'sort_order' => 2,
        ]);

        Enrollment::query()->create(['user_id' => $student->id, 'course_id' => $course->id]);

        $this->actingAs($student)
            ->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $second->id]))
            ->assertRedirect(route('explore.show', $course->slug));

        LessonCompletion::query()->create([
            'user_id' => $student->id,
            'lesson_id' => $first->id,
            'completed_at' => now(),
        ]);

        $this->actingAs($student)
            ->get(route('explore.learn', ['course' => $course->slug, 'lesson' => $second->id]))
            ->assertOk();
    }

    public function test_guest_cannot_enroll_without_account(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);

        $course = Course::query()->create([
            'title' => 'دورة محمية',
            'slug' => 'protected-course',
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        $this->post(route('courses.enroll', $course))
            ->assertRedirect(route('login'));
    }

    public function test_login_with_enroll_intent_auto_enrolls_student(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $course = Course::query()->create([
            'title' => 'دورة الاشتراك',
            'slug' => 'enroll-course',
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        $this->get(route('login', [
            'redirect' => route('explore.show', $course->slug, absolute: false),
            'enroll_course' => $course->id,
        ]));

        $this->post(route('login'), [
            'email' => $student->email,
            'password' => 'password',
        ])->assertRedirect(route('explore.show', $course->slug));

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);
    }

    public function test_registration_creates_student_and_auto_enrolls(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);

        $course = Course::query()->create([
            'title' => 'دورة التسجيل',
            'slug' => 'register-enroll-course',
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        $this->get(route('register', [
            'redirect' => route('explore.show', $course->slug, absolute: false),
            'enroll_course' => $course->id,
        ]));

        $response = $this->post(route('register'), [
            'name' => 'طالب جديد',
            'email' => 'new-student@example.com',
            'gender' => 'male',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::query()->where('email', 'new-student@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame(User::ROLE_STUDENT, $user->role);
        $response->assertRedirect(route('explore.show', $course->slug));

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);
    }

    public function test_enrolled_student_sees_enrolled_course_ids_in_shared_props(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $course = Course::query()->create([
            'title' => 'دورة مسجّل بها',
            'slug' => 'enrolled-course',
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        Enrollment::query()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'active',
            'progress_percent' => 0,
            'enrolled_at' => now(),
        ]);

        $this->actingAs($student)
            ->get(route('explore.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('auth.enrolledCourseIds', [$course->id])
            );
    }

    public function test_explore_show_hides_enroll_for_enrolled_student(): void
    {
        $teacher = User::factory()->create(['role' => User::ROLE_TEACHER]);
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $course = Course::query()->create([
            'title' => 'دورة مشترك بها',
            'slug' => 'subscribed-course',
            'teacher_id' => $teacher->id,
            'is_published' => true,
        ]);

        Enrollment::query()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'active',
            'progress_percent' => 25,
            'enrolled_at' => now(),
        ]);

        $this->actingAs($student)
            ->get(route('explore.show', $course->slug))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('isEnrolled', true)
                ->where('enrollment.progress_percent', 25)
            );
    }

    public function test_student_dashboard_redirects_to_profile(): void
    {
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $this->actingAs($student)
            ->get(route('dashboard'))
            ->assertRedirect(route('student.profile'));
    }

    public function test_student_profile_page_renders(): void
    {
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        $this->actingAs($student)
            ->get(route('student.profile'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Public/StudentProfile')
                ->has('stats', 4)
            );
    }
}
