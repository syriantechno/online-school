import { Link, router } from '@inertiajs/react';
import { useStudentTheme } from '@/contexts/StudentThemeContext';

const paths = {
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z',
    play: 'M8 5v14l11-7L8 5z',
    star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z',
    check: 'M5 12.5 9.2 17 19 7',
    chart: 'M4 19V9m6 10V5m6 14v-7m5 7H2',
    user: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m7.5-10a4 4 0 100-8 4 4 0 000 8z',
    logout: 'M17 7l5 5m0 0-5 5m5-5H9m4-5H5a2 2 0 00-2 2v10a2 2 0 002 2h8',
    settings: 'M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
    arrow: 'M19 12H5m7-7l-7 7 7 7',
};

const statIcons = ['book', 'chart', 'star', 'check'];

function Icon({ name, className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
        </svg>
    );
}

function SectionHead({ kicker, title, href, linkLabel }) {
    return (
        <div className="student-space-section-head">
            <div>
                <span>{kicker}</span>
                <h2>{title}</h2>
            </div>
            {href && (
                <Link href={href} className="student-space-section-link">
                    {linkLabel}
                    <Icon name="arrow" className="h-4 w-4" />
                </Link>
            )}
        </div>
    );
}

function EmptyBlock({ icon, title, text, href, actionLabel }) {
    return (
        <div className="student-space-empty">
            <span className="student-space-empty-icon"><Icon name={icon} className="h-6 w-6" /></span>
            <div>
                <strong>{title}</strong>
                <p>{text}</p>
            </div>
            {href && (
                <Link href={href} className="site-btn site-btn-primary site-btn-sm">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}

export default function StudentProfileContent({ user, stats = [], recentCourses = [], announcements = [], enrollments = [] }) {
    const { isGirl } = useStudentTheme();
    const character = isGirl ? '/assets/home/characters/girl-hero.png' : '/assets/home/characters/boy-hero.png';
    const firstName = user.name?.replace(/^(الطالب|الطالبة)\s*/, '') || user.name;

    const shortcuts = [
        { title: 'تعلّمي', text: 'آخر دروسك', href: route('learning.my'), icon: 'play' },
        { title: 'الدورات', text: 'اكتشف جديد', href: route('explore.index'), icon: 'book' },
        { title: 'النجوم', text: 'لوحة المتصدرين', href: route('stars.leaderboard'), icon: 'star' },
        { title: 'إعداداتي', text: 'بيانات الحساب', href: route('profile.edit'), icon: 'settings' },
    ];

    return (
        <div className="student-space">
            <section className="student-space-banner" aria-label="ملفي الشخصي">
                <div className="student-space-banner-glow" aria-hidden="true" />
                <div className="student-space-banner-orb student-space-banner-orb-a" aria-hidden="true" />
                <div className="student-space-banner-orb student-space-banner-orb-b" aria-hidden="true" />

                <div className="student-space-banner-top">
                    <span className="student-space-kicker">{isGirl ? 'بطلتنا المبدعة ✦' : 'بطلنا المبدع ✦'}</span>
                    <button
                        type="button"
                        onClick={() => router.post(route('logout'))}
                        className="student-space-logout"
                        aria-label="تسجيل الخروج"
                    >
                        <Icon name="logout" className="h-4 w-4" />
                        <span>خروج</span>
                    </button>
                </div>

                <div className="student-space-banner-main">
                    <div className="student-space-banner-copy">
                        <h1>أهلاً يا {firstName}!</h1>
                        <p>مساحتك الخاصة — تابع تقدّمك، عدّ لدروسك، واجمع نجومك.</p>
                        <div className="student-space-banner-actions">
                            <Link href={route('learning.my')} className="site-btn site-btn-primary">
                                <Icon name="play" />
                                ابدأ التعلّم
                            </Link>
                            <Link href={route('stars.leaderboard')} className="site-btn site-btn-ghost student-space-banner-ghost">
                                <Icon name="star" />
                                {user.stars ?? 0} نجمة
                            </Link>
                        </div>
                    </div>

                    <div className="student-space-character" aria-hidden="true">
                        <span className="student-space-character-blob" />
                        <img src={character} alt="" className="student-space-character-img" />
                    </div>
                </div>

                <div className="student-space-banner-stats">
                    {stats.map((stat, index) => (
                        <div key={stat.label} className="student-space-stat">
                            <span className="student-space-stat-icon">
                                <Icon name={statIcons[index] || 'star'} className="h-5 w-5" />
                            </span>
                            <div>
                                <strong>{stat.value}</strong>
                                <small>{stat.label}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <nav className="student-space-shortcuts" aria-label="اختصارات سريعة">
                {shortcuts.map((item) => (
                    <Link key={item.title} href={item.href} className="student-space-shortcut">
                        <span className="student-space-shortcut-icon"><Icon name={item.icon} /></span>
                        <span className="student-space-shortcut-copy">
                            <strong>{item.title}</strong>
                            <small>{item.text}</small>
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="student-space-layout">
                <main className="student-space-main">
                    <section className="student-space-section">
                        <SectionHead
                            kicker="رحلتك التعليمية"
                            title="تقدّم دوراتك"
                            href={route('learning.my')}
                            linkLabel="عرض تعلّمي"
                        />

                        {enrollments.length > 0 ? (
                            <div className="student-space-progress-list">
                                {enrollments.map((enrollment) => (
                                    <article key={enrollment.id} className="student-space-progress-card">
                                        <span className="student-space-progress-badge" aria-hidden="true">
                                            <Icon name="book" className="h-5 w-5" />
                                        </span>
                                        <div className="student-space-progress-body">
                                            <div className="student-space-progress-meta">
                                                <Link
                                                    href={enrollment.course?.slug ? route('explore.show', enrollment.course.slug) : route('explore.index')}
                                                    className="student-space-progress-title"
                                                >
                                                    {enrollment.course?.title}
                                                </Link>
                                                <span className="student-space-progress-percent">{enrollment.progress_percent}%</span>
                                            </div>
                                            <div
                                                className="student-space-progress"
                                                role="progressbar"
                                                aria-valuenow={enrollment.progress_percent}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-label={`تقدّم ${enrollment.course?.title}`}
                                            >
                                                <span style={{ width: `${enrollment.progress_percent}%` }} />
                                            </div>
                                        </div>
                                        <Link
                                            href={route('learning.my')}
                                            className="student-space-progress-action"
                                        >
                                            متابعة
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <EmptyBlock
                                icon="play"
                                title="لم تبدأ رحلتك بعد"
                                text="اختر دورة مناسبة وابدأ أول درس — نجومك بانتظارك!"
                                href={route('explore.index')}
                                actionLabel="استكشف الدورات"
                            />
                        )}
                    </section>
                </main>

                <aside className="student-space-aside">
                    <section className="student-space-section">
                        <SectionHead kicker="جديد المدرسة" title="إعلانات" />
                        {announcements.length > 0 ? (
                            <div className="student-space-feed">
                                {announcements.map((item) => (
                                    <article key={item.id} className="student-space-feed-item">
                                        <span className="student-space-feed-dot" aria-hidden="true" />
                                        <div>
                                            <strong>{item.title}</strong>
                                            <p>{item.body}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <EmptyBlock
                                icon="star"
                                title="لا إعلانات حالياً"
                                text="سنخبرك هنا عند وجود أخبار أو أنشطة جديدة."
                            />
                        )}
                    </section>

                    <section className="student-space-section">
                        <SectionHead
                            kicker="سجلّك"
                            title="آخر الدورات"
                            href={route('explore.index')}
                            linkLabel="كل الدورات"
                        />
                        {recentCourses.length > 0 ? (
                            <div className="student-space-list">
                                {recentCourses.map((course) => (
                                    <Link key={course.id} href={route('explore.show', course.slug)} className="student-space-list-item">
                                        <span className="student-space-list-icon"><Icon name="book" className="h-4 w-4" /></span>
                                        <span className="student-space-list-copy">
                                            <strong>{course.title}</strong>
                                            <small>{course.subject || 'اللغة العربية'}{course.level ? ` · ${course.level}` : ''}</small>
                                        </span>
                                        <Icon name="arrow" className="student-space-list-arrow h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <EmptyBlock
                                icon="book"
                                title="لا دورات بعد"
                                text="اشترك بدورتك الأولى وابدأ التعلّم اليوم."
                                href={route('explore.index')}
                                actionLabel="تصفّح الدورات"
                            />
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}
