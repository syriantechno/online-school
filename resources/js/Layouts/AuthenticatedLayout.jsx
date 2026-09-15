import Sidebar from '@/Components/Sidebar';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const studentPageHints = {
    courses: 'اختر مغامرتك التعليمية واكتشف دروساً جديدة.',
    learning: 'تابع رحلتك من المكان الذي وصلت إليه.',
    assignments: 'أنجز مهامك واجمع مزيداً من النجوم.',
    exams: 'اختبر مهاراتك وأظهر ما تعلّمته.',
    notes: 'رتّب أفكارك واحتفظ بكل ملاحظاتك المهمة.',
    certificates: 'كل إنجاز تحققه يستحق أن نفتخر به.',
    calendar: 'نظّم وقتك ولا تفوّت أي موعد مهم.',
    books: 'افتح كتاباً وابدأ رحلة جديدة مع الكلمات.',
    messages: 'تواصل مع معلّميك وزملائك بسهولة.',
    notifications: 'تابع كل جديد في رحلتك التعليمية.',
    announcements: 'اكتشف أخبار المدرسة والأنشطة الجديدة.',
    stars: 'اجمع النجوم وتقدّم بين أبطال المدرسة.',
    'video-rooms': 'استعد للقاء تفاعلي ممتع مع معلّمك.',
};

export default function AuthenticatedLayout({ header, children, studentTheme = null }) {
    const { flash, auth, unreadNotifications = 0 } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const activeStudentTheme = studentTheme ?? (auth.user?.role === 'student'
        ? (auth.user?.gender === 'female' ? 'girl' : 'boy')
        : null);
    const currentRoute = route().current() || '';
    const pageGroup = Object.keys(studentPageHints).find((key) => currentRoute.startsWith(key));
    const pageVariant = pageGroup ? Object.keys(studentPageHints).indexOf(pageGroup) % 3 : 0;
    const girlMascots = ['/assets/home/characters/girl2.png', '/assets/home/characters/girl3.png', '/assets/home/characters/girl-card.png'];
    const boyMascots = ['/assets/home/characters/boy-hero.png', '/assets/home/characters/boy-card.png', '/assets/home/characters/boy-schoolbag.png'];
    const pageMascot = activeStudentTheme === 'girl' ? girlMascots[pageVariant] : boyMascots[pageVariant];
    const showStudentIntro = activeStudentTheme && currentRoute !== 'dashboard' && pageGroup;

    return (
        <div className={`relative min-h-screen bg-gradient-to-b from-slate-200/70 to-slate-50 before:fixed before:inset-x-0 before:top-0 before:z-0 before:h-[370px] before:bg-gradient-to-t before:from-theme-1/80 before:to-theme-2 before:content-[''] ${activeStudentTheme ? `student-app-shell student-app-${activeStudentTheme}` : ''}`}>
            <ConfirmDialog />
            <div className="relative z-10 flex min-h-screen">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex min-w-0 flex-1 flex-col pb-16 pt-[54px]">
                    <header className="absolute inset-x-0 top-0 z-20 px-5">
                        <div className="flex h-[54px] items-center justify-between gap-3 xl:ms-[275px]">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10 xl:hidden"
                                    onClick={() => setSidebarOpen(true)}
                                    aria-label="فتح القائمة"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div className="text-white">
                                    {header ? (
                                        <h1 className="text-base font-medium sm:text-lg">{header}</h1>
                                    ) : (
                                        <p className="text-sm text-white/80">
                                            أهلاً، <span className="font-medium text-white">{auth.user?.name}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('notifications.index')}
                                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15"
                                    aria-label="الإشعارات"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium text-white">
                                            {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                        </span>
                                    )}
                                </Link>
                                {typeof auth.user?.stars === 'number' && (
                                    <Link
                                        href={route('stars.leaderboard')}
                                        className="rounded-full bg-amber-400/20 px-3 py-1.5 text-sm font-medium text-amber-100 hover:bg-amber-400/30"
                                    >
                                        {auth.user.stars} ★
                                    </Link>
                                )}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/15"
                                >
                                    خروج
                                </Link>
                            </div>
                        </div>
                    </header>

                    <div className="mt-16 px-5">
                        <div className={`${activeStudentTheme ? 'student-page-content rounded-3xl bg-[#f8fbff] p-3 shadow-sm sm:p-5' : 'rounded-2xl bg-slate-50 p-4 shadow-sm sm:p-5'}`}>
                            {showStudentIntro && (
                                <section className={`student-page-intro student-page-intro-${pageVariant + 1}`}>
                                    <span className="student-page-intro-orb" aria-hidden="true" />
                                    <div><span>{activeStudentTheme === 'girl' ? 'بطلتنا المبدعة' : 'بطلنا المبدع'}</span><h2>{header}</h2><p>{studentPageHints[pageGroup]}</p></div>
                                    <img src={pageMascot} alt="" aria-hidden="true" />
                                </section>
                            )}
                            {(flash?.success || flash?.error) && (
                                <div className="mb-4">
                                    {flash.success && (
                                        <div className="rounded-[0.6rem] border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
                                            {flash.success}
                                        </div>
                                    )}
                                    {flash.error && (
                                        <div className="rounded-[0.6rem] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                                            {flash.error}
                                        </div>
                                    )}
                                </div>
                            )}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
