import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ certificates }) {
    return (
        <AuthenticatedLayout header="الشهادات">
            <Head title="الشهادات" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.data.map((c) => (
                    <Link key={c.id} href={route('certificates.show', c.id)} className="box block p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                        <p className="text-xs text-amber-600">شهادة إتمام</p>
                        <h3 className="mt-2 font-medium text-slate-800">{c.course?.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{c.user?.name}</p>
                        <p className="mt-3 text-xs text-slate-400">
                            {c.code} · {c.issued_at ? new Date(c.issued_at).toLocaleDateString('ar') : ''}
                        </p>
                    </Link>
                ))}
            </div>

            {certificates.data.length === 0 && (
                <div className="box p-10 text-center text-sm text-slate-500">
                    لا شهادات بعد. أكمل كل دروس الدورة لتحصل على شهادتك.
                </div>
            )}
        </AuthenticatedLayout>
    );
}
