<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Book;
use App\Models\BookChapter;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\StudentRating;
use App\Models\User;
use App\Models\VideoRoom;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@school.test'],
            [
                'name' => 'مدير النظام',
                'role' => User::ROLE_ADMIN,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $teacher = User::query()->updateOrCreate(
            ['email' => 'teacher@school.test'],
            [
                'name' => 'الأستاذة نور',
                'role' => User::ROLE_TEACHER,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $student = User::query()->updateOrCreate(
            ['email' => 'student@school.test'],
            [
                'name' => 'الطالب أحمد',
                'role' => User::ROLE_STUDENT,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
                'stars' => 5,
            ]
        );

        $parent = User::query()->updateOrCreate(
            ['email' => 'parent@school.test'],
            [
                'name' => 'ولي الأمر خالد',
                'role' => User::ROLE_PARENT,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $parent->children()->syncWithoutDetaching([$student->id]);

        $course = Course::query()->updateOrCreate(
            ['slug' => 'arabic-reading-basics'],
            [
                'title' => 'اللغة العربية — أساسيات القراءة',
                'description' => 'دورة عربية تأسيسية متدرجة للقراءة والفهم مع فيديوهات وتمارين تفاعلية.',
                'teacher_id' => $teacher->id,
                'level' => 'ابتدائي',
                'subject' => 'لغة عربية',
                'is_published' => true,
            ]
        );

        Lesson::query()->where('course_id', $course->id)->delete();

        Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'الحروف والحركات',
            'slug' => 'letters-and-harakat',
            'content' => "في هذا الدرس نتعرّف على الحروف العربية والحركات الأساسية.\n\nشاهد الفيديو ثم أجب عن التمرين التفاعلي.",
            'video_url' => 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
            'duration_minutes' => 12,
            'sort_order' => 1,
            'is_published' => true,
            'is_interactive' => true,
            'stars_reward' => 3,
            'interactive_payload' => [
                'questions' => [
                    [
                        'id' => 'q1',
                        'question' => 'كم عدد حروف اللغة العربية؟',
                        'options' => ['26', '28', '29', '32'],
                        'correct_index' => 1,
                        'explanation' => 'الحروف العربية ثمانية وعشرون حرفاً.',
                    ],
                    [
                        'id' => 'q2',
                        'question' => 'ما الحركة التي تمثل صوت «ا» القصير؟',
                        'options' => ['الضمة', 'الفتحة', 'الكسرة', 'السكون'],
                        'correct_index' => 1,
                        'explanation' => 'الفتحة تقابل صوت الألف القصير.',
                    ],
                    [
                        'id' => 'q3',
                        'question' => 'أي مما يلي حرف عربي؟',
                        'options' => ['A', 'ب', 'C', 'Z'],
                        'correct_index' => 1,
                        'explanation' => 'حرف الباء من حروف العربية.',
                    ],
                ],
            ],
        ]);

        Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'قراءة جملة قصيرة',
            'slug' => 'short-sentence-reading',
            'content' => 'تدرّب على قراءة جملة قصيرة بوضوح وفكّر على معنى الحروف.',
            'video_url' => null,
            'duration_minutes' => 8,
            'sort_order' => 2,
            'is_published' => true,
            'is_interactive' => true,
            'stars_reward' => 2,
            'interactive_payload' => [
                'questions' => [
                    [
                        'id' => 'q1',
                        'question' => 'الجملة «ذهب الولد إلى المدرسة» تبدأ بـ:',
                        'options' => ['المدرسة', 'الولد', 'ذهب', 'إلى'],
                        'correct_index' => 2,
                        'explanation' => 'ذهب فعل ماضٍ في بداية الجملة.',
                    ],
                ],
            ],
        ]);

        Enrollment::query()->updateOrCreate(
            [
                'user_id' => $student->id,
                'course_id' => $course->id,
            ],
            [
                'status' => 'active',
                'progress_percent' => 0,
            ]
        );

        VideoRoom::query()->updateOrCreate(
            ['slug' => 'arabic-live-class'],
            [
                'title' => 'حصة قراءة مباشرة',
                'room_code' => 'school-demoarabic',
                'description' => 'غرفة تجريبية للاتصال المرئي مع المعلم عبر Jitsi.',
                'host_id' => $teacher->id,
                'course_id' => $course->id,
                'scheduled_at' => now()->addDay(),
                'is_active' => true,
            ]
        );

        Announcement::query()->updateOrCreate(
            ['title' => 'مرحباً بكم في المدرسة الإلكترونية'],
            [
                'body' => "أهلاً بالطلاب والمعلمين وأولياء الأمور.\nابدؤوا بالتسجيل في الدورات، شاهدوا الدروس، واجمعوا النجوم.",
                'author_id' => $admin->id,
                'course_id' => null,
                'is_published' => true,
                'published_at' => now(),
            ]
        );

        Announcement::query()->updateOrCreate(
            ['title' => 'بدء دورة اللغة العربية'],
            [
                'body' => 'تم فتح التسجيل في دورة أساسيات القراءة. سجّل الآن وابدأ الدرس الأول.',
                'author_id' => $teacher->id,
                'course_id' => $course->id,
                'is_published' => true,
                'published_at' => now(),
            ]
        );

        $book = Book::query()->first();
        if ($book) {
            BookChapter::query()->updateOrCreate(
                [
                    'book_id' => $book->id,
                    'title' => 'الفصل الأول — تمهيد',
                ],
                [
                    'page_from' => 1,
                    'page_to' => 5,
                    'sort_order' => 1,
                    'is_interactive' => true,
                    'stars_reward' => 3,
                    'interactive_payload' => [
                        'questions' => [
                            [
                                'id' => 'bq1',
                                'question' => 'ما عنوان هذا الكتاب تقريباً؟',
                                'options' => [$book->title, 'كتاب رياضيات', 'كتاب إنجليزي', 'لا أعلم'],
                                'correct_index' => 0,
                                'explanation' => 'العنوان يظهر في صفحة الكتاب.',
                            ],
                        ],
                    ],
                ]
            );
        }

        StudentRating::query()->updateOrCreate(
            [
                'student_id' => $student->id,
                'rated_by' => $teacher->id,
                'course_id' => $course->id,
            ],
            [
                'stars' => 5,
                'comment' => 'أداء ممتاز في الحصة الأولى.',
            ]
        );

        unset($admin);
    }
}
