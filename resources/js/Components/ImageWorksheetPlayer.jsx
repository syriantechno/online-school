import { useMemo, useState } from 'react';

function normalize(value) {
    return String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه');
}

export function scoreWorksheet(pages, answers) {
    let score = 0;
    let total = 0;

    pages.forEach((page, pageIndex) => {
        (page.zones || []).forEach((zone) => {
            total += 1;
            const key = `${pageIndex}:${zone.id}`;
            const value = answers[key];
            if (zone.type === 'fill' && normalize(value) === normalize(zone.answer)) {
                score += 1;
            } else if (zone.type === 'select' && Number(value) === Number(zone.correct_index)) {
                score += 1;
            } else if (zone.type === 'click' && Boolean(value) === (zone.correct !== false)) {
                score += 1;
            }
        });
    });

    return { score, total };
}

function zoneStateClass(done, ok, selected, showOutlines, type) {
    if (done && ok) {
        return 'border-emerald-500 bg-emerald-400/35 ring-2 ring-emerald-300';
    }
    if (done && !ok) {
        return 'border-red-500 bg-red-400/30 ring-2 ring-red-200';
    }
    if (selected && type === 'click') {
        return 'border-amber-400 bg-amber-300/40 ring-2 ring-amber-200';
    }
    if (showOutlines) {
        return type === 'fill' ? 'border-sky-400/80 bg-white/55' : 'border-white/80 bg-white/20';
    }
    return selected ? 'border-amber-300 bg-amber-200/30' : 'border-transparent bg-transparent hover:bg-white/20';
}

export default function ImageWorksheetPlayer({ payload, onComplete }) {
    const pages = payload.pages || [];
    const showOutlines = payload.show_outlines !== false;
    const [pageIndex, setPageIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [done, setDone] = useState(false);

    const page = pages[pageIndex];
    const result = useMemo(() => scoreWorksheet(pages, answers), [pages, answers]);

    if (!pages.length) {
        return <p className="rounded-2xl bg-slate-50 p-6 text-slate-500">لم تُرفع صور لهذا النشاط بعد.</p>;
    }

    const setAnswer = (zoneId, value) => {
        if (done) {
            return;
        }
        setAnswers((old) => ({ ...old, [`${pageIndex}:${zoneId}`]: value }));
    };

    const finish = () => {
        const current = scoreWorksheet(pages, answers);
        setDone(true);
        if (current.total < 1) {
            onComplete?.({ score: 1, total: 1 });
            return;
        }
        onComplete?.(current);
    };

    return (
        <div>
            {payload.instruction && (
                <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold leading-7 text-amber-900">
                    {payload.instruction}
                </div>
            )}

            {pages.length > 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {pages.map((item, index) => (
                        <button
                            type="button"
                            key={item.id || index}
                            onClick={() => setPageIndex(index)}
                            className={`min-h-11 rounded-xl border px-3 text-sm font-black ${
                                pageIndex === index ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white'
                            }`}
                        >
                            {item.title || `صفحة ${index + 1}`}
                        </button>
                    ))}
                </div>
            )}

            <div dir="ltr" className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={page?.image_url} alt={page?.title || 'ورقة النشاط'} className="block w-full select-none" draggable={false} />
                {(page?.zones || []).map((zone) => {
                    const key = `${pageIndex}:${zone.id}`;
                    const value = answers[key];
                    const selected = zone.type === 'click' ? Boolean(value) : value !== undefined && value !== '';
                    const ok =
                        zone.type === 'fill'
                            ? normalize(value) === normalize(zone.answer)
                            : zone.type === 'select'
                              ? Number(value) === Number(zone.correct_index)
                              : Boolean(value) === (zone.correct !== false);

                    return (
                        <div
                            key={zone.id}
                            className={`absolute overflow-hidden rounded-md border-2 transition ${zoneStateClass(done, ok, selected, showOutlines, zone.type)}`}
                            style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
                        >
                            {zone.type === 'click' && (
                                <button
                                    type="button"
                                    disabled={done}
                                    title={zone.hint || zone.label || 'اضغط هنا'}
                                    aria-pressed={Boolean(value)}
                                    aria-label={zone.label || zone.hint || 'اختيار عنصر'}
                                    onClick={() => setAnswer(zone.id, !value)}
                                    className="h-full min-h-[44px] w-full min-w-[44px]"
                                />
                            )}
                            {zone.type === 'fill' && (
                                <input
                                    disabled={done}
                                    value={value || ''}
                                    title={zone.hint || zone.label || 'اكتب الإجابة'}
                                    aria-label={zone.label || 'اكتب الإجابة'}
                                    onChange={(e) => setAnswer(zone.id, e.target.value)}
                                    className="h-full w-full bg-transparent text-center font-black text-slate-800 outline-none"
                                    style={{ fontSize: 'clamp(14px, 2.4vw, 28px)' }}
                                />
                            )}
                            {zone.type === 'select' && (
                                <select
                                    disabled={done}
                                    value={value ?? ''}
                                    title={zone.hint || zone.label || 'اختر الإجابة'}
                                    aria-label={zone.label || 'اختر الإجابة'}
                                    onChange={(e) => setAnswer(zone.id, e.target.value)}
                                    className="h-full w-full bg-white/80 text-center text-sm font-bold"
                                >
                                    <option value="">اختر</option>
                                    {(zone.options || []).map((option, index) => (
                                        <option key={index} value={index}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    );
                })}
            </div>

            {!done ? (
                <button
                    type="button"
                    onClick={finish}
                    className="mt-5 min-h-12 rounded-xl bg-blue-600 px-7 py-3 font-black text-white"
                >
                    تحقق من الإجابات
                </button>
            ) : (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <p className="text-lg font-black text-blue-700">
                        نتيجتك: {result.score} من {result.total}
                    </p>
                    <button type="button" onClick={() => setDone(false)} className="min-h-11 rounded-xl border px-4 font-bold">
                        تعديل الإجابات
                    </button>
                </div>
            )}
        </div>
    );
}
