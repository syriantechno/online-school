import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ course, threads, canPost }) {
    const form = useForm({ title: '', body: '' });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('discussions.store', course.id), {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthenticatedLayout header={`نقاش: ${course.title}`}>
            <Head title={`نقاش ${course.title}`} />

            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">اسأل المعلم أو ناقش مع زملائك داخل الدورة.</p>
                <Link href={route('courses.show', course.id)} className="text-sm text-primary hover:underline">
                    صفحة الدورة
                </Link>
            </div>

            {canPost && (
                <form onSubmit={submit} className="box mb-5 space-y-3 p-5">
                    <h3 className="font-medium text-slate-800">سؤال / نقاش جديد</h3>
                    <div>
                        <InputLabel value="العنوان" />
                        <input className="form-control mt-1" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} required />
                    </div>
                    <div>
                        <InputLabel value="التفاصيل" />
                        <textarea className="form-control mt-1" rows={3} value={form.data.body} onChange={(e) => form.setData('body', e.target.value)} required />
                    </div>
                    <PrimaryButton disabled={form.processing}>نشر</PrimaryButton>
                </form>
            )}

            <div className="space-y-2">
                {threads.data.map((t) => (
                    <Link
                        key={t.id}
                        href={route('discussions.show', [course.id, t.id])}
                        className="box flex items-start justify-between gap-3 p-4 transition hover:bg-slate-50"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                {t.is_pinned && <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] text-amber-700">مثبّت</span>}
                                <h3 className="font-medium text-slate-800">{t.title}</h3>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                {t.user?.name} · {t.replies_count} رد
                            </p>
                        </div>
                        <span className="text-xs text-slate-400">
                            {t.last_replied_at ? new Date(t.last_replied_at).toLocaleDateString('ar') : ''}
                        </span>
                    </Link>
                ))}
            </div>

            {threads.data.length === 0 && (
                <div className="box p-10 text-center text-sm text-slate-500">لا نقاشات بعد — كن أول من يسأل.</div>
            )}
        </AuthenticatedLayout>
    );
}
