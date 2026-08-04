import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, router, useForm } from '@inertiajs/react';

export default function Index({ announcements, canManage, courses }) {
    const form = useForm({
        title: '',
        body: '',
        course_id: '',
        is_published: true,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('announcements.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthenticatedLayout header="الإعلانات">
            <Head title="الإعلانات" />

            {canManage && (
                <form onSubmit={submit} className="box mb-5 space-y-3 p-5">
                    <h3 className="font-medium text-slate-800">إعلان جديد</h3>
                    <div>
                        <InputLabel value="العنوان" />
                        <input
                            className="form-control mt-1"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <InputLabel value="النص" />
                        <textarea
                            className="form-control mt-1"
                            rows={3}
                            value={form.data.body}
                            onChange={(e) => form.setData('body', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <InputLabel value="دورة (اختياري — فارغ = إعلان عام)" />
                        <select
                            className="form-control mt-1"
                            value={form.data.course_id}
                            onChange={(e) => form.setData('course_id', e.target.value)}
                        >
                            <option value="">إعلان عام للمنصة</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                    <PrimaryButton disabled={form.processing}>نشر الإعلان</PrimaryButton>
                </form>
            )}

            <div className="space-y-3">
                {announcements.data.map((a) => (
                    <article key={a.id} className="box p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-medium text-slate-800">{a.title}</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {a.author?.name}
                                    {a.course ? ` · ${a.course.title}` : ' · عام'}
                                    {a.published_at
                                        ? ` · ${new Date(a.published_at).toLocaleDateString('ar')}`
                                        : ''}
                                </p>
                            </div>
                            {canManage && (
                                <button
                                    type="button"
                                    className="text-sm text-danger hover:underline"
                                    onClick={() => {
                                        if (confirm('حذف الإعلان؟')) {
                                            router.delete(route('announcements.destroy', a.id));
                                        }
                                    }}
                                >
                                    حذف
                                </button>
                            )}
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{a.body}</p>
                    </article>
                ))}
                {announcements.data.length === 0 && (
                    <div className="box p-10 text-center text-sm text-slate-500">لا إعلانات بعد.</div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
