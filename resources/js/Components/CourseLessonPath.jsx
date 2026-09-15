import { Link } from '@inertiajs/react';
import { formatDuration } from '@/Components/PublicSiteLayout';

export default function CourseLessonPath({
    courseSlug,
    lessons = [],
    currentLessonId = null,
    compact = false,
}) {
    const learn = (lessonId) => route('explore.learn', { course: courseSlug, lesson: lessonId });

    if (!lessons.length) {
        return (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm font-medium text-slate-500">
                لا دروس منشورة بعد.
            </p>
        );
    }

    return (
        <ol className={`space-y-2.5 ${compact ? '' : ''}`}>
            {lessons.map((lesson) => {
                const isCurrent = currentLessonId === lesson.id;
                const canOpen = lesson.unlocked;
                const locked = lesson.locked;

                const cardClass = [
                    'relative flex items-start gap-3 rounded-xl border-2 p-3.5 transition',
                    isCurrent ? 'border-blue-400 bg-blue-50 shadow-sm' : '',
                    lesson.completed ? 'border-emerald-200 bg-emerald-50/50' : '',
                    locked ? 'border-slate-100 bg-slate-50/80 opacity-75' : '',
                    canOpen && !isCurrent && !lesson.completed ? 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30' : '',
                    !canOpen && !locked ? 'border-slate-100 bg-slate-50/50' : '',
                ].filter(Boolean).join(' ');

                const stepBadge = (
                    <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-black ${
                            lesson.completed
                                ? 'bg-emerald-500 text-white'
                                : locked
                                    ? 'bg-slate-200 text-slate-500'
                                    : isCurrent
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                        {lesson.completed ? '✓' : locked ? '🔒' : lesson.index}
                    </span>
                );

                const content = (
                    <>
                        {stepBadge}
                        <div className="min-w-0 flex-1 pt-0.5">
                            <p className={`text-sm font-black leading-6 ${locked ? 'text-slate-400' : 'text-slate-800'}`}>
                                {lesson.title}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                                {lesson.duration_minutes ? (
                                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                        {lesson.duration_minutes} د
                                    </span>
                                ) : null}
                                {lesson.is_interactive ? (
                                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                                        تفاعلي
                                    </span>
                                ) : null}
                                {lesson.stars_reward ? (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                        {lesson.stars_reward} ★
                                    </span>
                                ) : null}
                            </div>
                            {locked && (
                                <p className="mt-1.5 text-[11px] font-bold text-slate-400">أكمل الدرس السابق أولاً</p>
                            )}
                            {canOpen && !lesson.completed && !locked && (
                                <p className="mt-1.5 text-[11px] font-black text-blue-600">اضغط للبدء ←</p>
                            )}
                        </div>
                    </>
                );

                return (
                    <li key={lesson.id}>
                        {canOpen ? (
                            <Link href={learn(lesson.id)} className={cardClass}>
                                {content}
                            </Link>
                        ) : (
                            <div className={cardClass} aria-disabled="true">
                                {content}
                            </div>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

export function CourseLessonPathPanel({ title = 'مسار الدروس', subtitle, children, footer }) {
    return (
        <div className="overflow-hidden rounded-xl border-2 border-sky-200 bg-white shadow-sm">
            <div className="border-b border-sky-100 bg-gradient-to-l from-sky-50 to-white px-4 py-4">
                <h2 className="text-lg font-black text-slate-900">{title}</h2>
                {subtitle ? <p className="mt-1 text-xs font-bold text-slate-500">{subtitle}</p> : null}
            </div>
            <div className="max-h-[min(70vh,520px)] overflow-y-auto p-4">{children}</div>
            {footer ? <div className="border-t border-sky-100 bg-sky-50/40 p-4">{footer}</div> : null}
        </div>
    );
}

export function courseDurationLabel(lessons) {
    const total = lessons.reduce((sum, lesson) => sum + (Number(lesson.duration_minutes) || 0), 0);
    return formatDuration(total);
}
