import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ courses, filters, canManage }) {
    return (
        <AuthenticatedLayout header="الدورات">
            <Head title="الدورات" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        router.get(route('courses.index'), { search: e.target.search.value }, { preserveState: true });
                    }}
                    className="flex flex-wrap gap-2"
                >
                    <TextInput
                        name="search"
                        defaultValue={filters.search || ''}
                        placeholder="بحث عن دورة..."
                        className="!w-64 !py-2"
                    />
                    <PrimaryButton>بحث</PrimaryButton>
                </form>

                {canManage && (
                    <Link href={route('courses.create')}>
                        <PrimaryButton>دورة جديدة</PrimaryButton>
                    </Link>
                )}
            </div>

            <div className="box overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>المادة</th>
                                <th>المستوى</th>
                                <th>الدروس</th>
                                <th>الطلاب</th>
                                <th>الحالة</th>
                                <th>إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.data.map((course) => (
                                <tr key={course.id}>
                                    <td>
                                        <Link href={route('courses.show', course.id)} className="font-medium text-primary">
                                            {course.title}
                                        </Link>
                                    </td>
                                    <td>{course.subject || '—'}</td>
                                    <td>{course.level || '—'}</td>
                                    <td>{course.lessons_count || 0}</td>
                                    <td>{course.enrollments_count || 0}</td>
                                    <td>
                                        <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${course.is_published ? 'bg-success/10 text-success' : 'bg-pending/10 text-pending'}`}>
                                            {course.is_published ? 'منشورة' : 'مسودة'}
                                        </span>
                                    </td>
                                    <td className="space-x-2 space-x-reverse">
                                        <Link href={route('courses.show', course.id)} className="text-primary hover:underline">عرض</Link>
                                        {canManage && (
                                            <Link href={route('courses.edit', course.id)} className="text-slate-500 hover:underline">تعديل</Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {courses.data.length === 0 && (
                    <p className="p-8 text-center text-sm text-slate-500">لا توجد دورات حالياً.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
