import { useMemo, useState } from 'react';

/**
 * مشغّل أسئلة تفاعلية للطالب.
 * payload: { questions: [{ id, question, options[], correct_index, explanation? }] }
 */
export default function InteractiveQuiz({ payload, onComplete }) {
    const questions = useMemo(
        () => (Array.isArray(payload?.questions) ? payload.questions : []),
        [payload],
    );

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    if (questions.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                لا توجد أسئلة تفاعلية بعد.
            </div>
        );
    }

    const score = questions.reduce((sum, q, index) => {
        const key = q.id || String(index);
        return sum + (answers[key] === q.correct_index ? 1 : 0);
    }, 0);

    const submit = () => {
        setSubmitted(true);
        onComplete?.({ score, total: questions.length });
    };

    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-800">تمرين تفاعلي</h3>
                <span className="text-sm text-slate-500">{questions.length} سؤال</span>
            </div>

            {questions.map((q, index) => {
                const key = q.id || String(index);
                const selected = answers[key];
                const isCorrect = selected === q.correct_index;

                return (
                    <div key={key} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                        <p className="font-medium text-slate-800">
                            {index + 1}. {q.question}
                        </p>
                        <div className="mt-3 space-y-2">
                            {(q.options || []).map((option, optIndex) => {
                                const chosen = selected === optIndex;
                                let stateClass = 'border-slate-200 bg-white hover:border-primary/40';
                                if (submitted) {
                                    if (optIndex === q.correct_index) {
                                        stateClass = 'border-success bg-success/10 text-success';
                                    } else if (chosen) {
                                        stateClass = 'border-danger bg-danger/5 text-danger';
                                    }
                                } else if (chosen) {
                                    stateClass = 'border-primary bg-primary/5 text-primary ring-1 ring-primary';
                                }

                                return (
                                    <button
                                        key={`${key}-${optIndex}`}
                                        type="button"
                                        disabled={submitted}
                                        onClick={() =>
                                            setAnswers((prev) => ({ ...prev, [key]: optIndex }))
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-right text-sm transition ${stateClass}`}
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                                            {optIndex + 1}
                                        </span>
                                        <span>{option}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {submitted && (
                            <p className={`mt-3 text-sm ${isCorrect ? 'text-success' : 'text-danger'}`}>
                                {isCorrect ? 'إجابة صحيحة' : 'إجابة غير صحيحة'}
                                {q.explanation ? ` — ${q.explanation}` : ''}
                            </p>
                        )}
                    </div>
                );
            })}

            <div className="flex flex-wrap items-center gap-3">
                {!submitted ? (
                    <button
                        type="button"
                        onClick={submit}
                        disabled={Object.keys(answers).length < questions.length}
                        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        تصحيح الإجابات
                    </button>
                ) : (
                    <>
                        <p className="text-sm font-semibold text-slate-800">
                            النتيجة: {score} من {questions.length}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setAnswers({});
                                setSubmitted(false);
                            }}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
                        >
                            إعادة المحاولة
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}
