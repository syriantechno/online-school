<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Course extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'teacher_id',
        'level',
        'subject',
        'is_published',
    ];

    protected $appends = ['cover_url'];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    protected function coverUrl(): Attribute
    {
        return Attribute::get(function () {
            if (! $this->cover_image) {
                return null;
            }

            return Storage::disk('public')->url($this->cover_image);
        });
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order');
    }

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(CourseReview::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function discussionThreads(): HasMany
    {
        return $this->hasMany(DiscussionThread::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }

    public function averageReview(): float
    {
        return round((float) $this->reviews()->avg('stars'), 1);
    }
}
