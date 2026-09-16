import { Head, Link, usePage } from '@inertiajs/react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import ArabetiLogo from '@/Components/ArabetiLogo';

const A = '/assets/home/characters/';
const IMG = {
    boyHero: `${A}boy-hero.png`,
    girlHero: `${A}girl-hero.png`,
    boy1: `${A}boy1.png`,
    gilr1: `${A}gilr1.png`,
    girl2: `${A}girl2.png`,
    girl3: `${A}girl3.png`,
    boyCard: `${A}boy-card.png`,
    girlCard: `${A}girl-card.png`,
    book: `${A}book.png`,
    game: `${A}game.png`,
    hadaf: `${A}hadaf.png`,
    lamp: `${A}lamp.png`,
    ipad: `${A}ipad.png`,
    chat: `${A}chat.png`,
    ka2s: `${A}ka2s.png`,
    pag: `${A}pag.png`,
    think: `${A}think.png`,
    trophy: `${A}trophy.png`,
};

const ageCards = [
    { badge: 'أعمار 2-4', title: 'متعلمين صغار', desc: 'أنشطة ممتعة لبناء الفضائل ومهارات التعلم المبكر', img: IMG.boyCard, color: '#FFE082', btn: '#FFB300' },
    { badge: 'أعمار 5-7', title: 'مستكشفون شباب', desc: 'دروس تفاعلية لتحسين الأساسيات وتعزيز الثقة', img: IMG.girlCard, color: '#A5D6A7', btn: '#66BB6A' },
    { badge: 'أعمار 8-10', title: 'مفكرون أذكياء', desc: 'بناء مفاهيم قوية في الرياضيات والعلوم واللغة', img: IMG.girl2, color: '#90CAF9', btn: '#42A5F5' },
    { badge: 'أعمار 11+', title: 'قادة المستقبل', desc: 'مواضيع متقدمة ومهارات عالمية حقيقية للمستقبل', img: IMG.gilr1, color: '#CE93D8', btn: '#AB47BC' },
];

const features = [
    { title: 'آمن و محمي', desc: 'بيئة تعليم 100% آمنة للاطفال مع رقابة الوالدين', icon: 'shield' },
    { title: 'تعلم مخصص', desc: 'دروس تتكيف مع مستوى طفلك واهتماماته', icon: 'target' },
    { title: 'جوائز و شارات', desc: 'حفز الأطفال بشارات ونقاط ومكافآت ممتعة', icon: 'star' },
    { title: 'تتبع التقدم', desc: 'تقارير مفصلة لمتابعة تطور طفلك خطوة بخطوة', icon: 'chart' },
    { title: 'دعم متخصص', desc: 'فريقنا موجود لمساعدة الآلاف من الآباء والمتعلمين', icon: 'support' },
];

function FeatureIcon({ name }) {
    const paths = {
        shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        target: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-4a6 6 0 100-12 6 6 0 000 12zm0-2a4 4 0 110-8 4 4 0 010 8z',
        star: 'M12 2l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 2z',
        chart: 'M3 3v18h18M7 16l3-3 4 4 5-6',
        support: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
    };
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
            <path d={paths[name]} />
        </svg>
    );
}

const badges = [
    { img: IMG.book, label: 'كتب تفاعلية' },
    { img: IMG.game, label: 'ألعاب تعليمية' },
    { img: IMG.trophy, label: 'جوائز ومكافآت' },
    { img: IMG.think, label: 'دروس تفاعلية' },
    { img: IMG.ipad, label: 'تعلم رقمي' },
    { img: IMG.chat, label: 'دعم مباشر' },
];

export default function Welcome({ content = {}, courses = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <PublicSiteLayout fullBleed hideFooter hideHeader>
            <Head title="عربيتي — تعلم العربية" />
            <div className="lumi-landing" dir="rtl" style={{ minHeight: '100vh' }}>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Poppins:wght@400;600;700;800&display=swap');

                    .lumi-landing {
                        font-family: 'Tajawal', 'Poppins', sans-serif;
                        overflow-x: hidden;
                        background: #EBF4FF;
                        direction: rtl;
                        color: #1E293B;
                    }

                    /* ===== Hero Section ===== */
                    .hero-area {
                        position: relative;
                        width: 100%;
                        min-height: 100vh;
                        background: linear-gradient(180deg, #EBF4FF 0%, #E8F0FE 40%, #E3F2FD 100%);
                        display: flex;
                        align-items: center;
                        overflow: hidden;
                        padding-top: 80px;
                    }

                    .hero-cloud {
                        position: absolute;
                        background: white;
                        border-radius: 50%;
                        opacity: 0.7;
                    }

                    .hero-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        background: white;
                        border-radius: 999px;
                        padding: 8px 20px;
                        font-size: 0.95rem;
                        font-weight: 700;
                        color: #E53935;
                        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                        margin-bottom: 24px;
                    }

                    .hero-badge .star-icon {
                        color: #FBC02D;
                    }

                    .hero-title {
                        font-size: clamp(2.8rem, 6vw, 4.5rem);
                        font-weight: 900;
                        line-height: 1.15;
                        color: #1565C0;
                        margin-bottom: 16px;
                    }

                    .hero-title .accent {
                        color: #FBC02D;
                    }

                    .hero-desc {
                        font-size: 1.15rem;
                        color: #546E7A;
                        line-height: 1.7;
                        max-width: 480px;
                        margin-bottom: 32px;
                    }

                    .hero-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        background: linear-gradient(135deg, #1565C0, #1E88E5);
                        color: white;
                        border: none;
                        border-radius: 999px;
                        padding: 16px 36px;
                        font-size: 1.15rem;
                        font-weight: 800;
                        cursor: pointer;
                        text-decoration: none;
                        box-shadow: 0 8px 24px rgba(21,101,192,0.3);
                        transition: transform .25s ease, box-shadow .25s ease;
                    }
                    .hero-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 12px 32px rgba(21,101,192,0.4);
                    }

                    .hero-visual {
                        position: relative;
                        width: 100%;
                        max-width: 600px;
                        display: flex;
                        align-items: flex-end;
                        justify-content: center;
                    }

                    .hero-mascot {
                        width: min(400px, 45vw);
                        height: auto;
                        z-index: 5;
                        filter: drop-shadow(0 20px 40px rgba(21,101,192,0.18));
                    }

                    .hero-dashboard {
                        position: absolute;
                        right: -10%;
                        top: 10%;
                        width: min(500px, 55vw);
                        height: auto;
                        z-index: 3;
                        filter: drop-shadow(0 20px 50px rgba(0,0,0,0.12));
                        border-radius: 20px;
                    }

                    /* ===== Badges Row ===== */
                    .badges-strip {
                        display: flex;
                        justify-content: center;
                        gap: 28px;
                        flex-wrap: wrap;
                        padding: 48px 20px;
                        background: white;
                        margin-top: -40px;
                        position: relative;
                        z-index: 10;
                        border-radius: 32px 32px 0 0;
                        box-shadow: 0 -8px 30px rgba(0,0,0,0.04);
                    }

                    .badge-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        min-width: 100px;
                    }

                    .badge-item img {
                        width: 64px;
                        height: 64px;
                        object-fit: contain;
                    }

                    .badge-item span {
                        font-size: 0.85rem;
                        font-weight: 700;
                        color: #455A64;
                        text-align: center;
                    }

                    /* ===== Age Section ===== */
                    .ages-section {
                        padding: 80px 20px;
                        background: white;
                    }

                    .section-header {
                        text-align: center;
                        margin-bottom: 48px;
                    }

                    .section-header .kicker {
                        font-size: 0.95rem;
                        font-weight: 800;
                        color: #1E88E5;
                        letter-spacing: 0.05em;
                        text-transform: uppercase;
                        margin-bottom: 8px;
                    }

                    .section-header h2 {
                        font-size: clamp(1.8rem, 4vw, 2.8rem);
                        font-weight: 900;
                        color: #1E293B;
                        margin-bottom: 12px;
                    }

                    .section-header p {
                        color: #78909C;
                        font-size: 1.05rem;
                        max-width: 560px;
                        margin: 0 auto;
                    }

                    .ages-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                        gap: 24px;
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .age-card {
                        border-radius: 24px;
                        padding: 32px 24px 24px;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                        transition: transform .3s ease, box-shadow .3s ease;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                    }

                    .age-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 16px 40px rgba(0,0,0,0.1);
                    }

                    .age-card .age-badge {
                        display: inline-block;
                        background: rgba(255,255,255,0.85);
                        border-radius: 999px;
                        padding: 6px 16px;
                        font-size: 0.85rem;
                        font-weight: 700;
                        color: #455A64;
                        margin-bottom: 12px;
                    }

                    .age-card h3 {
                        font-size: 1.4rem;
                        font-weight: 800;
                        color: #1E293B;
                        margin-bottom: 8px;
                    }

                    .age-card p {
                        font-size: 0.95rem;
                        color: #607D8B;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }

                    .age-card img {
                        width: 120px;
                        height: auto;
                        margin-bottom: 16px;
                    }

                    .age-card .explore-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        border: none;
                        border-radius: 999px;
                        padding: 10px 24px;
                        font-size: 0.95rem;
                        font-weight: 700;
                        color: white;
                        cursor: pointer;
                        text-decoration: none;
                        transition: transform .2s ease;
                    }
                    .age-card .explore-btn:hover {
                        transform: translateY(-2px);
                    }

                    /* ===== Features Section ===== */
                    .features-section {
                        padding: 80px 20px;
                        background: #F5F7FA;
                    }

                    .features-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        max-width: 1100px;
                        margin: 0 auto;
                    }

                    .feature-card {
                        background: white;
                        border-radius: 20px;
                        padding: 28px 20px;
                        text-align: center;
                        box-shadow: 0 4px 16px rgba(0,0,0,0.04);
                        transition: transform .25s ease;
                    }

                    .feature-card:hover {
                        transform: translateY(-4px);
                    }

                    .feature-icon {
                        width: 56px;
                        height: 56px;
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 14px;
                        color: white;
                    }

                    .feature-card h4 {
                        font-size: 1.05rem;
                        font-weight: 800;
                        color: #1E293B;
                        margin-bottom: 6px;
                    }

                    .feature-card p {
                        font-size: 0.88rem;
                        color: #78909C;
                        line-height: 1.6;
                    }

                    /* ===== Bottom CTA ===== */
                    .bottom-cta {
                        padding: 80px 20px;
                        background: linear-gradient(135deg, #1565C0, #1E88E5);
                        text-align: center;
                        color: white;
                        position: relative;
                        overflow: hidden;
                    }

                    .bottom-cta h2 {
                        font-size: clamp(1.6rem, 3.5vw, 2.5rem);
                        font-weight: 900;
                        margin-bottom: 12px;
                    }

                    .bottom-cta p {
                        font-size: 1.05rem;
                        opacity: 0.9;
                        margin-bottom: 28px;
                        max-width: 500px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .bottom-cta .cta-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        background: white;
                        color: #1565C0;
                        border-radius: 999px;
                        padding: 14px 32px;
                        font-size: 1.1rem;
                        font-weight: 800;
                        text-decoration: none;
                        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                        transition: transform .25s ease;
                    }
                    .bottom-cta .cta-btn:hover {
                        transform: translateY(-3px);
                    }

                    /* ===== Trust Bar ===== */
                    .trust-bar {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 32px;
                        flex-wrap: wrap;
                        padding: 32px 20px;
                        background: white;
                        border-top: 1px solid #ECEFF1;
                    }

                    .trust-item {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 0.95rem;
                        font-weight: 700;
                        color: #546E7A;
                    }

                    .trust-stars {
                        color: #FBC02D;
                        font-size: 1.1rem;
                        letter-spacing: 2px;
                    }

                    @media (max-width: 768px) {
                        .hero-area { flex-direction: column; text-align: center; padding-top: 100px; padding-bottom: 40px; }
                        .hero-dashboard { display: none; }
                        .hero-mascot { width: 260px; }
                        .ages-grid { grid-template-columns: 1fr; }
                        .badges-strip { gap: 16px; }
                    }
                `}</style>

                {/* ===== Hero ===== */}
                <section className="hero-area" id="hero">
                    {/* Clouds */}
                    <div className="hero-cloud" style={{ width: 120, height: 40, top: '8%', left: '5%' }} />
                    <div className="hero-cloud" style={{ width: 80, height: 30, top: '15%', right: '10%' }} />
                    <div className="hero-cloud" style={{ width: 100, height: 35, top: '25%', left: '40%' }} />

                    {/* Floating badge */}
                    <div style={{ position: 'absolute', top: '6%', right: '12%', zIndex: 8 }}>
                        <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
                            <polygon points="30,0 37,23 60,23 42,37 49,60 30,47 11,60 18,37 0,23 23,23" fill="#FBC02D" opacity="0.85" />
                            <polygon points="30,6 35,21 53,21 39,31 45,49 30,39 15,49 21,31 7,21 25,21" fill="#FFF8E1" />
                            <text x="30" y="34" textAnchor="middle" fontSize="14" fontWeight="900" fill="#F57F17">★</text>
                        </svg>
                    </div>

                    {/* Rocket SVG */}
                    <div style={{ position: 'absolute', top: '5%', left: '8%', zIndex: 6 }}>
                        <svg width="70" height="90" viewBox="0 0 70 90" aria-hidden="true">
                            <ellipse cx="35" cy="68" rx="14" ry="6" fill="rgba(21,101,192,0.15)" />
                            <path d="M35 5 C45 15 52 35 52 55 C52 68 45 78 35 80 C25 78 18 68 18 55 C18 35 25 15 35 5Z" fill="#E3F2FD" stroke="#1565C0" strokeWidth="2"/>
                            <circle cx="35" cy="42" r="10" fill="#BBDEFB" stroke="#1565C0" strokeWidth="1.5"/>
                            <circle cx="35" cy="42" r="6" fill="#90CAF9"/>
                            <path d="M18 60 C10 65 8 75 12 82 L18 75Z" fill="#EF5350"/>
                            <path d="M52 60 C60 65 62 75 58 82 L52 75Z" fill="#EF5350"/>
                            <path d="M28 78 C30 84 32 86 35 88 C38 86 40 84 42 78" fill="#FF9800"/>
                            <path d="M30 82 C32 86 34 88 35 90 C36 88 38 86 40 82" fill="#FFEB3B"/>
                            <path d="M35 5 L40 0 L38 5Z" fill="#90CAF9" opacity="0.6"/>
                        </svg>
                    </div>

                    <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, padding: '0 32px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 400px', textAlign: 'right' }}>
                            <div className="hero-badge">
                                <span className="star-icon">★</span>
                                موثوق من أكثر من 50,000 والد
                            </div>
                            <h1 className="hero-title">
                                تعلم العربية<br />
                                بطريقة <span className="accent">ممتعة</span>
                            </h1>
                            <p className="hero-desc">
                                منصة تفاعلية تساعد أطفالكم على تعلم اللغة العربية بحب من خلال دروس وأنشطة وألعاب مخصصة لكل عمر.
                            </p>
                            <Link href={route('register')} className="hero-btn">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2"/>
                                    <polygon points="10,8 10,16 16,12" />
                                </svg>
                                ابدأ التعلم الآن
                            </Link>
                        </div>
                        <div className="hero-visual" style={{ flex: '1 1 400px', justifyContent: 'center' }}>
                            <img src={IMG.boyHero} alt="شخصية تعلم العربية" className="hero-mascot" />
                        </div>
                    </div>
                </section>

                {/* ===== Badges Strip ===== */}
                <div className="badges-strip">
                    {badges.map((b, i) => (
                        <div className="badge-item" key={i}>
                            <img src={b.img} alt={b.label} loading="lazy" />
                            <span>{b.label}</span>
                        </div>
                    ))}
                </div>

                {/* ===== Age Groups ===== */}
                <section className="ages-section" id="grades">
                    <div className="section-header">
                        <div className="kicker">◆ تعلم لكل مرحلة عمرية</div>
                        <h2>تعلم لجميع الأعمار والمراحل</h2>
                        <p>محتوى مخصص مصمم ليتناسب مع عمر واهتمامات طفلك</p>
                    </div>
                    <div className="ages-grid">
                        {ageCards.map((card) => (
                            <article className="age-card" key={card.title} style={{ background: card.color }}>
                                <div className="age-badge">{card.badge}</div>
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                                <img src={card.img} alt={card.title} loading="lazy" />
                                <a href="#" className="explore-btn" style={{ background: card.btn }}>
                                    استكشف
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ===== Features ===== */}
                <section className="features-section" id="how">
                    <div className="section-header">
                        <div className="kicker">◆ مميزاتنا</div>
                        <h2>لماذا نحن الأفضل؟</h2>
                        <p>نقدم أفضل تجربة تعليمية لطفلك مع الاهتمام بكل التفاصيل</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => {
                            const bgColors = ['#1565C0', '#E53935', '#FBC02D', '#43A047', '#8E24AA'];
                            return (
                                <div className="feature-card" key={f.title}>
                                    <div className="feature-icon" style={{ background: bgColors[i] }}>
                                        <FeatureIcon name={f.icon} />
                                    </div>
                                    <h4>{f.title}</h4>
                                    <p>{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ===== Trust Bar ===== */}
                <div className="trust-bar">
                    <div className="trust-item">
                        <span className="trust-stars">★★★★★</span>
                        <span>4.8/5 من 10,000+ تقييم</span>
                    </div>
                    <div className="trust-item">✓ معتمد COPPA</div>
                    <div className="trust-item">🛡️ آمن للأطفال</div>
                    <div className="trust-item">💬 دعم 24/7</div>
                </div>

                {/* ===== Bottom CTA ===== */}
                <section className="bottom-cta">
                    <h2>هل أنت مستعد لتبدأ رحلة التعلم؟</h2>
                    <p>انضم الآن واكتشف عالم العربية بطريقة تفاعلية ممتعة مع أصدقائك.</p>
                    <Link href={route('register')} className="cta-btn">
                        ابدأ مجاناً
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </section>
            </div>
        </PublicSiteLayout>
    );
}
