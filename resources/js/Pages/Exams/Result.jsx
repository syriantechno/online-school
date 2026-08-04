import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

function optionText(options, value) {
    if (value == null || value === '') return '—';
    const idx = Number(value);
    if (Number.isInteger(idx) && options?.[idx] != null) return options[idx];
    return String(value);
}

export default function Result({ exam, attempt, student, details = [], canManage = false }) {
    return (
        <AuthenticatedLayout header={`نتيجة: ${exam.title}`}>
            <Head title={`نتيجة ${exam.title}`} />

            <div className="mx-auto max-w-3xl space-y-5">
                <div className={`box p-6 ${attempt.passed ? 'border-success/30' : 'border-pending/30'}`}>
                    <p className="text-sm text-slate-500">{student?.name} · محاولة #{attempt.attempt_number}</p>
                    <h1 className="mt-1 text-2xl font-medium text-slate-800">{exam.title}</h1>
                    <div className="mt-4 flex flex-wrap items-end gap-6">
                        <div>
                            <p className="text-xs text-slate-500">النسبة</p>
                            <p className={`text-3xl font-medium ${attempt.passed ? 'text-success' : 'text-pending'}`}>
                                {attempt.percent}%
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">الدرجة</p>
                            <p className="text-xl font-medium text-slate-800">{attempt.score} / {attempt.max_score}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">الحالة</p>
                            <p className="text-sm font-medium text-slate-700">
                                {attempt.status === 'submitted'
                                    ? 'بانتظار تصحيح الإجابات القصيرة'
                                    : attempt.passed
                                        ? 'ناجح'
                                        : `راسب (النجاح من ${exam.pass_percent}%)`}
                            </p>
                        </div>
                    </div>
                    {attempt.passed && attempt.status === 'graded' && (
                        <p className="mt-3 text-sm text-amber-600">حصلت على {exam.stars_reward} نجوم عند النجاح.</p>
                    )}
                </div>

                <div className="space-y-4">
                    {details.map((item, index) => (
                        <AnswerCard
                            key={item.id}
                            index={index}
                            item={item}
                            examId={exam.id}
                            attemptId={attempt.id}
                            canManage={canManage}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                    <Link href={route('exams.show', exam.id)} className="text-primary hover:underline">العودة للفحص</Link>
                    <Link href={route('exams.index')} className="text-slate-500 hover:underline">كل الفحوصات</Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function AnswerCard({ index, item, examId, attemptId, canManage }) {
    const form = useForm({
        points_earned: item.points_earned ?? 0,
        is_correct: item.is_correct ?? false,
        teacher_feedback: item.teacher_feedback || '',
    });

    const given = Array.isArray(item.answer) ? item.answer : [];
    const correct = Array.isArray(item.correct_answers) ? item.correct_answers : [];

    return (
        <div className="box p-5">
            <div className="mb-2 flex items-start justify-between gap-2">
                <p className="font-medium text-slate-800">{index + 1}. {item.prompt}</p>
                <span className={`rounded-md px-2 py-1 text-[11px] ${
                    item.is_correct === true ? 'bg-success/10 text-success'
                        : item.is_correct === false ? 'bg-danger/10 text-danger'
                            : 'bg-pending/10 text-pending'
                }`}>
                    {item.is_correct === true ? 'صحيح' : item.is_correct === false ? 'خطأ' : 'بانتظار التصحيح'}
                    {' · '}{item.points_earned}/{item.points}
                </span>
            </div>

            <p className="text-sm text-slate-600">
                إجابة الطالب:{' '}
                {item.type === 'short'
                    ? (given[0] || '—')
                    : given.length
                        ? given.map((v) => optionText(item.options, v)).join('، ')
                        : '—'}
            </p>

            {item.correct_answers && item.type !== 'short' && (
                <p className="mt-1 text-sm text-success">
                    الصحيح: {correct.map((v) => optionText(item.options, v)).join('، ')}
                </p>
            )}

            {item.explanation && (
                <p className="mt-2 text-sm text-slate-500">{item.explanation}</p>
            )}

            {item.teacher_feedback && (
                <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">ملاحظة المعلم: {item.teacher_feedback}</p>
            )}

            {canManage && item.type === 'short' && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post(route('exams.answers.grade', [examId, attemptId, item.id]), { preserveScroll: true });
                    }}
                    className="mt-4 grid gap-2 border-t border-slate-100 pt-4 md:grid-cols-3"
                >
                    <div>
                        <label className="text-xs text-slate-500">الدرجة</label>
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={item.points}
                            className="form-control mt-1"
                            value={form.data.points_earned}
                            onChange={(e) => form.setData('points_earned', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-500">ملاحظة للطالب</label>
                        <input
                            className="form-control mt-1"
                            value={form.data.teacher_feedback}
                            onChange={(e) => form.setData('teacher_feedback', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <PrimaryButton disabled={form.processing}>حفظ التصحيح</PrimaryButton>
                    </div>
                </form>
            )}
        </div>
    );
}
