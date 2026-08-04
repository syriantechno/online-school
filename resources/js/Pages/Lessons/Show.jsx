import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InteractiveQuiz from '@/Components/InteractiveQuiz';
import PrimaryButton from '@/Components/PrimaryButton';
import VideoPlayer from '@/Components/VideoPlayer';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Show({ lesson, completed, enrolled, canComplete, note = null, canTakeNotes = false }) {
    const hasQuiz = lesson.is_interactive && (lesson.interactive_payload?.questions?.length || 0) > 0;

    const noteForm = useForm({
        body: note?.body || '',
        is_bookmarked: note?.is_bookmarked || false,
    });

    const completeLesson = (payload = {}) => {
        router.post(route('lessons.complete', lesson.id), payload, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={lesson.title}>
            <Head title={lesson.title} />

            <article className="mx-auto max-w-3xl space-y-5">
                <div className="box p-6">
                    <p className="text-sm text-slate-500">{lesson.course?.title}</p>
                    <h1 className="mt-1 text-2xl font-medium text-slate-800">{lesson.title}</h1>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {lesson.is_interactive && (
                            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                درس تفاعلي
                            </span>
                        )}
                        {lesson.duration_minutes && (
                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                {lesson.duration_minutes} دقيقة
                            </span>
                        )}
                        <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                            {lesson.stars_reward || 2} نجوم
                        </span>
                        {completed && (
                            <span className="rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                                مكتمل
                            </span>
                        )}
                    </div>

                    {!enrolled && canComplete && (
                        <p className="mt-4 rounded-box border border-pending/20 bg-pending/5 px-4 py-3 text-sm text-pending">
                            سجّل في الدورة أولاً لتتمكن من إكمال الدرس والحصول على النجوم.
                            {lesson.course?.id && (
                                <>
                                    {' '}
                                    <Link href={route('courses.show', lesson.course.id)} className="underline">
                                        عرض الدورة
                                    </Link>
                                </>
                            )}
                        </p>
                    )}
                </div>

                {lesson.video_url && <VideoPlayer url={lesson.video_url} title="فيديو الدرس" />}

                <div className="box p-6">
                    <h2 className="mb-3 text-lg font-medium text-slate-800">شرح الدرس</h2>
                    <div className="whitespace-pre-wrap leading-8 text-slate-700">
                        {lesson.content || 'لا يوجد محتوى نصي لهذا الدرس.'}
                    </div>
                </div>

                {canTakeNotes && enrolled && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            noteForm.post(route('lessons.notes.store', lesson.id), { preserveScroll: true });
                        }}
                        className="box space-y-3 p-5"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-lg font-medium text-slate-800">ملاحظاتي</h2>
                            <Link href={route('notes.index')} className="text-xs text-primary hover:underline">كل الملاحظات</Link>
                        </div>
                        <textarea
                            className="form-control"
                            rows={4}
                            placeholder="اكتب ملاحظاتك على هذا الدرس..."
                            value={noteForm.data.body}
                            onChange={(e) => noteForm.setData('body', e.target.value)}
                        />
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={noteForm.data.is_bookmarked}
                                onChange={(e) => noteForm.setData('is_bookmarked', e.target.checked)}
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            إضافة للمفضلة
                        </label>
                        <PrimaryButton disabled={noteForm.processing}>حفظ الملاحظة</PrimaryButton>
                    </form>
                )}

                {hasQuiz ? (
                    <div className="box p-5">
                        <InteractiveQuiz
                            payload={lesson.interactive_payload}
                            onComplete={({ score, total }) => {
                                if (enrolled && canComplete) {
                                    completeLesson({ score, total });
                                }
                            }}
                        />
                    </div>
                ) : (
                    enrolled && canComplete && !completed && (
                        <div className="box flex items-center justify-between gap-3 p-5">
                            <p className="text-sm text-slate-600">أنهيت مشاهدة الدرس؟ سجّل إكماله لتحصل على النجوم.</p>
                            <PrimaryButton onClick={() => completeLesson()}>إكمال الدرس</PrimaryButton>
                        </div>
                    )
                )}

                {completed && (
                    <div className="rounded-box border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
                        أكملت هذا الدرس مسبقاً.
                    </div>
                )}

                <Link href={route('lessons.index')} className="inline-block text-sm text-primary hover:underline">
                    العودة للدروس
                </Link>
            </article>
        </AuthenticatedLayout>
    );
}
