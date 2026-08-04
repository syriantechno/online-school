import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ notifications, unreadCount = 0 }) {
    return (
        <AuthenticatedLayout header="الإشعارات">
            <Head title="الإشعارات" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">{unreadCount} غير مقروء</p>
                {unreadCount > 0 && (
                    <PrimaryButton onClick={() => router.post(route('notifications.read-all'))}>
                        تعليم الكل كمقروء
                    </PrimaryButton>
                )}
            </div>

            <div className="space-y-2">
                {notifications.data.map((n) => (
                    <button
                        key={n.id}
                        type="button"
                        onClick={() => router.post(route('notifications.read', n.id))}
                        className={`box flex w-full flex-col p-4 text-right transition hover:bg-slate-50 ${
                            n.read_at ? 'opacity-70' : 'border-primary/20 bg-primary/5'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="font-medium text-slate-800">{n.title}</p>
                            {!n.read_at && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                        {n.body && <p className="mt-1 text-sm text-slate-500">{n.body}</p>}
                        <p className="mt-2 text-xs text-slate-400">
                            {new Date(n.created_at).toLocaleString('ar')}
                        </p>
                    </button>
                ))}
            </div>

            {notifications.data.length === 0 && (
                <div className="box p-10 text-center text-sm text-slate-500">لا إشعارات بعد.</div>
            )}
        </AuthenticatedLayout>
    );
}
