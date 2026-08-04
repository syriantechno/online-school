import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';

export default function Index({ books, canManage }) {
    return (
        <AuthenticatedLayout header="الكتب">
            <Head title="الكتب" />

            <div className="mb-5 flex justify-end">
                {canManage && (
                    <Link href={route('books.create')}>
                        <PrimaryButton>رفع كتاب</PrimaryButton>
                    </Link>
                )}
            </div>

            <div className="box overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>النوع</th>
                                <th>الدورة</th>
                                <th>الحالة</th>
                                <th>إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.data.map((book) => (
                                <tr key={book.id}>
                                    <td>
                                        <Link href={route('books.show', book.id)} className="font-medium text-primary">
                                            {book.title}
                                        </Link>
                                    </td>
                                    <td>{book.file_type?.toUpperCase()}</td>
                                    <td>{book.course?.title || 'عام'}</td>
                                    <td>
                                        <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${book.is_published ? 'bg-success/10 text-success' : 'bg-pending/10 text-pending'}`}>
                                            {book.is_published ? 'منشور' : 'مسودة'}
                                        </span>
                                    </td>
                                    <td className="space-x-2 space-x-reverse">
                                        <Link href={route('books.show', book.id)} className="text-primary hover:underline">عرض</Link>
                                        {canManage && (
                                            <Link href={route('books.edit', book.id)} className="text-slate-500 hover:underline">تعديل</Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {books.data.length === 0 && (
                    <p className="p-8 text-center text-sm text-slate-500">لا كتب بعد.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
