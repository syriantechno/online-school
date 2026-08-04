/**
 * منشئ أسئلة تفاعلية للمعلم/المدير.
 */
export default function InteractiveBuilder({ questions = [], onChange }) {
    const update = (next) => onChange(next);

    const addQuestion = () => {
        update([
            ...questions,
            {
                id: `q_${Date.now()}`,
                question: '',
                options: ['', '', '', ''],
                correct_index: 0,
                explanation: '',
            },
        ]);
    };

    const removeQuestion = (index) => {
        update(questions.filter((_, i) => i !== index));
    };

    const patch = (index, fields) => {
        update(questions.map((q, i) => (i === index ? { ...q, ...fields } : q)));
    };

    const patchOption = (qIndex, optIndex, value) => {
        const q = questions[qIndex];
        const options = [...(q.options || [])];
        options[optIndex] = value;
        patch(qIndex, { options });
    };

    return (
        <div className="space-y-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-brand-900">الأسئلة التفاعلية</h3>
                    <p className="text-xs text-slate-500">أضف أسئلة اختيار من متعدد للطالب.</p>
                </div>
                <button
                    type="button"
                    onClick={addQuestion}
                    className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white"
                >
                    إضافة سؤال
                </button>
            </div>

            {questions.length === 0 && (
                <p className="text-sm text-slate-500">لا أسئلة بعد — اضغط «إضافة سؤال».</p>
            )}

            {questions.map((q, index) => (
                <div key={q.id || index} className="space-y-3 rounded-xl border border-brand-100 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                        <label className="block flex-1 text-sm font-medium text-brand-900">
                            السؤال {index + 1}
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                rows={2}
                                value={q.question}
                                onChange={(e) => patch(index, { question: e.target.value })}
                                placeholder="اكتب نص السؤال بالعربية..."
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-sm text-red-600 hover:underline"
                        >
                            حذف
                        </button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {(q.options || []).map((opt, optIndex) => (
                            <label key={optIndex} className="text-xs text-slate-600">
                                الخيار {optIndex + 1}
                                <div className="mt-1 flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`correct_${q.id || index}`}
                                        checked={Number(q.correct_index) === optIndex}
                                        onChange={() => patch(index, { correct_index: optIndex })}
                                        title="الإجابة الصحيحة"
                                    />
                                    <input
                                        className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        value={opt}
                                        onChange={(e) => patchOption(index, optIndex, e.target.value)}
                                        placeholder={`الخيار ${optIndex + 1}`}
                                    />
                                </div>
                            </label>
                        ))}
                    </div>

                    <label className="block text-xs text-slate-600">
                        شرح الإجابة (اختياري)
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            value={q.explanation || ''}
                            onChange={(e) => patch(index, { explanation: e.target.value })}
                            placeholder="يظهر للطالب بعد التصحيح"
                        />
                    </label>
                    <p className="text-xs text-slate-400">اختر الدائرة بجانب الإجابة الصحيحة.</p>
                </div>
            ))}
        </div>
    );
}
