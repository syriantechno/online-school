import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';

export default function MyLearning({ continueItems = [], pendingAssignments = [], pendingExams = [], stats = {} }) {
    return (
        <AuthenticatedLayout header="تعلّمي">
            <Head title="تعلّمي" />

            <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <div className="box p-5">
                    <p className="text-xs text-slate-500">دوراتي</p>
                    <p className="mt-1 text-2xl font-medium text-slate-800">{stats.courses ?? 0}</p>
                </div>
                <div className="box p-5">
                    <p className="text-xs text-slate-500">مكتملة</p>
                    <p className="mt-1 text-2xl font-medium text-slate-800">{stats.completed ?? 0}</p>
                </div>
                <div className="box p-5">
                    <p className="text-xs text-slate-500">متوسط التقدّم</p>
                    <p className="mt-1 text-2xl font-medium text-slate-800">{stats.avg_progress ?? 0}%</p>
                </div>
            </div>

            <section className="box mb-5 overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="font-medium text-slate-800">تابع من حيث توقفت</h2>
                </div>
                {continueItems.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-500">
                        لا دورات بعد.{' '}
                        <Link href={route('courses.index')} className="text-primary hover:underline">تصفّح الدورات</Link>
                    </p>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {continueItems.map((item) => (
                            <div key={item.enrollment.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                                <div className="min-w-0 flex-1">
                                    <Link href={route('courses.show', item.course.id)} className="font-medium text-primary hover:underline">
                                        {item.course.title}
                                    </Link>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {item.course.teacher?.name} · التقدّم {item.enrollment.progress_percent}%
                                    </p>
                                    <div className="mt-2 h-2 max-w-xs overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-l from-theme-1 to-theme-2"
                                            style={{ width: `${item.enrollment.progress_percent}%` }}
                                        />
                                    </div>
                                    {item.next_lesson && (
                                        <p className="mt-2 text-sm text-slate-600">التالي: {item.next_lesson.title}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('courses.path', item.course.id)} className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                        المسار
                                    </Link>
                                    {item.next_lesson ? (
                                        <Link href={route('lessons.show', item.next_lesson.id)} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white">
                                            متابعة
                                        </Link>
                                    ) : (
                                        <Link href={route('certificates.index')} className="rounded-md bg-success px-3 py-2 text-sm font-medium text-white">
                                            الشهادة
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="box overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h2 className="font-medium text-slate-800">واجبات معلّقة</h2>
                        <Link href={route('assignments.index')} className="text-sm text-primary hover:underline">الكل</Link>
                    </div>
                    {pendingAssignments.length === 0 ? (
                        <p className="p-8 text-center text-sm text-slate-500">لا واجبات معلّقة. أحسنت!</p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {pendingAssignments.map((a) => (
                                <li key={a.id} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{a.title}</p>
                                        <p className="text-xs text-slate-500">{a.course?.title}</p>
                                    </div>
                                    <Link href={route('assignments.show', a.id)}>
                                        <PrimaryButton>تسليم</PrimaryButton>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="box overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h2 className="font-medium text-slate-800">فحوصات بانتظارك</h2>
                        <Link href={route('exams.index')} className="text-sm text-primary hover:underline">الكل</Link>
                    </div>
                    {pendingExams.length === 0 ? (
                        <p className="p-8 text-center text-sm text-slate-500">لا فحوصات معلّقة حالياً.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {pendingExams.map((exam) => (
                                <li key={exam.id} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{exam.title}</p>
                                        <p className="text-xs text-slate-500">
                                            {exam.course?.title}
                                            {exam.duration_minutes ? ` · ${exam.duration_minutes} د` : ''}
                                            {` · ${exam.questions_count || 0} سؤال`}
                                        </p>
                                    </div>
                                    <Link href={route('exams.show', exam.id)}>
                                        <PrimaryButton>ابدأ</PrimaryButton>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

