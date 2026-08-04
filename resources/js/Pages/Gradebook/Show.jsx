import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function statusLabel(status) {
    return {
        graded: 'مصحّح',
        submitted: 'مُسلَّم',
        returned: 'معاد',
        missing: '—',
    }[status] || status;
}

export default function Show({ course, assignments = [], exams = [], rows = [], stats = {} }) {
    return (
        <AuthenticatedLayout header={`دفتر الدرجات · ${course.title}`}>
            <Head title={`دفتر الدرجات · ${course.title}`} />

            <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                    ['الطلاب', stats.students],
                    ['الواجبات', stats.assignments],
                    ['الفحوصات', stats.exams],
                    ['متوسط التقدّم', `${stats.avgProgress ?? 0}%`],
                    ['متوسط الدرجات', stats.avgGrade != null ? `${stats.avgGrade}%` : '—'],
                ].map(([label, value]) => (
                    <div key={label} className="box p-5">
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="mt-1 text-2xl font-medium text-slate-800">{value}</p>
                    </div>
                ))}
            </div>

            <div className="box overflow-x-auto">
                <table className="data-table min-w-full">
                    <thead>
                        <tr>
                            <th className="sticky right-0 bg-slate-50">الطالب</th>
                            <th>التقدّم</th>
                            {assignments.map((a) => (
                                <th key={`a-${a.id}`} title={a.title}>
                                    <span className="line-clamp-2 max-w-[8rem]">{a.title}</span>
                                    <span className="mt-0.5 block text-[10px] font-normal text-slate-400">واجب /{a.max_score ?? 100}</span>
                                </th>
                            ))}
                            {exams.map((exam) => (
                                <th key={`e-${exam.id}`} title={exam.title}>
                                    <span className="line-clamp-2 max-w-[8rem]">{exam.title}</span>
                                    <span className="mt-0.5 block text-[10px] font-normal text-slate-400">فحص · نجاح {exam.pass_percent}%</span>
                                </th>
                            ))}
                            <th>المعدل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.user.id}>
                                <td className="sticky right-0 bg-white">
                                    <p className="font-medium text-slate-800">{row.user.name}</p>
                                    <p className="text-xs text-slate-400">{row.user.email}</p>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-l from-theme-1 to-theme-2"
                                                style={{ width: `${row.progress_percent}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-600">{row.progress_percent}%</span>
                                    </div>
                                </td>
                                {row.scores.map((s) => (
                                    <td key={s.assignment_id} className="text-center text-sm">
                                        {s.score != null ? (
                                            <span className="font-medium text-slate-800">{s.score}</span>
                                        ) : (
                                            <span className="text-slate-400">{statusLabel(s.status)}</span>
                                        )}
                                    </td>
                                ))}
                                {(row.examScores || []).map((s) => (
                                    <td key={s.exam_id} className="text-center text-sm">
                                        {s.percent != null ? (
                                            <span className={`font-medium ${s.passed ? 'text-success' : 'text-pending'}`}>
                                                {s.percent}%
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">—</span>
                                        )}
                                    </td>
                                ))}
                                <td className="font-medium text-primary">
                                    {row.average != null ? `${row.average}%` : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && (
                    <p className="p-8 text-center text-sm text-slate-500">لا طلاب مسجّلين في هذه الدورة بعد.</p>
                )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link href={route('courses.show', course.id)} className="text-primary hover:underline">عرض الدورة</Link>
                <Link href={route('exams.index')} className="text-slate-500 hover:underline">الفحوصات</Link>
                <Link href={route('assignments.index')} className="text-slate-500 hover:underline">الواجبات</Link>
            </div>
        </AuthenticatedLayout>
    );
}
