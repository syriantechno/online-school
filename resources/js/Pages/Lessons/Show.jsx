import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import InteractiveQuiz from '@/Components/InteractiveQuiz';
import ArabicActivityPlayer from '@/Components/ArabicActivityPlayer';
import ImageWorksheetPlayer from '@/Components/ImageWorksheetPlayer';
import GeneratedWorksheetPlayer from '@/Components/GeneratedWorksheetPlayer';
import CourseLessonPath, { CourseLessonPathPanel } from '@/Components/CourseLessonPath';
import PrimaryButton from '@/Components/PrimaryButton';
import VideoPlayer from '@/Components/VideoPlayer';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Show({
    lesson,
    completed,
    enrolled,
    canComplete,
    note = null,
    canTakeNotes = false,
    canManage = false,
    audioSubmissions = [],
    publicMode = false,
    courseSlug = null,
    lessonPath = [],
    nextLessonId = null,
}) {
    const activityType = lesson.interactive_payload?.type;
    const hasQuiz = lesson.is_interactive && (lesson.interactive_payload?.questions?.length || 0) > 0;
    const hasWorksheet = lesson.is_interactive && activityType === 'image_worksheet';
    const hasGenerated = lesson.is_interactive && activityType === 'generated_worksheet';
    const hasArabicActivity = lesson.is_interactive && activityType && !['quiz', 'image_worksheet', 'generated_worksheet'].includes(activityType);
    const hasActivity = hasGenerated || hasWorksheet || hasArabicActivity || hasQuiz;
    const [showExtras, setShowExtras] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

    const slug = courseSlug || lesson.course?.slug;
    const courseHref = slug ? route('explore.show', slug) : null;

    const noteForm = useForm({
        body: note?.body || '',
        is_bookmarked: note?.is_bookmarked || false,
    });

    const bankForm = useForm({
        lesson_id: lesson.id,
        max: 12,
        also_exam: true,
        exam_title: `فحص · ${lesson.title}`,
    });

    const completeLesson = (payload = {}) => {
        router.post(route('lessons.complete', lesson.id), payload, { preserveScroll: true });
    };

    const learn = (lessonId) => (slug ? route('explore.learn', { course: slug, lesson: lessonId }) : null);

    const lessonMain = (
        <>
            {!publicMode && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0 text-sm font-bold text-slate-500">
                        <Link href={route('lessons.index')} className="text-primary hover:underline">الدروس</Link>
                        <span className="mx-1 text-slate-400">/</span>
                        <span>{lesson.course?.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {lesson.duration_minutes && (
                            <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-sm">{lesson.duration_minutes} د</span>
                        )}
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 shadow-sm">{lesson.stars_reward || 2} ★</span>
                        {completed && <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">مكتمل ✓</span>}
                    </div>
                </div>
            )}

            {publicMode && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">{lesson.title}</h1>
                        <p className="mt-1 text-sm font-bold text-slate-500">{lesson.course?.title}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {lesson.duration_minutes && (
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{lesson.duration_minutes} د</span>
                        )}
                        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">{lesson.stars_reward || 2} ★</span>
                        {completed && <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">مكتمل ✓</span>}
                    </div>
                </div>
            )}

            {!enrolled && canComplete && (
                <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                    سجّل في الدورة أولاً لإكمال الدرس.
                    {courseHref && (
                        <>
                            {' '}
                            <Link href={courseHref} className="font-black underline">عرض الدورة</Link>
                        </>
                    )}
                </p>
            )}

            {canManage && hasGenerated && !publicMode && (
                <section className="box mb-4 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">ولّد أسئلة للبنك من هذا الدرس</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                يستخرج أسئلة من القصة والكلمات وأنشطة الدرس، ويحفظها في بنك الأسئلة. يمكن إنشاء مسودة فحص للمراجعة.
                            </p>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                bankForm.post(route('question-bank.from-lesson'));
                            }}
                            className="flex shrink-0 flex-wrap items-center gap-2"
                        >
                            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={!!bankForm.data.also_exam}
                                    onChange={(e) => bankForm.setData('also_exam', e.target.checked)}
                                />
                                + مسودة فحص
                            </label>
                            <PrimaryButton type="submit" disabled={bankForm.processing}>
                                {bankForm.processing ? 'جارٍ التوليد…' : 'ولّد الأسئلة'}
                            </PrimaryButton>
                        </form>
                    </div>
                    {bankForm.errors.lesson_id && (
                        <p className="mt-3 text-sm font-medium text-rose-600">{bankForm.errors.lesson_id}</p>
                    )}
                </section>
            )}

            {hasActivity ? (
                <section className="mb-4">
                    {hasGenerated && (
                        <GeneratedWorksheetPlayer
                            payload={lesson.interactive_payload}
                            lessonId={lesson.id}
                            canUpload={enrolled && canComplete}
                            onComplete={({ score, total }) => {
                                if (enrolled && canComplete) completeLesson({ score, total });
                            }}
                        />
                    )}
                    {hasWorksheet && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <ImageWorksheetPlayer
                                payload={lesson.interactive_payload}
                                onComplete={({ score, total }) => {
                                    if (enrolled && canComplete) completeLesson({ score, total });
                                }}
                            />
                        </div>
                    )}
                    {hasArabicActivity && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <ArabicActivityPlayer
                                payload={lesson.interactive_payload}
                                onComplete={({ score, total }) => {
                                    if (enrolled && canComplete) completeLesson({ score, total });
                                }}
                            />
                        </div>
                    )}
                    {hasQuiz && !hasGenerated && !hasWorksheet && !hasArabicActivity && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <InteractiveQuiz
                                payload={lesson.interactive_payload}
                                onComplete={({ score, total }) => {
                                    if (enrolled && canComplete) completeLesson({ score, total });
                                }}
                            />
                        </div>
                    )}
                </section>
            ) : (
                <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    {lesson.content ? (
                        <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{lesson.content}</div>
                    ) : (
                        <p className="text-sm text-slate-500">لا يوجد محتوى لهذا الدرس بعد.</p>
                    )}
                    {enrolled && canComplete && !completed && (
                        <div className="mt-4 flex justify-end">
                            <PrimaryButton onClick={() => completeLesson()}>إكمال الدرس</PrimaryButton>
                        </div>
                    )}
                </section>
            )}

            <div className="flex flex-wrap gap-2">
                {(lesson.video_url || lesson.content) && (
                    <button
                        type="button"
                        onClick={() => setShowExtras((value) => !value)}
                        className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600"
                    >
                        {showExtras ? 'إخفاء الشرح/الفيديو' : 'عرض الشرح/الفيديو'}
                    </button>
                )}
                {canTakeNotes && enrolled && (
                    <button
                        type="button"
                        onClick={() => setShowNotes((value) => !value)}
                        className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600"
                    >
                        {showNotes ? 'إخفاء الملاحظات' : 'ملاحظاتي'}
                    </button>
                )}
                {publicMode && courseHref && (
                    <Link href={courseHref} className="min-h-9 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-black text-blue-700">
                        ← رجوع للدورة
                    </Link>
                )}
            </div>

            {showExtras && (
                <div className="mt-3 space-y-3">
                    {lesson.video_url && <VideoPlayer url={lesson.video_url} title="فيديو الدرس" />}
                    {lesson.content && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h2 className="mb-2 text-sm font-bold text-slate-800">شرح إضافي</h2>
                            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{lesson.content}</div>
                        </div>
                    )}
                </div>
            )}

            {showNotes && canTakeNotes && enrolled && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        noteForm.post(route('lessons.notes.store', lesson.id), { preserveScroll: true });
                    }}
                    className="mt-3 space-y-2.5 rounded-xl border border-slate-200 bg-white p-4"
                >
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-bold text-slate-800">ملاحظاتي</h2>
                        {!publicMode && <Link href={route('notes.index')} className="text-xs text-primary hover:underline">كل الملاحظات</Link>}
                    </div>
                    <textarea
                        className="form-control !py-2.5"
                        rows={3}
                        placeholder="اكتب ملاحظة سريعة..."
                        value={noteForm.data.body}
                        onChange={(e) => noteForm.setData('body', e.target.value)}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={noteForm.data.is_bookmarked}
                                onChange={(e) => noteForm.setData('is_bookmarked', e.target.checked)}
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            مفضلة
                        </label>
                        <PrimaryButton disabled={noteForm.processing}>حفظ</PrimaryButton>
                    </div>
                </form>
            )}

            {canManage && audioSubmissions.length > 0 && (
                <section className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                    <h2 className="text-sm font-bold text-slate-800">تسجيلات الطلاب الصوتية</h2>
                    {audioSubmissions.map((item) => (
                        <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-bold text-slate-800">{item.user?.name || 'طالب'}</p>
                                <span className="text-xs text-slate-500">{item.status === 'graded' ? `مقيّم: ${item.score}/10` : 'بانتظار التقييم'}</span>
                            </div>
                            {item.file_url && (
                                <audio className="mb-3 w-full" controls src={item.file_url}>
                                    لا يدعم المتصفح الصوت
                                </audio>
                            )}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const fd = new FormData(e.currentTarget);
                                    router.post(route('lessons.audio.grade', [lesson.id, item.id]), {
                                        score: fd.get('score'),
                                        teacher_feedback: fd.get('teacher_feedback'),
                                    }, { preserveScroll: true });
                                }}
                                className="grid gap-2 sm:grid-cols-[100px_1fr_auto]"
                            >
                                <input name="score" type="number" min="0" max="10" defaultValue={item.score ?? 8} className="form-control !py-2" required />
                                <input name="teacher_feedback" defaultValue={item.teacher_feedback || ''} placeholder="ملاحظة للمعلم" className="form-control !py-2" />
                                <PrimaryButton>حفظ التقييم</PrimaryButton>
                            </form>
                        </div>
                    ))}
                </section>
            )}

            {completed && (
                <div className="mt-4 space-y-3">
                    <p className="text-sm font-bold text-emerald-600">أكملت هذا الدرس — أحسنت! ✦</p>
                    {publicMode && nextLessonId && nextLessonId !== lesson.id && learn(nextLessonId) && (
                        <Link
                            href={learn(nextLessonId)}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-6 text-sm font-black text-slate-900 shadow-sm transition hover:bg-amber-300"
                        >
                            الدرس التالي ←
                        </Link>
                    )}
                </div>
            )}
        </>
    );

    const dashboardBody = (
        <div className="mx-auto max-w-5xl">{lessonMain}</div>
    );

    const publicBody = (
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-7 lg:px-10">
            <div className="mb-4 text-sm font-bold text-slate-500">
                <Link href={route('explore.index')} className="text-blue-700 hover:underline">الدورات</Link>
                <span className="mx-2">/</span>
                {courseHref ? (
                    <Link href={courseHref} className="text-blue-700 hover:underline">{lesson.course?.title}</Link>
                ) : (
                    <span>{lesson.course?.title}</span>
                )}
                <span className="mx-2">/</span>
                <span className="text-slate-700">{lesson.title}</span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="min-w-0">{lessonMain}</div>
                {slug && lessonPath.length > 0 && (
                    <aside className="lg:sticky lg:top-[100px] lg:self-start">
                        <CourseLessonPathPanel title="مسار الدروس" subtitle="بالترتيب — أكمل للفتح">
                            <CourseLessonPath courseSlug={slug} lessons={lessonPath} currentLessonId={lesson.id} />
                        </CourseLessonPathPanel>
                    </aside>
                )}
            </div>
        </div>
    );

    if (publicMode) {
        return (
            <PublicSiteLayout>
                <Head title={lesson.title} />
                {publicBody}
            </PublicSiteLayout>
        );
    }

    return (
        <AuthenticatedLayout header={lesson.title}>
            <Head title={lesson.title} />
            {dashboardBody}
        </AuthenticatedLayout>
    );
}
