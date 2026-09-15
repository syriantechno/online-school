<?php

namespace App\Services;

use App\Models\Lesson;

/**
 * يستخرج أسئلة بنك من محتوى الدرس التفاعلي (مولّد الاستوديو).
 */
class LessonQuestionGenerator
{
    public function fromLesson(Lesson $lesson, int $max = 12): array
    {
        $payload = $lesson->interactive_payload ?? [];
        if (($payload['type'] ?? null) !== 'generated_worksheet') {
            return [];
        }

        $letter = trim((string) ($payload['letter'] ?? ''));
        $grade = (string) ($payload['grade_level'] ?? $lesson->course?->level ?? '');
        $skill = (string) ($payload['skill'] ?? 'فهم الدرس');
        $drafts = [];

        foreach ($payload['blocks'] ?? [] as $block) {
            $kind = $block['kind'] ?? '';

            if (in_array($kind, ['story_quiz', 'text_lab', 'grammar_fix'], true)) {
                foreach ($block['items'] ?? [] as $item) {
                    $draft = $this->fromQuizItem($item, $skill, $grade, $kind);
                    if ($draft) {
                        $drafts[] = $draft;
                    }
                }
            }

            if ($kind === 'pick_grid' && $letter !== '') {
                foreach ($block['items'] ?? [] as $item) {
                    $label = trim((string) ($item['label'] ?? ''));
                    if ($label === '') {
                        continue;
                    }
                    $starts = (bool) ($item['starts_with'] ?? false);
                    $drafts[] = [
                        'skill' => 'تمييز الحرف',
                        'difficulty' => 'easy',
                        'type' => 'true_false',
                        'prompt' => "هل كلمة «{$label}» تبدأ بحرف ({$letter})؟",
                        'options' => ['صح', 'خطأ'],
                        'correct_answers' => [$starts ? '0' : '1'],
                        'points' => 1,
                        'explanation' => $starts
                            ? "نعم، «{$label}» تبدأ بحرف ({$letter})."
                            : "لا، «{$label}» لا تبدأ بحرف ({$letter}).",
                        'grade_level' => $grade,
                    ];
                }
            }

            if ($kind === 'vocab_grid' && $letter !== '') {
                $labels = collect($block['items'] ?? [])
                    ->pluck('label')
                    ->filter()
                    ->values()
                    ->all();
                if (count($labels) >= 1) {
                    $correct = $labels[0];
                    $distractors = array_values(array_filter($labels, fn ($w) => $w !== $correct));
                    while (count($distractors) < 3) {
                        $distractors[] = $this->fakeDistractor($letter, count($distractors));
                    }
                    $options = array_values(array_slice(array_unique([$correct, ...$distractors]), 0, 4));
                    shuffle($options);
                    $correctIndex = (string) array_search($correct, $options, true);
                    $drafts[] = [
                        'skill' => 'مفردات',
                        'difficulty' => 'easy',
                        'type' => 'single',
                        'prompt' => "أي كلمة مما يأتي تبدأ بحرف ({$letter})؟",
                        'options' => $options,
                        'correct_answers' => [$correctIndex],
                        'points' => 1,
                        'explanation' => "«{$correct}» تبدأ بحرف ({$letter}).",
                        'grade_level' => $grade,
                    ];
                }
            }

            if ($kind === 'writing_workshop' && ! empty($block['prompt'])) {
                $drafts[] = [
                    'skill' => 'تعبير',
                    'difficulty' => 'hard',
                    'type' => 'short',
                    'prompt' => (string) $block['prompt'],
                    'options' => null,
                    'correct_answers' => null,
                    'points' => 3,
                    'explanation' => (string) ($block['rubric'] ?? 'وضوح الفكرة · ترابط الجمل · سلامة اللغة'),
                    'grade_level' => $grade,
                ];
            }

            if ($kind === 'story' && $letter !== '' && ! empty($block['text'])) {
                $drafts[] = [
                    'skill' => 'فهم مقروء',
                    'difficulty' => 'medium',
                    'type' => 'true_false',
                    'prompt' => "هل تظهر كلمات تبدأ بحرف ({$letter}) في قصة هذا الدرس؟",
                    'options' => ['صح', 'خطأ'],
                    'correct_answers' => ['0'],
                    'points' => 1,
                    'explanation' => 'القصة مبنية حول الحرف المستهدف في الدرس.',
                    'grade_level' => $grade,
                ];
            }

            if ($kind === 'voice_reading' && ! empty($block['passage'])) {
                $snippet = mb_substr(trim((string) $block['passage']), 0, 80);
                $drafts[] = [
                    'skill' => 'قراءة',
                    'difficulty' => 'medium',
                    'type' => 'short',
                    'prompt' => "اقرأ ثم اكتب جملة مفيدة مستوحاة من هذا المقطع: «{$snippet}…»",
                    'options' => null,
                    'correct_answers' => null,
                    'points' => 2,
                    'explanation' => 'تُقيّم وضوح القراءة والمعنى في الجملة المكتوبة.',
                    'grade_level' => $grade,
                ];
            }
        }

        // إزالة التكرار حسب نص السؤال
        $unique = [];
        foreach ($drafts as $draft) {
            $key = mb_strtolower(trim($draft['prompt']));
            if ($key === '' || isset($unique[$key])) {
                continue;
            }
            $unique[$key] = $draft;
        }

        return array_slice(array_values($unique), 0, max(1, min(50, $max)));
    }

    private function fromQuizItem(array $item, string $skill, string $grade, string $kind): ?array
    {
        $prompt = trim((string) ($item['question'] ?? $item['sentence'] ?? ''));
        $options = array_values(array_filter($item['options'] ?? [], fn ($o) => filled($o)));
        if ($prompt === '' || count($options) < 2) {
            return null;
        }

        $correctIndex = (int) ($item['correct_index'] ?? 0);
        if ($correctIndex < 0 || $correctIndex >= count($options)) {
            $correctIndex = 0;
        }

        $difficulty = match ($kind) {
            'grammar_fix' => 'medium',
            'text_lab' => 'medium',
            default => 'easy',
        };

        return [
            'skill' => $kind === 'grammar_fix' ? 'نحو' : $skill,
            'difficulty' => $difficulty,
            'type' => 'single',
            'prompt' => $prompt,
            'options' => $options,
            'correct_answers' => [(string) $correctIndex],
            'points' => $difficulty === 'hard' ? 3 : ($difficulty === 'medium' ? 2 : 1),
            'explanation' => null,
            'grade_level' => $grade,
        ];
    }

    private function fakeDistractor(string $letter, int $index): string
    {
        $pool = ['باب', 'شمس', 'قمر', 'ورد', 'بيت', 'نور', 'قلم', 'كتاب'];
        foreach ($pool as $word) {
            if (! str_starts_with($word, $letter)) {
                return $word;
            }
        }

        return 'كلمة'.$index;
    }
}
