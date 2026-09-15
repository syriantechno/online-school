import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GeneratedWorksheetBuilder from '@/Components/GeneratedWorksheetBuilder';
import GeneratedWorksheetPlayer from '@/Components/GeneratedWorksheetPlayer';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import {
    ARABIC_LETTERS,
    buildGeneratedWorksheet,
    countGeneratedAnswers,
    emptyGeneratedPayload,
} from '@/Components/LessonAssets';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const STAGES = [
    { id: 'foundation', title: 'تأسيس / صغار', hint: 'حروف وقصة وأنشطة لطيفة', grade: 1, letter: true },
    { id: 'primary', title: 'ابتدائي', hint: 'مهارات قراءة وكتابة', grade: 3, letter: true },
    { id: 'middle', title: 'متوسط', hint: 'نصوص وفهم', grade: 5, letter: false },
    { id: 'prep', title: 'إعدادي', hint: 'نحو وتعبير', grade: 7, letter: false },
    { id: 'secondary', title: 'ثانوي', hint: 'بلاغة وكتابة', grade: 8, letter: false },
    { id: 'mastery', title: 'إتقان', hint: 'قراءة مسموعة وثقة', grade: 9, letter: false, focus: 'voice_reading' },
];

const FOCUS = [
    { id: 'auto', title: 'تلقائي كامل', hint: 'درس جاهز مناسب للمرحلة' },
    { id: 'reading', title: 'قراءة وفهم', hint: 'نص + أسئلة أو قصة للصغار' },
    { id: 'grammar', title: 'نحو ولغة', hint: 'جمل وتراكيب حسب المرحلة' },
    { id: 'writing', title: 'كتابة', hint: 'ورشة كتابة موجّهة' },
    { id: 'voice', title: 'قراءة صوتية', hint: 'تسجيل صوت يُرسل للمعلّم' },
];

const QUICK_STEPS = [
    { n: 1, label: 'الدورة' },
    { n: 2, label: 'المرحلة' },
    { n: 3, label: 'إنشاء' },
];

function pickLetter() {
    const list = ARABIC_LETTERS || ['أ', 'ب', 'ت', 'م', 'ن', 'س'];
    return list[Math.floor(Math.random() * list.length)] || 'ب';
}

function resolveTemplate(stage, focusId) {
    if (stage.focus) return stage.focus;
    if (focusId === 'voice') return 'voice_reading';
    if (stage.grade <= 3) {
        if (focusId === 'reading') return 'letter_story';
        if (focusId === 'writing') return 'trace_only';
        return 'grade_track';
    }
    if (focusId === 'reading') return 'text_lab';
    if (focusId === 'grammar') return 'grammar_fix';
    if (focusId === 'writing') return 'writing_workshop';
    return 'grade_track';
}

function OptionCard({ selected, onClick, title, hint, meta }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3.5 text-right transition ${
                selected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
        >
            <span className={`text-sm font-bold ${selected ? 'text-primary' : 'text-slate-800'}`}>{title}</span>
            {hint ? <span className="text-xs leading-5 text-slate-500">{hint}</span> : null}
            {meta ? <span className="mt-1 text-[11px] font-medium text-slate-400">{meta}</span> : null}
        </button>
    );
}

/**
 * استوديو الدروس — إنشاء سريع + مولد تفاعلي كامل في مكان واحد.
 */
export default function Studio({ lesson = null, courses = [], recent = [], initialMode = null }) {
    const edit = !!lesson;
    const initialPayload =
        lesson?.interactive_payload?.type === 'generated_worksheet'
            ? lesson.interactive_payload
            : emptyGeneratedPayload();

    const [mode, setMode] = useState(() => {
        if (edit) return 'editor';
        if (initialMode === 'editor' || initialMode === 'quick') return initialMode;
        return 'quick';
    });
    const [step, setStep] = useState(1);
    const [courseId, setCourseId] = useState(
        lesson?.course_id ? String(lesson.course_id) : courses[0]?.id ? String(courses[0].id) : '',
    );
    const [stageId, setStageId] = useState('foundation');
    const [focusId, setFocusId] = useState('auto');
    const [letter, setLetter] = useState(() => pickLetter());
    const [preview, setPreview] = useState(false);

    const stage = STAGES.find((item) => item.id === stageId) || STAGES[0];

    const quickPayload = useMemo(() => {
        const template = resolveTemplate(stage, focusId);
        return buildGeneratedWorksheet({
            template,
            grade_level: stage.grade,
            letter: stage.letter ? letter : 'ب',
            theme: 'clay_pink',
        });
    }, [stage, focusId, letter]);

    const { data, setData, post, put, processing, errors } = useForm({
        course_id: lesson?.course_id || courseId || '',
        title: lesson?.title || initialPayload.title || 'درس عربي تفاعلي',
        content: lesson?.content || '',
        duration_minutes: lesson?.duration_minutes || 12,
        sort_order: lesson?.sort_order || 0,
        is_published: lesson?.is_published ?? true,
        stars_reward: lesson?.stars_reward || 3,
        interactive_payload: initialPayload,
    });

    const payload = data.interactive_payload;
    const answers = countGeneratedAnswers(payload);
    const courseTitle = courses.find((c) => String(c.id) === String(courseId || data.course_id))?.title || '';

    const applyQuickPayload = (nextPayload, nextCourseId = courseId) => {
        setData({
            ...data,
            course_id: nextCourseId,
            title: nextPayload.title || `درس عربي · الصف ${nextPayload.grade_level || stage.grade}`,
            duration_minutes: (nextPayload.grade_level || stage.grade) <= 3 ? 12 : 18,
            interactive_payload: nextPayload,
        });
    };

    const syncAndNext = () => {
        applyQuickPayload(quickPayload, courseId);
        setStep(3);
    };

    const openInEditor = (fromQuick = false) => {
        if (fromQuick) {
            applyQuickPayload(quickPayload, courseId);
        }
        setMode('editor');
        setPreview(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const syncTitle = (nextPayload) => {
        const suggested = nextPayload.title || `درس عربي · الصف ${nextPayload.grade_level || 1}`;
        const keepTitle =
            data.title
            && !String(data.title).startsWith('رحلة حرف')
            && !String(data.title).startsWith('مغامرة حرف')
            && !String(data.title).includes('· الصف');
        setData({
            ...data,
            title: keepTitle ? data.title : suggested,
            interactive_payload: nextPayload,
        });
    };

    const submit = (event) => {
        event.preventDefault();
        if (edit) {
            put(route('lesson-generator.update', lesson.id), { preserveScroll: true });
            return;
        }
        post(route('lesson-generator.store'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={edit ? 'تعديل درس' : 'استوديو الدروس'}>
            <Head title={edit ? 'تعديل درس' : 'استوديو الدروس'} />

            <div className="mx-auto max-w-6xl space-y-5">
                {/* رأس الاستوديو */}
                <div className="box overflow-hidden p-0">
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-primary">Studio Creator</p>
                            <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                                {edit ? 'تعديل درس تفاعلي' : 'أنشئ درساً عربياً احترافياً'}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                إنشاء سريع للمعلّم، ومحرر كامل للتحكم بكل جزء — في مكان واحد.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route('question-bank.index')}
                                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                بنك الأسئلة
                            </Link>
                            <Link
                                href={route('worksheets.create')}
                                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                من صورة
                            </Link>
                            <Link
                                href={route('lessons.index')}
                                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                كل الدروس
                            </Link>
                        </div>
                    </div>

                    {!edit && (
                        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-slate-100">
                            <button
                                type="button"
                                onClick={() => setMode('quick')}
                                className={`cursor-pointer px-4 py-3.5 text-sm font-bold transition sm:px-6 ${
                                    mode === 'quick' ? 'bg-primary/5 text-primary' : 'bg-white text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                إنشاء سريع
                                <span className="mt-0.5 block text-xs font-medium text-slate-400">3 خطوات جاهزة</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => openInEditor(mode === 'quick' && step >= 2)}
                                className={`cursor-pointer px-4 py-3.5 text-sm font-bold transition sm:px-6 ${
                                    mode === 'editor' ? 'bg-primary/5 text-primary' : 'bg-white text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                المولّد الكامل
                                <span className="mt-0.5 block text-xs font-medium text-slate-400">صف · قالب · تعديل أجزاء</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* دروس حديثة */}
                {!edit && recent.length > 0 && mode === 'quick' && step === 1 && (
                    <div className="box p-4 sm:p-5">
                        <h2 className="mb-3 text-sm font-bold text-slate-700">دروس حديثة من الاستوديو</h2>
                        <div className="flex flex-wrap gap-2">
                            {recent.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('lesson-generator.edit', item.id)}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary/40 hover:text-primary"
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* ——— إنشاء سريع ——— */}
                {mode === 'quick' && !edit && (
                    <>
                        <div className="box overflow-hidden p-0">
                            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100">
                                {QUICK_STEPS.map((item) => {
                                    const active = step === item.n;
                                    const done = step > item.n;
                                    return (
                                        <div
                                            key={item.n}
                                            className={`flex items-center gap-3 px-3 py-4 sm:px-5 ${
                                                active ? 'bg-primary/5' : done ? 'bg-emerald-50/60' : 'bg-white'
                                            }`}
                                        >
                                            <span
                                                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                                                    active
                                                        ? 'bg-primary text-white'
                                                        : done
                                                          ? 'bg-emerald-500 text-white'
                                                          : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {done ? '✓' : item.n}
                                            </span>
                                            <p className={`truncate text-sm font-bold ${active ? 'text-primary' : 'text-slate-700'}`}>
                                                {item.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {step === 1 && (
                            <section className="box p-5 sm:p-6">
                                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">اختر الدورة</h2>
                                        <p className="mt-1 text-sm text-slate-500">الدرس يُضاف لهذه الدورة.</p>
                                    </div>
                                    <Link href={route('courses.create')} className="text-sm font-medium text-primary hover:underline">
                                        + دورة جديدة
                                    </Link>
                                </div>

                                {courses.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                                        <p className="text-sm text-slate-500">ما عندك دورة بعد.</p>
                                        <Link href={route('courses.create')} className="btn-primary mt-4 inline-flex">
                                            أنشئ دورة أولاً
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {courses.map((course) => (
                                            <OptionCard
                                                key={course.id}
                                                selected={String(courseId) === String(course.id)}
                                                onClick={() => setCourseId(String(course.id))}
                                                title={course.title}
                                                hint={course.subject || 'عربية'}
                                                meta={course.level || 'بدون مستوى محدد'}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                                    <button
                                        type="button"
                                        onClick={() => openInEditor(false)}
                                        className="cursor-pointer text-sm font-medium text-slate-500 hover:text-primary"
                                    >
                                        تفضّل المولّد الكامل؟
                                    </button>
                                    <PrimaryButton type="button" disabled={!courseId} onClick={() => setStep(2)}>
                                        التالي — المرحلة
                                    </PrimaryButton>
                                </div>
                            </section>
                        )}

                        {step === 2 && (
                            <section className="box p-5 sm:p-6">
                                <div className="mb-5">
                                    <h2 className="text-lg font-bold text-slate-800">المرحلة ونوع الدرس</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        الدورة: <span className="font-medium text-slate-700">{courseTitle}</span>
                                    </p>
                                </div>

                                <h3 className="mb-3 text-sm font-bold text-slate-700">المرحلة</h3>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {STAGES.map((item) => (
                                        <OptionCard
                                            key={item.id}
                                            selected={stageId === item.id}
                                            onClick={() => setStageId(item.id)}
                                            title={item.title}
                                            hint={item.hint}
                                            meta={`صف تقريبي ${item.grade}`}
                                        />
                                    ))}
                                </div>

                                <h3 className="mb-3 mt-6 text-sm font-bold text-slate-700">تركيز الدرس</h3>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {FOCUS.map((item) => (
                                        <OptionCard
                                            key={item.id}
                                            selected={focusId === item.id}
                                            onClick={() => setFocusId(item.id)}
                                            title={item.title}
                                            hint={item.hint}
                                        />
                                    ))}
                                </div>

                                {stage.letter && (
                                    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="text-sm font-bold text-slate-700">الحرف (للصغار)</h3>
                                            <button
                                                type="button"
                                                onClick={() => setLetter(pickLetter())}
                                                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                                            >
                                                عشوائي
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(ARABIC_LETTERS || []).slice(0, 14).map((ch) => (
                                                <button
                                                    key={ch}
                                                    type="button"
                                                    onClick={() => setLetter(ch)}
                                                    className={`grid h-10 w-10 cursor-pointer place-items-center rounded-lg border text-base font-bold ${
                                                        letter === ch
                                                            ? 'border-primary bg-primary text-white'
                                                            : 'border-slate-200 bg-white text-slate-700'
                                                    }`}
                                                >
                                                    {ch}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"
                                    >
                                        رجوع
                                    </button>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openInEditor(true)}
                                            className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-primary/40"
                                        >
                                            عدّل في المولّد
                                        </button>
                                        <PrimaryButton type="button" onClick={syncAndNext}>
                                            معاينة وإنشاء
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                                <section className="box space-y-5 p-5 sm:p-6">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">راجع وأنشئ</h2>
                                        <p className="mt-1 text-sm text-slate-500">أو انقل المحتوى للمولّد الكامل للتعديل.</p>
                                    </div>

                                    <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-800">الدورة:</span> {courseTitle}
                                        </p>
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-800">المرحلة:</span> {stage.title}
                                        </p>
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-800">الأجزاء:</span> {payload.blocks?.length || 0}
                                        </p>
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-800">إجابات:</span> {answers}
                                        </p>
                                    </div>

                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">عنوان الدرس</span>
                                        <input
                                            className="form-control mt-2"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.title} className="mt-1" />
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-primary focus:ring-primary/20"
                                            checked={!!data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                        />
                                        انشر مباشرة للطلاب
                                    </label>

                                    <InputError message={errors.course_id} />
                                    <InputError message={errors.interactive_payload} />

                                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"
                                        >
                                            رجوع
                                        </button>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openInEditor(false)}
                                                className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                                            >
                                                المولّد الكامل
                                            </button>
                                            <PrimaryButton type="submit" disabled={processing}>
                                                {processing ? 'جارٍ الإنشاء…' : 'أنشئ الدرس الآن'}
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </section>

                                <aside className="box p-5 sm:p-6">
                                    <h3 className="mb-4 text-sm font-bold text-slate-800">محتوى الدرس للطالب</h3>
                                    <ol className="space-y-2">
                                        {(payload.blocks || []).map((block, index) => (
                                            <li key={block.id || index} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                                                <p className="text-sm font-medium text-slate-800">
                                                    <span className="me-1 text-slate-400">{index + 1}.</span>
                                                    {block.title || block.kind}
                                                </p>
                                                {block.prompt ? (
                                                    <p className="mt-1 text-xs leading-5 text-slate-500">{block.prompt}</p>
                                                ) : null}
                                            </li>
                                        ))}
                                    </ol>
                                </aside>
                            </form>
                        )}
                    </>
                )}

                {/* ——— المولّد الكامل (مولد الدروس القديم) ——— */}
                {(mode === 'editor' || edit) && (
                    <form onSubmit={submit} className="space-y-5">
                        {!edit && recent.length > 0 && (
                            <div className="box p-4 sm:p-5">
                                <h2 className="mb-3 text-sm font-bold text-slate-700">دروس حديثة</h2>
                                <div className="flex flex-wrap gap-2">
                                    {recent.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route('lesson-generator.edit', item.id)}
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary"
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <section className="box p-5 sm:p-6">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">بيانات الدرس</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        الصف {payload.grade_level || 1} · {payload.blocks?.length || 0} أجزاء · {answers} إجابات
                                    </p>
                                </div>
                                {!edit && (
                                    <button
                                        type="button"
                                        onClick={() => setMode('quick')}
                                        className="cursor-pointer text-sm font-medium text-slate-500 hover:text-primary"
                                    >
                                        ← إنشاء سريع
                                    </button>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <label>
                                    <span className="text-sm font-medium text-slate-700">الدورة</span>
                                    <select
                                        className="form-control mt-2"
                                        value={data.course_id}
                                        onChange={(e) => {
                                            setData('course_id', e.target.value);
                                            setCourseId(e.target.value);
                                        }}
                                        required
                                    >
                                        <option value="">اختر دورة</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.course_id} className="mt-1" />
                                </label>
                                <label>
                                    <span className="text-sm font-medium text-slate-700">عنوان الدرس</span>
                                    <input
                                        className="form-control mt-2"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="مثال: مختبر النص — الصف 7"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-1" />
                                </label>
                            </div>

                            <label className="mt-4 block">
                                <span className="text-sm font-medium text-slate-700">شرح قصير (اختياري)</span>
                                <textarea
                                    rows={3}
                                    className="form-control mt-2"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="اختياري — يظهر ضمن الشرح الإضافي"
                                />
                            </label>
                        </section>

                        <section className="box p-5 sm:p-6">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">توليد المحتوى</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        اختر الصف والقالب وعدّل الأجزاء. الطالب يرى الأنشطة والتسجيل الصوتي.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPreview((value) => !value)}
                                    className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    {preview ? 'إخفاء المعاينة' : 'معاينة كطالب'}
                                </button>
                            </div>

                            {preview ? (
                                <GeneratedWorksheetPlayer payload={payload} />
                            ) : (
                                <GeneratedWorksheetBuilder
                                    payload={payload}
                                    onChange={(next) => {
                                        if (
                                            next.letter !== payload.letter
                                            || next.template !== payload.template
                                            || Number(next.grade_level) !== Number(payload.grade_level)
                                        ) {
                                            syncTitle(next);
                                            return;
                                        }
                                        setData('interactive_payload', next);
                                    }}
                                />
                            )}
                            <InputError
                                message={errors['interactive_payload.blocks'] || errors.interactive_payload}
                                className="mt-2"
                            />
                        </section>

                        <section className="box p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-slate-800">النشر</h2>
                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                <label>
                                    <span className="text-sm font-medium text-slate-700">المدة بالدقائق</span>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control mt-2"
                                        value={data.duration_minutes}
                                        onChange={(e) => setData('duration_minutes', e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span className="text-sm font-medium text-slate-700">نجوم المكافأة</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className="form-control mt-2"
                                        value={data.stars_reward}
                                        onChange={(e) => setData('stars_reward', e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span className="text-sm font-medium text-slate-700">ترتيب الدرس</span>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control mt-2"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', e.target.value)}
                                    />
                                </label>
                            </div>

                            <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-emerald-50 px-4 text-sm font-bold text-emerald-800">
                                <input
                                    type="checkbox"
                                    className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-200"
                                    checked={!!data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                />
                                نشر الدرس وإتاحته للطلاب
                            </label>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <PrimaryButton type="submit" disabled={processing || !payload.blocks?.length}>
                                    {processing ? 'جارٍ الحفظ…' : edit ? 'حفظ الدرس' : 'إنشاء الدرس'}
                                </PrimaryButton>
                                <Link
                                    href={route('lessons.index')}
                                    className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    إلغاء
                                </Link>
                            </div>
                        </section>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
