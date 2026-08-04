<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    protected $fillable = ['key', 'value'];

    private const CACHE_PREFIX = 'system_setting:';

    public static function get(string $key, mixed $default = null): mixed
    {
        $cached = Cache::remember(self::CACHE_PREFIX.$key, now()->addMinutes(10), function () use ($key) {
            return self::query()->where('key', $key)->value('value');
        });

        if ($cached === null || $cached === '') {
            return $default;
        }

        return $cached;
    }

    public static function set(string $key, mixed $value): self
    {
        $value = is_string($value) ? trim($value) : $value;
        $saved = self::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget(self::CACHE_PREFIX.$key);

        return $saved;
    }
}
