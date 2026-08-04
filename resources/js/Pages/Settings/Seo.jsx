import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Seo({ seo }) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: seo.site_name || '',
        default_meta_title: seo.default_meta_title || '',
        default_meta_description: seo.default_meta_description || '',
        default_meta_keywords: seo.default_meta_keywords || '',
        og_image_url: seo.og_image_url || '',
        meta_title_template: seo.meta_title_template || '',
        meta_description_template: seo.meta_description_template || '',
        auto_submit_google: seo.auto_submit_google ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('settings.seo.update'));
    };

    return (
        <AuthenticatedLayout header="إعدادات SEO">
            <Head title="إعدادات SEO" />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-600">مستوحى من إعدادات SEO في موتور بازار — عنوان ووصف وكلمات مفتاحية وصورة مشاركة.</p>

                {[
                    ['site_name', 'اسم الموقع'],
                    ['default_meta_title', 'العنوان الافتراضي (Meta Title)'],
                    ['default_meta_keywords', 'الكلمات المفتاحية'],
                    ['og_image_url', 'رابط صورة OG'],
                    ['meta_title_template', 'قالب العنوان'],
                    ['meta_description_template', 'قالب الوصف'],
                ].map(([key, label]) => (
                    <div key={key}>
                        <InputLabel value={label} />
                        <TextInput className="mt-1 block w-full" value={data[key]} onChange={(e) => setData(key, e.target.value)} />
                        <InputError message={errors[key]} className="mt-2" />
                    </div>
                ))}

                <div>
                    <InputLabel value="الوصف الافتراضي" />
                    <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        rows={3}
                        value={data.default_meta_description}
                        onChange={(e) => setData('default_meta_description', e.target.value)}
                    />
                </div>

                <label className="flex items-center gap-2">
                    <Checkbox checked={data.auto_submit_google} onChange={(e) => setData('auto_submit_google', e.target.checked)} />
                    <span className="text-sm">إرسال تلقائي لـ Google (Sitemap / Indexing لاحقاً)</span>
                </label>

                <PrimaryButton disabled={processing}>حفظ إعدادات SEO</PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
