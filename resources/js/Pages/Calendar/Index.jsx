import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ events = [] }) {
    const grouped = events.reduce((acc, event) => {
        if (!event.at) return acc;
        const day = new Date(event.at).toLocaleDateString('ar', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        acc[day] = acc[day] || [];
        acc[day].push(event);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout header="التقويم">
            <Head title="التقويم" />

            <p className="mb-5 text-sm text-slate-500">
                حصص الفيديو المباشرة ومواعيد تسليم الواجبات في مكان واحد.
            </p>

            {Object.keys(grouped).length === 0 ? (
                <div className="box p-10 text-center text-sm text-slate-500">لا أحداث مجدولة حالياً.</div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([day, items]) => (
                        <section key={day}>
                            <h2 className="mb-3 text-sm font-medium text-slate-500">{day}</h2>
                            <div className="space-y-2">
                                {items.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={event.href}
                                        className="box flex items-center gap-4 p-4 transition hover:bg-slate-50"
                                    >
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${
                                            event.type === 'video' ? 'bg-info' : 'bg-pending'
                                        }`}>
                                            {event.type === 'video' ? '▶' : '✎'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-800">{event.title}</p>
                                            <p className="text-xs text-slate-500">{event.subtitle}</p>
                                        </div>
                                        <p className="text-sm text-slate-500">
                                            {new Date(event.at).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
