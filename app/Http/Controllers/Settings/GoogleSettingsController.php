<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GoogleSettingsController extends Controller
{
    public function edit(): Response
    {
        $seo = SeoSetting::getCurrent();

        return Inertia::render('Settings/Google', [
            'google' => [
                'google_analytics_id' => $seo->google_analytics_id,
                'google_analytics_property_id' => $seo->google_analytics_property_id,
                'google_ads_aw_id' => $seo->google_ads_aw_id,
                'google_ads_conversion_label' => $seo->google_ads_conversion_label,
                'google_search_console_api_key' => $seo->google_search_console_api_key,
                'google_site_verification' => SystemSetting::get('google_site_verification', ''),
                'seo_og_image_url' => SystemSetting::get('seo_og_image_url', $seo->og_image_url),
                'auto_submit_google' => $seo->auto_submit_google,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'google_analytics_id' => ['nullable', 'string', 'max:50'],
            'google_analytics_property_id' => ['nullable', 'string', 'max:50'],
            'google_ads_aw_id' => ['nullable', 'string', 'max:50'],
            'google_ads_conversion_label' => ['nullable', 'string', 'max:100'],
            'google_search_console_api_key' => ['nullable', 'string', 'max:255'],
            'google_site_verification' => ['nullable', 'string', 'max:255'],
            'seo_og_image_url' => ['nullable', 'string', 'max:500'],
            'auto_submit_google' => ['boolean'],
        ]);

        $seo = SeoSetting::getCurrent();
        $seo->update([
            'google_analytics_id' => $data['google_analytics_id'] ?? null,
            'google_analytics_property_id' => $data['google_analytics_property_id'] ?? null,
            'google_ads_aw_id' => $data['google_ads_aw_id'] ?? null,
            'google_ads_conversion_label' => $data['google_ads_conversion_label'] ?? null,
            'google_search_console_api_key' => $data['google_search_console_api_key'] ?? null,
            'og_image_url' => $data['seo_og_image_url'] ?? $seo->og_image_url,
            'auto_submit_google' => $data['auto_submit_google'] ?? true,
        ]);
        SeoSetting::clearCache();

        SystemSetting::set('google_site_verification', $data['google_site_verification'] ?? '');
        SystemSetting::set('seo_og_image_url', $data['seo_og_image_url'] ?? '');

        return back()->with('success', 'تم حفظ إعدادات Google.');
    }
}
