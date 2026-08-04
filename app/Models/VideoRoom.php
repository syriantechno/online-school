<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class VideoRoom extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'room_code',
        'description',
        'host_id',
        'course_id',
        'scheduled_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public static function generateRoomCode(): string
    {
        return 'school-'.Str::lower(Str::random(10));
    }

    public function jitsiUrl(): string
    {
        return 'https://meet.jit.si/'.$this->room_code;
    }
}
