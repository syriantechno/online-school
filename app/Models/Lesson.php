<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'slug',
        'content',
        'video_url',
        'duration_minutes',
        'sort_order',
        'is_published',
        'is_interactive',
        'interactive_payload',
        'stars_reward',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'is_interactive' => 'boolean',
            'interactive_payload' => 'array',
            'stars_reward' => 'integer',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function completions(): HasMany
    {
        return $this->hasMany(LessonCompletion::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(LessonNote::class);
    }

    public function starTransactions(): MorphMany
    {
        return $this->morphMany(StarTransaction::class, 'source');
    }
}
