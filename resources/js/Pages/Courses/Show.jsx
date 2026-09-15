import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/Components/ConfirmDialog';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';

function Stars({ value }) {
    return <span className="text-amber-500">{'★'.repeat(value)}{'☆'.repeat(5 - value)}</span>;
}

export default function Show({
    course,
    canManage,
    isEnrolled,
    enrollment,
    canEnroll,
    averageReview = 0,
    reviewsCount = 0,
    myReview = null,
    reviews = [],
}) {
    const reviewForm = useForm({
        stars: myReview?.stars || 5,
        comment: myReview?.comment || '',
    });

    return (
        <AuthenticatedLayout header={course.title}>
            <Head title={course.title} />

            <div className="space-y-5">
                <div className="box p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-medium text-slate-800">{course.title}</h1>
                            <p className="mt-2 text-slate-600">{course.description || 'بدون وصف'}</p>
                            <p className="mt-3 text-sm text-slate-500">
                                المعلم: {course.teacher?.name || '—'} · {course.subject || '—'} · {course.level || '—'}
                            </p>
                            <p className="mt-2 text-sm text-amber-600">
                                <Stars value={Math.round(averageReview) || 0} /> {averageReview || '—'} ({reviewsCount} تقييم)
                            </p>
                            {isEnrolled && enrollment && (
                                <div className="mt-4 max-w-sm">
                                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                                        <span>تقدّمك</span>
                                        <span>{enrollment.progress_percent}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-l from-theme-1 to-theme-2"
                                            style={{ width: `${enrollment.progress_percent}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(isEnrolled || canManage) && (
                                <>
                                    {isEnrolled && (
                                        <Link href={route('courses.path', course.id)} className="rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                                            مسار التعلم
                                        </Link>
                                    )}
                                    <Link href={route('discussions.index', course.id)} className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                        منتدى النقاش
                                    </Link>
                                    <Link href={`${route('exams.index')}?course=${course.id}`} className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                        الفحوصات
                                    </Link>
                                </>
                            )}
                            {canEnroll && !isEnrolled && (
                                <PrimaryButton onClick={() => router.post(route('courses.enroll', course.id))}>
                                    التسجيل في الدورة
                                </PrimaryButton>
                            )}
                            {canEnroll && isEnrolled && (
                                <button
                                    type="button"
                                    className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                    onClick={async () => await confirmAction({ message: 'سيتم إلغاء تسجيلك في هذه الدورة.', variant: 'danger', confirmLabel: 'نعم، ألغِ التسجيل' }) && router.delete(route('courses.unenroll', course.id))}
                                >
                                    إلغاء التسجيل
                                </button>
                            )}
                            {canManage && (
                                <>
                                    <Link href={route('courses.gradebook', course.id)} className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                        دفتر الدرجات
                                    </Link>
                                    <Link href={route('courses.edit', course.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">
                                        تعديل
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    {course.cover_url && (
                        <img src={course.cover_url} alt="" className="mt-5 h-48 w-full rounded-xl object-cover" />
                    )}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <section className="box p-5">
                        <h2 className="mb-3 font-medium text-slate-800">الدروس</h2>
                        {course.lessons?.length ? (
                            <ul className="space-y-2">
                                {course.lessons.map((lesson) => (
                                    <li key={lesson.id}>
                                        <Link href={route('lessons.show', lesson.id)} className="text-sm text-primary hover:underline">
                                            {lesson.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500">لا دروس بعد.</p>
                        )}
                    </section>

                    <section className="box p-5">
                        <h2 className="mb-3 font-medium text-slate-800">الكتب</h2>
                        {course.books?.length ? (
                            <ul className="space-y-2">
                                {course.books.map((book) => (
                                    <li key={book.id}>
                                        <Link href={route('books.show', book.id)} className="text-sm text-primary hover:underline">
                                            {book.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500">لا كتب مرتبطة.</p>
                        )}
                    </section>
                </div>

                {isEnrolled && canEnroll && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            reviewForm.post(route('courses.reviews.store', course.id), { preserveScroll: true });
                        }}
                        className="box space-y-3 p-5"
                    >
                        <h3 className="font-medium text-slate-800">{myReview ? 'تعديل تقييمك' : 'قيّم الدورة'}</h3>
                        <select
                            className="form-control"
                            value={reviewForm.data.stars}
                            onChange={(e) => reviewForm.setData('stars', Number(e.target.value))}
                        >
                            {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>{n} نجوم</option>
                            ))}
                        </select>
                        <textarea
                            className="form-control"
                            rows={2}
                            placeholder="اكتب رأيك (اختياري)"
                            value={reviewForm.data.comment}
                            onChange={(e) => reviewForm.setData('comment', e.target.value)}
                        />
                        <PrimaryButton disabled={reviewForm.processing}>حفظ التقييم</PrimaryButton>
                    </form>
                )}

                {reviews.length > 0 && (
                    <section className="box overflow-hidden">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <h3 className="font-medium text-slate-800">آراء الطلاب</h3>
                        </div>
                        <ul className="divide-y divide-slate-100">
                            {reviews.map((r) => (
                                <li key={r.id} className="px-5 py-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-slate-800">{r.user?.name}</p>
                                        <Stars value={r.stars} />
                                    </div>
                                    {r.comment && <p className="mt-1 text-sm text-slate-500">{r.comment}</p>}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
