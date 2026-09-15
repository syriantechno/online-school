import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/Components/ConfirmDialog';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ assignments, mySubmissions = {}, canManage, courses = [] }) {
    const form = useForm({
        course_id: '',
        title: '',
        instructions: '',
        max_score: 100,
        stars_reward: 5,
        due_at: '',
        is_published: true,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('assignments.store'), {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthenticatedLayout header="الواجبات">
            <Head title="الواجبات" />

            {canManage && (
                <form onSubmit={submit} className="box mb-5 grid gap-3 p-5 md:grid-cols-2">
                    <h3 className="md:col-span-2 font-medium text-slate-800">واجب جديد</h3>
                    <div>
                        <InputLabel value="الدورة" />
                        <select className="form-control mt-1" value={form.data.course_id} onChange={(e) => form.setData('course_id', e.target.value)} required>
                            <option value="">اختر</option>
                            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="العنوان" />
                        <input className="form-control mt-1" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} required />
                    </div>
                    <div className="md:col-span-2">
                        <InputLabel value="التعليمات" />
                        <textarea className="form-control mt-1" rows={3} value={form.data.instructions} onChange={(e) => form.setData('instructions', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="الدرجة القصوى" />
                        <input type="number" className="form-control mt-1" value={form.data.max_score} onChange={(e) => form.setData('max_score', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="نجوم المكافأة" />
                        <input type="number" className="form-control mt-1" value={form.data.stars_reward} onChange={(e) => form.setData('stars_reward', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="آخر موعد" />
                        <input type="datetime-local" className="form-control mt-1" value={form.data.due_at} onChange={(e) => form.setData('due_at', e.target.value)} />
                    </div>
                    <div className="flex items-end">
                        <PrimaryButton disabled={form.processing}>إنشاء الواجب</PrimaryButton>
                    </div>
                </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {assignments.data.map((a) => {
                    const sub = mySubmissions[a.id];
                    return (
                        <div key={a.id} className="box flex flex-col p-5">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <h3 className="text-lg font-black leading-8 text-slate-800">{a.title}</h3>
                                {sub && (
                                    <span className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-bold ${
                                        sub.status === 'graded' ? 'bg-success/10 text-success' : 'bg-pending/10 text-pending'
                                    }`}>
                                        {sub.status === 'graded' ? `درجة ${sub.score}` : 'مُسلَّم'}
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-base font-bold text-slate-600">{a.course?.title}</p>
                            <p className="mt-3 line-clamp-2 text-base leading-8 text-slate-700">{a.instructions || 'بدون تعليمات'}</p>
                            <div className="mt-auto flex gap-2 pt-4">
                                <Link href={route('assignments.show', a.id)} className="rounded-md bg-primary px-3 py-2 text-sm text-white">
                                    فتح
                                </Link>
                                {canManage && (
                                    <><button
                                        type="button"
                                        className="rounded-md border border-theme-1/20 px-3 py-2 text-sm font-bold text-theme-1"
                                        onClick={() => router.post(route('assignments.duplicate', a.id))}
                                    >نسخ</button><button
                                        type="button"
                                        className="rounded-md border border-slate-200 px-3 py-2 text-sm text-danger"
                                        onClick={async () => await confirmAction({ message: 'سيتم حذف هذا الواجب وكل ما يرتبط به.', variant: 'danger' }) && router.delete(route('assignments.destroy', a.id))}
                                    >
                                        حذف
                                    </button></>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {assignments.data.length === 0 && (
                <div className="box p-10 text-center text-sm text-slate-500">لا واجبات بعد.</div>
            )}
        </AuthenticatedLayout>
    );
}
