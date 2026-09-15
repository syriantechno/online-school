<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\QuestionBankItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuestionBankSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::query()->where('role', User::ROLE_TEACHER)->first();
        if (! $teacher) {
            return;
        }

        $course = Course::query()->where('teacher_id', $teacher->id)->first();
        $samples = [
            ['easy', 'قواعد', 'single', 'أي كلمة مما يأتي تبدأ باللام الشمسية؟', ['الشمس', 'القمر', 'الكتاب', 'الباب'], ['0'], 'تُدغم اللام في كلمة الشمس.'],
            ['easy', 'قواعد', 'true_false', 'تُكتب التاء المربوطة في نهاية كلمة «مدرسة».', ['صح', 'خطأ'], ['0'], 'مدرسة تنتهي بتاء مربوطة.'],
            ['medium', 'نحو', 'single', 'ما نوع كلمة «كتبَ» في جملة: كتبَ الطالبُ الدرسَ؟', ['اسم', 'فعل ماضٍ', 'حرف', 'فعل أمر'], ['1'], 'كتبَ فعل ماضٍ يدل على حدث انتهى.'],
            ['medium', 'مفردات', 'single', 'ما مرادف كلمة «سعيد»؟', ['حزين', 'فرح', 'متعب', 'غاضب'], ['1'], 'فرح وسعيد كلمتان متقاربتان في المعنى.'],
            ['easy', 'إملاء', 'single', 'اختر الكلمة المكتوبة كتابة صحيحة.', ['هاذا', 'هذا', 'هاذاك', 'هدا'], ['1'], 'تُكتب اسم الإشارة: هذا.'],
            ['hard', 'فهم مقروء', 'short', 'اكتب جملة مفيدة تصف فيها أهمية القراءة.', null, null, 'تُقيّم الإجابة بحسب وضوح المعنى وسلامة اللغة.'],
            ['medium', 'صرف', 'single', 'ما جمع كلمة «كتاب»؟', ['كاتب', 'مكتبة', 'كتب', 'كتابات'], ['2'], 'جمع التكسير لكلمة كتاب هو كتب.'],
            ['hard', 'نحو', 'multiple', 'اختر الكلمات التي تُعد أسماءً.', ['مدرسة', 'يكتب', 'قلم', 'إلى'], ['0', '2'], 'مدرسة وقلم اسمان، يكتب فعل، وإلى حرف.'],
            ['easy', 'قراءة', 'true_false', 'تبدأ الجملة العربية من جهة اليمين.', ['صح', 'خطأ'], ['0'], 'تُقرأ العربية وتُكتب من اليمين إلى اليسار.'],
            ['medium', 'إملاء', 'single', 'أي كلمة تحتوي همزة قطع؟', ['ابن', 'اسم', 'أحمد', 'اثنان'], ['2'], 'أحمد تبدأ بهمزة قطع ظاهرة.'],
        ];

        foreach ($samples as [$difficulty, $skill, $type, $prompt, $options, $correct, $explanation]) {
            QuestionBankItem::query()->updateOrCreate(
                ['created_by' => $teacher->id, 'prompt' => $prompt],
                [
                    'course_id' => $course?->id,
                    'grade_level' => $course?->level,
                    'skill' => $skill,
                    'difficulty' => $difficulty,
                    'type' => $type,
                    'options' => $options,
                    'correct_answers' => $correct,
                    'points' => $difficulty === 'hard' ? 3 : ($difficulty === 'medium' ? 2 : 1),
                    'explanation' => $explanation,
                    'is_active' => true,
                ]
            );
        }
    }
}
