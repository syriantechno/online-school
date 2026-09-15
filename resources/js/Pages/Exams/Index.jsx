import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/Components/ConfirmDialog';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ exams, myAttempts = {}, canManage, courses = [] }) {
    const form = useForm({
        course_id: '',
        title: '',
        description: '',
        duration_minutes: 30,
        pass_percent: 50,
        max_attempts: 2,
        stars_reward: 5,
        shuffle_questions: false,
        show_correct_answers: true,
        is_published: false,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('exams.store'), {
            onSuccess: () => form.reset('title', 'description'),
        });
    };

    return (
        <AuthenticatedLayout header="الفحوصات">
            <Head title="الفحوصات" />

            {canManage && (
                <form onSubmit={submit} className="box mb-5 grid gap-3 p-5 md:grid-cols-2">
                    <h3 className="md:col-span-2 font-medium text-slate-800">فحص جديد</h3>
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
                        <InputLabel value="الوصف / التعليمات" />
                        <textarea className="form-control mt-1" rows={2} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="المدة (دقيقة)" />
                        <input type="number" className="form-control mt-1" value={form.data.duration_minutes} onChange={(e) => form.setData('duration_minutes', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="درجة النجاح %" />
                        <input type="number" className="form-control mt-1" value={form.data.pass_percent} onChange={(e) => form.setData('pass_percent', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="عدد المحاولات" />
                        <input type="number" className="form-control mt-1" value={form.data.max_attempts} onChange={(e) => form.setData('max_attempts', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="نجوم عند النجاح" />
                        <input type="number" className="form-control mt-1" value={form.data.stars_reward} onChange={(e) => form.setData('stars_reward', e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" checked={form.data.is_published} onChange={(e) => form.setData('is_published', e.target.checked)} className="rounded border-slate-300 text-primary" />
                        نشر مباشرة
                    </label>
                    <div className="flex items-end">
                        <PrimaryButton disabled={form.processing}>إنشاء الفحص</PrimaryButton>
                    </div>
                </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {exams.data.map((exam) => {
                    const attempt = myAttempts[exam.id];
                    return (
                        <div key={exam.id} className="box flex flex-col p-5">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <h3 className="text-lg font-black leading-8 text-slate-800">{exam.title}</h3>
                                <span className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-bold ${exam.is_published ? 'bg-success/10 text-success' : 'bg-pending/10 text-pending'}`}>
                                    {exam.is_published ? 'منشور' : 'مسودة'}
                                </span>
                            </div>
                            <p className="mt-1 text-base font-bold text-slate-600">{exam.course?.title}</p>
                            <p className="mt-3 line-clamp-2 text-base leading-8 text-slate-700">{exam.description || 'بدون وصف'}</p>
                            <div className="mt-4 flex flex-wrap gap-2.5 text-sm font-bold text-slate-600">
                                <span className="rounded-lg bg-white px-3 py-2 shadow-sm">{exam.questions_count || 0} سؤال</span>
                                {exam.duration_minutes && <span className="rounded-lg bg-white px-3 py-2 shadow-sm">{exam.duration_minutes} دقيقة</span>}
                                <span className="rounded-lg bg-white px-3 py-2 shadow-sm">النجاح {exam.pass_percent}%</span>
                                {attempt && (
                                    <span className={`rounded-lg bg-white px-3 py-2 shadow-sm ${attempt.passed ? 'text-success' : 'text-pending'}`}>
                                        آخر محاولة {attempt.percent}%
                                    </span>
                                )}
                            </div>
                            <div className="mt-auto flex gap-2 pt-4">
                                <Link href={route('exams.show', exam.id)} className="rounded-md bg-primary px-3 py-2 text-sm text-white">
                                    فتح
                                </Link>
                                {canManage && (
                                    <><button
                                        type="button"
                                        className="rounded-md border border-theme-1/20 px-3 py-2 text-sm font-bold text-theme-1"
                                        onClick={() => router.post(route('exams.duplicate', exam.id))}
                                    >نسخ</button><button
                                        type="button"
                                        className="rounded-md border border-slate-200 px-3 py-2 text-sm text-danger"
                                        onClick={async () => await confirmAction({ message: 'سيتم حذف الفحص وأسئلته ومحاولاته.', variant: 'danger' }) && router.delete(route('exams.destroy', exam.id))}
                                    >
                                        حذف
                                    </button></>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {exams.data.length === 0 && (
                <div className="box p-10 text-center text-sm text-slate-500">لا فحوصات بعد.</div>
            )}
        </AuthenticatedLayout>
    );
}
