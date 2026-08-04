import { LogoMark } from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const HERO_IMG = '/images/home/hero.jpg';
const VIDEO_IMG = '/images/home/video.jpg';
const BOOKS_IMG = '/images/home/books.jpg';
const LIVE_IMG = '/images/home/live.jpg';

const courseCovers = [
    '/images/home/course-1.jpg',
    '/images/home/course-2.jpg',
    '/images/home/course-3.jpg',
    '/images/home/course-4.jpg',
    '/images/home/course-5.jpg',
];

const features = [
    {
        title: 'دورات منظمة',
        desc: 'مسارات تعليمية واضحة مرتبة حسب المستوى والمادة.',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
    {
        title: 'دروس بالفيديو',
        desc: 'يوتيوب وفيميو وملفات مباشرة داخل الصفحة.',
        icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
    },
    {
        title: 'تمارين تفاعلية',
        desc: 'أسئلة مع تصحيح فوري وشرح للإجابة.',
        icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
        title: 'كتب رقمية',
        desc: 'قراءة PDF وفصول تفاعلية مع نجوم.',
        icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    },
    {
        title: 'غرف فيديو',
        desc: 'حصص مباشرة بين المعلم والطلاب.',
        icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    },
    {
        title: 'نجوم وتقييم',
        desc: 'تحفيز الطالب بنظام نجوم وتقييم المعلم.',
        icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    },
];

function Icon({ d, className = 'h-6 w-6' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
}

function FeatureBand({ image, title, desc, points, reverse = false, ctaHref, ctaLabel }) {
    return (
        <section className={`py-16 sm:py-20 ${reverse ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
                <div className={reverse ? 'lg:order-2' : ''}>
                    <div className="overflow-hidden rounded-2xl shadow-lg shadow-theme-1/10">
                        <img
                            src={image}
                            alt={title}
                            className="h-72 w-full object-cover sm:h-96"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className={reverse ? 'lg:order-1' : ''}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        ميزة المنصة
                    </span>
                    <h2 className="mt-4 text-2xl font-medium text-slate-800 sm:text-3xl">{title}</h2>
                    <p className="mt-4 text-base leading-8 text-slate-500">{desc}</p>
                    <ul className="mt-6 space-y-3">
                        {points.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-sm text-slate-600">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                                    <Icon d="M4.5 12.75l6 6 9-13.5" className="h-3.5 w-3.5" />
                                </span>
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                    {ctaHref && (
                        <Link
                            href={ctaHref}
                            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-theme-1 px-6 text-sm font-medium text-white transition hover:bg-theme-2"
                        >
                            {ctaLabel}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function Welcome({ auth, stats = [], courses = [] }) {
    const { appName, auth: sharedAuth } = usePage().props;
    const user = auth?.user ?? sharedAuth?.user ?? null;
    const name = appName || 'المدرسة الإلكترونية';

    return (
        <>
            <Head title={name} />

            <div className="min-h-screen bg-white">
                {/* ===== HERO ===== */}
                <section className="relative min-h-[45vh] overflow-hidden">
                    <img
                        src={HERO_IMG}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-theme-1/95 via-theme-1/80 to-theme-2/70" />
                    <div className="absolute inset-0 bg-texture-white opacity-40" />

                    <div className="relative z-10 flex min-h-[45vh] flex-col">
                        <header className="px-5 pt-5 sm:px-8">
                            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                                <Link href="/" className="flex items-center gap-3 text-white">
                                    <LogoMark className="!h-11 !w-11 border-white/30 [&_>div]:!h-10 [&_>div]:!w-10" />
                                    <div>
                                        <p className="text-base font-medium sm:text-lg">{name}</p>
                                        <p className="text-xs text-white/70">منصة تعليم عربية</p>
                                    </div>
                                </Link>
                                <nav className="flex items-center gap-2">
                                    {user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-theme-1 shadow-sm transition hover:bg-slate-50"
                                        >
                                            لوحة التحكم
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="rounded-full px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                                            >
                                                دخول
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-theme-1 shadow-sm transition hover:bg-slate-50"
                                            >
                                                إنشاء حساب
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </div>
                        </header>

                        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-8 sm:px-8 lg:py-10">
                            <div className="max-w-2xl">
                                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
                                    <Icon d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.908.076-1.747.17-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" className="h-4 w-4" />
                                    تعليم تفاعلي عن بُعد
                                </p>
                                <h1 className="text-4xl font-medium leading-[1.35] text-white sm:text-5xl lg:text-[3.25rem]">
                                    {name}
                                </h1>
                                <p className="mt-5 max-w-xl text-lg leading-9 text-white/80">
                                    دروس فيديو، تمارين تفاعلية، كتب رقمية، وغرف اتصال مرئي — مع نظام نجوم يحفّز الطالب على التقدّم.
                                </p>
                                <div className="mt-9 flex flex-wrap gap-3">
                                    <Link
                                        href={user ? route('dashboard') : route('register')}
                                        className="inline-flex min-h-12 items-center rounded-full bg-white px-7 text-sm font-medium text-theme-1 shadow-md transition hover:bg-slate-50"
                                    >
                                        {user ? 'متابعة التعلم' : 'ابدأ مجاناً الآن'}
                                    </Link>
                                    <a
                                        href="#features"
                                        className="inline-flex min-h-12 items-center rounded-full border border-white/35 bg-white/10 px-7 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                                    >
                                        اكتشف المزايا
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== STATS ===== */}
                <section className="relative z-20 -mt-10 px-5 sm:px-8">
                    <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="box flex items-center gap-4 p-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-theme-1 to-theme-2 text-white shadow-sm">
                                    <Icon d={stat.icon} className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                    <p className="mt-0.5 text-2xl font-medium text-slate-800">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== FEATURE ICONS GRID ===== */}
                <section id="features" className="px-5 py-20 sm:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-2xl font-medium text-slate-800 sm:text-3xl">كل ما تحتاجه للتعلّم</h2>
                            <p className="mt-3 text-base leading-8 text-slate-500">
                                أدوات متكاملة للطالب والمعلم في واجهة عربية بسيطة وواضحة.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((f) => (
                                <div
                                    key={f.title}
                                    className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-gradient-to-b group-hover:from-theme-1 group-hover:to-theme-2 group-hover:text-white">
                                        <Icon d={f.icon} />
                                    </div>
                                    <h3 className="text-base font-medium text-slate-800">{f.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-500">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== IMAGE BANDS ===== */}
                <FeatureBand
                    image={VIDEO_IMG}
                    title="تعلّم بالفيديو بوضوح"
                    desc="شاهد الدروس داخل المنصة مباشرة، مع تمارين تفاعلية تظهر بعد كل درس لتعزز الفهم."
                    points={['تشغيل يوتيوب وفيميو وملفات MP4', 'تمارين اختيار من متعدد مع شرح', 'تتبّع تقدّم الطالب بسهولة']}
                    ctaHref={user ? route('lessons.index') : route('register')}
                    ctaLabel={user ? 'تصفّح الدروس' : 'جرّب الآن'}
                />

                <FeatureBand
                    reverse
                    image={BOOKS_IMG}
                    title="كتب رقمية تفاعلية"
                    desc="ارفع ملفات PDF ونظّمها في فصول مع أسئلة ومكافآت نجوم بعد كل فصل."
                    points={['قراءة مريحة داخل المتصفح', 'فصول وأسئلة مرتبطة بالصفحات', 'نجوم تُحفّز إكمال القراءة']}
                    ctaHref={user ? route('books.index') : route('login')}
                    ctaLabel="مكتبة الكتب"
                />

                <FeatureBand
                    image={LIVE_IMG}
                    title="حصص مباشرة بالفيديو"
                    desc="أنشئ غرفة اتصال مرئي وادخل مع طلابك فوراً — بدون تثبيت برامج إضافية."
                    points={['غرف جاهزة بضغطة زر', 'كاميرا ومايك داخل الصفحة', 'ربط الغرفة بدورة محددة']}
                    ctaHref={user ? route('video-rooms.index') : route('register')}
                    ctaLabel="غرف الفيديو"
                />

                {/* ===== COURSES ===== */}
                <section className="bg-slate-50 px-5 py-20 sm:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-medium text-slate-800 sm:text-3xl">أحدث الدورات</h2>
                                <p className="mt-2 text-sm text-slate-500">نماذج مما يُدرَّس على المنصة</p>
                            </div>
                            {user && (
                                <Link href={route('courses.index')} className="text-sm font-medium text-primary hover:underline">
                                    عرض كل الدورات
                                </Link>
                            )}
                        </div>

                        {courses.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
                                ستظهر الدورات هنا بعد نشرها.
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course, i) => (
                                    <article key={course.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                        <div className="relative h-44 overflow-hidden">
                                            <img
                                                src={courseCovers[i % courseCovers.length]}
                                                alt=""
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-theme-1/50 to-transparent" />
                                            {course.level && (
                                                <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-theme-1">
                                                    {course.level}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <p className="text-xs text-slate-400">{course.subject || 'مادة عامة'}</p>
                                            <h3 className="mt-1 text-base font-medium text-slate-800">{course.title}</h3>
                                            <p className="mt-2 text-sm text-slate-500">
                                                المعلم: {course.teacher?.name || '—'}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== STEPS ===== */}
                <section className="px-5 py-20 sm:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-2xl font-medium text-slate-800 sm:text-3xl">كيف تبدأ؟</h2>
                            <p className="mt-3 text-base text-slate-500">ثلاث خطوات بسيطة للانطلاق</p>
                        </div>
                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            {[
                                ['01', 'أنشئ حسابك', 'سجّل كطالب أو معلم خلال دقائق.', 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
                                ['02', 'اختر دورتك', 'شاهد الدروس وحل التمارين واقرأ الكتب.', 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'],
                                ['03', 'تقدّم وتميّز', 'اجمع النجوم واحصل على تقييم معلمك.', 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'],
                            ].map(([n, title, desc, icon]) => (
                                <div key={n} className="relative rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-sm">
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-l from-theme-1 to-theme-2 px-3 py-1 text-xs font-medium text-white">
                                        {n}
                                    </span>
                                    <div className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Icon d={icon} className="h-7 w-7" />
                                    </div>
                                    <h3 className="mt-4 text-base font-medium text-slate-800">{title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-500">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== CTA ===== */}
                <section className="relative overflow-hidden px-5 py-16 sm:px-8">
                    <div className="absolute inset-0 bg-gradient-to-l from-theme-1 to-theme-2" />
                    <div className="absolute inset-0 bg-texture-white opacity-30" />
                    <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="text-white">
                            <h2 className="text-2xl font-medium sm:text-3xl">جاهز تبدأ رحلتك التعليمية؟</h2>
                            <p className="mt-3 max-w-xl text-base text-white/75">
                                انضم الآن واستفد من الدروس التفاعلية وغرف الفيديو ونظام النجوم. يمكنك أيضاً تخصيص ألوان الواجهة من زر الإعدادات أسفل الصفحة.
                            </p>
                        </div>
                        <Link
                            href={user ? route('dashboard') : route('register')}
                            className="inline-flex min-h-12 shrink-0 items-center rounded-full bg-white px-7 text-sm font-medium text-theme-1 transition hover:bg-slate-50"
                        >
                            {user ? 'إلى لوحة التحكم' : 'إنشاء حساب مجاني'}
                        </Link>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <footer className="bg-gradient-to-b from-theme-1 to-theme-2 text-white">
                    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <LogoMark className="!h-11 !w-11 border-white/30 [&_>div]:!h-10 [&_>div]:!w-10" />
                                    <div>
                                        <p className="font-medium">{name}</p>
                                        <p className="text-xs text-white/60">منصة تعليم عربية</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-7 text-white/70">
                                    دورات، دروس فيديو، كتب تفاعلية، وغرف اتصال مرئي في مكان واحد.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-4 text-sm font-medium">روابط سريعة</h3>
                                <ul className="space-y-2.5 text-sm text-white/70">
                                    <li><a href="#features" className="hover:text-white">المزايا</a></li>
                                    <li><Link href={user ? route('courses.index') : route('login')} className="hover:text-white">الدورات</Link></li>
                                    <li><Link href={route('login')} className="hover:text-white">تسجيل الدخول</Link></li>
                                    <li><Link href={route('register')} className="hover:text-white">إنشاء حساب</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-sm font-medium">التعلم</h3>
                                <ul className="space-y-2.5 text-sm text-white/70">
                                    <li><Link href={user ? route('lessons.index') : route('login')} className="hover:text-white">الدروس</Link></li>
                                    <li><Link href={user ? route('books.index') : route('login')} className="hover:text-white">الكتب</Link></li>
                                    <li><Link href={user ? route('video-rooms.index') : route('login')} className="hover:text-white">غرف الفيديو</Link></li>
                                    <li><Link href={user ? route('stars.leaderboard') : route('login')} className="hover:text-white">لوحة النجوم</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-sm font-medium">تواصل معنا</h3>
                                <ul className="space-y-3 text-sm text-white/70">
                                    <li>support@school.test</li>
                                    <li dir="ltr" className="text-end">+963 000 000 000</li>
                                    <li>سوريا · تعليم عن بُعد</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10">
                        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-4 text-xs text-white/55 sm:flex-row sm:px-8">
                            <p>© {new Date().getFullYear()} {name}. جميع الحقوق محفوظة.</p>
                            <div className="flex gap-4">
                                <span>خصوصية</span>
                                <span>شروط الاستخدام</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
