import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/Components/ConfirmDialog';
import InputLabel from '@/Components/InputLabel';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const types = {
    single: 'اختيار واحد',
    multiple: 'اختيارات متعددة',
    true_false: 'صح أو خطأ',
    short: 'إجابة قصيرة',
};
const difficulties = { easy: 'سهل', medium: 'متوسط', hard: 'متقدم' };
const difficultyStyle = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    hard: 'bg-rose-50 text-rose-700 border-rose-200',
};

const Icon = ({ path, className = 'h-5 w-5' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

export default function Index({ items, courses, studioLessons = [], filters, skills, stats }) {
    const [tab, setTab] = useState('bank');
    const question = useForm({
        course_id: '', lesson_id: '', grade_level: '', skill: 'قواعد', difficulty: 'medium',
        type: 'single', prompt: '', options: ['', '', '', ''], correct_answers: ['0'],
        points: 1, explanation: '', is_active: true,
    });
    const generator = useForm({
        target: 'exam', course_id: '', lesson_id: '', title: '', count: 5,
        difficulty: '', skill: '', duration_minutes: 20, pass_percent: 60,
    });
    const fromLesson = useForm({
        lesson_id: '',
        max: 12,
        also_exam: true,
        exam_title: '',
    });

    const questionLessons = useMemo(() => courses.find((c) => String(c.id) === String(question.data.course_id))?.lessons || [], [courses, question.data.course_id]);
    const generatorLessons = useMemo(() => courses.find((c) => String(c.id) === String(generator.data.course_id))?.lessons || [], [courses, generator.data.course_id]);

    const submitQuestion = (event) => {
        event.preventDefault();
        question.post(route('question-bank.store'), {
            preserveScroll: true,
            onSuccess: () => question.reset('prompt', 'explanation'),
        });
    };

    const submitGenerator = (event) => {
        event.preventDefault();
        generator.post(route('question-bank.generate'));
    };

    const submitFromLesson = (event) => {
        event.preventDefault();
        fromLesson.post(route('question-bank.from-lesson'));
    };

    const applyFilters = (patch) => router.get(route('question-bank.index'), { ...filters, ...patch }, { preserveState: true, replace: true });

    return (
        <AuthenticatedLayout header="بنك الأسئلة الذكي">
            <Head title="بنك الأسئلة" />

            <section className="relative mb-5 overflow-hidden rounded-xl bg-gradient-to-b from-theme-1 to-theme-2 px-5 py-7 text-white shadow-lg md:px-8">
                <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 2px)', backgroundSize: '38px 38px' }} />
                <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div>
                        <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-bold">من الدرس إلى الفحص</span>
                        <h1 className="mt-3 text-2xl font-black md:text-3xl">استخرج أسئلة من دروس الاستوديو</h1>
                        <p className="mt-2 max-w-2xl text-base leading-8 text-white/85">
                            ولّد أسئلة تلقائياً من محتوى الدرس، خزّنها في البنك، وأنشئ مسودة فحص للمراجعة قبل النشر.
                        </p>
                    </div>
                    <button type="button" onClick={() => setTab('from-lesson')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-black text-theme-1 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/40">
                        <Icon path="M12 4.5v15m7.5-7.5h-15" /> من درس الاستوديو
                    </button>
                </div>
            </section>

            <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    ['كل الأسئلة', stats.total, 'M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5'],
                    ['أسئلة سهلة', stats.easy, 'M4.5 12.75l6 6 9-13.5'],
                    ['مستوى متوسط', stats.medium, 'M12 6v6l4 2'],
                    ['أسئلة متقدمة', stats.hard, 'M12 3l1.9 5.8H20l-4.95 3.6 1.9 5.8L12 14.6 7.05 18.2l1.9-5.8L4 8.8h6.1L12 3z'],
                ].map(([label, value, path]) => (
                    <div key={label} className="box flex items-center gap-4 p-4 shadow-sm">
                        <span className="grid h-12 w-12 place-items-center rounded-lg bg-theme-1/10 text-theme-1"><Icon path={path} /></span>
                        <div><p className="text-sm font-bold text-slate-500">{label}</p><p className="text-2xl font-black text-slate-900">{value}</p></div>
                    </div>
                ))}
            </div>

            <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm" role="tablist">
                {[
                    ['bank', 'تصفح البنك'],
                    ['from-lesson', 'من درس'],
                    ['add', 'إضافة سؤال'],
                    ['generate', 'فحص / واجب'],
                ].map(([id, label]) => (
                    <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`min-h-11 rounded-lg px-5 py-2.5 font-black transition ${tab === id ? 'bg-theme-1 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</button>
                ))}
            </div>

            {tab === 'from-lesson' && (
                <form onSubmit={submitFromLesson} className="box mx-auto max-w-3xl overflow-hidden">
                    <div className="border-b border-slate-100 bg-gradient-to-l from-theme-1/10 to-transparent p-6">
                        <h2 className="text-xl font-black text-slate-900">توليد أسئلة من درس الاستوديو</h2>
                        <p className="mt-1 text-sm font-bold text-slate-500">
                            النظام يقرأ القصة والكلمات والأسئلة داخل الدرس ويحوّلها لأسئلة بنك جاهزة.
                        </p>
                    </div>
                    <div className="grid gap-4 p-5 md:p-7">
                        {studioLessons.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                <p className="text-sm font-bold text-slate-600">ما في دروس تفاعلية بعد من الاستوديو.</p>
                                <Link href={route('lesson-generator.studio')} className="mt-3 inline-flex font-black text-theme-1 hover:underline">
                                    افتح استوديو الدروس
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Field label="اختر الدرس">
                                    <select
                                        required
                                        className="form-control"
                                        value={fromLesson.data.lesson_id}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            const lesson = studioLessons.find((l) => String(l.id) === String(id));
                                            fromLesson.setData({
                                                ...fromLesson.data,
                                                lesson_id: id,
                                                exam_title: lesson ? `فحص · ${lesson.title}` : '',
                                            });
                                        }}
                                    >
                                        <option value="">درس من الاستوديو…</option>
                                        {studioLessons.map((lesson) => (
                                            <option key={lesson.id} value={lesson.id}>
                                                {lesson.course_title} — {lesson.title}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="أقصى عدد أسئلة">
                                    <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        className="form-control"
                                        value={fromLesson.data.max}
                                        onChange={(e) => fromLesson.setData('max', e.target.value)}
                                    />
                                </Field>
                                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-emerald-50 px-4 text-sm font-black text-emerald-800">
                                    <input
                                        type="checkbox"
                                        checked={!!fromLesson.data.also_exam}
                                        onChange={(e) => fromLesson.setData('also_exam', e.target.checked)}
                                    />
                                    أنشئ مسودة فحص من الأسئلة المستخرجة
                                </label>
                                {fromLesson.data.also_exam && (
                                    <Field label="عنوان الفحص">
                                        <input
                                            className="form-control"
                                            value={fromLesson.data.exam_title}
                                            onChange={(e) => fromLesson.setData('exam_title', e.target.value)}
                                            placeholder="فحص · عنوان الدرس"
                                        />
                                    </Field>
                                )}
                                <Errors bag={fromLesson.errors} />
                                <div className="flex flex-wrap justify-end gap-3">
                                    <Link href={route('lesson-generator.studio')} className="inline-flex min-h-12 items-center rounded-lg border px-5 font-bold text-slate-600">
                                        استوديو الدروس
                                    </Link>
                                    <button
                                        disabled={fromLesson.processing || !fromLesson.data.lesson_id}
                                        className="min-h-12 rounded-lg bg-theme-1 px-8 py-3 font-black text-white shadow-md disabled:opacity-60"
                                    >
                                        {fromLesson.processing ? 'جارٍ التوليد…' : 'ولّد الأسئلة الآن'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
            )}

            {tab === 'bank' && (
                <section>
                    <div className="box mb-4 grid gap-3 p-4 md:grid-cols-5">
                        <input aria-label="بحث في الأسئلة" className="form-control md:col-span-2" placeholder="ابحث في نص السؤال…" defaultValue={filters.search || ''} onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search: e.currentTarget.value })} />
                        <select aria-label="تصفية حسب الدورة" className="form-control" value={filters.course_id || ''} onChange={(e) => applyFilters({ course_id: e.target.value })}>
                            <option value="">كل الدورات</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                        <select aria-label="تصفية حسب الصعوبة" className="form-control" value={filters.difficulty || ''} onChange={(e) => applyFilters({ difficulty: e.target.value })}>
                            <option value="">كل المستويات</option>{Object.entries(difficulties).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                        <select aria-label="تصفية حسب النوع" className="form-control" value={filters.type || ''} onChange={(e) => applyFilters({ type: e.target.value })}>
                            <option value="">كل الأنواع</option>{Object.entries(types).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                        {items.data.map((item) => (
                            <article key={item.id} className="box group p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`rounded-md border px-2.5 py-1 text-xs font-black ${difficultyStyle[item.difficulty]}`}>{difficulties[item.difficulty]}</span>
                                        <span className="rounded-md bg-theme-1/10 px-2.5 py-1 text-xs font-black text-theme-1">{types[item.type]}</span>
                                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{item.skill}</span>
                                    </div>
                                    <button type="button" aria-label="حذف السؤال" className="grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" onClick={async () => await confirmAction({ message: 'حذف السؤال من البنك؟', variant: 'danger' }) && router.delete(route('question-bank.destroy', item.id), { preserveScroll: true })}>
                                        <Icon path="M14.74 9l-.35 9m-4.78 0L9.26 9m9.97-3.21c.35.05.7.1 1.04.16m-1.04-.16L18.16 19.67A2.25 2.25 0 0115.92 21H8.08a2.25 2.25 0 01-2.24-2.08L4.77 5.79m14.46 0a48.1 48.1 0 00-3.48-.4m-10.98.4c.35-.05.7-.1 1.04-.16m0 0a48.1 48.1 0 013.48-.4m6.46.16V4.48c0-1.18-.91-2.16-2.09-2.2a52.8 52.8 0 00-3.32 0c-1.18.04-2.09 1.02-2.09 2.2v.91m7.5 0a48.7 48.7 0 00-7.5 0" />
                                    </button>
                                </div>
                                <h2 className="mt-4 text-lg font-black leading-8 text-slate-900">{item.prompt}</h2>
                                {item.options?.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2">{item.options.map((option, index) => <span key={index} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-600">{String.fromCharCode(65 + index)}. {option}</span>)}</div>}
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm font-bold text-slate-500">
                                    <span>{item.course?.title || 'سؤال عام'} {item.lesson ? `• ${item.lesson.title}` : ''}</span>
                                    <span>استُخدم {item.times_used} مرة • {item.points} درجة</span>
                                </div>
                            </article>
                        ))}
                    </div>
                    {items.data.length === 0 && <div className="box p-10 text-center"><p className="text-lg font-black text-slate-700">لا توجد أسئلة بهذه الفلاتر</p><button className="mt-3 font-black text-theme-1" onClick={() => setTab('from-lesson')}>ولّد من درس</button></div>}
                    {items.links?.length > 3 && <div className="mt-5 flex flex-wrap justify-center gap-2">{items.links.map((link, i) => link.url ? <Link key={i} href={link.url} className={`rounded-md px-3 py-2 text-sm font-bold ${link.active ? 'bg-theme-1 text-white' : 'bg-white text-slate-600'}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : null)}</div>}
                </section>
            )}

            {tab === 'add' && (
                <form onSubmit={submitQuestion} className="box mx-auto max-w-5xl p-5 md:p-7">
                    <div className="mb-6"><h2 className="text-xl font-black text-slate-900">أضف سؤالاً إلى البنك</h2><p className="mt-1 text-sm font-bold text-slate-500">التصنيف الدقيق يجعل التوليد التلقائي أفضل.</p></div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="الدورة (اختياري)"><select className="form-control" value={question.data.course_id} onChange={(e) => { question.setData('course_id', e.target.value); question.setData('lesson_id', ''); }}><option value="">سؤال عام</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></Field>
                        <Field label="الدرس (اختياري)"><select className="form-control" value={question.data.lesson_id} onChange={(e) => question.setData('lesson_id', e.target.value)} disabled={!question.data.course_id}><option value="">كل دروس الدورة</option>{questionLessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}</select></Field>
                        <Field label="المهارة"><input className="form-control" value={question.data.skill} onChange={(e) => question.setData('skill', e.target.value)} placeholder="مثال: إملاء، قواعد، فهم مقروء" required /></Field>
                        <Field label="الصف"><input className="form-control" value={question.data.grade_level} onChange={(e) => question.setData('grade_level', e.target.value)} placeholder="مثال: الصف الثالث" /></Field>
                        <Field label="نوع السؤال"><select className="form-control" value={question.data.type} onChange={(e) => question.setData('type', e.target.value)}>{Object.entries(types).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
                        <Field label="الصعوبة"><select className="form-control" value={question.data.difficulty} onChange={(e) => question.setData('difficulty', e.target.value)}>{Object.entries(difficulties).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
                        <div className="md:col-span-2"><Field label="نص السؤال"><textarea className="form-control" rows="3" value={question.data.prompt} onChange={(e) => question.setData('prompt', e.target.value)} required /></Field></div>

                        {!['short', 'true_false'].includes(question.data.type) && <div className="md:col-span-2 grid gap-3 sm:grid-cols-2">{question.data.options.map((option, index) => <label key={index} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2"><input type={question.data.type === 'multiple' ? 'checkbox' : 'radio'} name="correct-answer" checked={question.data.correct_answers.includes(String(index))} onChange={() => question.setData('correct_answers', question.data.type === 'multiple' ? (question.data.correct_answers.includes(String(index)) ? question.data.correct_answers.filter((v) => v !== String(index)) : [...question.data.correct_answers, String(index)]) : [String(index)])} /><input aria-label={`الخيار ${index + 1}`} className="min-w-0 flex-1 border-0 bg-transparent focus:ring-0" value={option} onChange={(e) => { const next = [...question.data.options]; next[index] = e.target.value; question.setData('options', next); }} placeholder={`الخيار ${index + 1}`} /></label>)}</div>}
                        {question.data.type === 'true_false' && <Field label="الإجابة الصحيحة"><select className="form-control" value={question.data.correct_answers[0] || '0'} onChange={(e) => question.setData('correct_answers', [e.target.value])}><option value="0">صح</option><option value="1">خطأ</option></select></Field>}
                        <Field label="درجة السؤال"><input type="number" min="1" max="100" className="form-control" value={question.data.points} onChange={(e) => question.setData('points', e.target.value)} /></Field>
                        <div className="md:col-span-2"><Field label="شرح الإجابة (يظهر بعد التصحيح)"><textarea className="form-control" rows="2" value={question.data.explanation} onChange={(e) => question.setData('explanation', e.target.value)} /></Field></div>
                    </div>
                    <Errors bag={question.errors} />
                    <div className="mt-6 flex justify-end"><button disabled={question.processing} className="min-h-12 rounded-lg bg-theme-1 px-7 py-3 font-black text-white shadow-md transition hover:bg-theme-2 disabled:opacity-60">حفظ في بنك الأسئلة</button></div>
                </form>
            )}

            {tab === 'generate' && (
                <form onSubmit={submitGenerator} className="box mx-auto max-w-4xl overflow-hidden">
                    <div className="border-b border-slate-100 bg-gradient-to-l from-theme-1/10 to-transparent p-6"><h2 className="text-xl font-black text-slate-900">مولّد النماذج التلقائي</h2><p className="mt-1 text-sm font-bold text-slate-500">سيتم إنشاء مسودة فقط، ولن تصل للطلاب قبل مراجعتك ونشرها.</p></div>
                    <div className="grid gap-4 p-5 md:grid-cols-2 md:p-7">
                        <div className="md:col-span-2 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-2">
                            {[['exam', 'فحص قابل للتصحيح التلقائي'], ['assignment', 'واجب بأسئلة جاهزة']].map(([value, label]) => <button type="button" key={value} onClick={() => generator.setData('target', value)} className={`min-h-12 rounded-lg px-3 font-black transition ${generator.data.target === value ? 'bg-theme-1 text-white shadow-md' : 'bg-white text-slate-600'}`}>{label}</button>)}
                        </div>
                        <Field label="الدورة"><select required className="form-control" value={generator.data.course_id} onChange={(e) => { generator.setData('course_id', e.target.value); generator.setData('lesson_id', ''); }}><option value="">اختر الدورة</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></Field>
                        <Field label="الدرس"><select className="form-control" value={generator.data.lesson_id} onChange={(e) => generator.setData('lesson_id', e.target.value)} disabled={!generator.data.course_id}><option value="">كل دروس الدورة</option>{generatorLessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}</select></Field>
                        <div className="md:col-span-2"><Field label="عنوان النموذج"><input required className="form-control" value={generator.data.title} onChange={(e) => generator.setData('title', e.target.value)} placeholder="مثال: مراجعة الوحدة الأولى" /></Field></div>
                        <Field label="عدد الأسئلة"><input type="number" min="1" max="50" className="form-control" value={generator.data.count} onChange={(e) => generator.setData('count', e.target.value)} /></Field>
                        <Field label="الصعوبة"><select className="form-control" value={generator.data.difficulty} onChange={(e) => generator.setData('difficulty', e.target.value)}><option value="">مستويات متنوعة</option>{Object.entries(difficulties).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
                        <Field label="المهارة"><select className="form-control" value={generator.data.skill} onChange={(e) => generator.setData('skill', e.target.value)}><option value="">مهارات متنوعة</option>{skills.map((skill) => <option key={skill} value={skill}>{skill}</option>)}</select></Field>
                        {generator.data.target === 'exam' && <><Field label="المدة بالدقائق"><input type="number" min="1" className="form-control" value={generator.data.duration_minutes} onChange={(e) => generator.setData('duration_minutes', e.target.value)} /></Field><Field label="نسبة النجاح"><input type="number" min="1" max="100" className="form-control" value={generator.data.pass_percent} onChange={(e) => generator.setData('pass_percent', e.target.value)} /></Field></>}
                        <div className="md:col-span-2 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-bold leading-7 text-blue-800">بعد الإنشاء ستنتقل مباشرة إلى صفحة المعاينة. تستطيع حذف سؤال أو إضافة سؤال جديد ثم نشر النموذج.</div>
                        <Errors bag={generator.errors} />
                        <div className="md:col-span-2 flex justify-end"><button disabled={generator.processing} className="min-h-12 rounded-lg bg-theme-1 px-8 py-3 font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60">{generator.processing ? 'جارٍ التجهيز…' : 'إنشاء المسودة ومعاينتها'}</button></div>
                    </div>
                </form>
            )}
        </AuthenticatedLayout>
    );
}

function Field({ label, children }) {
    return <div><InputLabel value={label} /><div className="mt-1.5">{children}</div></div>;
}

function Errors({ bag }) {
    const values = Object.values(bag || {});
    return values.length ? <div className="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{values[0]}</div> : null;
}
