import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ summary = {}, courseStats = [], progressBuckets = [], topStudents = [] }) {
    const maxBucket = Math.max(...progressBuckets.map((b) => b.value), 1);

    const cards = [
        ['الدورات', summary.courses],
        ['الطلاب', summary.students],
        ['التسجيلات', summary.enrollments],
        ['متوسط التقدّم', `${summary.avgProgress ?? 0}%`],
        ['واجبات بانتظار التصحيح', summary.pendingSubmissions],
        ['حضور هذا الأسبوع', summary.attendanceWeek],
        ['الشهادات', summary.certificates],
        ['إكمالات الدروس', summary.completions],
    ];

    return (
        <AuthenticatedLayout header="التقارير والتحليلات">
            <Head title="التقارير والتحليلات" />

            <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map(([label, value]) => (
                    <div key={label} className="box p-5">
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="mt-1 text-2xl font-medium text-slate-800">{value}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="box p-5">
                    <h2 className="mb-4 font-medium text-slate-800">توزيع التقدّم</h2>
                    <div className="space-y-3">
                        {progressBuckets.map((b) => (
                            <div key={b.label}>
                                <div className="mb-1 flex justify-between text-xs text-slate-500">
                                    <span>{b.label}</span>
                                    <span>{b.value}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-l from-theme-1 to-theme-2"
                                        style={{ width: `${(b.value / maxBucket) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="box overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h2 className="font-medium text-slate-800">أبرز الطلاب</h2>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {topStudents.map((row) => (
                            <li key={row.user?.id} className="flex items-center justify-between gap-3 px-5 py-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{row.user?.name}</p>
                                    <p className="text-xs text-slate-400">{row.courses_count} دورات · {row.user?.stars ?? 0} نجوم</p>
                                </div>
                                <span className="text-sm font-medium text-primary">{row.avg_progress}%</span>
                            </li>
                        ))}
                        {topStudents.length === 0 && (
                            <li className="px-5 py-8 text-center text-sm text-slate-500">لا بيانات بعد.</li>
                        )}
                    </ul>
                </section>
            </div>

            <section className="box mt-5 overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="font-medium text-slate-800">أداء الدورات</h2>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>الدورة</th>
                            <th>الطلاب</th>
                            <th>الدروس</th>
                            <th>الواجبات</th>
                            <th>متوسط التقدّم</th>
                            <th>مكتملون</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseStats.map((c) => (
                            <tr key={c.id}>
                                <td className="font-medium text-slate-800">{c.title}</td>
                                <td>{c.enrollments_count}</td>
                                <td>{c.lessons_count}</td>
                                <td>{c.assignments_count}</td>
                                <td>{c.avg_progress}%</td>
                                <td>{c.completed}</td>
                                <td>
                                    <Link href={route('courses.gradebook', c.id)} className="text-sm text-primary hover:underline">
                                        دفتر الدرجات
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {courseStats.length === 0 && (
                    <p className="p-8 text-center text-sm text-slate-500">لا دورات بعد.</p>
                )}
            </section>
        </AuthenticatedLayout>
    );
}
