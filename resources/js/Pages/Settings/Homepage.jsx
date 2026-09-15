import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

const fields = [
    ['hero_title','اسم المنصة (عربيتي)'],['hero_highlight','عنوان الهيرو (أنتِ تكتبينه)'],['hero_description','وصف الهيرو (أنتِ تكتبينه)','textarea'],
    ['why_title','عنوان قسم المميزات'],['why_description','وصف قسم المميزات','textarea'],
    ['about_badge','شارة لمحة عنا'],['about_title','عنوان لمحة عنا'],['about_description','نص لمحة عنا','textarea'],
    ['cta_title','عنوان الدعوة النهائية'],['cta_description','وصف الدعوة النهائية','textarea'],
    ['contact_email','البريد الإلكتروني'],['contact_phone','رقم الهاتف'],['contact_address','العنوان'],
];

export default function Homepage({ content }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm(content);
    return <AuthenticatedLayout header="محتوى الموقع"><Head title="محتوى الموقع" /><form onSubmit={e => { e.preventDefault(); put(route('settings.homepage.update')); }} className="mx-auto max-w-4xl rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:p-8"><div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-slate-900">تحرير الصفحة الرئيسية</h2><p className="mt-2 text-sm text-slate-500">عدّل النصوص ومعلومات التواصل، وستظهر مباشرة في الموقع.</p></div><Link href="/" className="rounded-xl bg-sky-50 px-5 py-3 text-sm font-black text-sky-700">معاينة الموقع</Link></div><div className="grid gap-6 md:grid-cols-2">{fields.map(([key,label,type]) => <div key={key} className={type === 'textarea' ? 'md:col-span-2' : ''}><InputLabel value={label} />{type === 'textarea' ? <textarea rows="4" value={data[key]} onChange={e=>setData(key,e.target.value)} className="mt-2 block w-full rounded-xl border-slate-300 focus:border-sky-500 focus:ring-sky-500" /> : <TextInput value={data[key]} onChange={e=>setData(key,e.target.value)} className="mt-2 block w-full" />}<InputError message={errors[key]} className="mt-2" /></div>)}</div><div className="mt-8 flex items-center gap-4"><PrimaryButton disabled={processing}>حفظ التغييرات</PrimaryButton>{recentlySuccessful && <span className="font-bold text-emerald-600">تم الحفظ ✓</span>}</div></form></AuthenticatedLayout>;
}
