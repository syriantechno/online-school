import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { LessonIcon, THEMES } from '@/Components/LessonAssets';

function normalize(value) {
    return String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه');
}

function highlightText(text, words = []) {
    if (!text) return text;
    const sorted = [...words].filter(Boolean).sort((a, b) => b.length - a.length);
    if (!sorted.length) return text;
    const pattern = new RegExp(`(${sorted.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    return text.split(pattern).map((part, index) =>
        sorted.includes(part) ? (
            <span key={index} className="font-semibold text-rose-600">{part}</span>
        ) : (
            <span key={index}>{part}</span>
        ),
    );
}

const STEP_META = {
    story: { label: 'اقرأ', title: 'اقرأ القصة' },
    story_tap: { label: 'ظلّل', title: 'ظلّل كلمات الحرف' },
    vocab_grid: { label: 'كلمات', title: 'تعرّف على الكلمات' },
    pick_grid: { label: 'اختر', title: 'اختر الإجابات الصحيحة' },
    match_pairs: { label: 'طابق', title: 'طابق الصورة والكلمة' },
    story_quiz: { label: 'أسئلة', title: 'أسئلة على القصة' },
    find_letter: { label: 'أين؟', title: 'أين الحرف داخل الكلمة؟' },
    build_word: { label: 'ركّب', title: 'ركّب الكلمة' },
    trace_letter: { label: 'اكتب', title: 'اكتب الحرف' },
    text_lab: { label: 'نص', title: 'مختبر النص' },
    grammar_fix: { label: 'نحو', title: 'محقق النحو' },
    writing_workshop: { label: 'تعبير', title: 'ورشة الكتابة' },
    voice_reading: { label: 'صوت', title: 'قراءة مسموعة' },
};

export function scoreGeneratedWorksheet(blocks, answers) {
    let score = 0;
    let total = 0;

    (blocks || []).forEach((block) => {
        if (block.kind === 'pick_grid') {
            (block.items || []).forEach((item) => {
                total += 1;
                const selected = Boolean(answers[`${block.id}:${item.id}`]);
                if (selected === (item.starts_with !== false)) score += 1;
            });
        }
        if (block.kind === 'match_pairs' || block.kind === 'build_word') {
            (block.items || []).forEach((item) => {
                total += 1;
                if (normalize(answers[`${block.id}:${item.id}`]) === normalize(item.answer || item.label)) score += 1;
            });
        }
        if (block.kind === 'find_letter' || block.kind === 'story_quiz' || block.kind === 'text_lab' || block.kind === 'grammar_fix') {
            (block.items || []).forEach((item) => {
                total += 1;
                if (Number(answers[`${block.id}:${item.id}`]) === Number(item.correct_index)) score += 1;
            });
        }
        if (block.kind === 'story_tap') {
            (block.tokens || []).filter((token) => token.correct).forEach((token) => {
                total += 1;
                if (answers[`${block.id}:${token.id}`]) score += 1;
            });
        }
        if (block.kind === 'trace_letter') {
            const count = Math.max(1, Number(block.count) || 1);
            for (let i = 0; i < count; i += 1) {
                total += 1;
                if (normalize(answers[`${block.id}:${i}`]) === normalize(block.letter)) score += 1;
            }
        }
        if (block.kind === 'writing_workshop') {
            total += 1;
            const text = String(answers[`${block.id}:text`] || '').trim();
            const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
            if (words >= Math.max(1, Number(block.min_words) || 20)) score += 1;
        }
        if (block.kind === 'voice_reading') {
            total += 1;
            if (answers[`${block.id}:uploaded`] || answers[`${block.id}:blob`]) score += 1;
        }
    });

    return { score, total };
}

function StoryStage({ block, theme }) {
    const paragraphs = block.paragraphs?.length ? block.paragraphs : [block.text];
    return (
        <div className={`rounded-box ${theme.soft} space-y-4 p-5 sm:p-6`}>
            <h3 className={`text-lg font-medium ${theme.accent}`}>{block.title}</h3>
            {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base leading-8 text-slate-700">
                    {highlightText(paragraph, block.highlight || [])}
                </p>
            ))}
        </div>
    );
}

function StoryTapStage({ block, answers, setAnswer, done, theme }) {
    const correctCount = (block.tokens || []).filter((token) => token.correct).length;
    const tappedCorrect = (block.tokens || []).filter((token) => token.correct && answers[`${block.id}:${token.id}`]).length;
    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-base text-slate-600">{block.prompt}</p>
                <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${theme.chip}`}>{tappedCorrect}/{correctCount}</span>
            </div>
            <div className="flex flex-wrap gap-2 rounded-box border border-slate-200 bg-white p-4 leading-8 sm:p-5">
                {(block.tokens || []).map((token) => {
                    if (!token.clean) {
                        return <span key={token.id} className="text-base text-slate-700">{token.text}</span>;
                    }
                    const key = `${block.id}:${token.id}`;
                    const selected = Boolean(answers[key]);
                    let style = 'border-slate-200 bg-slate-50 text-slate-700';
                    if (selected && !done) style = 'border-amber-400 bg-amber-50 text-amber-800';
                    if (done && token.correct && selected) style = 'border-emerald-400 bg-emerald-50 text-emerald-800';
                    if (done && token.correct && !selected) style = 'border-emerald-300 bg-emerald-50/40 text-emerald-700';
                    if (done && !token.correct && selected) style = 'border-red-300 bg-red-50 text-red-700';
                    return (
                        <button key={token.id} type="button" disabled={done} onClick={() => setAnswer(key, !selected)} className={`rounded-md border px-2.5 py-1 text-base font-medium ${style}`} aria-pressed={selected}>
                            {token.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function VocabStage({ block }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(block.items || []).map((item) => (
                <div key={item.id} className="rounded-box border border-slate-200 bg-white p-4 text-center sm:p-5">
                    <LessonIcon name={item.icon} className="mx-auto h-20 w-20" />
                    <p className="mt-3 text-base font-medium text-slate-800">
                        <span className="text-rose-600">{(item.label || '')[0]}</span>
                        {(item.label || '').slice(1)}
                    </p>
                </div>
            ))}
        </div>
    );
}

function PickStage({ block, answers, setAnswer, done }) {
    return (
        <div>
            <p className="mb-4 text-base text-slate-600">{block.prompt}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(block.items || []).map((item) => {
                    const key = `${block.id}:${item.id}`;
                    const selected = Boolean(answers[key]);
                    const ok = selected === (item.starts_with !== false);
                    let style = 'border-slate-200 bg-white';
                    if (selected && !done) style = 'border-amber-400 bg-amber-50';
                    if (done && ok) style = 'border-emerald-400 bg-emerald-50';
                    if (done && !ok) style = 'border-red-300 bg-red-50';
                    return (
                        <button key={item.id} type="button" disabled={done} onClick={() => setAnswer(key, !selected)} className={`rounded-box border p-4 text-center sm:p-5 ${style}`} aria-pressed={selected}>
                            <LessonIcon name={item.icon} className="mx-auto h-16 w-16 sm:h-20 sm:w-20" />
                            <p className="mt-3 text-base font-medium text-slate-800">{item.label}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function QuizStage({ block, answers, setAnswer, done }) {
    return (
        <div className="space-y-4">
            <p className="text-base text-slate-600">{block.prompt}</p>
            {(block.items || []).map((item, index) => {
                const key = `${block.id}:${item.id}`;
                const value = answers[key];
                const ok = Number(value) === Number(item.correct_index);
                return (
                    <div key={item.id} className={`rounded-box border bg-white p-4 sm:p-5 ${done ? (ok ? 'border-emerald-300' : 'border-red-200') : 'border-slate-200'}`}>
                        <p className="text-base font-medium text-slate-800">{index + 1}. {item.question}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(item.options || []).map((option, optIndex) => (
                                <button key={optIndex} type="button" disabled={done} onClick={() => setAnswer(key, optIndex)} className={`min-h-11 rounded-md border px-4 text-sm font-medium ${Number(value) === optIndex ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200'}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function FindStage({ block, answers, setAnswer, done }) {
    return (
        <div className="space-y-4">
            <p className="text-base text-slate-600">{block.prompt}</p>
            {(block.items || []).map((item) => {
                const key = `${block.id}:${item.id}`;
                const value = answers[key];
                const ok = Number(value) === Number(item.correct_index);
                return (
                    <div key={item.id} className={`rounded-box border bg-white p-4 sm:p-5 ${done ? (ok ? 'border-emerald-300' : 'border-red-200') : 'border-slate-200'}`}>
                        <div className="mb-3 flex items-center gap-3">
                            <LessonIcon name={item.icon} className="h-14 w-14" />
                            <p className="text-base font-medium text-slate-700">{item.label}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[...String(item.label || '')].map((ch, index) => (
                                <button key={index} type="button" disabled={done} onClick={() => setAnswer(key, index)} className={`grid h-11 w-11 place-items-center rounded-md border text-base font-medium ${Number(value) === index ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200'}`}>
                                    {ch}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function BuildStage({ block, answers, setAnswer, done }) {
    return (
        <div className="space-y-4">
            <p className="text-base text-slate-600">{block.prompt}</p>
            {(block.items || []).map((item) => {
                const key = `${block.id}:${item.id}`;
                const value = answers[key] || '';
                const expected = item.answer || item.label;
                const ok = normalize(value) === normalize(expected);
                return (
                    <div key={item.id} className={`rounded-box border bg-white p-4 sm:p-5 ${done ? (ok ? 'border-emerald-300' : 'border-red-200') : 'border-slate-200'}`}>
                        <div className="mb-3 flex items-center gap-3">
                            <LessonIcon name={item.icon} className="h-14 w-14" />
                            <p className="text-xl font-medium tracking-widest text-rose-600">{item.scrambled || expected}</p>
                        </div>
                        <input disabled={done} className="form-control !py-3 text-base" value={value} onChange={(e) => setAnswer(key, e.target.value)} placeholder="اكتب الكلمة" />
                        {done && <p className="mt-2 text-sm text-slate-600">الصحيح: {expected}</p>}
                    </div>
                );
            })}
        </div>
    );
}

function MatchStage({ block, answers, setAnswer, done }) {
    const [labels] = useState(() => [...(block.items || []).map((item) => item.label)].sort(() => Math.random() - 0.5));
    return (
        <div className="space-y-3">
            <p className="mb-2 text-base text-slate-600">{block.prompt}</p>
            {(block.items || []).map((item) => {
                const key = `${block.id}:${item.id}`;
                const value = answers[key] || '';
                const ok = value === item.label;
                return (
                    <div key={item.id} className={`flex flex-wrap items-center gap-3 rounded-box border bg-white p-3.5 sm:p-4 ${done ? (ok ? 'border-emerald-300' : 'border-red-200') : 'border-slate-200'}`}>
                        <LessonIcon name={item.icon} className="h-14 w-14" />
                        <select disabled={done} className="form-control !w-auto !min-w-[10rem] !py-2.5 text-base" value={value} onChange={(e) => setAnswer(key, e.target.value)}>
                            <option value="">اختر</option>
                            {labels.map((label) => <option key={label} value={label}>{label}</option>)}
                        </select>
                    </div>
                );
            })}
        </div>
    );
}

function TraceStage({ block, answers, setAnswer, done }) {
    const count = Math.max(1, Number(block.count) || 6);
    return (
        <div>
            <p className="mb-4 text-base text-slate-600">{block.prompt || `اكتب حرف ${block.letter}`}</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {Array.from({ length: count }).map((_, index) => {
                    const key = `${block.id}:${index}`;
                    const value = answers[key] || '';
                    const ok = normalize(value) === normalize(block.letter);
                    return (
                        <label key={key} className="relative block">
                            <span className="pointer-events-none absolute inset-0 grid place-items-center text-4xl text-slate-200">{block.letter}</span>
                            <input
                                disabled={done}
                                value={value}
                                onChange={(e) => setAnswer(key, e.target.value)}
                                className={`relative z-10 h-20 w-full rounded-box border bg-transparent text-center text-3xl outline-none ${done ? (ok ? 'border-emerald-400' : 'border-red-300') : 'border-dashed border-slate-300'}`}
                                maxLength={2}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

function TextLabStage({ block, answers, setAnswer, done, theme }) {
    const paragraphs = block.paragraphs?.length ? block.paragraphs : [block.text];
    return (
        <div className="space-y-4">
            <div className={`rounded-box ${theme.soft} space-y-3 p-5`}>
                <h3 className={`text-lg font-medium ${theme.accent}`}>{block.title || 'النص'}</h3>
                {paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-base leading-8 text-slate-700">{paragraph}</p>
                ))}
            </div>
            <QuizStage block={{ ...block, prompt: block.prompt || 'أسئلة الفهم' }} answers={answers} setAnswer={setAnswer} done={done} />
        </div>
    );
}

function GrammarStage({ block, answers, setAnswer, done }) {
    return (
        <div className="space-y-4">
            <p className="text-base text-slate-600">{block.prompt}</p>
            {(block.items || []).map((item, index) => {
                const key = `${block.id}:${item.id}`;
                const value = answers[key];
                const ok = Number(value) === Number(item.correct_index);
                return (
                    <div key={item.id} className={`rounded-box border bg-white p-4 sm:p-5 ${done ? (ok ? 'border-emerald-300' : 'border-red-200') : 'border-slate-200'}`}>
                        {item.sentence && (
                            <p className="mb-2 rounded-md bg-slate-50 px-3 py-2 text-base font-medium text-slate-800">{item.sentence}</p>
                        )}
                        <p className="text-base font-medium text-slate-800">{index + 1}. {item.question}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(item.options || []).map((option, optIndex) => (
                                <button key={optIndex} type="button" disabled={done} onClick={() => setAnswer(key, optIndex)} className={`min-h-11 rounded-md border px-4 text-sm font-medium ${Number(value) === optIndex ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200'}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function WritingStage({ block, answers, setAnswer, done }) {
    const key = `${block.id}:text`;
    const value = answers[key] || '';
    const words = value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
    const min = Math.max(1, Number(block.min_words) || 20);
    return (
        <div>
            <p className="mb-2 text-base text-slate-700">{block.prompt}</p>
            {block.rubric && <p className="mb-3 text-sm text-slate-500">معايير: {block.rubric}</p>}
            <textarea
                disabled={done}
                rows={8}
                className="form-control text-base leading-7"
                value={value}
                onChange={(e) => setAnswer(key, e.target.value)}
                placeholder="اكتب هنا..."
            />
            <p className={`mt-2 text-sm ${words >= min ? 'text-emerald-700' : 'text-slate-500'}`}>
                عدد الكلمات: {words} / المطلوب على الأقل {min}
            </p>
        </div>
    );
}

function VoiceStage({ block, answers, setAnswer, done, lessonId, canUpload }) {
    const [recording, setRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [localUrl, setLocalUrl] = useState(answers[`${block.id}:preview`] || '');
    const mediaRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const maxSeconds = Math.max(15, Number(block.max_seconds) || 60);
    const uploaded = Boolean(answers[`${block.id}:uploaded`]);

    useEffect(() => () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (mediaRef.current) mediaRef.current.stream?.getTracks?.().forEach((track) => track.stop());
        if (localUrl?.startsWith('blob:')) URL.revokeObjectURL(localUrl);
    }, [localUrl]);

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
    };

    const startRecording = async () => {
        setError('');
        if (!navigator.mediaDevices?.getUserMedia) {
            setError('المتصفح لا يدعم تسجيل الصوت.');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined;
            const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
            chunksRef.current = [];
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };
            recorder.onstop = () => {
                stream.getTracks().forEach((track) => track.stop());
                const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setLocalUrl(url);
                setAnswer(`${block.id}:blob`, blob);
                setAnswer(`${block.id}:preview`, url);
                setAnswer(`${block.id}:uploaded`, false);
            };
            mediaRef.current = recorder;
            recorder.start();
            setRecording(true);
            setSeconds(0);
            timerRef.current = setInterval(() => {
                setSeconds((value) => {
                    if (value + 1 >= maxSeconds) {
                        recorder.stop();
                        setRecording(false);
                        stopTimer();
                        return maxSeconds;
                    }
                    return value + 1;
                });
            }, 1000);
        } catch {
            setError('لم نتمكن من فتح الميكروفون. اسمح بالوصول للصوت ثم أعد المحاولة.');
        }
    };

    const stopRecording = () => {
        if (mediaRef.current && mediaRef.current.state !== 'inactive') {
            mediaRef.current.stop();
        }
        setRecording(false);
        stopTimer();
    };

    const upload = async () => {
        const blob = answers[`${block.id}:blob`];
        if (!blob) {
            setError('سجّل صوتك أولاً.');
            return;
        }
        if (!lessonId || !canUpload) {
            setAnswer(`${block.id}:uploaded`, true);
            setError('');
            return;
        }
        setUploading(true);
        setError('');
        try {
            const form = new FormData();
            form.append('block_id', block.id);
            form.append('kind', 'voice_reading');
            form.append('audio', blob, `reading-${block.id}.webm`);
            const { data } = await axios.post(route('lessons.audio.store', lessonId), form);
            setAnswer(`${block.id}:uploaded`, true);
            if (data?.file_url) setAnswer(`${block.id}:file_url`, data.file_url);
        } catch (err) {
            setError(err?.response?.data?.message || 'فشل رفع التسجيل. حاول مرة أخرى.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <p className="mb-3 text-base text-slate-700">{block.prompt}</p>
            <div className="mb-4 rounded-box border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">{block.mode === 'dictation' ? 'نص الإملاء المسموع' : 'النص للقراءة'}</p>
                <p className="mt-2 text-lg leading-9 text-slate-800">{block.passage}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {!recording ? (
                    <button type="button" disabled={done} onClick={startRecording} className="min-h-11 rounded-md bg-rose-600 px-5 text-sm font-medium text-white disabled:opacity-40">
                        ابدأ التسجيل
                    </button>
                ) : (
                    <button type="button" onClick={stopRecording} className="min-h-11 rounded-md bg-slate-900 px-5 text-sm font-medium text-white">
                        إيقاف ({seconds}ث)
                    </button>
                )}
                <button type="button" disabled={done || uploading || !answers[`${block.id}:blob`]} onClick={upload} className="btn-primary min-h-11 px-5 text-sm disabled:opacity-40">
                    {uploading ? 'جارٍ الإرسال...' : uploaded ? 'تم الإرسال ✓' : 'إرسال للمعلم'}
                </button>
                <span className="text-xs text-slate-500">حد أقصى {maxSeconds} ثانية</span>
            </div>
            {localUrl && (
                <audio className="mt-4 w-full" controls src={localUrl}>
                    متصفحك لا يدعم تشغيل الصوت
                </audio>
            )}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {!lessonId && <p className="mt-3 text-xs text-slate-500">معاينة فقط: الإرسال الفعلي يعمل داخل الدرس المنشور.</p>}
        </div>
    );
}

function StageBody({ block, answers, setAnswer, done, theme, lessonId, canUpload }) {
    if (block.kind === 'story') return <StoryStage block={block} theme={theme} />;
    if (block.kind === 'story_tap') return <StoryTapStage block={block} answers={answers} setAnswer={setAnswer} done={done} theme={theme} />;
    if (block.kind === 'vocab_grid') return <VocabStage block={block} />;
    if (block.kind === 'pick_grid') return <PickStage block={block} answers={answers} setAnswer={setAnswer} done={done} />;
    if (block.kind === 'story_quiz') return <QuizStage block={block} answers={answers} setAnswer={setAnswer} done={done} />;
    if (block.kind === 'find_letter') return <FindStage block={block} answers={answers} setAnswer={setAnswer} done={done} />;
    if (block.kind === 'build_word') return <BuildStage block={block} answers={answers} setAnswer={setAnswer} done={done} />;
    if (block.kind === 'match_pairs') return <MatchStage block={block} answers={answers} setAnswer={setAnswer} done={done} />;
    if (block.kind === 'trace_letter') return <TraceStage block={block} answers={answers} setAnswer={setAnswer} done={done} />;
    if (block.kind === 'text_lab') return <TextLabStage block={block} answers={answers} setAnswer={setAnswer} done={done} theme={theme} />;
    if (block.kind === 'grammar_fix') return <GrammarStage block={block} answers={answers} setAnswer={setAnswer} done={done} />;
    if (block.kind === 'writing_workshop') return <WritingStage block={block} answers={answers} setAnswer={setAnswer} done={done} />;
    if (block.kind === 'voice_reading') return <VoiceStage block={block} answers={answers} setAnswer={setAnswer} done={done} lessonId={lessonId} canUpload={canUpload} />;
    return null;
}

export default function GeneratedWorksheetPlayer({ payload, onComplete, lessonId = null, canUpload = false }) {
    const blocks = useMemo(() => payload.blocks || [], [payload.blocks]);
    const theme = THEMES[payload.theme] || THEMES.clay_pink;
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [done, setDone] = useState(false);
    const result = useMemo(() => scoreGeneratedWorksheet(blocks, answers), [blocks, answers]);

    const current = blocks[step];
    const meta = STEP_META[current?.kind] || { label: `خطوة ${step + 1}`, title: 'النشاط' };
    const isLast = step >= blocks.length - 1;

    const setAnswer = (key, value) => {
        if (done) return;
        setAnswers((old) => ({ ...old, [key]: value }));
    };

    const finish = () => {
        const currentResult = scoreGeneratedWorksheet(blocks, answers);
        setDone(true);
        onComplete?.(currentResult.total < 1 ? { score: 1, total: 1 } : currentResult);
    };

    if (!blocks.length) {
        return <p className="rounded-box bg-slate-50 p-4 text-sm text-slate-500">لا يوجد محتوى مولّد لهذا الدرس بعد.</p>;
    }

    if (done) {
        const percent = result.total ? Math.round((result.score / result.total) * 100) : 100;
        return (
            <div className="rounded-box border border-slate-200 bg-white p-5 text-center">
                <p className="text-xs font-medium text-slate-500">انتهت المغامرة</p>
                <p className="mt-2 text-3xl font-medium text-primary">{percent}%</p>
                <p className="mt-1 text-sm text-slate-600">
                    نتيجتك {result.score} من {result.total}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setDone(false);
                            setStep(0);
                        }}
                        className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-medium"
                    >
                        أعد المحاولة من البداية
                    </button>
                    <button type="button" onClick={() => setDone(false)} className="btn-primary min-h-10 px-4 text-sm">
                        عدّل الإجابات
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-box border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-base font-medium text-slate-800">{meta.title}</p>
                    <p className="text-sm text-slate-500">
                        {step + 1} / {blocks.length}
                    </p>
                </div>
                <div className="flex gap-1.5">
                    {blocks.map((block, index) => (
                        <button
                            key={block.id || index}
                            type="button"
                            onClick={() => setStep(index)}
                            className={`h-2 flex-1 rounded-full transition ${index <= step ? 'bg-primary' : 'bg-slate-200'}`}
                            aria-label={STEP_META[block.kind]?.label || `خطوة ${index + 1}`}
                        />
                    ))}
                </div>
                <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
                    {blocks.map((block, index) => (
                        <button
                            key={`label-${block.id || index}`}
                            type="button"
                            onClick={() => setStep(index)}
                            className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium ${index === step ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                        >
                            {STEP_META[block.kind]?.label || index + 1}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[420px] p-5 sm:min-h-[480px] sm:p-6">
                <StageBody block={current} answers={answers} setAnswer={setAnswer} done={false} theme={theme} lessonId={lessonId} canUpload={canUpload} />
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
                <button
                    type="button"
                    disabled={step === 0}
                    onClick={() => setStep((value) => Math.max(0, value - 1))}
                    className="min-h-11 rounded-md border border-slate-200 bg-white px-5 text-sm font-medium disabled:opacity-40"
                >
                    السابق
                </button>
                {!isLast ? (
                    <button type="button" onClick={() => setStep((value) => Math.min(blocks.length - 1, value + 1))} className="btn-primary min-h-11 px-6 text-sm">
                        التالي
                    </button>
                ) : (
                    <button type="button" onClick={finish} className="min-h-11 rounded-md bg-emerald-600 px-6 text-sm font-medium text-white">
                        إنهاء والتحقق
                    </button>
                )}
            </div>
        </div>
    );
}
