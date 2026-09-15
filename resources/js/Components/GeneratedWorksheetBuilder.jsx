import { useMemo, useState } from 'react';
import {
    ARABIC_LETTERS,
    GRADE_LEVELS,
    LessonIcon,
    THEMES,
    buildGeneratedWorksheet,
    gradeBand,
    iconNames,
    templatesForGrade,
} from '@/Components/LessonAssets';

const uid = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

const BLOCK_LABELS = {
    story: 'القصة',
    story_tap: 'اضغط بالقصة',
    story_quiz: 'أسئلة القصة',
    vocab_grid: 'الكلمات',
    pick_grid: 'التلوين',
    match_pairs: 'المطابقة',
    find_letter: 'أين الحرف',
    build_word: 'ركّب الكلمة',
    trace_letter: 'الكتابة',
    text_lab: 'مختبر النص',
    grammar_fix: 'محقق النحو',
    writing_workshop: 'ورشة الكتابة',
    voice_reading: 'قراءة مسموعة',
};

export default function GeneratedWorksheetBuilder({ payload, onChange }) {
    const data = {
        type: 'generated_worksheet',
        template: 'grade_track',
        letter: 'ب',
        grade_level: 1,
        theme: 'clay_pink',
        skill: 'الحروف والأصوات',
        objective: '',
        instruction: '',
        blocks: [],
        ...payload,
    };
    const [activeBlock, setActiveBlock] = useState(0);
    const blocks = data.blocks || [];
    const block = blocks[activeBlock];
    const band = gradeBand(data.grade_level);
    const availableTemplates = useMemo(() => templatesForGrade(data.grade_level), [data.grade_level]);

    const patch = (fields) => onChange({ ...data, ...fields });
    const regenerate = (fields = {}) => {
        const next = buildGeneratedWorksheet({
            template: fields.template || data.template,
            letter: fields.letter || data.letter,
            theme: fields.theme || data.theme,
            grade_level: fields.grade_level ?? data.grade_level,
            customStory: fields.keepStory ? blocks.find((b) => b.kind === 'story')?.text : undefined,
        });
        patch({
            ...next,
            objective: data.objective || next.objective,
            instruction: data.instruction || next.instruction,
            skill: data.skill || next.skill,
        });
        setActiveBlock(0);
    };

    const patchBlock = (index, fields) => {
        patch({ blocks: blocks.map((item, i) => (i === index ? { ...item, ...fields } : item)) });
    };

    const patchItem = (blockIndex, itemIndex, fields) => {
        const current = blocks[blockIndex];
        const items = (current.items || []).map((item, i) => (i === itemIndex ? { ...item, ...fields } : item));
        patchBlock(blockIndex, { items });
    };

    return (
        <div className="space-y-5">
            <div>
                <p className="mb-2 font-bold">الصف الدراسي</p>
                <div className="flex flex-wrap gap-2">
                    {GRADE_LEVELS.map((grade) => (
                        <button
                            type="button"
                            key={grade.id}
                            onClick={() => regenerate({ grade_level: grade.id, template: 'grade_track' })}
                            className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${
                                Number(data.grade_level) === grade.id ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-200 bg-white'
                            }`}
                        >
                            {grade.label}
                        </button>
                    ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    {band === 'foundation' && 'تأسيس: حروف وكلمات وقصة قصيرة + قراءة مسموعة'}
                    {band === 'intermediate' && 'متوسط: فهم مقروء + نحو + صوت + كتابة'}
                    {band === 'advanced' && 'متقدم: تحليل نص + نحو/بلاغة + كتابة + قراءة مسموعة'}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {availableTemplates.map((template) => (
                    <button
                        type="button"
                        key={template.id}
                        onClick={() => regenerate({ template: template.id })}
                        className={`min-h-24 rounded-2xl border px-4 py-3 text-right ${
                            data.template === template.id ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-100' : 'border-slate-200 bg-white'
                        }`}
                    >
                        <strong className="block text-sm font-black">{template.label}</strong>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">{template.description}</span>
                    </button>
                ))}
            </div>

            {band === 'foundation' && (
                <div>
                    <p className="mb-2 font-bold">اختر الحرف</p>
                    <div className="flex flex-wrap gap-2">
                        {ARABIC_LETTERS.map((letter) => (
                            <button
                                type="button"
                                key={letter}
                                onClick={() => regenerate({ letter })}
                                className={`grid h-11 w-11 place-items-center rounded-xl border text-lg font-black ${
                                    data.letter === letter ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-200 bg-white'
                                }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <p className="mb-2 font-bold">ثيم الألوان</p>
                <div className="flex flex-wrap gap-2">
                    {Object.values(THEMES).map((theme) => (
                        <button
                            type="button"
                            key={theme.id}
                            onClick={() => patch({ theme: theme.id })}
                            className={`min-h-11 rounded-xl border px-4 text-sm font-bold ${
                                data.theme === theme.id ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white'
                            }`}
                        >
                            {theme.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label>
                    <span className="font-bold">هدف الدرس</span>
                    <input
                        className="form-control mt-2"
                        value={data.objective || ''}
                        onChange={(e) => patch({ objective: e.target.value })}
                        placeholder="هدف واضح حسب الصف"
                    />
                </label>
                <label>
                    <span className="font-bold">تعليمات للطالب</span>
                    <input
                        className="form-control mt-2"
                        value={data.instruction || ''}
                        onChange={(e) => patch({ instruction: e.target.value })}
                        placeholder="اتبع الخطوات وسجّل قراءتك عند الطلب"
                    />
                </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {blocks.map((item, index) => (
                        <button
                            type="button"
                            key={item.id || index}
                            onClick={() => setActiveBlock(index)}
                            className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${
                                activeBlock === index ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white'
                            }`}
                        >
                            {BLOCK_LABELS[item.kind] || item.kind}
                        </button>
                    ))}
                </div>
                <button type="button" onClick={() => regenerate()} className="min-h-11 rounded-xl bg-slate-900 px-4 text-sm font-black text-white">
                    إعادة توليد المحتوى
                </button>
            </div>

            {(block?.kind === 'story' || block?.kind === 'text_lab') && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="block">
                        <span className="font-bold">العنوان</span>
                        <input className="form-control mt-2" value={block.title || ''} onChange={(e) => patchBlock(activeBlock, { title: e.target.value })} />
                    </label>
                    <label className="mt-3 block">
                        <span className="font-bold">النص</span>
                        <textarea
                            rows={10}
                            className="form-control mt-2"
                            value={block.text || ''}
                            onChange={(e) =>
                                patchBlock(activeBlock, {
                                    text: e.target.value,
                                    paragraphs: e.target.value.split(/\n+/).map((line) => line.trim()).filter(Boolean),
                                })
                            }
                        />
                    </label>
                </div>
            )}

            {block?.kind === 'story_tap' && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                    جزء تفاعلي: يضغط الطالب كلمات الحرف داخل القصة.
                    <p className="mt-2 font-black">الكلمات الصحيحة: {(block.tokens || []).filter((token) => token.correct).length}</p>
                </div>
            )}

            {(block?.kind === 'story_quiz' || block?.kind === 'text_lab' || block?.kind === 'grammar_fix') && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="mb-4 block">
                        <span className="font-bold">عنوان الأسئلة</span>
                        <input className="form-control mt-2" value={block.prompt || ''} onChange={(e) => patchBlock(activeBlock, { prompt: e.target.value })} />
                    </label>
                    <div className="space-y-3">
                        {(block.items || []).map((item, itemIndex) => (
                            <div key={item.id || itemIndex} className="rounded-xl bg-slate-50 p-3">
                                {block.kind === 'grammar_fix' && (
                                    <input
                                        className="form-control mb-2"
                                        value={item.sentence || ''}
                                        onChange={(e) => patchItem(activeBlock, itemIndex, { sentence: e.target.value })}
                                        placeholder="الجملة"
                                    />
                                )}
                                <input
                                    className="form-control mb-2"
                                    value={item.question || ''}
                                    onChange={(e) => patchItem(activeBlock, itemIndex, { question: e.target.value })}
                                    placeholder="نص السؤال"
                                />
                                <div className="grid gap-2 sm:grid-cols-3">
                                    {(item.options || ['', '', '']).map((option, optIndex) => (
                                        <label key={optIndex} className="flex items-center gap-2 text-xs font-bold">
                                            <input
                                                type="radio"
                                                name={`q_${block.id}_${itemIndex}`}
                                                checked={Number(item.correct_index) === optIndex}
                                                onChange={() => patchItem(activeBlock, itemIndex, { correct_index: optIndex })}
                                            />
                                            <input
                                                className="form-control !py-2"
                                                value={option}
                                                onChange={(e) => {
                                                    const options = [...(item.options || ['', '', ''])];
                                                    options[optIndex] = e.target.value;
                                                    patchItem(activeBlock, itemIndex, { options });
                                                }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(block?.kind === 'vocab_grid' || block?.kind === 'pick_grid' || block?.kind === 'match_pairs' || block?.kind === 'find_letter' || block?.kind === 'build_word') && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    {block.kind !== 'vocab_grid' && (
                        <label className="mb-4 block">
                            <span className="font-bold">سؤال النشاط</span>
                            <input
                                className="form-control mt-2"
                                value={block.prompt || block.title || ''}
                                onChange={(e) => patchBlock(activeBlock, { prompt: e.target.value, title: e.target.value })}
                            />
                        </label>
                    )}
                    {block.kind === 'vocab_grid' && (
                        <label className="mb-4 block">
                            <span className="font-bold">عنوان قسم الكلمات</span>
                            <input className="form-control mt-2" value={block.title || ''} onChange={(e) => patchBlock(activeBlock, { title: e.target.value })} />
                        </label>
                    )}
                    <div className="space-y-3">
                        {(block.items || []).map((item, itemIndex) => (
                            <div key={item.id || itemIndex} className="grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[72px_1fr_auto_auto]">
                                <div className="grid place-items-center rounded-xl bg-white p-2">
                                    <LessonIcon name={item.icon} className="h-14 w-14" />
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <label className="text-xs font-bold">
                                        الكلمة
                                        <input
                                            className="form-control mt-1 !py-2"
                                            value={item.label || ''}
                                            onChange={(e) => patchItem(activeBlock, itemIndex, { label: e.target.value })}
                                        />
                                    </label>
                                    <label className="text-xs font-bold">
                                        الشكل
                                        <select
                                            className="form-control mt-1 !py-2"
                                            value={item.icon || 'star'}
                                            onChange={(e) => patchItem(activeBlock, itemIndex, { icon: e.target.value })}
                                        >
                                            {iconNames.map((name) => (
                                                <option key={name} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                {block.kind === 'pick_grid' && (
                                    <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-700">
                                        <input
                                            type="checkbox"
                                            checked={item.starts_with !== false}
                                            onChange={(e) => patchItem(activeBlock, itemIndex, { starts_with: e.target.checked })}
                                        />
                                        إجابة صحيحة
                                    </label>
                                )}
                                <button
                                    type="button"
                                    className="min-h-11 text-sm font-bold text-danger"
                                    onClick={() => patchBlock(activeBlock, { items: (block.items || []).filter((_, i) => i !== itemIndex) })}
                                >
                                    حذف
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm font-bold"
                        onClick={() =>
                            patchBlock(activeBlock, {
                                items: [
                                    ...(block.items || []),
                                    { id: uid('item'), icon: 'star', label: 'كلمة جديدة', starts_with: block.kind !== 'pick_grid' },
                                ],
                            })
                        }
                    >
                        إضافة عنصر
                    </button>
                </div>
            )}

            {block?.kind === 'trace_letter' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="block">
                        <span className="font-bold">تعليمات الكتابة</span>
                        <input className="form-control mt-2" value={block.prompt || ''} onChange={(e) => patchBlock(activeBlock, { prompt: e.target.value })} />
                    </label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <label>
                            <span className="font-bold">الحرف</span>
                            <input className="form-control mt-2" value={block.letter || data.letter} onChange={(e) => patchBlock(activeBlock, { letter: e.target.value })} />
                        </label>
                        <label>
                            <span className="font-bold">عدد الخانات</span>
                            <input
                                type="number"
                                min="1"
                                max="12"
                                className="form-control mt-2"
                                value={block.count || 6}
                                onChange={(e) => patchBlock(activeBlock, { count: Number(e.target.value) || 6 })}
                            />
                        </label>
                    </div>
                </div>
            )}

            {block?.kind === 'writing_workshop' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                    <label className="block">
                        <span className="font-bold">موضوع الكتابة</span>
                        <textarea rows={4} className="form-control mt-2" value={block.prompt || ''} onChange={(e) => patchBlock(activeBlock, { prompt: e.target.value })} />
                    </label>
                    <label className="block">
                        <span className="font-bold">الحد الأدنى للكلمات</span>
                        <input type="number" min="10" max="300" className="form-control mt-2" value={block.min_words || 40} onChange={(e) => patchBlock(activeBlock, { min_words: Number(e.target.value) || 40 })} />
                    </label>
                    <label className="block">
                        <span className="font-bold">معايير التصحيح</span>
                        <input className="form-control mt-2" value={block.rubric || ''} onChange={(e) => patchBlock(activeBlock, { rubric: e.target.value })} />
                    </label>
                </div>
            )}

            {block?.kind === 'voice_reading' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                    <label className="block">
                        <span className="font-bold">تعليمات التسجيل</span>
                        <input className="form-control mt-2" value={block.prompt || ''} onChange={(e) => patchBlock(activeBlock, { prompt: e.target.value })} />
                    </label>
                    <label className="block">
                        <span className="font-bold">النص الذي يقرأه الطالب</span>
                        <textarea rows={4} className="form-control mt-2" value={block.passage || ''} onChange={(e) => patchBlock(activeBlock, { passage: e.target.value })} />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label>
                            <span className="font-bold">النوع</span>
                            <select className="form-control mt-2" value={block.mode || 'reading'} onChange={(e) => patchBlock(activeBlock, { mode: e.target.value })}>
                                <option value="reading">قراءة جهرية</option>
                                <option value="dictation">إملاء مسموع</option>
                            </select>
                        </label>
                        <label>
                            <span className="font-bold">أقصى مدة (ثانية)</span>
                            <input type="number" min="15" max="180" className="form-control mt-2" value={block.max_seconds || 60} onChange={(e) => patchBlock(activeBlock, { max_seconds: Number(e.target.value) || 60 })} />
                        </label>
                    </div>
                </div>
            )}

            {!block && <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">اختر الصف والقالب ليظهر المحتوى.</p>}
        </div>
    );
}
