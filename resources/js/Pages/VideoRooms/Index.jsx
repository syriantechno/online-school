import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/Components/ConfirmDialog';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ rooms, canManage }) {
    return (
        <AuthenticatedLayout header="غرف الفيديو">
            <Head title="غرف الفيديو" />

            <div className="mb-5 flex justify-end">
                {canManage && (
                    <Link href={route('video-rooms.create')}>
                        <PrimaryButton>إنشاء غرفة</PrimaryButton>
                    </Link>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {rooms.data.map((room) => (
                    <div key={room.id} className="box flex flex-col p-5">
                        <div className="mb-3 flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-slate-800">{room.title}</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    المضيف: {room.host?.name}
                                    {room.course ? ` · ${room.course.title}` : ''}
                                </p>
                            </div>
                            <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${room.is_active ? 'bg-success/10 text-success' : 'bg-pending/10 text-pending'}`}>
                                {room.is_active ? 'نشطة' : 'مغلقة'}
                            </span>
                        </div>
                        {room.description && (
                            <p className="mb-3 line-clamp-2 text-sm text-slate-600">{room.description}</p>
                        )}
                        {room.scheduled_at && (
                            <p className="mb-3 text-xs text-slate-500">
                                موعد: {new Date(room.scheduled_at).toLocaleString('ar')}
                            </p>
                        )}
                        <div className="mt-auto flex gap-2">
                            <Link
                                href={route('video-rooms.show', room.id)}
                                className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white"
                            >
                                دخول الغرفة
                            </Link>
                            {canManage && (
                                <button
                                    type="button"
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600"
                                    onClick={async () => {
                                        if (await confirmAction({ message: 'سيتم حذف غرفة الفيديو نهائياً.', variant: 'danger' })) {
                                            router.delete(route('video-rooms.destroy', room.id));
                                        }
                                    }}
                                >
                                    حذف
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {rooms.data.length === 0 && (
                <div className="box p-10 text-center text-sm text-slate-500">لا غرف فيديو بعد.</div>
            )}
        </AuthenticatedLayout>
    );
}
