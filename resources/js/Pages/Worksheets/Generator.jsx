import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ImageWorksheetBuilder, { emptyPayload } from '@/Components/ImageWorksheetBuilder';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

const skills = ['الحروف والأصوات', 'القراءة', 'الإملاء', 'المفردات', 'التراكيب', 'القواعد', 'الاستماع', 'المحادثة', 'التعبير الكتابي'];

const Icon = ({ d }) => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

export default function Generator({ lesson, courses, recent = [] }) {
    const edit = !!lesson;
    const initial = {
        ...emptyPayload,
        ...(lesson?.interactive_payload || {}),
        type: 'image_worksheet',
        pages: lesson?.interactive_payload?.pages || [],
    };

    const { data, setData, post, put, processing, errors } = useForm({
        course_id: lesson?.course_id || '',
        title: lesson?.title || '',
        content: lesson?.content || '',
        duration_minutes: lesson?.duration_minutes || 10,
        sort_order: lesson?.sort_order || 0,
        is_published: lesson?.is_published || false,
        stars_reward: lesson?.stars_reward || 3,
        interactive_payload: initial,
    });

    const payload = data.interactive_payload;
    const zoneCount = (payload.pages || []).reduce((sum, page) => sum + (page.zones?.length || 0), 0);

    const submit = (event) => {
        event.preventDefault();
        if (edit) {
            put(route('worksheets.update', lesson.id));
            return;
        }
        post(route('worksheets.store'));
    };

    return (
        <AuthenticatedLayout header={edit ? 'تعديل درس بالصورة' : 'مولد دروس الصور'}>
            <Head title={edit ? 'تعديل ورقة نشاط' : 'مولد دروس الصور'} />

            <section className="relative mb-5 overflow-hidden rounded-xl bg-gradient-to-l from-rose-600 to-pink-400 px-5 py-7 text-white shadow-lg md:px-8">
                <div
                    className="pointer-events-none absolute inset-0 opacity-15"
                    style={{ backgroundImage: 'radial-gradient(circle at 18px 18px, white 2px, transparent 2px)', backgroundSize: '36px 36px' }}
                />
                <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-bold">أنت تتحكم بمكان الإجابة</span>
                        <h1 className="mt-3 text-2xl font-black md:text-3xl">{edit ? 'عدّل مناطق الإجابة على الورقة' : 'حوّل ورقة النشاط إلى درس تفاعلي'}</h1>
                        <p className="mt-2 max-w-2xl text-base leading-8 text-white/90">
                            ارفع صورة التمرين كما هي، ثم ارسم مربعاً فوق كل إجابة. حرّك المربع أو اضبط موقعه بالأرقام حتى يطابق الكلمة أو الحرف تماماً.
                        </p>
                    </div>
                    <div className="flex min-h-16 items-center gap-3 rounded-2xl bg-white/15 px-5 py-3 text-sm font-bold">
                        <Icon d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        {payload.pages?.length || 0} صور · {zoneCount} إجابات
                    </div>
                </div>
            </section>

            {!edit && recent.length > 0 && (
                <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <h2 className="mb-3 text-sm font-black text-slate-700">دروس صوّرتها سابقاً</h2>
                    <div className="flex flex-wrap gap-2">
                        {recent.map((item) => (
                            <Link
                                key={item.id}
                                href={route('worksheets.edit', item.id)}
                                className="min-h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold hover:border-primary hover:text-primary"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-black">بيانات الدرس</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <label>
                            <span className="font-bold">الدورة</span>
                            <select className="form-control mt-2" value={data.course_id} onChange={(e) => setData('course_id', e.target.value)} required>
                                <option value="">اختر دورة</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.course_id} />
                        </label>
                        <label>
                            <span className="font-bold">عنوان الدرس</span>
                            <input
                                className="form-control mt-2"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="مثال: قصة حرف الباء"
                                required
                            />
                            <InputError message={errors.title} />
                        </label>
                    </div>
                    <div className="mt-4">
                        <span className="font-bold">المهارة</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <button
                                    type="button"
                                    key={skill}
                                    onClick={() => setData('interactive_payload', { ...payload, skill })}
                                    className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${
                                        payload.skill === skill ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200'
                                    }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                    <label className="mt-4 block">
                        <span className="font-bold">هدف الدرس</span>
                        <input
                            className="form-control mt-2"
                            value={payload.objective || ''}
                            onChange={(e) => setData('interactive_payload', { ...payload, objective: e.target.value })}
                            placeholder="مثال: أن يميّز الطالب الكلمات التي تبدأ بحرف ب"
                        />
                    </label>
                    <label className="mt-4 block">
                        <span className="font-bold">شرح قصير (اختياري)</span>
                        <textarea
                            rows={3}
                            className="form-control mt-2"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="يظهر فوق ورقة النشاط للطالب"
                        />
                    </label>
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-black">الصور وأماكن الإجابة</h2>
                    <p className="mt-1 text-sm text-slate-500">ارسم المربع فوق الكلمة أو الصورة أو سطر الكتابة تماماً كما تريد أن يجيب الطالب.</p>
                    <div className="mt-5">
                        <ImageWorksheetBuilder payload={payload} onChange={(next) => setData('interactive_payload', next)} />
                    </div>
                    <InputError message={errors['interactive_payload.pages'] || errors.interactive_payload} />
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-black">النشر</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
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
                    <label className="mt-5 flex min-h-14 items-center gap-3 rounded-2xl bg-emerald-50 px-5 font-black text-emerald-800">
                        <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                        نشر الدرس وإتاحته للطلاب
                    </label>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button disabled={processing || !payload.pages?.length} className="min-h-12 rounded-xl bg-emerald-600 px-8 py-3 font-black text-white disabled:opacity-50">
                            {edit ? 'حفظ الورقة' : 'إنشاء الدرس'}
                        </button>
                        <Link href={route('lessons.index')} className="inline-flex min-h-12 items-center rounded-xl border px-6 font-bold">
                            إلغاء
                        </Link>
                    </div>
                </section>
            </form>
        </AuthenticatedLayout>
    );
}
