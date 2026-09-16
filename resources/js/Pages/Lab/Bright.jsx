import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * صفحة مستقلة — مطابقة تصميم Brightly (Pinterest)
 * المسار: /lab/bright
 * لا تستخدم PublicSiteLayout ولا ناف بار الموقع.
 */
const A = {
    lama: '/assets/home/characters/girl-3d-1.png',
    majd: '/assets/home/characters/boy-3d-1.png',
    both: '/assets/home/characters/boy-girl-3d.png',
    lamp: '/assets/home/characters/lamp.png',
    target: '/assets/home/characters/hadaf.png',
    trophy: '/assets/home/characters/ka2s.png',
    chat: '/assets/home/characters/chat.png',
    book: '/assets/home/characters/book.png',
    pencil: '/assets/home/characters/card-pic1.png',
    think: '/assets/home/characters/think.png',
    game: '/assets/home/characters/game.png',
};

const LINKS = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'about', label: 'من نحن' },
    { id: 'services', label: 'المزايا' },
    { id: 'work', label: 'المسار' },
    { id: 'reviews', label: 'آراء' },
    { id: 'contact', label: 'تواصل' },
];

const STATS = [
    { n: '١٠آ+', l: 'طالب سعيد', img: A.both, bg: '#ece7ff' },
    { n: '٥٠٠+', l: 'درس مكتمل', img: A.book, bg: '#ffe8e4' },
    { n: '٥+', l: 'سنوات خبرة', img: A.trophy, bg: '#d8f5ef' },
    { n: '٩٨٪', l: 'رضا الأهل', img: A.lamp, bg: '#fff1cc' },
];

const CARDS = [
    { t: 'تركيز على الطفل', d: 'مسار يناسب عمر طفلك واهتماماته في كل درس.', img: A.target, pad: '#ece7ff', line: '#8b5cf6' },
    { t: 'حلول إبداعية', d: 'لعب وأغاني وشخصيات تجعل الحرف حيًّا وممتعًا.', img: A.lamp, pad: '#ffe4dc', line: '#fb7185' },
    { t: 'آمن وموثوق', d: 'بيئة مغلقة للأطفال مع متابعة يفهمها الأهل.', img: A.think, pad: '#d8f5ef', line: '#14b8a6' },
    { t: 'نتائج ملموسة', d: 'نجوم ووقت وإنجازات تظهر التقدّم أسبوعيًا.', img: A.trophy, pad: '#fff1cc', line: '#f59e0b' },
    { t: 'فريق خبير', d: 'معلمون ومصمّمون تربويون يبنون الرحلة معكم.', img: A.both, pad: '#e4e9ff', line: '#6366f1' },
    { t: 'دعم على مدار الساعة', d: 'نرد على أسئلتكم ونساعدكم في اختيار البداية.', img: A.chat, pad: '#ffe4f1', line: '#ec4899' },
];

function Arrow() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
        </svg>
    );
}

function LogoMark() {
    return (
        <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <path
                fill="#9b87f5"
                d="M16 3c4.2 5.2 8 8.4 8 13.2A8 8 0 0 1 8 16.2C8 11.4 11.8 8.2 16 3z"
            />
            <circle cx="16" cy="17.5" r="3.2" fill="#7c6ad6" />
        </svg>
    );
}

function HeartTiny() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#9b87f5" aria-hidden="true">
            <path d="M12 21s-7-4.4-9.4-8C.8 10.2 1.4 6.7 4.2 5.4 6.3 4.4 8.9 5.3 12 7.8c3.1-2.5 5.7-3.4 7.8-2.4 2.8 1.3 3.4 4.8 1.6 7.6C19 16.6 12 21 12 21z" />
        </svg>
    );
}

export default function Bright() {
    const [active, setActive] = useState('home');
    const [menu, setMenu] = useState(false);

    useEffect(() => {
        document.documentElement.classList.remove('site-theme-boy', 'site-theme-girl', 'site-theme-general');
        document.body.style.background = '#fbf9ff';
        return () => {
            document.body.style.background = '';
        };
    }, []);

    return (
        <>
            <Head title="عربيتي — Brightly">
                <meta name="robots" content="noindex" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=nunito:600,700,800|cairo:600,700,800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style>{`
                html,body,#app{background:#fbf9ff !important;margin:0}
                .by{
                    --ink:#2a2f45;
                    --muted:#8b90a5;
                    --lav:#9b87f5;
                    --lav2:#8a74e8;
                    --soft:#f3efff;
                    --font:'Nunito','Cairo',system-ui,sans-serif;
                    font-family:var(--font);
                    color:var(--ink);
                    background:#fbf9ff;
                    min-height:100vh;
                    overflow-x:clip;
                }
                .by *,.by *::before,.by *::after{box-sizing:border-box}
                .by a{color:inherit}
                .by-shell{width:min(1180px,100%);margin:0 auto;padding:1.25rem 1.25rem 3rem}

                /* —— NAV: كبسولة عائمة مثل Brightly — لا تشبه ناف بار الموقع —— */
                /* ناف بار LTR مثل Brightly: شعار يسار · روابط وسط · زر يمين */
                .by-nav{
                    direction:ltr;
                    display:flex;align-items:center;justify-content:space-between;gap:1rem;
                    background:#fff;
                    border-radius:999px;
                    padding:.55rem .55rem .55rem 1.15rem;
                    box-shadow:0 8px 30px rgba(60,50,120,.08);
                    position:relative;z-index:20;
                }
                .by-nav .by-link,.by-nav .by-brand strong,.by-nav-btn{font-family:'Cairo','Nunito',system-ui,sans-serif}
                .by-drawer{direction:rtl}
                .by-brand{display:inline-flex;align-items:center;gap:.55rem;text-decoration:none;flex-shrink:0}
                .by-brand strong{font-size:1.2rem;font-weight:800;letter-spacing:-.02em;color:var(--ink)}
                .by-links{display:none;align-items:center;gap:.1rem;flex:1;justify-content:center}
                @media(min-width:980px){.by-links{display:flex}}
                .by-link{
                    position:relative;appearance:none;border:0;background:transparent;cursor:pointer;
                    padding:.55rem .85rem;font:inherit;font-size:.9rem;font-weight:700;
                    color:var(--muted);border-radius:999px;transition:color .2s ease;
                }
                .by-link:hover{color:var(--ink)}
                .by-link.is-on{color:var(--ink)}
                .by-link.is-on::after{
                    content:'';position:absolute;left:50%;bottom:.15rem;transform:translateX(-50%);
                    width:6px;height:6px;border-radius:50%;background:var(--lav);
                }
                .by-nav-btn{
                    display:inline-flex;align-items:center;gap:.45rem;
                    min-height:2.85rem;padding:0 1.2rem;border-radius:999px;
                    background:var(--lav);color:#fff;font-weight:800;font-size:.9rem;
                    text-decoration:none;border:0;cursor:pointer;flex-shrink:0;
                    box-shadow:0 10px 22px rgba(155,135,245,.35);
                    transition:transform .2s ease,filter .2s ease;
                }
                .by-nav-btn:hover{transform:translateY(-1px);filter:brightness(1.04)}
                .by-burger{
                    display:grid;place-items:center;width:2.7rem;height:2.7rem;border-radius:999px;
                    border:0;background:var(--soft);color:var(--ink);cursor:pointer;margin-inline-end:.15rem;
                }
                @media(min-width:980px){.by-burger{display:none}}
                .by-drawer{
                    margin-top:.75rem;background:#fff;border-radius:1.5rem;padding:.75rem;
                    box-shadow:0 16px 40px rgba(60,50,120,.1);display:grid;gap:.25rem;
                }
                @media(min-width:980px){.by-drawer{display:none !important}}
                .by-drawer button,.by-drawer a{
                    text-align:right;padding:.85rem 1rem;border-radius:1rem;border:0;background:#fbf9ff;
                    font:inherit;font-weight:700;color:var(--ink);cursor:pointer;text-decoration:none;
                }

                /* —— HERO —— */
                .by-hero{
                    position:relative;
                    display:grid;gap:1.5rem;align-items:center;
                    padding:clamp(2.5rem,6vw,4.5rem) .5rem clamp(5.5rem,10vw,7.5rem);
                    direction:ltr; /* مطابقة Brightly: الشخصية يسار والنص يمين */
                }
                @media(min-width:960px){
                    .by-hero{grid-template-columns:1.1fr .95fr;gap:2rem;min-height:560px}
                }
                .by-blob{
                    position:absolute;border-radius:50%;pointer-events:none;z-index:0;
                    background:radial-gradient(circle,#e4dcff 0%,rgba(228,220,255,0) 70%);
                }
                .by-blob-1{width:min(520px,70vw);height:min(520px,70vw);top:-6%;left:-8%}
                .by-blob-2{width:min(340px,50vw);height:min(340px,50vw);bottom:8%;right:-6%;background:radial-gradient(circle,#ffe8f3 0%,rgba(255,232,243,0) 70%)}
                .by-visual{position:relative;z-index:2;min-height:340px;display:grid;place-items:center}
                .by-desk{
                    position:relative;width:min(100%,480px);aspect-ratio:1/1.05;
                    display:grid;place-items:end center;
                }
                .by-desk-glow{
                    position:absolute;inset:18% 8% 6%;border-radius:50%;
                    background:radial-gradient(ellipse at 50% 60%,rgba(155,135,245,.28),transparent 68%);
                    z-index:0;
                }
                .by-hero-char{
                    position:relative;z-index:2;width:78%;max-width:360px;
                    filter:drop-shadow(0 30px 28px rgba(60,50,120,.18));
                    transform:translateY(4%);
                }
                .by-float{
                    position:absolute;z-index:3;filter:drop-shadow(0 12px 10px rgba(60,50,120,.12));
                    animation:byBob 4.8s ease-in-out infinite;
                }
                .by-float-1{width:72px;left:2%;top:22%}
                .by-float-2{width:58px;right:4%;top:14%;animation-delay:.5s}
                .by-float-3{width:64px;left:6%;bottom:16%;animation-delay:.9s}
                .by-float-4{width:52px;right:8%;bottom:28%;animation-delay:1.2s}
                @keyframes byBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
                .by-copy{position:relative;z-index:2;max-width:34rem;direction:rtl;text-align:right}
                @media(min-width:960px){.by-copy{padding-inline-end:1rem}}
                .by-pill{
                    display:inline-flex;align-items:center;gap:.45rem;
                    background:#fff;border-radius:999px;padding:.45rem .95rem;
                    font-size:.82rem;font-weight:700;color:#6d668c;
                    box-shadow:0 8px 22px rgba(60,50,120,.07);
                }
                .by-h1{
                    margin:1.1rem 0 0;font-size:clamp(2.6rem,5.2vw,4rem);
                    font-weight:800;line-height:1.12;letter-spacing:-.03em;color:var(--ink);
                }
                .by-p{
                    margin:1rem 0 0;font-size:1.08rem;line-height:1.75;font-weight:600;color:var(--muted);
                    max-width:28rem;
                }
                .by-btn{
                    display:inline-flex;align-items:center;gap:.5rem;margin-top:1.6rem;
                    min-height:3.15rem;padding:0 1.45rem;border-radius:999px;
                    background:var(--lav);color:#fff;font-weight:800;font-size:1rem;
                    text-decoration:none;border:0;cursor:pointer;
                    box-shadow:0 14px 28px rgba(155,135,245,.38);
                    transition:transform .2s ease,filter .2s ease;
                }
                .by-btn:hover{transform:translateY(-2px);filter:brightness(1.04)}
                .by-btn.is-solid{background:var(--lav2)}

                /* —— STATS —— */
                .by-stats{
                    position:relative;z-index:5;margin-top:-3.25rem;
                    background:#fff;border-radius:1.75rem;
                    padding:1.35rem 1.1rem;
                    display:grid;grid-template-columns:repeat(2,1fr);gap:1.1rem;
                    box-shadow:0 22px 50px rgba(60,50,120,.09);
                }
                @media(min-width:860px){
                    .by-stats{grid-template-columns:repeat(4,1fr);padding:1.5rem 1.75rem;gap:1rem}
                }
                .by-stat{display:flex;align-items:center;gap:.85rem}
                .by-stat-ico{
                    width:3.35rem;height:3.35rem;border-radius:1.05rem;flex-shrink:0;
                    display:grid;place-items:center;background:var(--bg);
                }
                .by-stat-ico img{width:2.05rem;height:2.05rem;object-fit:contain}
                .by-stat strong{display:block;font-size:1.45rem;font-weight:800;line-height:1;color:var(--ink)}
                .by-stat span{display:block;margin-top:.28rem;font-size:.8rem;font-weight:700;color:var(--muted)}

                /* —— FEATURES —— */
                .by-sec{padding:clamp(3.2rem,7vw,5rem) .25rem 1rem}
                .by-head{text-align:center;max-width:40rem;margin:0 auto 2.4rem}
                .by-kicker{
                    margin:0;font-size:.78rem;font-weight:800;letter-spacing:.08em;
                    color:var(--lav);text-transform:uppercase;
                }
                .by-head h2{
                    margin:.55rem 0 0;font-size:clamp(1.85rem,3.6vw,2.55rem);
                    font-weight:800;letter-spacing:-.02em;color:var(--ink);
                }
                .by-rule{
                    display:flex;align-items:center;justify-content:center;gap:.55rem;margin-top:.9rem;
                }
                .by-rule i{width:36px;height:2.5px;border-radius:999px;background:#d9d1f7;display:block}
                .by-grid{
                    display:grid;gap:1.15rem;
                    grid-template-columns:1fr;
                }
                @media(min-width:700px){.by-grid{grid-template-columns:repeat(2,1fr)}}
                @media(min-width:1020px){.by-grid{grid-template-columns:repeat(3,1fr);gap:1.25rem}}
                .by-card{
                    background:#fff;border-radius:1.6rem;padding:1.7rem 1.35rem 1.45rem;
                    text-align:center;
                    box-shadow:0 16px 40px rgba(60,50,120,.06);
                    transition:transform .22s ease,box-shadow .22s ease;
                }
                .by-card:hover{transform:translateY(-5px);box-shadow:0 24px 48px rgba(60,50,120,.1)}
                .by-card-pad{
                    width:5rem;height:5rem;margin:0 auto;border-radius:1.35rem;
                    display:grid;place-items:center;background:var(--pad);
                }
                .by-card-pad img{width:3.15rem;height:3.15rem;object-fit:contain}
                .by-card h3{margin:1.05rem 0 0;font-size:1.15rem;font-weight:800;color:var(--ink)}
                .by-card p{margin:.55rem auto 0;max-width:17rem;font-size:.9rem;line-height:1.7;font-weight:600;color:var(--muted)}
                .by-card-line{width:40px;height:3.5px;border-radius:999px;background:var(--line);margin:1rem auto 0}

                /* —— CTA BAND —— */
                .by-cta{
                    margin-top:clamp(2rem,5vw,3.2rem);
                    background:linear-gradient(90deg,#efeaff 0%,#e8e0ff 50%,#efeaff 100%);
                    border-radius:1.85rem;
                    padding:1.4rem 1.35rem;
                    display:grid;gap:1.1rem;align-items:center;
                    position:relative;overflow:hidden;
                }
                @media(min-width:900px){
                    .by-cta{grid-template-columns:auto 1fr auto;padding:1.55rem 1.8rem;gap:1.5rem}
                }
                .by-cta-ico{
                    width:4.8rem;height:4.8rem;border-radius:1.35rem;background:rgba(255,255,255,.65);
                    display:grid;place-items:center;
                }
                .by-cta-ico img{width:3rem;height:3rem;object-fit:contain}
                .by-cta h3{margin:0;font-size:clamp(1.25rem,2.5vw,1.65rem);font-weight:800;color:var(--ink)}
                .by-cta p{margin:.35rem 0 0;font-size:.95rem;font-weight:600;color:var(--muted)}
                .by-cta-plant{
                    position:absolute;width:68px;bottom:-4px;inset-inline-end:1.1rem;
                    pointer-events:none;
                }
                @media(max-width:899px){.by-cta-plant{display:none}}

                .by-foot{
                    margin-top:1.75rem;text-align:center;font-size:.8rem;font-weight:700;color:var(--muted);
                }
                .by-foot a{color:var(--lav2);text-decoration:none;font-weight:800}

                @media(prefers-reduced-motion:reduce){
                    .by-float{animation:none}
                }
            `}</style>

            <div className="by" dir="rtl" lang="ar">
                <div className="by-shell">
                    {/* ناف بار Brightly — كبسولة مستقلة */}
                    <header className="by-nav" id="home">
                        <Link href="/lab/bright" className="by-brand">
                            <LogoMark />
                            <strong>عربيتي</strong>
                        </Link>

                        <nav className="by-links" aria-label="القائمة">
                            {LINKS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`by-link${active === item.id ? ' is-on' : ''}`}
                                    onClick={() => {
                                        setActive(item.id);
                                        const el = document.getElementById(item.id === 'home' ? 'home' : item.id);
                                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <a className="by-nav-btn" href="#contact" onClick={() => setActive('contact')}>
                            تواصل معنا
                            <Arrow />
                        </a>

                        <button type="button" className="by-burger" aria-label="القائمة" onClick={() => setMenu((v) => !v)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                {menu ? <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
                            </svg>
                        </button>
                    </header>

                    {menu && (
                        <div className="by-drawer">
                            {LINKS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setActive(item.id);
                                        setMenu(false);
                                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* هيرو: شخصية يسار بصري / نص يمين — في RTL العمود الأول يمين */}
                    <section className="by-hero" id="about" aria-label="لماذا عربيتي">
                        <div className="by-blob by-blob-1" aria-hidden="true" />
                        <div className="by-blob by-blob-2" aria-hidden="true" />

                        <div className="by-visual">
                            <div className="by-desk">
                                <div className="by-desk-glow" aria-hidden="true" />
                                <img src={A.pencil} alt="" className="by-float by-float-1" />
                                <img src={A.lamp} alt="" className="by-float by-float-2" />
                                <img src={A.book} alt="" className="by-float by-float-3" />
                                <img src={A.game} alt="" className="by-float by-float-4" />
                                <img src={A.lama} alt="لمى" className="by-hero-char" width="360" height="460" />
                            </div>
                        </div>

                        <div className="by-copy">
                            <span className="by-pill">
                                نجاح طفلك أولويتنا
                                <HeartTiny />
                            </span>
                            <h1 className="by-h1">لماذا تختارنا؟</h1>
                            <p className="by-p">
                                لسنا مجرد منصة دروس. نحن شريك نمو لطفلك في حب العربية —
                                مع مجد ولمى في كل خطوة.
                            </p>
                            <a className="by-btn" href="#services">
                                اكتشف المزيد
                                <Arrow />
                            </a>
                        </div>
                    </section>

                    {/* شريط الأرقام العائم */}
                    <div className="by-stats" id="work" role="list">
                        {STATS.map((s) => (
                            <div key={s.l} className="by-stat" role="listitem">
                                <div className="by-stat-ico" style={{ '--bg': s.bg }}>
                                    <img src={s.img} alt="" />
                                </div>
                                <div>
                                    <strong>{s.n}</strong>
                                    <span>{s.l}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* المزايا ٦ بطاقات */}
                    <section className="by-sec" id="services">
                        <div className="by-head">
                            <p className="by-kicker">ما الذي يميّزنا</p>
                            <h2>نقدّم الأفضل لطفلك</h2>
                            <div className="by-rule" aria-hidden="true">
                                <i /><HeartTiny /><i />
                            </div>
                        </div>

                        <div className="by-grid">
                            {CARDS.map((c) => (
                                <article key={c.t} className="by-card" style={{ '--pad': c.pad, '--line': c.line }}>
                                    <div className="by-card-pad">
                                        <img src={c.img} alt="" loading="lazy" />
                                    </div>
                                    <h3>{c.t}</h3>
                                    <p>{c.d}</p>
                                    <div className="by-card-line" aria-hidden="true" />
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* شريط تواصل فاتح مثل Brightly */}
                    <section className="by-cta" id="contact">
                        <div className="by-cta-ico">
                            <img src={A.chat} alt="" />
                        </div>
                        <div>
                            <h3>لنبنِ معًا رحلة عربية ممتعة</h3>
                            <p>عندك سؤال أو فكرة؟ يسعدنا نسمع منك.</p>
                        </div>
                        <Link href={route('register')} className="by-btn is-solid">
                            لنبدأ الحديث
                            <Arrow />
                        </Link>
                        <img src={A.pencil} alt="" className="by-cta-plant" />
                    </section>

                    <p className="by-foot">
                        صفحة تصميم مستقلة · <Link href="/">العودة للرئيسية</Link>
                    </p>
                </div>
            </div>
        </>
    );
}
