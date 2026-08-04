<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamQuestion extends Model
{
    public const TYPE_SINGLE = 'single';

    public const TYPE_MULTIPLE = 'multiple';

    public const TYPE_TRUE_FALSE = 'true_false';

    public const TYPE_SHORT = 'short';

    protected $fillable = [
        'exam_id',
        'type',
        'prompt',
        'options',
        'correct_answers',
        'points',
        'sort_order',
        'explanation',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'correct_answers' => 'array',
            'points' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(ExamAnswer::class);
    }

    public function isAutoGradable(): bool
    {
        return in_array($this->type, [
            self::TYPE_SINGLE,
            self::TYPE_MULTIPLE,
            self::TYPE_TRUE_FALSE,
        ], true);
    }

    public function grade(mixed $answer): array
    {
        if ($this->type === self::TYPE_SHORT) {
            return ['is_correct' => null, 'points_earned' => 0];
        }

        $correct = collect($this->correct_answers ?? [])->map(fn ($v) => (string) $v)->sort()->values()->all();
        $given = collect(is_array($answer) ? $answer : [$answer])->map(fn ($v) => (string) $v)->sort()->values()->all();

        $isCorrect = $correct === $given;

        return [
            'is_correct' => $isCorrect,
            'points_earned' => $isCorrect ? (float) $this->points : 0.0,
        ];
    }
}
