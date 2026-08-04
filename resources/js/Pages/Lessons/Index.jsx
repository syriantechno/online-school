import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ lessons, courses, filters, canManage }) {
    return (
        <AuthenticatedLayout header="الدروس">
            <Head title="الدروس" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <select
                    className="form-control !w-auto !py-2"
                    value={filters.course_id || ''}
                    onChange={(e) => router.get(route('lessons.index'), { course_id: e.target.value || undefined }, { preserveState: true })}
                >
                    <option value="">كل الدورات</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>

                {canManage && (
                    <Link href={route('lessons.create')}>
                        <PrimaryButton>درس جديد</PrimaryButton>
                    </Link>
                )}
            </div>

            <div className="box overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>الدورة</th>
                                <th>المدة</th>
                                <th>الحالة</th>
                                <th>إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.data.map((lesson) => (
                                <tr key={lesson.id}>
                                    <td>
                                        <Link href={route('lessons.show', lesson.id)} className="font-medium text-primary">
                                            {lesson.title}
                                        </Link>
                                    </td>
                                    <td>{lesson.course?.title}</td>
                                    <td>{lesson.duration_minutes ? `${lesson.duration_minutes} د` : '—'}</td>
                                    <td>
                                        <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${lesson.is_published ? 'bg-success/10 text-success' : 'bg-pending/10 text-pending'}`}>
                                            {lesson.is_published ? 'منشور' : 'مسودة'}
                                        </span>
                                    </td>
                                    <td className="space-x-2 space-x-reverse">
                                        <Link href={route('lessons.show', lesson.id)} className="text-primary hover:underline">عرض</Link>
                                        {canManage && (
                                            <Link href={route('lessons.edit', lesson.id)} className="text-slate-500 hover:underline">تعديل</Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {lessons.data.length === 0 && <p className="p-8 text-center text-sm text-slate-500">لا توجد دروس.</p>}
            </div>
        </AuthenticatedLayout>
    );
}
