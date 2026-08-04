import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Leaderboard({ leaders, me }) {
    return (
        <AuthenticatedLayout header="لوحة النجوم">
            <Head title="لوحة النجوم" />

            <div className="mb-5 grid gap-4 sm:grid-cols-2">
                <div className="box p-5">
                    <p className="text-xs text-slate-500">رصيدك</p>
                    <p className="mt-1 text-3xl font-semibold text-amber-500">{me?.stars ?? 0} ★</p>
                </div>
                {me?.average_rating != null && (
                    <div className="box p-5">
                        <p className="text-xs text-slate-500">متوسط تقييمك</p>
                        <p className="mt-1 text-3xl font-semibold text-slate-800">{me.average_rating || '—'}</p>
                    </div>
                )}
            </div>

            <div className="box overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>الطالب</th>
                            <th>النجوم</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((row, index) => (
                            <tr key={row.id} className={row.id === me?.id ? 'bg-amber-50/60' : ''}>
                                <td className="font-medium text-slate-500">{index + 1}</td>
                                <td className="font-medium text-slate-800">
                                    {row.name}
                                    {row.id === me?.id ? ' (أنت)' : ''}
                                </td>
                                <td className="text-amber-500 font-semibold">{row.stars} ★</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leaders.length === 0 && (
                    <p className="p-8 text-center text-sm text-slate-500">لا طلاب بعد.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
