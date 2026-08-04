import { Link, usePage } from '@inertiajs/react';

function LogoMark({ className = '' }) {
    return (
        <div className={`flex h-[55px] w-[55px] items-center justify-center rounded-[0.8rem] border border-primary/30 ${className}`}>
            <div className="relative flex h-[50px] w-[50px] items-center justify-center rounded-[0.6rem] bg-gradient-to-b from-theme-1/90 to-theme-2/90">
                <div className="relative h-[26px] w-[26px] -rotate-45 [&_div]:bg-white">
                    <div className="absolute inset-y-0 left-0 my-auto h-[75%] w-[20%] rounded-full opacity-50" />
                    <div className="absolute inset-0 m-auto h-[120%] w-[20%] rounded-full" />
                    <div className="absolute inset-y-0 right-0 my-auto h-[75%] w-[20%] rounded-full opacity-50" />
                </div>
            </div>
        </div>
    );
}

/**
 * Guest/auth layout matching invoices Tailwise login split screen.
 */
export default function GuestLayout({
    children,
    title = 'تسجيل الدخول',
    subtitle,
    heroTitle,
    heroSubtitle = 'منصة تعليم عربية: دورات، دروس بالفيديو، وتمارين تفاعلية.',
}) {
    const { appName } = usePage().props;
    const name = appName || 'المدرسة الإلكترونية';

    return (
        <div className="min-h-screen bg-white" dir="ltr">
            <div className="container relative z-50 grid grid-cols-12 px-5 py-10 sm:px-10 sm:py-14 md:px-36 lg:h-screen lg:max-w-[1550px] lg:py-0 lg:pl-14 lg:pr-12 xl:px-24 2xl:max-w-[1750px]">
                <div
                    className="relative z-50 col-span-12 h-full rounded-2xl bg-white p-7 before:absolute before:inset-0 before:-mb-3.5 before:mx-5 before:rounded-2xl before:bg-white/40 before:content-[''] sm:p-14 lg:col-span-5 lg:bg-transparent lg:p-0 lg:pr-10 xl:pr-24 2xl:col-span-4"
                    dir="rtl"
                >
                    <div className="relative z-10 flex h-full w-full flex-col justify-center py-2 lg:py-32">
                        <Link href="/">
                            <LogoMark />
                        </Link>

                        <div className="mt-10">
                            <div className="text-2xl font-medium text-slate-800">{title}</div>
                            <div className="mt-2.5 text-slate-600">{subtitle || name}</div>

                            <div className="my-7 flex items-start gap-3 rounded-[0.6rem] border border-primary/20 bg-primary/5 px-4 py-3 leading-[1.7] text-slate-600">
                                <svg className="mt-0.5 h-6 w-6 shrink-0 stroke-[1.2] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                </svg>
                                <div className="text-sm">أدخل بياناتك للمتابعة إلى لوحة التحكم.</div>
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero panel (desktop) — invoices style */}
            <div className="container fixed inset-0 z-0 grid h-screen w-screen grid-cols-12 pl-14 pr-12 lg:max-w-[1550px] xl:px-24 2xl:max-w-[1750px]">
                <div
                    className="relative z-20 col-span-12 h-screen after:absolute after:inset-y-0 after:right-0 after:hidden after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:content-[''] after:lg:block before:absolute before:inset-y-0 before:right-0 before:-mr-4 before:my-6 before:hidden before:w-[800%] before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] before:bg-white/50 before:content-[''] before:lg:block lg:col-span-5 2xl:col-span-4"
                />
                <div className="relative col-span-7 h-full before:absolute before:inset-y-0 before:left-0 before:w-screen before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:content-[''] before:lg:-ml-10 before:lg:w-[800%] after:absolute after:inset-y-0 after:left-0 after:w-screen after:bg-texture-white after:bg-fixed after:bg-center after:bg-no-repeat after:content-[''] after:lg:w-[800%] after:lg:bg-[25rem_-25rem] 2xl:col-span-8">
                    <div className="sticky top-0 z-10 ml-16 hidden h-screen flex-col justify-center lg:flex xl:ml-28 2xl:ml-36" dir="rtl">
                        <div className="text-[2.6rem] font-medium leading-[1.4] text-white xl:text-5xl xl:leading-[1.2]">
                            {heroTitle || name}
                        </div>
                        <div className="mt-5 text-base leading-relaxed text-white/70 xl:text-lg">
                            {heroSubtitle}
                        </div>
                        <div className="mt-10 flex flex-col gap-3 xl:flex-row xl:items-center">
                            <div className="flex items-center gap-2">
                                {[
                                    'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                                    'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
                                    'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                ].map((d) => (
                                    <div
                                        key={d.slice(0, 12)}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white/40 bg-white/10"
                                    >
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
                                        </svg>
                                    </div>
                                ))}
                            </div>
                            <div className="text-base text-white/70 xl:mr-2">دروس · فيديو · تمارين تفاعلية</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { LogoMark };
