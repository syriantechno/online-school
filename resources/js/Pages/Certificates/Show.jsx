import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ certificate }) {
    return (
        <AuthenticatedLayout header="شهادة إتمام">
            <Head title={`شهادة — ${certificate.course?.title}`} />

            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border-4 border-theme-1/20 bg-gradient-to-b from-white to-slate-50 shadow-lg">
                <div className="bg-gradient-to-l from-theme-1 to-theme-2 px-8 py-6 text-center text-white">
                    <p className="text-sm text-white/70">المدرسة الإلكترونية</p>
                    <h1 className="mt-2 text-2xl font-medium sm:text-3xl">شهادة إتمام دورة</h1>
                </div>

                <div className="px-8 py-10 text-center">
                    <p className="text-sm text-slate-500">تشهد المنصة بأن</p>
                    <p className="mt-3 text-3xl font-medium text-theme-1">{certificate.user?.name}</p>
                    <p className="mt-4 text-sm leading-8 text-slate-600">
                        قد أتمّ بنجاح متطلبات دورة
                    </p>
                    <p className="mt-2 text-xl font-medium text-slate-800">{certificate.course?.title}</p>
                    {(certificate.course?.subject || certificate.course?.level) && (
                        <p className="mt-2 text-sm text-slate-500">
                            {[certificate.course?.subject, certificate.course?.level].filter(Boolean).join(' · ')}
                        </p>
                    )}

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-box border border-slate-100 bg-white p-3">
                            <p className="text-xs text-slate-500">رمز الشهادة</p>
                            <p className="mt-1 font-mono text-sm text-slate-800">{certificate.code}</p>
                        </div>
                        <div className="rounded-box border border-slate-100 bg-white p-3">
                            <p className="text-xs text-slate-500">نسبة الإتمام</p>
                            <p className="mt-1 text-sm text-slate-800">{certificate.final_percent}%</p>
                        </div>
                        <div className="rounded-box border border-slate-100 bg-white p-3">
                            <p className="text-xs text-slate-500">تاريخ الإصدار</p>
                            <p className="mt-1 text-sm text-slate-800">
                                {certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString('ar') : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 text-center">
                <Link href={route('certificates.index')} className="text-sm text-primary hover:underline">
                    العودة للشهادات
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
