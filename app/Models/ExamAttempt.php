<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class ExamAttempt extends Model
{
    protected $fillable = [
        'exam_id',
        'user_id',
        'attempt_number',
        'status',
        'score',
        'max_score',
        'percent',
        'passed',
        'started_at',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'float',
            'max_score' => 'float',
            'percent' => 'float',
            'passed' => 'boolean',
            'started_at' => 'datetime',
            'submitted_at' => 'datetime',
            'attempt_number' => 'integer',
        ];
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(ExamAnswer::class);
    }

    public function starTransactions(): MorphMany
    {
        return $this->morphMany(StarTransaction::class, 'source');
    }

    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    public function expiresAt(): ?\Carbon\Carbon
    {
        if (! $this->started_at || ! $this->exam?->duration_minutes) {
            return null;
        }

        return $this->started_at->copy()->addMinutes($this->exam->duration_minutes);
    }
}
