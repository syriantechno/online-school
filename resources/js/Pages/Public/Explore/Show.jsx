import PublicSiteLayout, { formatDuration } from '@/Components/PublicSiteLayout';
import CourseLessonPath, { CourseLessonPathPanel, courseDurationLabel } from '@/Components/CourseLessonPath';
import { loginForCourse, registerForCourse } from '@/utils/authRedirect';
import { Head, Link, router, usePage } from '@inertiajs/react';

const characters = ['boy-hero.png', 'girl-schoolbag.png', 'boy-card.png'];

export default function ExploreShow({
    course,
    stats,
    lessonPath = [],
    nextLessonId = null,
    isEnrolled,
    enrollment,
    canEnroll,
}) {
    const { flash } = usePage().props;
    const learn = (lessonId) => route('explore.learn', { course: course.slug, lesson: lessonId });
    const startHref = isEnrolled && nextLessonId ? learn(nextLessonId) : null;
    const completedCount = lessonPath.filter((lesson) => lesson.completed).length;
    const heroImage = course.cover_url;
    const fallbackCharacter = characters[course.id % characters.length];

    const handleEnroll = () => {
        if (!canEnroll) {
            window.location.href = loginForCourse(course);
            return;
        }
        router.post(route('courses.enroll', course.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (nextLessonId || lessonPath[0]?.id) {
                    router.visit(learn(nextLessonId || lessonPath[0].id));
                }
            },
        });
    };

    return (
        <PublicSiteLayout fullBleed>
            <Head title={course.title} />

            {/* هيدر الغلاف — ملاصق للنافبار */}
            <section className="relative min-h-[280px] overflow-hidden sm:min-h-[340px]">
                {heroImage ? (
                    <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-300 via-blue-200 to-amber-100">
                        <img
                            src={`/assets/home/characters/${fallbackCharacter}`}
                            alt=""
                            className="absolute bottom-0 left-8 h-[72%] max-h-[300px] object-contain drop-shadow-lg sm:left-16"
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/50 to-[#0f172a]/15" />
                <div className="relative z-10 mx-auto flex min-h-[280px] max-w-[1400px] flex-col justify-end px-4 pb-8 pt-[82px] sm:min-h-[340px] sm:px-7 lg:px-10">
                        <div className="mb-3 text-sm font-bold text-blue-200">
                            <Link href={route('explore.index')} className="hover:text-white">الدورات</Link>
                            <span className="mx-2 opacity-60">/</span>
                            <span className="text-white/90">{course.title}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {course.subject && (
                                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur-sm">
                                    {course.subject}
                                </span>
                            )}
                            {course.level && (
                                <span className="rounded-full bg-amber-400/90 px-3 py-1 text-xs font-black text-slate-900">
                                    {course.level}
                                </span>
                            )}
                        </div>
                        <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                            {course.title}
                        </h1>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-blue-100">
                            <span>{stats.lessons_count} درس</span>
                            <span>{formatDuration(stats.total_minutes)}</span>
                            {isEnrolled && (
                                <span className="text-amber-300">أنجزت {completedCount} / {stats.lessons_count}</span>
                            )}
                        </div>
                </div>
            </section>

            <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-7 lg:px-10">
                {flash?.success && (
                    <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
                        {flash.success}
                    </p>
                )}
                {flash?.error && (
                    <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
                        {flash.error}
                    </p>
                )}

                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    {/* المحتوى الرئيسي */}
                    <div className="min-w-0 space-y-6">
                        <section className="rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900">عن هذه الدورة</h2>
                            <p className="mt-4 text-base font-medium leading-8 text-slate-600">
                                {course.description || 'دورة تفاعلية لتعلّم اللغة العربية خطوة بخطوة — كل درس يفتح بعد إكمال الذي قبله.'}
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl bg-sky-50 p-4 text-center">
                                    <p className="text-2xl font-black text-blue-700">{stats.lessons_count}</p>
                                    <p className="mt-1 text-xs font-bold text-slate-500">درس في المسار</p>
                                </div>
                                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                                    <p className="text-2xl font-black text-emerald-700">{formatDuration(stats.total_minutes)}</p>
                                    <p className="mt-1 text-xs font-bold text-slate-500">مدة التعلّم</p>
                                </div>
                                <div className="rounded-xl bg-amber-50 p-4 text-center">
                                    <p className="text-2xl font-black text-amber-700">{stats.students_count || 0}</p>
                                    <p className="mt-1 text-xs font-bold text-slate-500">طالب مسجّل</p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border-2 border-violet-100 bg-gradient-to-l from-violet-50 to-white p-6 sm:p-8">
                            <h2 className="text-xl font-black text-slate-900">كيف تتعلّم؟</h2>
                            <ul className="mt-4 space-y-3 text-sm font-medium leading-7 text-slate-600">
                                <li className="flex gap-3"><span className="font-black text-violet-600">1.</span>ابدأ من الدرس الأول في المسار</li>
                                <li className="flex gap-3"><span className="font-black text-violet-600">2.</span>أكمل النشاط داخل كل درس</li>
                                <li className="flex gap-3"><span className="font-black text-violet-600">3.</span>يفتح الدرس التالي تلقائياً بعد الإكمال ✦</li>
                            </ul>
                        </section>

                        {isEnrolled && enrollment && (
                            <section className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-6">
                                <div className="mb-2 flex justify-between text-sm font-black text-slate-700">
                                    <span>تقدّمك في الدورة</span>
                                    <span>{enrollment.progress_percent}%</span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-white">
                                    <div className="h-full rounded-full bg-gradient-to-l from-blue-600 to-sky-500" style={{ width: `${enrollment.progress_percent}%` }} />
                                </div>
                            </section>
                        )}
                    </div>

                    {/* مسار الدروس — يسار */}
                    <aside className="lg:sticky lg:top-[100px] lg:self-start">
                        <CourseLessonPathPanel
                            title="مسار الدروس"
                            subtitle={`${stats.lessons_count} درس · ${courseDurationLabel(lessonPath)} · بالترتيب`}
                            footer={(
                                <div className="space-y-3">
                                    {isEnrolled && startHref ? (
                                        <Link
                                            href={startHref}
                                            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 text-sm font-black text-slate-900 shadow-sm transition hover:bg-amber-300"
                                        >
                                            {completedCount > 0 && startHref ? 'تابع التعلّم ←' : startHref ? 'ابدأ الدرس الأول ✦' : 'أكملت الدورة 🎉'}
                                        </Link>
                                    ) : isEnrolled && !startHref ? (
                                        <span className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-800">
                                            أكملت كل الدروس 🎉
                                        </span>
                                    ) : canEnroll ? (
                                        <button
                                            type="button"
                                            onClick={handleEnroll}
                                            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 text-sm font-black text-slate-900 shadow-sm transition hover:bg-amber-300"
                                        >
                                            اشترك وابدأ مجاناً
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <Link
                                                href={loginForCourse(course)}
                                                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-700 text-sm font-black text-white shadow-sm"
                                            >
                                                سجّل دخول للاشتراك
                                            </Link>
                                            <Link
                                                href={registerForCourse(course)}
                                                className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-blue-200 bg-white text-sm font-black text-blue-700"
                                            >
                                                أنشئ حساباً جديداً
                                            </Link>
                                        </div>
                                    )}
                                    <Link href={route('explore.index')} className="block text-center text-xs font-bold text-blue-700 hover:underline">
                                        ← كل الدورات
                                    </Link>
                                </div>
                            )}
                        >
                            <CourseLessonPath
                                courseSlug={course.slug}
                                lessons={lessonPath}
                            />
                        </CourseLessonPathPanel>
                    </aside>
                </div>
            </div>
        </PublicSiteLayout>
    );
}
