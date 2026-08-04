<?php

namespace App\Support;

use App\Models\SeoSetting;
use App\Models\SystemSetting;

final class SeoMeta
{
    public static function absoluteUrl(string $path = '', ?array $query = null): string
    {
        $base = rtrim((string) config('app.url'), '/');
        if ($base === '') {
            $base = rtrim(url('/'), '/');
        }

        $path = '/'.ltrim($path, '/');
        if ($path === '/') {
            $path = '';
        }

        $url = $base.$path;
        if ($query !== null && $query !== []) {
            $url .= '?'.http_build_query($query);
        }

        return $url;
    }

    public static function canonicalUrl(?string $path = null): string
    {
        if ($path !== null) {
            return self::absoluteUrl($path);
        }

        $trimmedPath = trim(request()->path(), '/');
        $pathSegment = $trimmedPath === '' ? '' : '/'.$trimmedPath;

        return self::absoluteUrl($pathSegment);
    }

    public static function ogImageUrl(): string
    {
        $seo = SeoSetting::getCurrent();
        $custom = trim((string) ($seo->og_image_url ?: SystemSetting::get('seo_og_image_url', '')));

        if ($custom !== '') {
            if (str_starts_with($custom, 'http://') || str_starts_with($custom, 'https://')) {
                return $custom;
            }

            return self::absoluteUrl($custom);
        }

        return self::absoluteUrl('/favicon.ico');
    }

    public static function siteVerification(): string
    {
        return trim((string) SystemSetting::get('google_site_verification', ''));
    }
}
