import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ room, records = [], presentCount = 0, lateCount = 0 }) {
    return (
        <AuthenticatedLayout header={`حضور: ${room.title}`}>
            <Head title={`حضور ${room.title}`} />

            <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <div className="box p-5">
                    <p className="text-xs text-slate-500">الإجمالي</p>
                    <p className="mt-1 text-2xl font-medium text-slate-800">{records.length}</p>
                </div>
                <div className="box p-5">
                    <p className="text-xs text-slate-500">حاضر</p>
                    <p className="mt-1 text-2xl font-medium text-success">{presentCount}</p>
                </div>
                <div className="box p-5">
                    <p className="text-xs text-slate-500">متأخر</p>
                    <p className="mt-1 text-2xl font-medium text-pending">{lateCount}</p>
                </div>
            </div>

            <div className="box overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>الطالب</th>
                            <th>الوقت</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r) => (
                            <tr key={r.id}>
                                <td>
                                    <p className="font-medium text-slate-800">{r.user?.name}</p>
                                    <p className="text-xs text-slate-400">{r.user?.email}</p>
                                </td>
                                <td>{r.checked_in_at ? new Date(r.checked_in_at).toLocaleString('ar') : '—'}</td>
                                <td>
                                    <span className={`rounded-md px-2 py-1 text-[11px] ${
                                        r.status === 'late' ? 'bg-pending/10 text-pending' : 'bg-success/10 text-success'
                                    }`}>
                                        {r.status === 'late' ? 'متأخر' : 'حاضر'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {records.length === 0 && (
                    <p className="p-8 text-center text-sm text-slate-500">لا حضور مسجّل بعد.</p>
                )}
            </div>

            <Link href={route('video-rooms.show', room.id)} className="mt-4 inline-block text-sm text-primary hover:underline">
                العودة للغرفة
            </Link>
        </AuthenticatedLayout>
    );
}
