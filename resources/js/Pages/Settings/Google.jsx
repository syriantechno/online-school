import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

const fields = [
    ['google_analytics_id', 'Google Analytics ID (G-XXXX)', 'معرّف قياس GA4'],
    ['google_analytics_property_id', 'GA Property ID', 'الرقم الخاص بـ Data API'],
    ['google_ads_aw_id', 'Google Ads AW ID', 'مثال: AW-123456789'],
    ['google_ads_conversion_label', 'Conversion Label', 'تسمية التحويل'],
    ['google_search_console_api_key', 'Search Console API Key', 'مفتاح أو ملاحظة الخدمة'],
    ['google_site_verification', 'Google Site Verification', 'محتوى meta التحقق'],
    ['seo_og_image_url', 'صورة OG الافتراضية', 'رابط مطلق أو نسبي'],
];

export default function Google({ google }) {
    const { data, setData, put, processing, errors } = useForm({
        google_analytics_id: google.google_analytics_id || '',
        google_analytics_property_id: google.google_analytics_property_id || '',
        google_ads_aw_id: google.google_ads_aw_id || '',
        google_ads_conversion_label: google.google_ads_conversion_label || '',
        google_search_console_api_key: google.google_search_console_api_key || '',
        google_site_verification: google.google_site_verification || '',
        seo_og_image_url: google.seo_og_image_url || '',
        auto_submit_google: google.auto_submit_google ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('settings.google.update'));
    };

    return (
        <AuthenticatedLayout header="إعدادات Google">
            <Head title="إعدادات Google" />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
                    نفس منطق موتور بازار: GA4 + Google Ads عبر gtag، وVerification في الـ meta، مع شريط موافقة الكوكيز.
                </div>

                {fields.map(([key, label, hint]) => (
                    <div key={key}>
                        <InputLabel value={label} />
                        <TextInput className="mt-1 block w-full" value={data[key]} onChange={(e) => setData(key, e.target.value)} />
                        <p className="mt-1 text-xs text-slate-500">{hint}</p>
                        <InputError message={errors[key]} className="mt-2" />
                    </div>
                ))}

                <label className="flex items-center gap-2">
                    <Checkbox checked={data.auto_submit_google} onChange={(e) => setData('auto_submit_google', e.target.checked)} />
                    <span className="text-sm">تفعيل الإرسال التلقائي لـ Google</span>
                </label>

                <PrimaryButton disabled={processing}>حفظ إعدادات Google</PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
