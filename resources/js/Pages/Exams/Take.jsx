import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

function useCountdown(expiresAt, serverNow) {
    const offset = useMemo(() => {
        if (!serverNow) return 0;
        return Date.now() - new Date(serverNow).getTime();
    }, [serverNow]);

    const [remaining, setRemaining] = useState(() => {
        if (!expiresAt) return null;
        return Math.max(0, Math.floor((new Date(expiresAt).getTime() - (Date.now() - offset)) / 1000));
    });

    useEffect(() => {
        if (!expiresAt) return undefined;
        const tick = () => {
            const secs = Math.max(0, Math.floor((new Date(expiresAt).getTime() - (Date.now() - offset)) / 1000));
            setRemaining(secs);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [expiresAt, offset]);

    return remaining;
}

function formatTime(secs) {
    if (secs == null) return null;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Take({ exam, attempt, questions = [], expiresAt = null, serverNow = null }) {
    const form = useForm({ answers: {} });
    const remaining = useCountdown(expiresAt, serverNow);
    const [autoSubmitted, setAutoSubmitted] = useState(false);

    useEffect(() => {
        if (remaining === 0 && !autoSubmitted && !form.processing) {
            setAutoSubmitted(true);
            form.post(route('exams.submit', [exam.id, attempt.id]));
        }
    }, [remaining]);

    const setAnswer = (questionId, value, multi = false) => {
        const key = String(questionId);
        const current = form.data.answers[key];
        let next;
        if (multi) {
            const arr = Array.isArray(current) ? [...current] : [];
            next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
        } else {
            next = value;
        }
        form.setData('answers', { ...form.data.answers, [key]: next });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!confirm('تسليم الفحص الآن؟')) return;
        form.post(route('exams.submit', [exam.id, attempt.id]));
    };

    return (
        <AuthenticatedLayout header={exam.title}>
            <Head title={`فحص: ${exam.title}`} />

            <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
                <div>
                    <p className="text-sm font-medium text-slate-800">{exam.title}</p>
                    <p className="text-xs text-slate-500">محاولة #{attempt.attempt_number} · {questions.length} سؤال</p>
                </div>
                {remaining != null && (
                    <div className={`rounded-md px-3 py-1.5 text-sm font-medium ${remaining < 60 ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                        الوقت المتبقي: {formatTime(remaining)}
                    </div>
                )}
            </div>

            <form onSubmit={submit} className="mx-auto max-w-3xl space-y-4">
                {questions.map((q, index) => {
                    const key = String(q.id);
                    const value = form.data.answers[key];

                    return (
                        <div key={q.id} className="box p-5">
                            <div className="mb-3 flex items-start justify-between gap-2">
                                <p className="font-medium text-slate-800">{index + 1}. {q.prompt}</p>
                                <span className="shrink-0 text-xs text-slate-400">{q.points} درجة</span>
                            </div>

                            {q.type === 'short' ? (
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="اكتب إجابتك..."
                                    value={value || ''}
                                    onChange={(e) => setAnswer(q.id, e.target.value)}
                                />
                            ) : (
                                <div className="space-y-2">
                                    {(q.options || []).map((opt, optIndex) => {
                                        const selected = q.type === 'multiple'
                                            ? Array.isArray(value) && value.includes(String(optIndex))
                                            : value === String(optIndex);
                                        return (
                                            <button
                                                key={optIndex}
                                                type="button"
                                                onClick={() => setAnswer(q.id, String(optIndex), q.type === 'multiple')}
                                                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-right text-sm transition ${
                                                    selected
                                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                        : 'border-slate-200 bg-white hover:border-primary/40'
                                                }`}
                                            >
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                                                    {optIndex + 1}
                                                </span>
                                                <span>{opt}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className="box flex items-center justify-between gap-3 p-5">
                    <p className="text-sm text-slate-600">راجع إجاباتك قبل التسليم. لا يمكن التعديل بعد ذلك.</p>
                    <PrimaryButton disabled={form.processing}>تسليم الفحص</PrimaryButton>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
