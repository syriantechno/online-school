<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoLearningSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $teacher = User::query()->where('email', 'teacher@school.test')->firstOrFail();
            $course = Course::query()->updateOrCreate(['slug' => 'arabic-demo-adventure'], [
                'title' => 'مغامرة اللغة العربية التجريبية',
                'description' => 'دورة تجريبية متكاملة فيها دروس تفاعلية وواجبات وفحوصات لتجربة المنصة.',
                'teacher_id' => $teacher->id, 'level' => 'ابتدائي', 'subject' => 'اللغة العربية', 'is_published' => true,
            ]);

            $lessons = [
                ['demo-letter-ba', 'حرف الباء وأشكاله', "حرف الباء من الحروف الجميلة، وله نقطة واحدة تحت السطر.\n\nيأتي في أول الكلمة مثل: بَطة، وفي وسطها مثل: حبل، وفي آخرها مثل: كتاب.", 1, [
                    ['id' => 'ba-1', 'question' => 'أين توجد نقطة حرف الباء؟', 'options' => ['فوق الحرف', 'تحت الحرف', 'لا توجد نقطة'], 'correct_index' => 1, 'explanation' => 'لحرف الباء نقطة واحدة تحت الحرف.'],
                    ['id' => 'ba-2', 'question' => 'أي كلمة تبدأ بحرف الباء؟', 'options' => ['تفاحة', 'بطة', 'قمر'], 'correct_index' => 1, 'explanation' => 'كلمة بطة تبدأ بحرف الباء.'],
                ]],
                ['demo-sun-moon', 'اللام الشمسية والقمرية', "نكتب (الـ) في بداية الكلمات المعرفة.\n\nفي اللام الشمسية لا ننطق اللام مثل: الشَّمس. وفي اللام القمرية ننطقها مثل: القمر.", 2, [
                    ['id' => 'lam-1', 'question' => 'أي كلمة فيها لام شمسية؟', 'options' => ['القمر', 'الكتاب', 'الشمس'], 'correct_index' => 2, 'explanation' => 'الشمس تبدأ بلام شمسية.'],
                    ['id' => 'lam-2', 'question' => 'في كلمة «القمر» هل ننطق اللام؟', 'options' => ['نعم', 'لا'], 'correct_index' => 0, 'explanation' => 'القمر من الكلمات القمرية وننطق فيها اللام.'],
                ]],
                ['demo-sentence', 'نبني جملة مفيدة', "الجملة المفيدة تعطينا معنى كاملاً.\n\nمثال: قرأَ أحمدُ الكتابَ. تبدأ الجملة الفعلية بفعل، ثم يأتي من قام بالفعل.", 3, [
                    ['id' => 'sentence-1', 'question' => 'أي عبارة جملة مفيدة؟', 'options' => ['في المدرسة', 'كتبَ الطالبُ الدرسَ', 'الكتاب على'], 'correct_index' => 1, 'explanation' => 'كتب الطالب الدرس جملة مكتملة المعنى.'],
                ]],
            ];

            $lessonModels = [];
            foreach ($lessons as [$slug, $title, $content, $order, $questions]) {
                $lessonModels[$slug] = Lesson::query()->updateOrCreate(['course_id' => $course->id, 'slug' => $slug], [
                    'title' => $title, 'content' => $content, 'duration_minutes' => 8 + ($order * 2), 'sort_order' => $order,
                    'is_published' => true, 'is_interactive' => true, 'stars_reward' => 3,
                    'interactive_payload' => ['type' => 'quiz', 'skill' => 'القراءة', 'questions' => $questions],
                ]);
            }

            $assignments = [
                ['واجب: كلمات حرف الباء', 'اكتب خمس كلمات تحتوي حرف الباء، ثم كوّن جملة قصيرة باستخدام إحدى الكلمات.', 'demo-letter-ba', 10, 5],
                ['واجب: صنّف الكلمات', 'قسّم الكلمات التالية إلى شمسية وقمرية: الشمس، القلم، الطريق، الكتاب، النور، السماء.', 'demo-sun-moon', 20, 7],
            ];
            foreach ($assignments as [$title, $instructions, $lessonSlug, $score, $stars]) {
                Assignment::query()->updateOrCreate(['course_id' => $course->id, 'title' => $title], [
                    'lesson_id' => $lessonModels[$lessonSlug]->id, 'created_by' => $teacher->id, 'instructions' => $instructions,
                    'max_score' => $score, 'stars_reward' => $stars, 'due_at' => now()->addDays(7), 'is_published' => true,
                ]);
            }

            $this->seedExam($course, $teacher, $lessonModels['demo-letter-ba'], 'فحص تجريبي 1: الحروف والكلمات', 'فحص سريع للتأكد من فهم حرف الباء.', [
                ['single', 'أي حرف له نقطة واحدة تحته؟', ['ت', 'ب', 'ن'], ['1'], 2, 'حرف الباء له نقطة واحدة تحته.'],
                ['true_false', 'كلمة «باب» تبدأ وتنتهي بحرف الباء.', ['صح', 'خطأ'], ['0'], 2, 'الكلمة تبدأ بباء وتنتهي بباء.'],
                ['single', 'اختر الكلمة التي لا تحتوي على باء.', ['كتاب', 'باب', 'قلم'], ['2'], 2, 'كلمة قلم لا تحتوي على حرف الباء.'],
            ]);
            $this->seedExam($course, $teacher, $lessonModels['demo-sun-moon'], 'فحص تجريبي 2: الشمسية والقمرية', 'تحدٍ متنوع في اللام الشمسية والقمرية وبناء الجملة.', [
                ['single', 'أي كلمة تبدأ بلام قمرية؟', ['الشمس', 'الطريق', 'الكتاب'], ['2'], 3, 'ننطق اللام في كلمة الكتاب.'],
                ['multiple', 'اختر الكلمات الشمسية.', ['النور', 'السماء', 'القمر', 'الدرس'], ['0', '1', '3'], 3, 'النور والسماء والدرس كلمات شمسية.'],
                ['true_false', 'الجملة «قرأ الطفل القصة» جملة مفيدة.', ['صح', 'خطأ'], ['0'], 2, 'الجملة مكتملة المعنى.'],
            ]);

            User::query()->whereIn('email', ['student@school.test', 'girl@school.test'])->get()->each(function (User $student) use ($course): void {
                Enrollment::query()->updateOrCreate(['user_id' => $student->id, 'course_id' => $course->id], [
                    'status' => 'active', 'progress_percent' => 0, 'enrolled_at' => now(),
                ]);
            });
        });
    }

    private function seedExam(Course $course, User $teacher, Lesson $lesson, string $title, string $description, array $questions): void
    {
        $exam = Exam::query()->updateOrCreate(['course_id' => $course->id, 'title' => $title], [
            'lesson_id' => $lesson->id, 'created_by' => $teacher->id, 'description' => $description,
            'duration_minutes' => 10, 'pass_percent' => 60, 'max_attempts' => 3, 'stars_reward' => 8,
            'shuffle_questions' => false, 'show_correct_answers' => true, 'is_published' => true,
        ]);
        foreach ($questions as $index => [$type, $prompt, $options, $answers, $points, $explanation]) {
            $exam->questions()->updateOrCreate(['prompt' => $prompt], [
                'type' => $type, 'options' => $options, 'correct_answers' => $answers, 'points' => $points,
                'sort_order' => $index + 1, 'explanation' => $explanation,
            ]);
        }
    }
}
