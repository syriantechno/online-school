import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({
    room,
    jitsiUrl,
    displayName,
    checkedIn = false,
    attendanceCount = 0,
    canManageAttendance = false,
}) {
    const embedUrl = `${jitsiUrl}#userInfo.displayName="${encodeURIComponent(displayName || '')}"&config.prejoinPageEnabled=true`;

    return (
        <AuthenticatedLayout header={room.title}>
            <Head title={room.title} />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">
                        المضيف: {room.host?.name}
                        {room.course ? ` · ${room.course.title}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        رمز الغرفة: {room.room_code} · الحضور: {attendanceCount}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {!checkedIn ? (
                        <PrimaryButton onClick={() => router.post(route('attendance.check-in', room.id))}>
                            تسجيل الحضور
                        </PrimaryButton>
                    ) : (
                        <span className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">✓ تم تسجيل حضورك</span>
                    )}
                    {canManageAttendance && (
                        <Link href={route('attendance.index', room.id)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                            كشف الحضور
                        </Link>
                    )}
                    <a href={jitsiUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                        فتح في نافذة جديدة
                    </a>
                    <Link href={route('video-rooms.index')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                        العودة
                    </Link>
                </div>
            </div>

            {room.description && (
                <div className="box mb-4 p-4 text-sm text-slate-600">{room.description}</div>
            )}

            <div className="box overflow-hidden p-0">
                <iframe
                    title={room.title}
                    src={embedUrl}
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    className="h-[75vh] w-full border-0"
                />
            </div>
        </AuthenticatedLayout>
    );
}
