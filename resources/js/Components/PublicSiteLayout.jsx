import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import BrandLetters from '@/Components/BrandLetters';
import ArabetiLogo from '@/Components/ArabetiLogo';

const paths = {
    search: 'M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z',
    login: 'M10 17l5-5-5-5m5 5H3m12-9h4a2 2 0 012 2v14a2 2 0 01-2 2h-4',
    logout: 'M17 7l5 5m0 0-5 5m5-5H9m4-5H5a2 2 0 00-2 2v10a2 2 0 002 2h8',
    user: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m7.5-10a4 4 0 100-8 4 4 0 000 8zM19 8v6m3-3h-6',
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'M6 6l12 12M18 6L6 18',
    book: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zm0 0A2.5 2.5 0 006.5 22H20',
    play: 'M8 5v14l11-7L8 5z',
    star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z',
    dashboard: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 6a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z',
    arrow: 'M5 12h14m-7-7l7 7-7 7',
};

function Icon({ name, className = 'h-6 w-6' }) {
    return (
        <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
        </svg>
    );
}

const nav = [
    ['الرئيسية', '/'],
    ['الدورات', '/explore'],
    ['المعلمون', '/teachers'],
    ['الصفوف', '/#grades'],
    ['تواصل معنا', '/contact'],
];

export function formatDuration(minutes) {
    const total = Number(minutes) || 0;
    if (!total) return '—';
    if (total < 60) return `${total} د`;
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return mins ? `${hours} س ${mins} د` : `${hours} س`;
}

function LogoutButton({ className = 'site-btn site-btn-ghost', onClick }) {
    return (
        <Link
            href={route('logout')}
            method="post"
            as="button"
            className={className}
            onClick={onClick}
        >
            <Icon name="logout" className="h-5 w-5" />
            خروج
        </Link>
    );
}

export default function PublicSiteLayout({ children, title, fullBleed = false, overlayHero = false }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const isStudent = user?.role === 'student';

    useEffect(() => {
        if (!overlayHero) {
            setScrolled(false);
            return undefined;
        }
        const onScroll = () => setScrolled(window.scrollY > 48);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [overlayHero]);

    const headerClass = [
        'site-header fixed inset-x-0 top-0 z-50',
        overlayHero ? 'is-on-hero is-light-hero' : '',
        overlayHero && scrolled ? 'is-scrolled' : '',
    ].filter(Boolean).join(' ');

    return (
        <div dir="rtl" className="site-shell min-h-screen overflow-x-hidden font-sans text-[var(--site-text)]">
            <header className={headerClass}>
                <nav aria-label="التنقل الرئيسي" className="site-header-inner">
                    <Link href="/" className="site-brand site-brand-with-logo">
                        <ArabetiLogo size="nav" animate={false} />
                    </Link>

                    <div className="site-nav-desktop">
                        {nav.map(([label, href]) => (
                            <Link key={label} href={href} className="site-nav-link">
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="site-header-actions">
                        {user ? (
                            isStudent ? (
                                <>
                                    <Link href={route('learning.my')} className="site-btn site-btn-ghost hidden sm:inline-flex">
                                        <Icon name="play" className="h-5 w-5" />
                                        تعلّمي
                                    </Link>
                                    <Link href={route('student.profile')} className="site-btn site-btn-primary hidden sm:inline-flex">
                                        <Icon name="user" className="h-5 w-5" />
                                        ملفي
                                    </Link>
                                    <LogoutButton className="site-btn site-btn-ghost hidden sm:inline-flex" />
                                </>
                            ) : (
                                <>
                                    <Link href={route('learning.my')} className="site-btn site-btn-ghost hidden sm:inline-flex">
                                        <Icon name="play" className="h-5 w-5" />
                                        تعلّمي
                                    </Link>
                                    <Link href={route('dashboard')} className="site-btn site-btn-primary hidden sm:inline-flex">
                                        <Icon name="dashboard" className="h-5 w-5" />
                                        لوحة التحكم
                                    </Link>
                                    <LogoutButton className="site-btn site-btn-ghost hidden sm:inline-flex" />
                                </>
                            )
                        ) : (
                            <>
                                <Link href={route('login')} className="site-btn site-btn-ghost hidden sm:inline-flex">
                                    <Icon name="login" className="h-5 w-5" />
                                    تسجيل دخول
                                </Link>
                                <Link href={route('register')} className="site-btn site-btn-primary">
                                    <Icon name="user" className="h-5 w-5" />
                                    ابدأ مجاناً
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
                        onClick={() => setOpen(!open)}
                        className="site-menu-btn xl:hidden"
                    >
                        <Icon name={open ? 'close' : 'menu'} />
                    </button>
                </nav>

                {open && (
                    <div className="site-mobile-menu xl:hidden">
                        {nav.map(([label, href]) => (
                            <Link key={label} href={href} onClick={() => setOpen(false)} className="site-mobile-link">
                                {label}
                            </Link>
                        ))}
                        {user && (
                            <div className="mt-3 grid gap-2 border-t border-[var(--site-border)] pt-3">
                                {isStudent ? (
                                    <Link href={route('student.profile')} onClick={() => setOpen(false)} className="site-mobile-link font-black text-[var(--site-primary)]">
                                        <Icon name="user" className="inline h-4 w-4 ml-1" />
                                        ملفي
                                    </Link>
                                ) : (
                                    <Link href={route('dashboard')} onClick={() => setOpen(false)} className="site-mobile-link font-black text-[var(--site-primary)]">
                                        لوحة التحكم
                                    </Link>
                                )}
                                <Link href={route('learning.my')} onClick={() => setOpen(false)} className="site-mobile-link">
                                    <Icon name="play" className="inline h-4 w-4 ml-1" />
                                    تعلّمي
                                </Link>
                                <LogoutButton
                                    className="site-mobile-link w-full text-right text-rose-600"
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                        )}
                        {!user && (
                            <div className="mt-3 grid gap-2 border-t border-[var(--site-border)] pt-3">
                                <Link href={route('login')} onClick={() => setOpen(false)} className="site-mobile-link">
                                    تسجيل دخول
                                </Link>
                                <Link href={route('register')} onClick={() => setOpen(false)} className="site-mobile-link font-black text-[var(--site-primary)]">
                                    ابدأ مجاناً
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <main className={fullBleed ? '' : 'site-main'}>
                {title && (
                    <div className="site-page-title">
                        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-7 lg:px-10">
                            <h1>{title}</h1>
                        </div>
                    </div>
                )}
                {children}
            </main>

            <footer className="site-footer site-footer-branded">
                <div className="site-footer-wave" aria-hidden="true">
                    <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,48 C240,96 480,0 720,32 C960,64 1200,96 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
                <div className="site-footer-bridge">
                    <Link href={route('explore.index')} className="site-btn site-btn-accent">
                        للطلاب والأهل
                        <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                    <Link href={route('marketing.teachers')} className="site-btn site-btn-accent">
                        للمعلمين
                        <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                </div>
                <BrandLetters variant="footer" />
                <div className="site-footer-grid">
                    <div>
                        <strong className="site-footer-brand site-brand-arabeti">عربيتي</strong>
                        <p className="site-footer-text">
                            منصة عربية للأطفال والعائلات: حروف وهوية أصيلة، دروس قصيرة، ومتابعة تقدّم يفهمها الأهل.
                        </p>
                    </div>
                    <div>
                        <h3>تعلّم معنا</h3>
                        <ul>
                            <li><Link href={route('explore.index')}>استكشف الدورات</Link></li>
                            <li><Link href="/#grades">مسار النجوم</Link></li>
                            <li><Link href={route('register')}>إنشاء حساب</Link></li>
                            <li><Link href={route('marketing.pricing')}>الأسعار</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3>للعائلات</h3>
                        <ul>
                            <li><Link href={route('marketing.about')}>عن المدرسة</Link></li>
                            <li><Link href={route('marketing.teachers')}>المعلمون</Link></li>
                            <li><Link href={route('marketing.contact')}>تواصل معنا</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3>روابط مفيدة</h3>
                        <ul>
                            <li><Link href={route('marketing.blog')}>المدونة</Link></li>
                            <li><Link href={route('login')}>تسجيل الدخول</Link></li>
                            <li><Link href={route('register')}>اشترك</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="site-footer-bar">
                    <span>© {new Date().getFullYear()} عربيتي</span>
                    <span>هوية الحرف العربي</span>
                </div>
            </footer>
        </div>
    );
}
