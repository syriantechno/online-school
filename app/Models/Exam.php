<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    protected $fillable = [
        'course_id',
        'lesson_id',
        'created_by',
        'title',
        'description',
        'duration_minutes',
        'pass_percent',
        'max_attempts',
        'stars_reward',
        'shuffle_questions',
        'show_correct_answers',
        'available_from',
        'available_until',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'shuffle_questions' => 'boolean',
            'show_correct_answers' => 'boolean',
            'is_published' => 'boolean',
            'available_from' => 'datetime',
            'available_until' => 'datetime',
            'duration_minutes' => 'integer',
            'pass_percent' => 'integer',
            'max_attempts' => 'integer',
            'stars_reward' => 'integer',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ExamQuestion::class)->orderBy('sort_order')->orderBy('id');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(ExamAttempt::class);
    }

    public function totalPoints(): int
    {
        return (int) $this->questions()->sum('points');
    }

    public function isAvailable(): bool
    {
        if (! $this->is_published) {
            return false;
        }

        $now = now();

        if ($this->available_from && $now->lt($this->available_from)) {
            return false;
        }

        if ($this->available_until && $now->gt($this->available_until)) {
            return false;
        }

        return true;
    }
}
