import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/Components/ConfirmDialog';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const typeLabels = {
    single: 'اختيار من متعدد',
    multiple: 'اختيارات متعددة',
    true_false: 'صح / خطأ',
    short: 'إجابة قصيرة',
};

export default function Show({
    exam,
    canManage,
    attempts = [],
    myAttemptsCount = 0,
    canStart = false,
    openAttemptId = null,
    totalPoints = 0,
}) {
    const [type, setType] = useState('single');
    const questionForm = useForm({
        type: 'single',
        prompt: '',
        options: ['', '', '', ''],
        correct_answers: [],
        points: 1,
        explanation: '',
    });

    const settingsForm = useForm({
        course_id: exam.course_id,
        title: exam.title,
        description: exam.description || '',
        duration_minutes: exam.duration_minutes || '',
        pass_percent: exam.pass_percent,
        max_attempts: exam.max_attempts,
        stars_reward: exam.stars_reward,
        shuffle_questions: exam.shuffle_questions,
        show_correct_answers: exam.show_correct_answers,
        available_from: exam.available_from ? exam.available_from.slice(0, 16) : '',
        available_until: exam.available_until ? exam.available_until.slice(0, 16) : '',
        is_published: exam.is_published,
    });

    const changeType = (value) => {
        setType(value);
        questionForm.setData({
            ...questionForm.data,
            type: value,
            options: value === 'true_false' ? ['صح', 'خطأ'] : ['', '', '', ''],
            correct_answers: [],
        });
    };

    const toggleCorrect = (index, multi) => {
        const key = String(index);
        let next = [...questionForm.data.correct_answers];
        if (multi) {
            next = next.includes(key) ? next.filter((v) => v !== key) : [...next, key];
        } else {
            next = [key];
        }
        questionForm.setData('correct_answers', next);
    };

    const optionFields = useMemo(() => {
        if (type === 'short') return null;
        if (type === 'true_false') {
            return (
                <div className="space-y-2">
                    {['صح', 'خطأ'].map((label, index) => (
                        <label key={label} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="tf"
                                checked={questionForm.data.correct_answers.includes(String(index))}
                                onChange={() => toggleCorrect(index, false)}
                            />
                            {label} (الإجابة الصحيحة)
                        </label>
                    ))}
                </div>
            );
        }
        return questionForm.data.options.map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
                <input
                    type={type === 'multiple' ? 'checkbox' : 'radio'}
                    name="correct"
                    checked={questionForm.data.correct_answers.includes(String(index))}
                    onChange={() => toggleCorrect(index, type === 'multiple')}
                />
                <input
                    className="form-control flex-1"
                    placeholder={`خيار ${index + 1}`}
                    value={opt}
                    onChange={(e) => {
                        const options = [...questionForm.data.options];
                        options[index] = e.target.value;
                        questionForm.setData('options', options);
                    }}
                />
            </div>
        ));
    }, [type, questionForm.data]);

    return (
        <AuthenticatedLayout header={exam.title}>
            <Head title={exam.title} />

            <div className="space-y-5">
                <div className="box p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-sm text-slate-500">{exam.course?.title}</p>
                            <h1 className="mt-1 text-2xl font-medium text-slate-800">{exam.title}</h1>
                            <p className="mt-2 text-slate-600">{exam.description || 'بدون تعليمات إضافية'}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                                <span className="rounded-md bg-slate-100 px-2.5 py-1">{exam.questions?.length || 0} سؤال</span>
                                <span className="rounded-md bg-slate-100 px-2.5 py-1">{totalPoints} درجة</span>
                                {exam.duration_minutes && <span className="rounded-md bg-slate-100 px-2.5 py-1">{exam.duration_minutes} دقيقة</span>}
                                <span className="rounded-md bg-slate-100 px-2.5 py-1">نجاح من {exam.pass_percent}%</span>
                                <span className="rounded-md bg-amber-50 px-2.5 py-1 text-amber-600">{exam.stars_reward} نجوم</span>
                                <span className="rounded-md bg-slate-100 px-2.5 py-1">محاولات: {myAttemptsCount}/{exam.max_attempts}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {openAttemptId && (
                                <Link href={route('exams.take', [exam.id, openAttemptId])} className="rounded-md bg-pending px-4 py-2 text-sm font-medium text-white">
                                    متابعة المحاولة
                                </Link>
                            )}
                            {canStart && (
                                <PrimaryButton onClick={() => router.post(route('exams.start', exam.id))}>
                                    بدء الفحص
                                </PrimaryButton>
                            )}
                            <Link href={route('exams.index')} className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600">
                                رجوع
                            </Link>
                        </div>
                    </div>
                </div>

                {canManage && (
                    <>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                settingsForm.put(route('exams.update', exam.id), { preserveScroll: true });
                            }}
                            className="box grid gap-3 p-5 md:grid-cols-2"
                        >
                            <h3 className="md:col-span-2 font-medium text-slate-800">إعدادات الفحص</h3>
                            <div className="md:col-span-2">
                                <InputLabel value="العنوان" />
                                <input className="form-control mt-1" value={settingsForm.data.title} onChange={(e) => settingsForm.setData('title', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <InputLabel value="الوصف" />
                                <textarea className="form-control mt-1" rows={2} value={settingsForm.data.description} onChange={(e) => settingsForm.setData('description', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="المدة" />
                                <input type="number" className="form-control mt-1" value={settingsForm.data.duration_minutes} onChange={(e) => settingsForm.setData('duration_minutes', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="نسبة النجاح" />
                                <input type="number" className="form-control mt-1" value={settingsForm.data.pass_percent} onChange={(e) => settingsForm.setData('pass_percent', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="المحاولات" />
                                <input type="number" className="form-control mt-1" value={settingsForm.data.max_attempts} onChange={(e) => settingsForm.setData('max_attempts', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="النجوم" />
                                <input type="number" className="form-control mt-1" value={settingsForm.data.stars_reward} onChange={(e) => settingsForm.setData('stars_reward', e.target.value)} />
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={settingsForm.data.shuffle_questions} onChange={(e) => settingsForm.setData('shuffle_questions', e.target.checked)} />
                                خلط الأسئلة
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={settingsForm.data.show_correct_answers} onChange={(e) => settingsForm.setData('show_correct_answers', e.target.checked)} />
                                إظهار الإجابات بعد التسليم
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={settingsForm.data.is_published} onChange={(e) => settingsForm.setData('is_published', e.target.checked)} />
                                منشور
                            </label>
                            <div className="md:col-span-2">
                                <PrimaryButton disabled={settingsForm.processing}>حفظ الإعدادات</PrimaryButton>
                            </div>
                        </form>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                questionForm.post(route('exams.questions.store', exam.id), {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        questionForm.reset();
                                        questionForm.setData({
                                            type,
                                            prompt: '',
                                            options: type === 'true_false' ? ['صح', 'خطأ'] : ['', '', '', ''],
                                            correct_answers: [],
                                            points: 1,
                                            explanation: '',
                                        });
                                    },
                                });
                            }}
                            className="box space-y-3 p-5"
                        >
                            <h3 className="font-medium text-slate-800">إضافة سؤال</h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <InputLabel value="النوع" />
                                    <select className="form-control mt-1" value={type} onChange={(e) => changeType(e.target.value)}>
                                        {Object.entries(typeLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="الدرجة" />
                                    <input type="number" className="form-control mt-1" value={questionForm.data.points} onChange={(e) => questionForm.setData('points', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <InputLabel value="نص السؤال" />
                                <textarea className="form-control mt-1" rows={2} value={questionForm.data.prompt} onChange={(e) => questionForm.setData('prompt', e.target.value)} required />
                            </div>
                            {optionFields}
                            <div>
                                <InputLabel value="شرح (اختياري)" />
                                <input className="form-control mt-1" value={questionForm.data.explanation} onChange={(e) => questionForm.setData('explanation', e.target.value)} />
                            </div>
                            <PrimaryButton disabled={questionForm.processing}>إضافة السؤال</PrimaryButton>
                        </form>

                        <section className="box overflow-hidden">
                            <div className="border-b border-slate-100 px-5 py-4">
                                <h3 className="font-medium text-slate-800">أسئلة الفحص</h3>
                            </div>
                            <ul className="divide-y divide-slate-100">
                                {(exam.questions || []).map((q, index) => (
                                    <li key={q.id} className="flex items-start justify-between gap-3 px-5 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{index + 1}. {q.prompt}</p>
                                            <p className="mt-1 text-xs text-slate-400">{typeLabels[q.type]} · {q.points} درجة</p>
                                            {q.options?.length > 0 && (
                                                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                                                    {q.options.map((opt, i) => (
                                                        <li key={i} className={q.correct_answers?.includes(String(i)) || q.correct_answers?.includes(i) ? 'text-success' : ''}>
                                                            {i + 1}. {opt}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="text-sm text-danger"
                                            onClick={async () => await confirmAction({ message: 'سيتم حذف هذا السؤال من الفحص.', variant: 'danger' }) && router.delete(route('exams.questions.destroy', [exam.id, q.id]))}
                                        >
                                            حذف
                                        </button>
                                    </li>
                                ))}
                                {(exam.questions || []).length === 0 && (
                                    <li className="px-5 py-8 text-center text-sm text-slate-500">أضف أسئلة ليفتح الفحص للطلاب.</li>
                                )}
                            </ul>
                        </section>
                    </>
                )}

                <section className="box overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h3 className="font-medium text-slate-800">{canManage ? 'محاولات الطلاب' : 'محاولاتي'}</h3>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                {canManage && <th>الطالب</th>}
                                <th>المحاولة</th>
                                <th>النتيجة</th>
                                <th>الحالة</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.map((a) => (
                                <tr key={a.id}>
                                    {canManage && <td>{a.user?.name}</td>}
                                    <td>#{a.attempt_number}</td>
                                    <td>{a.status === 'in_progress' ? '—' : `${a.percent}% (${a.score}/${a.max_score})`}</td>
                                    <td>
                                        <span className={`rounded-md px-2 py-1 text-[11px] ${
                                            a.status === 'graded' && a.passed ? 'bg-success/10 text-success'
                                                : a.status === 'in_progress' ? 'bg-pending/10 text-pending'
                                                    : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {a.status === 'in_progress' ? 'جارية' : a.status === 'submitted' ? 'بانتظار التصحيح' : a.passed ? 'ناجح' : 'راسب'}
                                        </span>
                                    </td>
                                    <td>
                                        {a.status !== 'in_progress' && (
                                            <Link href={route('exams.result', [exam.id, a.id])} className="text-sm text-primary hover:underline">
                                                النتيجة
                                            </Link>
                                        )}
                                        {a.status === 'in_progress' && a.user_id && (
                                            <Link href={route('exams.take', [exam.id, a.id])} className="text-sm text-pending hover:underline">
                                                متابعة
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {attempts.length === 0 && (
                        <p className="p-8 text-center text-sm text-slate-500">لا محاولات بعد.</p>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
