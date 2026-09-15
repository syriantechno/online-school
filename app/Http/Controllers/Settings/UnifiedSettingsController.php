<?php
namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UnifiedSettingsController extends Controller
{
    public function edit(): Response
    {
        $seo=SeoSetting::getCurrent();
        return Inertia::render('Settings/Index',['homepage'=>HomepageSettingsController::content(),'seo'=>$seo,'google'=>[
            'google_analytics_id'=>$seo->google_analytics_id,'google_analytics_property_id'=>$seo->google_analytics_property_id,
            'google_ads_aw_id'=>$seo->google_ads_aw_id,'google_ads_conversion_label'=>$seo->google_ads_conversion_label,
            'google_search_console_api_key'=>$seo->google_search_console_api_key,'google_site_verification'=>SystemSetting::get('google_site_verification',''),
        ]]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data=$request->validate([
            'section'=>['required','in:homepage,seo,google'],'homepage'=>['nullable','array'],'seo'=>['nullable','array'],'google'=>['nullable','array'],
            'homepage.*'=>['nullable','string','max:800'],'seo.site_name'=>['nullable','string','max:255'],'seo.default_meta_title'=>['nullable','string','max:255'],
            'seo.default_meta_description'=>['nullable','string','max:500'],'seo.default_meta_keywords'=>['nullable','string','max:500'],'seo.og_image_url'=>['nullable','string','max:500'],
            'google.google_analytics_id'=>['nullable','string','max:50'],'google.google_analytics_property_id'=>['nullable','string','max:50'],
            'google.google_ads_aw_id'=>['nullable','string','max:50'],'google.google_ads_conversion_label'=>['nullable','string','max:100'],
            'google.google_search_console_api_key'=>['nullable','string','max:255'],'google.google_site_verification'=>['nullable','string','max:255'],
        ]);
        if($data['section']==='homepage') foreach(($data['homepage']??[]) as $key=>$value) if(array_key_exists($key,HomepageSettingsController::DEFAULTS)) SystemSetting::set('homepage_'.$key,$value);
        if($data['section']==='seo'){ SeoSetting::getCurrent()->update($data['seo']??[]); SeoSetting::clearCache(); }
        if($data['section']==='google'){ $g=$data['google']??[]; SystemSetting::set('google_site_verification',$g['google_site_verification']??''); unset($g['google_site_verification']); SeoSetting::getCurrent()->update($g); SeoSetting::clearCache(); }
        return back()->with('success','تم حفظ الإعدادات بنجاح.');
    }
}
