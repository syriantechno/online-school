import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Path({ course, enrollment, steps = [], completedCount = 0, totalCount = 0 }) {
    const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <AuthenticatedLayout header={`مسار: ${course.title}`}>
            <Head title={`مسار ${course.title}`} />

            <div className="box mb-5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-medium text-slate-800">{course.title}</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {course.teacher?.name} · أكملت {completedCount} من {totalCount}
                        </p>
                    </div>
                    <Link href={route('courses.show', course.id)} className="text-sm text-primary hover:underline">
                        صفحة الدورة
                    </Link>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-l from-theme-1 to-theme-2" style={{ width: `${percent}%` }} />
                </div>
                {enrollment?.status === 'completed' && (
                    <p className="mt-3 text-sm text-success">أكملت الدورة — راجع شهادتك من قسم الشهادات.</p>
                )}
            </div>

            <div className="space-y-3">
                {steps.map((step) => (
                    <div
                        key={step.lesson.id}
                        className={`box flex items-center gap-4 p-4 ${step.completed ? 'border-success/30 bg-success/5' : ''}`}
                    >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                            step.completed ? 'bg-success text-white' : 'bg-primary/10 text-primary'
                        }`}>
                            {step.completed ? '✓' : step.order}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800">{step.lesson.title}</p>
                            <p className="text-xs text-slate-500">
                                {step.lesson.duration_minutes ? `${step.lesson.duration_minutes} د · ` : ''}
                                {step.lesson.stars_reward || 2} نجوم
                                {step.lesson.is_interactive ? ' · تفاعلي' : ''}
                            </p>
                        </div>
                        <Link
                            href={route('lessons.show', step.lesson.id)}
                            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
                        >
                            {step.completed ? 'مراجعة' : 'ابدأ'}
                        </Link>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
