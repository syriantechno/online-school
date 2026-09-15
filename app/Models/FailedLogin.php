<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FailedLogin extends Model
{
    protected $fillable = [
        'email',
        'ip_address',
        'user_agent',
        'failed_at',
    ];

    protected $casts = [
        'failed_at' => 'datetime',
    ];
}
