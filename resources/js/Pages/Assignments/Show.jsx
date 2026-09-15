import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Show({ assignment, submission, submissions = [], canManage, canSubmit }) {
    const submitForm = useForm({ content: '', file: null });
    const settingsForm = useForm({
        title: assignment.title,
        instructions: assignment.instructions || '',
        max_score: assignment.max_score,
        stars_reward: assignment.stars_reward,
        due_at: assignment.due_at ? assignment.due_at.slice(0, 16) : '',
        is_published: assignment.is_published,
    });
    const gradeForms = {};

    const submit = (e) => {
        e.preventDefault();
        submitForm.post(route('assignments.submit', assignment.id), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout header={assignment.title}>
            <Head title={assignment.title} />

            <div className="box mb-5 p-5">
                <p className="text-sm text-slate-500">{assignment.course?.title}</p>
                <h1 className="mt-1 text-xl font-medium text-slate-800">{assignment.title}</h1>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {assignment.instructions || 'لا تعليمات إضافية.'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>الدرجة القصوى: {assignment.max_score}</span>
                    <span>·</span>
                    <span>مكافأة: {assignment.stars_reward}★</span>
                    {assignment.due_at && (
                        <>
                            <span>·</span>
                            <span>آخر موعد: {new Date(assignment.due_at).toLocaleString('ar')}</span>
                        </>
                    )}
                </div>
            </div>

            {canManage && (
                <form onSubmit={(e) => { e.preventDefault(); settingsForm.put(route('assignments.update', assignment.id), { preserveScroll: true }); }} className="box mb-5 grid gap-4 p-5 md:grid-cols-2">
                    <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
                        <div><h2 className="text-lg font-black text-slate-900">مراجعة الواجب ونشره</h2><p className="mt-1 text-sm font-bold text-slate-500">عدّل الأسئلة أو التعليمات ثم فعّل النشر عندما يصبح جاهزاً.</p></div>
                        <span className={`rounded-md px-3 py-1.5 text-sm font-black ${assignment.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{assignment.is_published ? 'منشور' : 'مسودة'}</span>
                    </div>
                    <div className="md:col-span-2"><InputLabel value="العنوان" /><input className="form-control mt-1" value={settingsForm.data.title} onChange={(e) => settingsForm.setData('title', e.target.value)} required /></div>
                    <div className="md:col-span-2"><InputLabel value="الأسئلة والتعليمات" /><textarea className="form-control mt-1 font-medium leading-8" rows="12" value={settingsForm.data.instructions} onChange={(e) => settingsForm.setData('instructions', e.target.value)} /></div>
                    <div><InputLabel value="الدرجة القصوى" /><input type="number" min="1" max="100" className="form-control mt-1" value={settingsForm.data.max_score} onChange={(e) => settingsForm.setData('max_score', e.target.value)} /></div>
                    <div><InputLabel value="النجوم" /><input type="number" min="1" max="20" className="form-control mt-1" value={settingsForm.data.stars_reward} onChange={(e) => settingsForm.setData('stars_reward', e.target.value)} /></div>
                    <div><InputLabel value="آخر موعد" /><input type="datetime-local" className="form-control mt-1" value={settingsForm.data.due_at} onChange={(e) => settingsForm.setData('due_at', e.target.value)} /></div>
                    <label className="flex min-h-12 items-center gap-3 rounded-lg border border-theme-1/15 bg-theme-1/5 px-4 font-black text-theme-1"><input type="checkbox" checked={settingsForm.data.is_published} onChange={(e) => settingsForm.setData('is_published', e.target.checked)} /> نشر الواجب للطلاب</label>
                    {Object.keys(settingsForm.errors).length > 0 && <p className="md:col-span-2 rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">{Object.values(settingsForm.errors)[0]}</p>}
                    <div className="md:col-span-2"><PrimaryButton disabled={settingsForm.processing}>حفظ التعديلات</PrimaryButton></div>
                </form>
            )}

            {canSubmit && (
                <form onSubmit={submit} className="box mb-5 space-y-3 p-5">
                    <h3 className="font-medium text-slate-800">
                        {submission ? 'إعادة التسليم' : 'تسليم الواجب'}
                    </h3>
                    {submission && (
                        <p className="text-sm text-slate-500">
                            الحالة: {submission.status === 'graded' ? `مصحّح — ${submission.score}/${assignment.max_score}` : 'بانتظار التصحيح'}
                        </p>
                    )}
                    {submission?.teacher_feedback && (
                        <p className="rounded-box bg-primary/5 px-3 py-2 text-sm text-primary">
                            ملاحظات المعلم: {submission.teacher_feedback}
                        </p>
                    )}
                    <div>
                        <InputLabel value="الإجابة النصية" />
                        <textarea
                            className="form-control mt-1"
                            rows={4}
                            value={submitForm.data.content}
                            onChange={(e) => submitForm.setData('content', e.target.value)}
                        />
                    </div>
                    <div>
                        <InputLabel value="مرفق (اختياري)" />
                        <input
                            type="file"
                            className="mt-1 block w-full text-sm"
                            onChange={(e) => submitForm.setData('file', e.target.files[0])}
                        />
                    </div>
                    <PrimaryButton disabled={submitForm.processing}>تسليم</PrimaryButton>
                </form>
            )}

            {canManage && (
                <div className="box overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h3 className="font-medium text-slate-800">تسليمات الطلاب ({submissions.length})</h3>
                    </div>
                    {submissions.length === 0 ? (
                        <p className="p-8 text-center text-sm text-slate-500">لا تسليمات بعد.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {submissions.map((s) => (
                                <div key={s.id} className="px-5 py-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-800">{s.user?.name}</p>
                                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{s.content || '—'}</p>
                                            {s.file_path && (
                                                <a href={`/storage/${s.file_path}`} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-primary hover:underline">
                                                    تحميل المرفق
                                                </a>
                                            )}
                                        </div>
                                        <form
                                            className="flex flex-wrap items-end gap-2"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const fd = new FormData(e.currentTarget);
                                                router.post(route('assignments.grade', [assignment.id, s.id]), {
                                                    score: fd.get('score'),
                                                    teacher_feedback: fd.get('teacher_feedback'),
                                                }, { preserveScroll: true });
                                            }}
                                        >
                                            <input
                                                name="score"
                                                type="number"
                                                min="0"
                                                max={assignment.max_score}
                                                defaultValue={s.score ?? ''}
                                                className="form-control w-24"
                                                placeholder="درجة"
                                                required
                                            />
                                            <input
                                                name="teacher_feedback"
                                                className="form-control w-48"
                                                defaultValue={s.teacher_feedback || ''}
                                                placeholder="ملاحظة"
                                            />
                                            <PrimaryButton>تصحيح</PrimaryButton>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Link href={route('assignments.index')} className="mt-4 inline-block text-sm text-primary hover:underline">
                العودة للواجبات
            </Link>
        </AuthenticatedLayout>
    );
}
