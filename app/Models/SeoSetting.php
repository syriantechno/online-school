<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    protected $table = 'seo_settings';

    private static ?self $cachedCurrent = null;

    protected $fillable = [
        'site_name',
        'default_meta_title',
        'default_meta_description',
        'default_meta_keywords',
        'og_image_url',
        'google_analytics_id',
        'google_analytics_property_id',
        'google_ads_aw_id',
        'google_ads_conversion_label',
        'google_search_console_api_key',
        'auto_submit_google',
        'meta_title_template',
        'meta_description_template',
    ];

    protected function casts(): array
    {
        return [
            'auto_submit_google' => 'boolean',
        ];
    }

    public static function getCurrent(): self
    {
        if (self::$cachedCurrent instanceof self) {
            return self::$cachedCurrent;
        }

        self::$cachedCurrent = static::query()->firstOrCreate(
            ['id' => 1],
            [
                'site_name' => config('app.name'),
                'default_meta_title' => 'المدرسة الإلكترونية',
                'default_meta_description' => 'منصة تعليم إلكتروني عربية: دورات، دروس تفاعلية، وكتب دراسية.',
                'auto_submit_google' => true,
            ]
        );

        return self::$cachedCurrent;
    }

    public static function clearCache(): void
    {
        self::$cachedCurrent = null;
    }
}
