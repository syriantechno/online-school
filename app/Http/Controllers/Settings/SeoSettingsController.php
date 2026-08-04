<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeoSettingsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Settings/Seo', [
            'seo' => SeoSetting::getCurrent(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'default_meta_title' => ['nullable', 'string', 'max:255'],
            'default_meta_description' => ['nullable', 'string', 'max:500'],
            'default_meta_keywords' => ['nullable', 'string', 'max:500'],
            'og_image_url' => ['nullable', 'string', 'max:500'],
            'meta_title_template' => ['nullable', 'string', 'max:255'],
            'meta_description_template' => ['nullable', 'string', 'max:500'],
            'auto_submit_google' => ['boolean'],
        ]);

        $seo = SeoSetting::getCurrent();
        $seo->update($data);
        SeoSetting::clearCache();

        return back()->with('success', 'تم حفظ إعدادات الـ SEO.');
    }
}
