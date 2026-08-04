<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class BookChapter extends Model
{
    protected $fillable = [
        'book_id',
        'title',
        'page_from',
        'page_to',
        'sort_order',
        'is_interactive',
        'interactive_payload',
        'stars_reward',
    ];

    protected function casts(): array
    {
        return [
            'is_interactive' => 'boolean',
            'interactive_payload' => 'array',
        ];
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function starTransactions(): MorphMany
    {
        return $this->morphMany(StarTransaction::class, 'source');
    }
}
