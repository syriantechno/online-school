import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Children({ children = [] }) {
    return (
        <AuthenticatedLayout header="أبنائي">
            <Head title="أبنائي" />

            <div className="grid gap-4 lg:grid-cols-2">
                {children.map((child) => (
                    <div key={child.id} className="box p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-medium text-slate-800">{child.name}</h3>
                                <p className="text-xs text-slate-500">{child.email}</p>
                            </div>
                            <span className="text-amber-500 font-medium">{child.stars} ★</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                            متوسط التقييم: {child.average_rating || '—'}
                        </p>

                        <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium text-slate-500">الدورات والتقدّم</p>
                            {child.enrollments?.length ? (
                                child.enrollments.map((e) => (
                                    <div key={e.id} className="rounded-box border border-slate-100 bg-slate-50 px-3 py-2">
                                        <div className="flex justify-between text-sm">
                                            <Link href={route('courses.show', e.course?.id)} className="text-primary hover:underline">
                                                {e.course?.title || 'دورة'}
                                            </Link>
                                            <span className="text-slate-500">{e.progress_percent}%</span>
                                        </div>
                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                                            <div
                                                className="h-full rounded-full bg-theme-1"
                                                style={{ width: `${e.progress_percent}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">لا تسجيلات بعد.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {children.length === 0 && (
                <div className="box p-10 text-center text-sm text-slate-500">
                    لا أبناء مرتبطين بحسابك بعد. تواصل مع الإدارة للربط.
                </div>
            )}
        </AuthenticatedLayout>
    );
}
