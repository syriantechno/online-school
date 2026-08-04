import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({
    stats = [],
    recentCourses = [],
    announcements = [],
    enrollments = [],
    roleLabel,
}) {
    const { auth, appName } = usePage().props;

    return (
        <AuthenticatedLayout header="لوحة التحكم">
            <Head title="لوحة التحكم" />

            <div className="mb-5">
                <h2 className="text-lg font-medium text-slate-800">أهلاً {auth.user?.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                    {roleLabel} · {appName || 'المدرسة الإلكترونية'}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="box p-5">
                        <p className="text-xs text-slate-500">{stat.label}</p>
                        <p className="mt-1 text-2xl font-medium text-slate-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {enrollments.length > 0 && (
                <div className="box mt-5 overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h3 className="text-base font-medium text-slate-800">تقدّم دوراتي</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {enrollments.map((e) => (
                            <div key={e.id} className="flex items-center justify-between gap-4 px-5 py-3">
                                <Link href={route('courses.show', e.course_id)} className="text-sm font-medium text-primary hover:underline">
                                    {e.course?.title}
                                </Link>
                                <div className="flex w-40 items-center gap-2">
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-theme-1"
                                            style={{ width: `${e.progress_percent}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-500">{e.progress_percent}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="box overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h3 className="text-base font-medium text-slate-800">أحدث الدورات</h3>
                        <Link href={route('courses.index')} className="text-sm text-primary hover:underline">
                            عرض الكل
                        </Link>
                    </div>
                    {recentCourses.length === 0 ? (
                        <div className="px-5 py-10 text-center text-sm text-slate-500">لا دورات بعد.</div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {recentCourses.map((course) => (
                                <li key={course.id} className="px-5 py-3">
                                    <Link href={route('courses.show', course.id)} className="text-sm font-medium text-primary hover:underline">
                                        {course.title}
                                    </Link>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {course.subject || '—'} · {course.teacher?.name || '—'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="box overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h3 className="text-base font-medium text-slate-800">الإعلانات</h3>
                        <Link href={route('announcements.index')} className="text-sm text-primary hover:underline">
                            الكل
                        </Link>
                    </div>
                    {announcements.length === 0 ? (
                        <div className="px-5 py-10 text-center text-sm text-slate-500">لا إعلانات.</div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {announcements.map((a) => (
                                <li key={a.id} className="px-5 py-3">
                                    <p className="text-sm font-medium text-slate-800">{a.title}</p>
                                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{a.body}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
