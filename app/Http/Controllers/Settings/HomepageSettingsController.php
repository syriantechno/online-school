<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomepageSettingsController extends Controller
{
    public const DEFAULTS = [
        'hero_title' => 'عربيتي',
        'hero_highlight' => 'العربية بيدْرُبك من التأسيس إلى الإتقان',
        'hero_description' => 'دروس تفاعلية قصيرة تجمع بين المرح والتعليم الصحيح، مع توجيه شخصي حسب مستوى طفلك.',
        'why_title' => 'مدرسة يحبّها الأطفال ويطمئن لها الأهل',
        'why_description' => 'نبني تجربة متوازنة تجمع بين التعليم الصحيح والمرح والتشجيع المستمر.',
        'about_badge' => 'لمحة عن مدرستنا', 'about_title' => 'نزرع حب العربية درساً بعد درس',
        'about_description' => 'نؤمن أن الطفل يتعلم أفضل حين يشعر بالأمان والفضول والإنجاز. لذلك صممنا دروسنا على شكل رحلة تفاعلية قصيرة، تراعي الفروق الفردية وتكافئ كل خطوة للأمام.',
        'cta_title' => 'جاهز تبدأ رحلة العربية؟',
        'cta_description' => 'أنشئ حساب طفلك اليوم، اكتشف مستواه، واحصل على رحلة تعلم تناسبه خطوة بخطوة.',
        'contact_email' => 'hello@arabeti.com', 'contact_phone' => '+971 50 000 0000', 'contact_address' => 'دبي، الإمارات العربية المتحدة',
    ];

    public static function content(): array
    {
        return collect(self::DEFAULTS)->mapWithKeys(fn ($default, $key) => [$key => SystemSetting::get('homepage_'.$key, $default)])->all();
    }

    public function edit(): Response
    {
        return Inertia::render('Settings/Homepage', ['content' => self::content()]);
    }

    public function update(Request $request): RedirectResponse
    {
        $rules = collect(self::DEFAULTS)->mapWithKeys(function ($value, $key) {
            $max = str_contains($key, 'description') ? '800' : '255';
            $required = in_array($key, ['hero_highlight', 'hero_description'], true) ? 'nullable' : 'required';

            return [$key => [$required, 'string', 'max:'.$max]];
        })->all();
        foreach ($request->validate($rules) as $key => $value) {
            SystemSetting::set('homepage_'.$key, $value ?? '');
        }

        return back()->with('success', 'تم حفظ محتوى الصفحة الرئيسية بنجاح.');
    }
}
