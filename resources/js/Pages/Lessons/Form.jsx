import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InteractiveBuilder from '@/Components/InteractiveBuilder';
import ArabicActivityBuilder, { activityTypes } from '@/Components/ArabicActivityBuilder';
import ImageWorksheetBuilder, { emptyPayload as emptyWorksheet } from '@/Components/ImageWorksheetBuilder';
import GeneratedWorksheetBuilder from '@/Components/GeneratedWorksheetBuilder';
import { emptyGeneratedPayload } from '@/Components/LessonAssets';
import InputError from '@/Components/InputError';

const skills = ['الحروف والأصوات', 'القراءة', 'الإملاء', 'المفردات', 'التراكيب', 'القواعد', 'الاستماع', 'المحادثة', 'التعبير الكتابي'];
const steps = [
    ['goal', '1', 'هدف الدرس'],
    ['content', '2', 'المحتوى'],
    ['activity', '3', 'النشاط'],
    ['publish', '4', 'النشر'],
];

export default function Form({ lesson, courses }) {
    const edit = !!lesson;
    const [step, setStep] = useState('goal');
    const initial = lesson?.interactive_payload || { type: 'quiz', skill: 'القراءة', objective: '', questions: [], items: [] };
    const { data, setData, post, put, processing, errors } = useForm({
        course_id: lesson?.course_id || '',
        title: lesson?.title || '',
        content: lesson?.content || '',
        video_url: lesson?.video_url || '',
        duration_minutes: lesson?.duration_minutes || 10,
        sort_order: lesson?.sort_order || 0,
        is_published: lesson?.is_published || false,
        is_interactive: lesson?.is_interactive ?? true,
        stars_reward: lesson?.stars_reward || 3,
        interactive_payload: initial,
    });
    const payload = data.interactive_payload;
    const go = (x) => setStep(x);
    const submit = (e) => {
        e.preventDefault();
        edit ? put(route('lessons.update', lesson.id)) : post(route('lessons.store'));
    };
    const pickType = (type) => {
        if (type === 'image_worksheet') {
            return setData('interactive_payload', { ...emptyWorksheet, ...payload, type, pages: payload.pages || [] });
        }
        if (type === 'generated_worksheet') {
            const generated = emptyGeneratedPayload();
            return setData('interactive_payload', {
                ...generated,
                ...payload,
                type,
                blocks: payload.blocks?.length ? payload.blocks : generated.blocks,
            });
        }
        setData('interactive_payload', { ...payload, type });
    };

    return (
        <AuthenticatedLayout header={edit ? 'تعديل درس عربي' : 'إنشاء درس عربي'}>
            <Head title={edit ? 'تعديل درس' : 'درس جديد'} />
            <form onSubmit={submit} className="mx-auto max-w-5xl">
                <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-l from-blue-700 to-sky-500 p-6 text-white">
                    <h2 className="text-2xl font-black">{edit ? 'طوّر الدرس بسهولة' : 'ابنِ رحلة تعلم ممتعة'}</h2>
                    <p className="mt-2 text-blue-100">أربع خطوات فقط: حدد الهدف، أضف المحتوى، اختر اللعبة، ثم انشر.</p>
                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {steps.map(([key, n, label]) => (
                            <button
                                type="button"
                                key={key}
                                onClick={() => go(key)}
                                className={`min-h-14 rounded-2xl px-3 text-right transition ${step === key ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                <span className="ml-2 inline-grid h-7 w-7 place-items-center rounded-lg bg-current/10 text-sm font-black">{n}</span>
                                <strong className="text-sm">{label}</strong>
                            </button>
                        ))}
                    </div>
                </div>

                {step === 'goal' && (
                    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-black">ما الذي سيتعلمه الطالب؟</h3>
                        <p className="mt-1 text-sm text-slate-500">اختيار المهارة يساعدنا على ترتيب الدرس والتقارير لاحقاً.</p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {skills.map((skill) => (
                                <button
                                    type="button"
                                    key={skill}
                                    onClick={() => setData('interactive_payload', { ...payload, skill })}
                                    className={`min-h-14 rounded-2xl border px-4 font-black transition ${payload.skill === skill ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                        <label className="mt-6 block">
                            <span className="font-bold">هدف الدرس بجملة واحدة</span>
                            <textarea
                                rows="3"
                                className="form-control mt-2"
                                value={payload.objective || ''}
                                onChange={(e) => setData('interactive_payload', { ...payload, objective: e.target.value })}
                                placeholder="مثال: أن يميّز الطالب حرف الباء في أول الكلمة ووسطها وآخرها"
                            />
                        </label>
                        <button type="button" onClick={() => go('content')} className="mt-6 rounded-xl bg-blue-600 px-7 py-3 font-black text-white">
                            التالي: المحتوى
                        </button>
                    </section>
                )}

                {step === 'content' && (
                    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-black">محتوى الدرس</h3>
                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <label>
                                <span className="font-bold">الدورة</span>
                                <select className="form-control mt-2" value={data.course_id} onChange={(e) => setData('course_id', e.target.value)} required>
                                    <option value="">اختر دورة</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.course_id} />
                            </label>
                            <label>
                                <span className="font-bold">عنوان الدرس</span>
                                <input className="form-control mt-2" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="مثال: حرف الباء وصوته" required />
                                <InputError message={errors.title} />
                            </label>
                            <label className="md:col-span-2">
                                <span className="font-bold">شرح مبسّط للطالب</span>
                                <textarea rows="7" className="form-control mt-2" value={data.content} onChange={(e) => setData('content', e.target.value)} placeholder="اكتب الشرح والأمثلة والتعليمات بلغة سهلة..." />
                            </label>
                            <label className="md:col-span-2">
                                <span className="font-bold">رابط الفيديو أو الصوت المرئي (اختياري)</span>
                                <input dir="ltr" className="form-control mt-2" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} placeholder="YouTube, Vimeo, MP4" />
                            </label>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => go('goal')} className="rounded-xl border px-6 py-3 font-bold">
                                السابق
                            </button>
                            <button type="button" onClick={() => go('activity')} className="rounded-xl bg-blue-600 px-7 py-3 font-black text-white">
                                التالي: النشاط
                            </button>
                        </div>
                    </section>
                )}

                {step === 'activity' && (
                    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-xl font-black">اختر طريقة اللعب</h3>
                                <p className="mt-1 text-sm text-slate-500">قوالب مصممة لمهارات اللغة العربية.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Link href={route('lesson-generator.studio')} className="btn-primary">
                                    استوديو الدروس
                                </Link>
                                <Link href={route('worksheets.create')} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                    من صورة
                                </Link>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.is_interactive} onChange={(e) => setData('is_interactive', e.target.checked)} />
                                    نشاط تفاعلي
                                </label>
                            </div>
                        </div>
                        {data.is_interactive && (
                            <>
                                <div className="my-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                                    {activityTypes.map(([type, label]) => (
                                        <button
                                            type="button"
                                            key={type}
                                            onClick={() => pickType(type)}
                                            className={`min-h-16 rounded-2xl border px-3 text-sm font-black ${payload.type === type ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-slate-200'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                {payload.type === 'quiz' ? (
                                    <InteractiveBuilder questions={payload.questions || []} onChange={(questions) => setData('interactive_payload', { ...payload, questions })} />
                                ) : payload.type === 'image_worksheet' ? (
                                    <ImageWorksheetBuilder payload={payload} onChange={(x) => setData('interactive_payload', x)} />
                                ) : payload.type === 'generated_worksheet' ? (
                                    <GeneratedWorksheetBuilder payload={payload} onChange={(x) => setData('interactive_payload', x)} />
                                ) : (
                                    <ArabicActivityBuilder payload={payload} onChange={(x) => setData('interactive_payload', x)} />
                                )}
                            </>
                        )}
                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => go('content')} className="rounded-xl border px-6 py-3 font-bold">
                                السابق
                            </button>
                            <button type="button" onClick={() => go('publish')} className="rounded-xl bg-blue-600 px-7 py-3 font-black text-white">
                                التالي: النشر
                            </button>
                        </div>
                    </section>
                )}

                {step === 'publish' && (
                    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-black">المراجعة والنشر</h3>
                        <div className="mt-6 grid gap-5 sm:grid-cols-3">
                            <label>
                                <span className="font-bold">المدة بالدقائق</span>
                                <input type="number" min="1" className="form-control mt-2" value={data.duration_minutes} onChange={(e) => setData('duration_minutes', e.target.value)} />
                            </label>
                            <label>
                                <span className="font-bold">نجوم المكافأة</span>
                                <input type="number" min="1" max="20" className="form-control mt-2" value={data.stars_reward} onChange={(e) => setData('stars_reward', e.target.value)} />
                            </label>
                            <label>
                                <span className="font-bold">ترتيب الدرس</span>
                                <input type="number" min="0" className="form-control mt-2" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
                            </label>
                        </div>
                        <label className="mt-6 flex min-h-14 items-center gap-3 rounded-2xl bg-emerald-50 px-5 font-black text-emerald-800">
                            <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                            نشر الدرس وإتاحته للطلاب
                        </label>
                        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                            <p className="text-sm font-bold text-blue-700">ملخص</p>
                            <h4 className="mt-2 text-lg font-black">{data.title || 'بدون عنوان'}</h4>
                            <p className="mt-1 text-sm text-slate-600">
                                {payload.skill} · {activityTypes.find((x) => x[0] === payload.type)?.[1]} · {data.stars_reward} نجوم
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => go('activity')} className="rounded-xl border px-6 py-3 font-bold">
                                السابق
                            </button>
                            <button disabled={processing} className="rounded-xl bg-emerald-600 px-8 py-3 font-black text-white disabled:opacity-50">
                                {edit ? 'حفظ التغييرات' : 'إنشاء الدرس'}
                            </button>
                        </div>
                    </section>
                )}
            </form>
        </AuthenticatedLayout>
    );
}
