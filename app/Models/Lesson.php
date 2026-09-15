<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Lesson extends Model
{
    public const ACTIVITY_TYPES = ['quiz', 'matching', 'ordering', 'fill', 'flashcards', 'image_worksheet', 'generated_worksheet'];

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

    public function submissions(): HasMany
    {
        return $this->hasMany(LessonSubmission::class);
    }

    public function starTransactions(): MorphMany
    {
        return $this->morphMany(StarTransaction::class, 'source');
    }

    public function isImageWorksheet(): bool
    {
        return $this->is_interactive && ($this->interactive_payload['type'] ?? null) === 'image_worksheet';
    }

    public function isGeneratedWorksheet(): bool
    {
        return $this->is_interactive && ($this->interactive_payload['type'] ?? null) === 'generated_worksheet';
    }

    public function worksheetZoneCount(): int
    {
        $payload = $this->interactive_payload ?? [];
        if (($payload['type'] ?? null) === 'generated_worksheet') {
            return $this->generatedAnswerCount();
        }

        $count = 0;
        foreach ($payload['pages'] ?? [] as $page) {
            $count += count($page['zones'] ?? []);
        }

        return $count;
    }

    public function generatedAnswerCount(): int
    {
        $count = 0;
        foreach ($this->interactive_payload['blocks'] ?? [] as $block) {
            $kind = $block['kind'] ?? null;
            if ($kind === 'pick_grid' || $kind === 'match_pairs' || $kind === 'find_letter' || $kind === 'build_word' || $kind === 'story_quiz' || $kind === 'text_lab' || $kind === 'grammar_fix') {
                $count += count($block['items'] ?? []);
            } elseif ($kind === 'story_tap') {
                $count += count(array_filter($block['tokens'] ?? [], fn ($token) => ! empty($token['correct'])));
            } elseif ($kind === 'trace_letter') {
                $count += max(1, (int) ($block['count'] ?? 1));
            } elseif ($kind === 'writing_workshop' || $kind === 'voice_reading') {
                $count += 1;
            }
        }

        return $count;
    }

    public function resolveWorksheetMedia(): static
    {
        $payload = $this->interactive_payload;
        if (($payload['type'] ?? null) !== 'image_worksheet') {
            return $this;
        }

        foreach ($payload['pages'] ?? [] as $i => $page) {
            if (! empty($page['image'])) {
                $payload['pages'][$i]['image_url'] = Storage::disk('public')->url($page['image']);
            }
        }

        $this->interactive_payload = $payload;

        return $this;
    }

    public static function uniqueSlug(int $courseId, string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: Str::random(8);
        $slug = $base;
        $i = 1;
        while (
            static::query()
                ->where('course_id', $courseId)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    public static function sanitizeInteractivePayload(?array $payload): ?array
    {
        if (! $payload) {
            return null;
        }

        if (($payload['type'] ?? null) === 'image_worksheet') {
            foreach ($payload['pages'] ?? [] as $i => $page) {
                unset($payload['pages'][$i]['image_url']);
            }
        }

        return $payload;
    }
}
