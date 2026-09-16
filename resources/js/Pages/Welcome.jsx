import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import ArabetiLogo from '@/Components/ArabetiLogo';
import { useStudentTheme } from '@/contexts/StudentThemeContext';

const CHAR = {
    majd: '/assets/home/characters/boy-3d-1.png',
    lama: '/assets/home/characters/girl-3d-1.png',
    both: '/assets/home/characters/boy-girl-3d.png',
    majdFull: '/assets/home/characters/boy3d.png',
    lamaFull: '/assets/home/characters/girl3d.png',
    majdHero: '/assets/home/characters/boy-hero.png',
    lamaHero: '/assets/home/characters/girl-hero.png',
    pencil: '/assets/home/characters/card-pic1.png',
    book: '/assets/home/characters/book.png',
    game: '/assets/home/characters/game.png',
    lamp: '/assets/home/characters/lamp.png',
    trophy: '/assets/home/characters/ka2s.png',
    target: '/assets/home/characters/hadaf.png',
    chat: '/assets/home/characters/chat.png',
    ipad: '/assets/home/characters/ipad.png',
    think: '/assets/home/characters/think.png',
};

const AGES = [
    { id: 'little', ages: '٢–٤', title: 'الصغار الفضوليون', desc: 'أصوات وحروف وأغاني قصيرة تزرع حب العربية.', color: '#f0b429', soft: '#fff8e8', btn: '#e5a312', img: CHAR.majd },
    { id: 'explorers', ages: '٥–٧', title: 'المستكشفون', desc: 'كلمات وجمل باللعب، مع لمى رفيقة القراءة.', color: '#3cb86a', soft: '#eefaf2', btn: '#2fa35a', img: CHAR.lama },
    { id: 'thinkers', ages: '٨–١٠', title: 'العقول النيرة', desc: 'قواعد مبسّطة وتمارين ذكية كل يوم.', color: '#3b82f6', soft: '#eef4ff', btn: '#2563eb', img: CHAR.majdFull },
    { id: 'leaders', ages: '١١+', title: 'قادة الغد', desc: 'تعبير وكتابة وثقة في التحدّث بطلاقة.', color: '#8b5cf6', soft: '#f4eeff', btn: '#7c3aed', img: CHAR.lamaFull },
];

const STEPS = [
    { n: '١', title: 'اختر المرحلة', desc: 'حدّد عمر طفلك ومستواه في دقيقتين.', color: '#3b82f6', img: CHAR.ipad },
    { n: '٢', title: 'تعلّم مع مجد ولمى', desc: 'دروس قصيرة، ألعاب، وأغاني تثبت الحرف.', color: '#f59e0b', img: CHAR.book },
    { n: '٣', title: 'تابع التقدّم', desc: 'لوحة واضحة للأهل: نجوم، وقت، وإنجازات.', color: '#22c55e', img: CHAR.trophy },
];

const FEATURES = [
    { title: 'آمن ومضمون', desc: 'بيئة مغلقة ومناسبة للأطفال', icon: 'shield', tone: '#3b82f6' },
    { title: 'تعلّم مخصّص', desc: 'مسار يتكيّف مع مستوى الطفل', icon: 'target', tone: '#f59e0b' },
    { title: 'نجوم ومكافآت', desc: 'تحفيز مرح بعد كل إنجاز', icon: 'star', tone: '#eab308' },
    { title: 'متابعة للأهل', desc: 'تقرير أسبوعي مفهوم وواضح', icon: 'chart', tone: '#22c55e' },
    { title: 'دعم حقيقي', desc: 'فريق جاهز لمساعدتكم دائماً', icon: 'chat', tone: '#a855f7' },
];

const REVIEWS = [
    { name: 'سارة أحمد', role: 'أم لطفلين', text: 'ابني صار يطلب عربيتي قبل النوم. الحروف صارت لعبة لا واجبًا.', color: '#dbeafe' },
    { name: 'خالد العلي', role: 'أب', text: 'لوحة التقدّم أوضحت لي أين يتحسّن ابني وأين يحتاج دعمًا.', color: '#fef3c7' },
    { name: 'نورة حسن', role: 'معلمة وأم', text: 'مجد ولمى قرّبا العربية من بنتي أكثر من أي تطبيق جرّبناه.', color: '#f3e8ff' },
];

const STATS = [
    { value: '+١٠ آلاف', label: 'طالب وطالبة' },
    { value: '+٥٠٠', label: 'درس تفاعلي' },
    { value: '٤٫٨', label: 'تقييم الأهل' },
    { value: '١٢ دقيقة', label: 'متوسط الدرس' },
];

function Icon({ name, className = 'h-5 w-5' }) {
    const d = {
        book: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM6.5 22H20',
        game: 'M6 12h4m-2-2v4m6-1h.01M17 11h.01M7 7h10a4 4 0 014 4v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2a4 4 0 014-4z',
        shield: 'M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z',
        target: 'M12 22a10 10 0 100-20 10 10 0 000 20zm0-4a6 6 0 100-12 6 6 0 000 12zm0-4a2 2 0 100-4 2 2 0 000 4z',
        star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z',
        chart: 'M4 19V5m0 14h16M8 17V10m5 7V7m5 10v-4',
        chat: 'M21 12a8.5 8.5 0 01-8.5 8.5c-1.2 0-2.3-.2-3.3-.7L3 21l1.3-5.2A8.5 8.5 0 1121 12z',
        play: 'M8 5v14l11-7L8 5z',
        heart: 'M12 21s-7-4.5-9.5-8.2C.7 10.2 1.3 6.5 4.2 5.1 6.4 4 9 5 12 7.5 15 5 17.6 4 19.8 5.1c2.9 1.4 3.5 5.1 1.7 7.7C19 16.5 12 21 12 21z',
        check: 'M5 13l4 4L19 7',
        arrow: 'M5 12h14m-7-7l7 7-7 7',
        menu: 'M4 7h16M4 12h16M4 17h16',
        close: 'M6 6l12 12M18 6L6 18',
    };
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={d[name]} />
        </svg>
    );
}

export default function Welcome({ content = {}, courses = [] }) {
    const { isPublicHome } = useStudentTheme();
    const { auth } = usePage().props;
    const user = auth?.user;
    const startRoute = isPublicHome ? route('explore.index') : route('learning.my');
    const heroDesc =
        content.hero_description ||
        'منصة عربية أصيلة للأطفال: دروس قصيرة، شخصيات محبوبة، ومتابعة يفهمها الأهل من أول أسبوع.';
    const rootRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const pillLinks = [
        ['الرئيسية', '/'],
        ['المراحل', '/#grades'],
        ['كيف يعمل', '/#how'],
        ['الشخصيات', '/#heroes'],
        ['الدورات', '/explore'],
        ['تواصل', '/contact'],
    ];

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;
        const nodes = root.querySelectorAll('.ap-reveal');
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-in');
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
        );
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, []);

    const featured = (courses || []).slice(0, 3);

    return (
        <PublicSiteLayout fullBleed hideFooter hideHeader>
            <Head title="عربيتي">
                <meta name="description" content={heroDesc} />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=baloo+bhaijaan+2:600,700,800&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                .ap{--ink:#15233f;--muted:#5d6d8c;--blue:#2563eb;--blue-d:#1d4ed8;--orange:#f59e0b;--pink:#fb7185;--font:'Baloo Bhaijaan 2','Cairo',system-ui,sans-serif;color:var(--ink);overflow-x:clip;background:#fff}
                .ap *,.ap *::before,.ap *::after{box-sizing:border-box}
                .ap-wrap{width:min(1180px,100%);margin-inline:auto;padding-inline:1.25rem}
                .ap-reveal{opacity:0;transform:translateY(28px) scale(.985);transition:opacity .75s cubic-bezier(.16,.8,.24,1),transform .75s cubic-bezier(.16,.8,.24,1)}
                .ap-reveal.is-in{opacity:1;transform:none}
                .ap-d1{transition-delay:.08s}.ap-d2{transition-delay:.16s}.ap-d3{transition-delay:.24s}.ap-d4{transition-delay:.32s}
                @keyframes ap-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
                @keyframes ap-float-r{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-12px) rotate(1.5deg)}}
                @keyframes ap-drift{0%,100%{transform:translateX(0)}50%{transform:translateX(24px)}}
                @keyframes ap-twinkle{0%,100%{opacity:.4;transform:scale(.88)}50%{opacity:1;transform:scale(1.12)}}
                @keyframes ap-pulse{0%,100%{box-shadow:0 14px 0 #1e40af,0 22px 34px -14px rgba(37,99,235,.55)}50%{box-shadow:0 14px 0 #1e40af,0 28px 42px -10px rgba(37,99,235,.7)}}
                @keyframes ap-wiggle{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
                @keyframes ap-shine{0%{transform:translateX(-120%) skewX(-18deg)}100%{transform:translateX(220%) skewX(-18deg)}}

                .ap-hero{
                    position:relative;min-height:100svh;display:flex;flex-direction:column;
                    padding:1rem 0 0;overflow:hidden;
                    background:linear-gradient(180deg,#dceefb 0%,#eaf5fc 40%,#f7fbfe 72%,#ffffff 100%);
                }
                .ap-shell{width:min(1180px,100%);margin:0 auto;padding-inline:1.15rem;position:relative;z-index:5}

                /* ناف بار بسيط قريب من المرجع */
                .ap-pillnav{
                    direction:ltr;display:flex;align-items:center;justify-content:space-between;gap:.85rem;
                    background:rgba(255,255,255,.92);border-radius:999px;padding:.45rem .45rem .45rem 1rem;
                    box-shadow:0 10px 28px rgba(37,99,235,.1);backdrop-filter:blur(10px);
                }
                .ap-pill-brand{display:inline-flex;align-items:center;gap:.45rem;text-decoration:none;flex-shrink:0}
                .ap-pill-brand .arabiti-logo{width:4.6rem}
                .ap-pill-brand strong{font-family:var(--font);font-size:1.12rem;font-weight:800;color:#1d4ed8}
                .ap-pill-links{display:none;align-items:center;justify-content:center;gap:.05rem;flex:1}
                @media(min-width:980px){.ap-pill-links{display:flex}}
                .ap-pill-link{position:relative;padding:.5rem .75rem;border-radius:999px;font-size:.84rem;font-weight:800;color:#5b7aaa;text-decoration:none;transition:color .2s,background .2s}
                .ap-pill-link:hover{color:#1d4ed8;background:#eef5ff}
                .ap-pill-link.is-on{color:#1d4ed8}
                .ap-pill-link.is-on::after{content:'';position:absolute;left:50%;bottom:.1rem;transform:translateX(-50%);width:6px;height:6px;border-radius:50%;background:#3b82f6}
                .ap-pill-actions{display:none;align-items:center;gap:.55rem;flex-shrink:0}
                @media(min-width:980px){.ap-pill-actions{display:flex}}
                .ap-pill-ghost{font-weight:800;font-size:.88rem;color:#2563eb;text-decoration:none;padding:.5rem .7rem}
                .ap-pill-cta{
                    display:inline-flex;align-items:center;gap:.35rem;min-height:2.7rem;padding:0 1.15rem;border-radius:999px;
                    background:#f59e0b;color:#422006;font-weight:800;font-size:.88rem;text-decoration:none;
                    box-shadow:0 8px 18px rgba(245,158,11,.35);transition:transform .2s ease;
                }
                .ap-pill-cta:hover{transform:translateY(-1px)}
                .ap-pill-burger{display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:999px;border:0;background:#eef5ff;color:#1d4ed8;cursor:pointer}
                @media(min-width:980px){.ap-pill-burger{display:none}}
                .ap-pill-drawer{margin-top:.7rem;background:#fff;border-radius:1.4rem;padding:.65rem;box-shadow:0 16px 40px rgba(37,99,235,.12);display:grid;gap:.25rem;direction:rtl}
                .ap-pill-drawer a{padding:.8rem 1rem;border-radius:1rem;background:#f7fbff;text-decoration:none;font-weight:800;color:var(--ink)}

                /* غيوم كبيرة خلفية مثل المرجع */
                .ap-hero-deco{position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden}
                .ap-sky-cloud{
                    position:absolute;border-radius:50%;
                    background:radial-gradient(circle at 35% 32%,#ffffff,#fff8dc 52%,rgba(255,248,220,.2) 100%);
                    filter:blur(1px);opacity:.95;
                    box-shadow:inset -20px -30px 60px rgba(255,220,140,.15);
                }
                .ap-sky-a{width:min(62vw,560px);height:min(44vw,400px);top:-10%;right:-8%}
                .ap-sky-b{width:min(52vw,480px);height:min(38vw,340px);top:22%;left:-14%;background:radial-gradient(circle at 40% 40%,#fff,#e8f4ff 58%,rgba(232,244,255,.2) 100%)}
                .ap-sky-c{width:min(44vw,400px);height:min(32vw,280px);bottom:6%;right:12%;background:radial-gradient(circle at 40% 40%,#fffef8,#ffe9a8 55%,rgba(255,233,168,.2) 100%);opacity:.8}
                .ap-rocket{position:absolute;top:12%;left:3%;width:64px;filter:drop-shadow(0 10px 12px rgba(15,23,42,.18));animation:ap-float 5s ease-in-out infinite}

                .ap-hero-grid{
                    direction:ltr;position:relative;z-index:3;
                    display:grid;gap:1.25rem;align-items:center;
                    padding:clamp(1.4rem,3.5vh,2.4rem) 0 clamp(3.5rem,8vh,5.5rem);flex:1;
                }
                @media(min-width:980px){
                    .ap-hero-grid{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:1rem;min-height:calc(100svh - 7rem)}
                }

                /* النص (مثل LumiKids) */
                .ap-hero-copy{position:relative;z-index:4;max-width:34rem;direction:rtl;text-align:right}
                .ap-kicker{
                    display:inline-flex;align-items:center;gap:.4rem;border-radius:999px;
                    padding:.42rem .95rem;background:#fff;border:1px solid #dbeafe;
                    color:#1d4ed8;font-size:.78rem;font-weight:800;
                    box-shadow:0 10px 22px -14px rgba(37,99,235,.35);
                }
                .ap-kicker svg{color:#fb7185;fill:#fb7185}
                .ap-title{
                    margin:.95rem 0 0;font-family:var(--font);font-weight:800;
                    font-size:clamp(2.4rem,5.5vw,3.9rem);line-height:1.12;color:#1e3a8a;letter-spacing:-.02em;
                }
                .ap-fun{position:relative;display:inline-block;color:#f59e0b}
                .ap-fun::after{
                    content:'';position:absolute;left:0;right:0;bottom:.05em;height:.18em;
                    background:#fb7185;border-radius:999px;opacity:.85;transform:skewX(-12deg);
                }
                .ap-fun i{position:absolute;width:8px;height:8px;border-radius:2px;background:#fb7185;transform:rotate(25deg)}
                .ap-fun i:nth-child(1){top:-.28em;inset-inline-end:.1em}
                .ap-fun i:nth-child(2){top:.05em;inset-inline-end:-.45em;width:6px;height:6px}
                .ap-fun i:nth-child(3){top:-.5em;inset-inline-start:.05em;width:6px;height:6px}
                .ap-lead{margin:.85rem 0 0;font-size:clamp(1rem,1.7vw,1.12rem);line-height:1.85;font-weight:600;color:#5b6b8c;max-width:30rem}
                .ap-icons{display:flex;flex-wrap:wrap;gap:1rem 1.5rem;margin-top:1.4rem}
                .ap-icon{display:flex;flex-direction:column;align-items:center;gap:.45rem;min-width:5rem;text-align:center}
                .ap-icon b{
                    width:3.25rem;height:3.25rem;border-radius:999px;display:grid;place-items:center;color:#fff;
                    box-shadow:0 12px 20px -10px rgba(37,99,235,.45);
                }
                .ap-icon span{font-size:.78rem;font-weight:800;color:#1e3a5f;line-height:1.35;max-width:6.2rem}
                .ap-actions{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:1rem;margin-top:1.6rem}
                .ap-cta{
                    position:relative;z-index:2;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;
                    min-height:3.35rem;padding:0 1.65rem;border-radius:999px;
                    font-family:var(--font);font-weight:800;font-size:1.08rem;color:#fff;text-decoration:none;cursor:pointer;
                    background:linear-gradient(180deg,#4f8cff,#2563eb);
                    box-shadow:0 12px 0 #1e40af,0 20px 30px -14px rgba(37,99,235,.5);
                    transition:transform .18s ease,box-shadow .18s ease;
                }
                .ap-cta:hover{transform:translateY(-2px);box-shadow:0 14px 0 #1e40af,0 24px 34px -14px rgba(37,99,235,.55)}
                .ap-cta:active{transform:translateY(3px);box-shadow:0 6px 0 #1e40af}
                .ap-cta-ghost{
                    display:inline-flex;align-items:center;gap:.35rem;min-height:3rem;padding:0 1.2rem;
                    border-radius:999px;background:#fff;border:1.5px solid #dde5f2;
                    color:#1d4ed8;font-weight:800;text-decoration:none;
                    box-shadow:0 8px 18px -14px rgba(21,35,63,.3);transition:transform .18s ease;
                }
                .ap-cta-ghost:hover{transform:translateY(-2px)}
                .ap-curve{
                    position:absolute;z-index:1;width:clamp(160px,22vw,250px);height:130px;
                    left:clamp(11rem,24vw,16rem);top:55%;pointer-events:none;
                }
                .ap-curve path{fill:none;stroke:#60a5fa;stroke-width:2.6;stroke-dasharray:6 9;stroke-linecap:round}
                .ap-curve-head{fill:#60a5fa}

                /* مكان النمر: غيمة كبيرة + عربيتي + شخصيات مرة واحدة */
                .ap-visual{
                    position:relative;min-height:clamp(360px,56vh,600px);
                    display:flex;align-items:flex-end;justify-content:center;
                }
                .ap-visual-cloud{
                    position:absolute;z-index:0;left:50%;top:2%;transform:translateX(-50%);
                    width:min(120%,600px);height:82%;pointer-events:none;
                }
                .ap-visual-cloud svg{width:100%;height:100%;display:block;filter:drop-shadow(0 22px 30px rgba(90,120,180,.14))}
                .ap-visual-logo{
                    position:absolute;z-index:3;top:2%;left:50%;transform:translateX(-50%);
                    width:clamp(10rem,24vw,15rem);
                    filter:drop-shadow(0 16px 22px rgba(15,23,42,.16));
                    animation:ap-float 5.5s ease-in-out infinite;
                }
                .ap-visual-logo .arabiti-logo{width:100%}
                .ap-visual-logo .arabiti-logo img{width:100%;height:auto;display:block}
                .ap-visual-duo{
                    position:relative;z-index:2;width:min(100%,580px);
                    filter:drop-shadow(0 36px 28px rgba(15,23,42,.28));
                    animation:ap-float 6s ease-in-out infinite;transform-origin:center bottom;
                }
                .ap-visual-duo img{display:block;width:100%;height:auto}

                .ap-hero-wave{position:relative;z-index:4;line-height:0;color:#fff;margin-top:-1px}
                .ap-hero-wave svg{display:block;width:100%;height:clamp(52px,8vw,90px)}

                @media(max-width:979px){
                    .ap-hero-grid{padding-top:1.1rem}
                    .ap-hero-copy{text-align:center;margin-inline:auto}
                    .ap-lead{margin-inline:auto}
                    .ap-icons,.ap-actions{justify-content:center}
                    .ap-curve{display:none}
                    .ap-visual{min-height:300px;order:-1}
                    .ap-visual-logo{top:0}
                }
                @media(max-width:640px){
                    .ap-visual-duo{width:min(100%,380px)}
                    .ap-title{font-size:clamp(2rem,9vw,2.65rem)}
                }

                .ap-trust{background:#fff;padding:1.1rem 0 0;border-bottom:1px solid #eef2f7}
                .ap-trust-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.85rem 1.6rem;padding-bottom:1.2rem;color:var(--muted);font-size:.86rem;font-weight:800}
                .ap-trust-row strong{color:var(--ink);font-family:var(--font);font-size:1.05rem}

                .ap-sec{padding:clamp(3rem,7vw,5rem) 0}
                .ap-head{text-align:center;max-width:42rem;margin-inline:auto}
                .ap-eyebrow{display:inline-flex;align-items:center;gap:.4rem;border-radius:999px;padding:.3rem .8rem;background:color-mix(in srgb,var(--site-primary,#433d78) 10%,#fff);color:var(--site-primary,#433d78);font-size:.75rem;font-weight:800;margin-bottom:.7rem}
                .ap-head h2{margin:0;font-family:var(--font);font-weight:800;font-size:clamp(1.85rem,4vw,2.75rem);line-height:1.2}
                .ap-head p{margin:.75rem 0 0;font-weight:600;line-height:1.85;color:var(--muted)}
                .ap-head-lines h2{display:inline-flex;align-items:center;gap:.8rem}
                .ap-head-lines h2::before,.ap-head-lines h2::after{content:'';width:30px;height:4px;border-radius:999px;background:#f5c542;box-shadow:0 8px 0 #f5c542}

                .ap-ages{background:#fff}
                .ap-age-grid{display:grid;gap:1.2rem;margin-top:2.2rem;grid-template-columns:1fr}
                @media(min-width:640px){.ap-age-grid{grid-template-columns:repeat(2,1fr)}}
                @media(min-width:1100px){.ap-age-grid{grid-template-columns:repeat(4,1fr)}}
                .ap-age{display:flex;flex-direction:column;border-radius:1.7rem;overflow:hidden;background:#fff;border:1px solid #eef2f7;box-shadow:0 22px 44px -30px rgba(21,35,63,.45);text-decoration:none;color:inherit;transition:transform .25s ease,box-shadow .25s ease}
                .ap-age:hover{transform:translateY(-8px);box-shadow:0 30px 50px -24px rgba(21,35,63,.42)}
                .ap-age-tag{align-self:center;margin-top:1.05rem;border-radius:999px;padding:.3rem .9rem;background:var(--c);color:#fff;font-size:.74rem;font-weight:800}
                .ap-age-art{height:190px;display:grid;place-items:end center;background:linear-gradient(180deg,var(--s),#fff);padding:0 .5rem}
                .ap-age-art img{height:176px;width:auto;max-width:92%;object-fit:contain;object-position:bottom;filter:drop-shadow(0 12px 12px rgba(21,35,63,.18))}
                .ap-age-body{padding:1rem 1.1rem 1.25rem;text-align:center;display:flex;flex-direction:column;gap:.4rem;flex:1}
                .ap-age-body h3{margin:0;font-family:var(--font);font-size:1.22rem;font-weight:800}
                .ap-age-body p{margin:0;font-size:.86rem;line-height:1.7;font-weight:600;color:var(--muted);flex:1}
                .ap-age-btn{margin-top:.5rem;display:inline-flex;align-items:center;justify-content:center;min-height:2.55rem;border-radius:999px;padding:0 1.15rem;background:var(--b);color:#fff;font-weight:800;font-size:.9rem}

                .ap-how{background:linear-gradient(180deg,#f7fbff,#eef6fd)}
                .ap-steps{display:grid;gap:1.15rem;margin-top:2.2rem}
                @media(min-width:900px){.ap-steps{grid-template-columns:repeat(3,1fr)}}
                .ap-step{position:relative;border-radius:1.7rem;padding:1.4rem 1.2rem 1.3rem;background:#fff;border:1px solid #e4eef8;box-shadow:0 18px 36px -28px rgba(21,35,63,.4);text-align:center}
                .ap-step-n{display:inline-grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:999px;background:var(--c);color:#fff;font-family:var(--font);font-weight:800;font-size:1.15rem;margin-bottom:.7rem}
                .ap-step img{width:72px;height:72px;object-fit:contain;margin:0 auto .7rem;filter:drop-shadow(0 10px 8px rgba(21,35,63,.15))}
                .ap-step h3{margin:0;font-family:var(--font);font-size:1.25rem;font-weight:800}
                .ap-step p{margin:.45rem 0 0;font-size:.9rem;line-height:1.75;font-weight:600;color:var(--muted)}

                .ap-heroes{background:#fff;overflow:hidden}
                .ap-heroes-grid{display:grid;gap:2rem;align-items:center;margin-top:1.5rem}
                @media(min-width:960px){.ap-heroes-grid{grid-template-columns:1.05fr .95fr}}
                .ap-heroes-art{position:relative;min-height:360px;display:grid;place-items:center}
                .ap-heroes-art img.main{width:min(100%,520px);filter:drop-shadow(0 28px 24px rgba(21,35,63,.28));animation:ap-float 6s ease-in-out infinite}
                .ap-heroes-copy h2{margin:0;font-family:var(--font);font-size:clamp(1.8rem,3.6vw,2.5rem);font-weight:800;line-height:1.2}
                .ap-heroes-copy p{margin:.8rem 0 0;font-size:1.02rem;line-height:1.9;font-weight:600;color:var(--muted)}
                .ap-list{margin:1.2rem 0 0;display:grid;gap:.7rem;padding:0;list-style:none}
                .ap-list li{display:flex;align-items:flex-start;gap:.65rem;font-weight:700;font-size:.95rem}
                .ap-list li span{width:1.7rem;height:1.7rem;border-radius:999px;display:grid;place-items:center;background:#e8f0ff;color:var(--blue);flex-shrink:0;margin-top:.1rem}

                .ap-features{background:linear-gradient(180deg,#fff,#fff8ea 55%,#fff3dc)}
                .ap-feat-shell{position:relative;margin-top:1.8rem}
                .ap-pencil{position:absolute;z-index:3;width:clamp(96px,13vw,140px);inset-inline-start:-.2rem;bottom:-.2rem;filter:drop-shadow(0 18px 16px rgba(21,35,63,.22));animation:ap-wiggle 5s ease-in-out infinite;transform-origin:bottom center}
                .ap-feat-bar{display:grid;gap:.55rem;grid-template-columns:1fr;background:#fffef8;border-radius:1.7rem;padding:1.2rem 1rem 1.2rem clamp(5rem,11vw,7.5rem);border:1px solid #f0e2bf;box-shadow:0 20px 40px -28px rgba(21,35,63,.35)}
                @media(min-width:820px){.ap-feat-bar{grid-template-columns:repeat(5,1fr)}}
                .ap-feat{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.4rem;padding:.6rem .3rem}
                .ap-feat-ico{width:3rem;height:3rem;border-radius:999px;display:grid;place-items:center;color:#fff;background:var(--t);box-shadow:0 10px 18px -10px var(--t)}
                .ap-feat strong{font-size:.9rem;font-weight:800}
                .ap-feat span{font-size:.74rem;font-weight:600;color:var(--muted);line-height:1.45;max-width:9.8rem}

                .ap-parents{background:#fff}
                .ap-parents-grid{display:grid;gap:1.4rem;margin-top:2rem}
                @media(min-width:900px){.ap-parents-grid{grid-template-columns:1.1fr .9fr;align-items:center}}
                .ap-panel{border-radius:1.8rem;padding:1.4rem;background:linear-gradient(160deg,#0b1f5c,#1e3a8a 50%,#4338ca);color:#fff;box-shadow:0 28px 50px -28px rgba(30,58,138,.55);min-height:280px}
                .ap-panel h3{margin:0;font-family:var(--font);font-size:1.35rem;font-weight:800}
                .ap-panel-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin-top:1.1rem}
                .ap-panel-stats div{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);border-radius:1rem;padding:.75rem .4rem;text-align:center}
                .ap-panel-stats strong{display:block;font-family:var(--font);font-size:1.35rem}
                .ap-panel-stats small{font-size:.7rem;opacity:.85;font-weight:700}
                .ap-bars{margin-top:1.1rem;display:grid;gap:.55rem}
                .ap-bars i{display:block;height:10px;border-radius:999px;background:rgba(255,255,255,.15);overflow:hidden}
                .ap-bars i span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#fbbf24,#60a5fa)}
                .ap-parents-copy h3{margin:0;font-family:var(--font);font-size:clamp(1.5rem,3vw,2rem);font-weight:800}
                .ap-parents-copy p{margin:.7rem 0 0;font-weight:600;line-height:1.85;color:var(--muted)}

                .ap-reviews{background:linear-gradient(180deg,#f8fbff,#fff)}
                .ap-rev-grid{display:grid;gap:1.1rem;margin-top:2rem}
                @media(min-width:900px){.ap-rev-grid{grid-template-columns:repeat(3,1fr)}}
                .ap-rev{border-radius:1.6rem;padding:1.3rem 1.2rem;background:var(--bg,#eef6ff);border:1px solid rgba(255,255,255,.8);box-shadow:0 16px 34px -26px rgba(21,35,63,.35)}
                .ap-rev p{margin:0;font-size:.95rem;line-height:1.85;font-weight:700}
                .ap-rev-meta{display:flex;align-items:center;gap:.7rem;margin-top:1.1rem}
                .ap-avatar{width:2.5rem;height:2.5rem;border-radius:50%;background:linear-gradient(135deg,#93c5fd,#a78bfa);border:2px solid #fff}
                .ap-rev-meta strong{display:block;font-size:.9rem}
                .ap-rev-meta small{color:var(--muted);font-weight:700;font-size:.75rem}

                .ap-stats{background:#fff;padding:0 0 clamp(2rem,5vw,3rem)}
                .ap-stats-row{display:grid;gap:1rem;grid-template-columns:repeat(2,1fr);border-radius:1.7rem;padding:1.3rem 1rem;background:linear-gradient(135deg,#eff6ff,#f5f3ff);border:1px solid #e4eaf8}
                @media(min-width:800px){.ap-stats-row{grid-template-columns:repeat(4,1fr)}}
                .ap-stat{text-align:center}
                .ap-stat strong{display:block;font-family:var(--font);font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;color:var(--blue-d);line-height:1.1}
                .ap-stat span{display:block;margin-top:.35rem;font-size:.84rem;font-weight:700;color:var(--muted)}

                .ap-courses{background:#f8fbff}
                .ap-course-grid{display:grid;gap:1.1rem;margin-top:2rem}
                @media(min-width:800px){.ap-course-grid{grid-template-columns:repeat(3,1fr)}}
                .ap-course{border-radius:1.5rem;overflow:hidden;background:#fff;border:1px solid #e8eef7;box-shadow:0 16px 34px -26px rgba(21,35,63,.4);text-decoration:none;color:inherit;transition:transform .22s ease}
                .ap-course:hover{transform:translateY(-5px)}
                .ap-course-top{height:140px;background:linear-gradient(135deg,var(--site-primary,#433d78),var(--site-primary-2,#5e548e));display:grid;place-items:center}
                .ap-course-top img{height:110px;filter:drop-shadow(0 10px 10px rgba(0,0,0,.25))}
                .ap-course-body{padding:1rem 1.1rem 1.2rem}
                .ap-course-body h3{margin:0;font-family:var(--font);font-size:1.1rem;font-weight:800}
                .ap-course-body p{margin:.4rem 0 0;font-size:.84rem;color:var(--muted);font-weight:600;line-height:1.65}

                .ap-cta-band{position:relative;padding:clamp(3rem,7vw,4.5rem) 0;background:linear-gradient(145deg,#1d4ed8 0%,#4338ca 45%,#6d28d9 100%);color:#fff;overflow:hidden;text-align:center}
                .ap-cta-band h2{margin:0;font-family:var(--font);font-size:clamp(1.9rem,4vw,2.8rem);font-weight:800}
                .ap-cta-band p{margin:.75rem auto 0;max-width:34rem;font-weight:600;line-height:1.8;opacity:.92}
                .ap-cta-band .ap-actions{justify-content:center;margin-top:1.5rem}
                .ap-cta-band .ap-cta{animation:none;box-shadow:0 12px 0 #0f172a,0 20px 30px -14px rgba(0,0,0,.35);background:linear-gradient(180deg,#fbbf24,#f59e0b);color:#422006}
                .ap-cta-band .ap-cta-ghost{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.35);color:#fff}

                .ap-footer{position:relative;background:linear-gradient(165deg,#071536 0%,#122a6b 48%,#2e1065 100%);color:#fff;padding:0 0 1.4rem;overflow:hidden}
                .ap-footer-wave{line-height:0;color:#fff;position:relative;z-index:1}
                .ap-footer-wave svg{display:block;width:100%;height:clamp(70px,10vw,120px)}
                .ap-footer-inner{position:relative;z-index:2;display:grid;gap:1.4rem;align-items:center;padding:clamp(1rem,3vw,1.6rem) 0 1rem}
                @media(min-width:900px){.ap-footer-inner{grid-template-columns:1.25fr 1.05fr auto;gap:1.5rem}}
                .ap-footer h2{margin:0;font-family:var(--font);font-weight:800;font-size:clamp(1.45rem,3.2vw,2.1rem);line-height:1.3;display:flex;align-items:center;gap:.55rem;flex-wrap:wrap}
                .ap-footer h2 svg{color:#f5c542}
                .ap-footer-mid{display:flex;flex-direction:column;gap:.5rem}
                @media(min-width:900px){.ap-footer-mid{align-items:center;text-align:center}}
                .ap-stars{display:flex;gap:.12rem;color:#f5c542}
                .ap-footer-mid p{margin:0;font-size:.92rem;font-weight:700;opacity:.95}
                .ap-avatars{display:flex}
                .ap-avatars span{width:2.4rem;height:2.4rem;border-radius:50%;border:2.5px solid #fff;margin-inline-start:-.5rem;background:linear-gradient(135deg,var(--a1,#93c5fd),var(--a2,#c4b5fd))}
                .ap-avatars span:first-child{margin-inline-start:0}
                .ap-badge{display:inline-flex;align-items:center;gap:.55rem;border-radius:999px;padding:.72rem 1.1rem;background:#fff;color:#1e3a8a;font-size:.84rem;font-weight:800;box-shadow:0 12px 24px -16px rgba(0,0,0,.45)}
                .ap-badge svg{color:#2563eb}
                .ap-copy{position:relative;z-index:2;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem;border-top:1px solid rgba(255,255,255,.14);padding-top:1rem;font-size:.74rem;font-weight:700;color:rgba(255,255,255,.7)}
                .ap-copy a{color:inherit;text-decoration:none}
                .ap-copy a:hover{color:#fff}

                @media(max-width:1023px){
                    .ap-pencil{position:relative;inset:auto;display:block;margin:0 auto .7rem;animation:ap-float 4.8s ease-in-out infinite}
                    .ap-feat-bar{padding:1.1rem}
                }
                @media(prefers-reduced-motion:reduce){
                    .ap *,.ap *::before,.ap *::after{animation:none !important;transition:none !important}
                    .ap-reveal{opacity:1;transform:none}
                }
            `}</style>

            <div className="ap" ref={rootRef}>
                <section className="ap-hero" aria-label="مقدمة عربيتي">
                    <div className="ap-hero-deco" aria-hidden="true">
                        <span className="ap-sky-cloud ap-sky-a" />
                        <span className="ap-sky-cloud ap-sky-b" />
                        <span className="ap-sky-cloud ap-sky-c" />
                        <img className="ap-rocket" src={CHAR.lamp} alt="" width="56" height="56" />
                    </div>

                    <div className="ap-shell" style={{ paddingTop: '0.15rem' }}>
                        <header className="ap-pillnav">
                            <Link href="/" className="ap-pill-brand">
                                <ArabetiLogo size="nav" animate={false} />
                                <strong>عربيتي</strong>
                            </Link>

                            <nav className="ap-pill-links" aria-label="التنقل">
                                {pillLinks.map(([label, href]) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className={`ap-pill-link${href === '/' ? ' is-on' : ''}`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="ap-pill-actions">
                                {user ? (
                                    <Link href={route('learning.my')} className="ap-pill-cta">تعلّمي</Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="ap-pill-ghost">دخول</Link>
                                        <Link href={route('register')} className="ap-pill-cta">سجّل مجانًا</Link>
                                    </>
                                )}
                            </div>

                            <button type="button" className="ap-pill-burger" aria-label="القائمة" onClick={() => setMenuOpen((v) => !v)}>
                                <Icon name={menuOpen ? 'close' : 'menu'} className="h-5 w-5" />
                            </button>
                        </header>

                        {menuOpen && (
                            <div className="ap-pill-drawer">
                                {pillLinks.map(([label, href]) => (
                                    <Link key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
                                ))}
                                {!user && <Link href={route('login')} onClick={() => setMenuOpen(false)}>دخول</Link>}
                                <Link href={user ? route('learning.my') : route('register')} onClick={() => setMenuOpen(false)}>
                                    {user ? 'تعلّمي' : 'سجّل مجانًا'}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="ap-shell ap-hero-grid">
                        {/* يسار: نص + أيقونات + زر + سهم */}
                        <div className="ap-hero-copy">
                            <span className="ap-kicker">
                                <Icon name="heart" className="h-4 w-4" />
                                يثق بنا أكثر من ١٠ آلاف أهل
                            </span>
                            <h1 className="ap-title">
                                تعلّم يصنع{' '}
                                <span className="ap-fun">
                                    المتعة
                                    <i /><i /><i />
                                </span>
                            </h1>
                            <p className="ap-lead">{heroDesc}</p>

                            <div className="ap-icons" role="list">
                                <div className="ap-icon" role="listitem">
                                    <b style={{ background: '#3b82f6' }}><Icon name="book" className="h-5 w-5" /></b>
                                    <span>منهج عربي أصيل</span>
                                </div>
                                <div className="ap-icon" role="listitem">
                                    <b style={{ background: '#22c55e' }}><Icon name="game" className="h-5 w-5" /></b>
                                    <span>تعلّم باللعب</span>
                                </div>
                                <div className="ap-icon" role="listitem">
                                    <b style={{ background: '#8b5cf6' }}><Icon name="shield" className="h-5 w-5" /></b>
                                    <span>آمن للأطفال</span>
                                </div>
                            </div>

                            <div className="ap-actions">
                                <Link href={startRoute} className="ap-cta">
                                    <Icon name="play" className="h-5 w-5" />
                                    ابدأ مجانًا
                                </Link>
                                <svg className="ap-curve" viewBox="0 0 240 130" aria-hidden="true">
                                    <path d="M12 18 C40 90, 110 118, 210 78" />
                                    <polygon className="ap-curve-head" points="210,78 196,68 204,90" />
                                </svg>
                            </div>
                        </div>

                        {/* يمين: غيمة كبيرة + عربيتي + مجد/لمى مكان النمر — مرة واحدة فقط */}
                        <div className="ap-visual" aria-label="مجد ولمى">
                            <div className="ap-visual-cloud" aria-hidden="true">
                                <svg viewBox="0 0 680 460" fill="none" preserveAspectRatio="xMidYMid meet">
                                    <ellipse cx="340" cy="250" rx="270" ry="150" fill="#fffef8" />
                                    <ellipse cx="200" cy="210" rx="145" ry="110" fill="#fff" />
                                    <ellipse cx="470" cy="205" rx="155" ry="115" fill="#fff" />
                                    <ellipse cx="340" cy="165" rx="135" ry="105" fill="#fffef5" />
                                    <ellipse cx="255" cy="280" rx="100" ry="78" fill="#f0f7ff" />
                                    <ellipse cx="420" cy="285" rx="105" ry="80" fill="#f0f7ff" />
                                </svg>
                            </div>
                            <div className="ap-visual-logo">
                                <ArabetiLogo size="hero" animate={false} />
                            </div>
                            <div className="ap-visual-duo">
                                <img
                                    src={CHAR.both}
                                    alt="مجد ولمى"
                                    width="580"
                                    height="387"
                                    fetchPriority="high"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="ap-hero-wave" aria-hidden="true">
                        <svg viewBox="0 0 1440 96" preserveAspectRatio="none">
                            <path fill="currentColor" d="M0,52 C200,92 380,10 560,44 C740,78 920,90 1100,48 C1260,14 1380,30 1440,42 L1440,96 L0,96 Z" />
                        </svg>
                    </div>
                </section>

                <div className="ap-trust">
                    <div className="ap-wrap ap-trust-row ap-reveal">
                        <span>يثق بنا أهالي من</span>
                        <strong>الخليج</strong>
                        <strong>الشام</strong>
                        <strong>شمال أفريقيا</strong>
                        <strong>وأوروبا</strong>
                    </div>
                </div>

                <section className="ap-sec ap-ages" id="grades" aria-label="المراحل العمرية">
                    <div className="ap-wrap">
                        <div className="ap-head ap-head-lines ap-reveal">
                            <span className="ap-eyebrow">لكل عمر مسار</span>
                            <h2>تعلّم لكل عمر ومرحلة</h2>
                            <p>أربع مسارات مصمّمة بعناية — من أولى الحروف حتى الثقة في التعبير.</p>
                        </div>
                        <div className="ap-age-grid">
                            {AGES.map((a, i) => (
                                <Link key={a.id} href={route('explore.index')} className={`ap-age ap-reveal ap-d${(i % 4) + 1}`} style={{ '--c': a.color, '--s': a.soft, '--b': a.btn }}>
                                    <span className="ap-age-tag">{a.ages} سنوات</span>
                                    <div className="ap-age-art"><img src={a.img} alt="" loading="lazy" /></div>
                                    <div className="ap-age-body">
                                        <h3>{a.title}</h3>
                                        <p>{a.desc}</p>
                                        <span className="ap-age-btn">استكشف</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="ap-sec ap-how" id="how" aria-label="كيف يعمل">
                    <div className="ap-wrap">
                        <div className="ap-head ap-reveal">
                            <span className="ap-eyebrow">بسيط وواضح</span>
                            <h2>ثلاث خطوات… وتبدأ الرحلة</h2>
                            <p>بدون تعقيد: اختيار، تعلّم، ومتابعة — هذا كل شيء.</p>
                        </div>
                        <div className="ap-steps">
                            {STEPS.map((s, i) => (
                                <article key={s.n} className={`ap-step ap-reveal ap-d${i + 1}`} style={{ '--c': s.color }}>
                                    <span className="ap-step-n">{s.n}</span>
                                    <img src={s.img} alt="" />
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="ap-sec ap-heroes" id="heroes" aria-label="مجد ولمى">
                    <div className="ap-wrap ap-heroes-grid">
                        <div className="ap-heroes-art ap-reveal">
                            <img src={CHAR.both} alt="مجد ولمى" className="main" />
                        </div>
                        <div className="ap-heroes-copy ap-reveal ap-d2">
                            <span className="ap-eyebrow">رفيقان في كل درس</span>
                            <h2>تعرّف على مجد ولمى</h2>
                            <p>
                                ليسا مجرد رسمتين — هما مرشدا طفلك في عالم الحروف والكلمات.
                                يضحكان معه، يشجّعانه، ويحتفلان بكل نجمة يجمعها.
                            </p>
                            <ul className="ap-list">
                                <li><span><Icon name="check" className="h-4 w-4" /></span>مجد يشرح بحماس ويحوّل القاعدة إلى لعبة</li>
                                <li><span><Icon name="check" className="h-4 w-4" /></span>لمى تقرأ بصبر وتفتح باب القصص العربية</li>
                                <li><span><Icon name="check" className="h-4 w-4" /></span>معًا يبنيان عادة تعلّم يومية قصيرة وممتعة</li>
                            </ul>
                            <div className="ap-actions" style={{ marginTop: '1.4rem' }}>
                                <Link href={startRoute} className="ap-cta" style={{ animation: 'none' }}>انضم إلى رحلتهم</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ap-sec ap-features" id="features" aria-label="المزايا">
                    <div className="ap-wrap">
                        <div className="ap-head ap-reveal">
                            <span className="ap-eyebrow">لماذا عربيتي؟</span>
                            <h2>كل ما يحتاجه الأهل… في مكان واحد</h2>
                        </div>
                        <div className="ap-feat-shell ap-reveal">
                            <img src={CHAR.pencil} alt="" className="ap-pencil" />
                            <div className="ap-feat-bar">
                                {FEATURES.map((f) => (
                                    <div key={f.title} className="ap-feat" style={{ '--t': f.tone }}>
                                        <span className="ap-feat-ico"><Icon name={f.icon} className="h-5 w-5" /></span>
                                        <strong>{f.title}</strong>
                                        <span>{f.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ap-sec ap-parents" id="parents" aria-label="مساحة الأهل">
                    <div className="ap-wrap ap-parents-grid">
                        <div className="ap-panel ap-reveal">
                            <h3>لوحة الأهل — واضحة في لمحة</h3>
                            <div className="ap-panel-stats">
                                <div><strong>١٢</strong><small>درس مكتمل</small></div>
                                <div><strong>٤٨</strong><small>دقيقة تعلّم</small></div>
                                <div><strong>٣٦</strong><small>نجمة</small></div>
                            </div>
                            <div className="ap-bars" aria-hidden="true">
                                <i><span style={{ width: '78%' }} /></i>
                                <i><span style={{ width: '56%' }} /></i>
                                <i><span style={{ width: '92%' }} /></i>
                            </div>
                        </div>
                        <div className="ap-parents-copy ap-reveal ap-d2">
                            <span className="ap-eyebrow">للعائلات</span>
                            <h3>تعرف ماذا يتعلّم طفلك… دون أن تلاحقه</h3>
                            <p>
                                ملخص أسبوعي بسيط: ما أنجزه، أين توقّف، وما الدرس التالي المقترح.
                                صُمّم ليُقرأ في دقيقة — لا تقارير معقّدة.
                            </p>
                            <ul className="ap-list">
                                <li><span><Icon name="check" className="h-4 w-4" /></span>تنبيهات لطيفة عند إكمال مرحلة</li>
                                <li><span><Icon name="check" className="h-4 w-4" /></span>تحكم كامل في وقت الشاشة</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="ap-sec ap-reviews" id="reviews" aria-label="آراء الأهل">
                    <div className="ap-wrap">
                        <div className="ap-head ap-reveal">
                            <span className="ap-eyebrow">قصص حقيقية</span>
                            <h2>ماذا يقول الأهل؟</h2>
                        </div>
                        <div className="ap-rev-grid">
                            {REVIEWS.map((r, i) => (
                                <article key={r.name} className={`ap-rev ap-reveal ap-d${i + 1}`} style={{ '--bg': r.color }}>
                                    <p>«{r.text}»</p>
                                    <div className="ap-rev-meta">
                                        <span className="ap-avatar" aria-hidden="true" />
                                        <div>
                                            <strong>{r.name}</strong>
                                            <small>{r.role}</small>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="ap-stats">
                    <div className="ap-wrap">
                        <div className="ap-stats-row ap-reveal">
                            {STATS.map((s) => (
                                <div key={s.label} className="ap-stat">
                                    <strong>{s.value}</strong>
                                    <span>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {featured.length > 0 && (
                    <section className="ap-sec ap-courses" id="courses" aria-label="دورات مميزة">
                        <div className="ap-wrap">
                            <div className="ap-head ap-reveal">
                                <span className="ap-eyebrow">ابدأ من هنا</span>
                                <h2>دورات يختارها الأطفال</h2>
                            </div>
                            <div className="ap-course-grid">
                                {featured.map((c, i) => (
                                    <Link key={c.id || c.slug || i} href={c.slug ? route('explore.show', c.slug) : route('explore.index')} className={`ap-course ap-reveal ap-d${(i % 3) + 1}`}>
                                        <div className="ap-course-top">
                                            <img src={i % 2 === 0 ? CHAR.majd : CHAR.lama} alt="" />
                                        </div>
                                        <div className="ap-course-body">
                                            <h3>{c.title || c.name}</h3>
                                            <p>{c.short_description || c.description || 'درس تفاعلي ممتع بالعربية.'}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="ap-cta-band" aria-label="ابدأ الآن">
                    <div className="ap-wrap ap-reveal">
                        <h2>جاهز تبدأ مغامرة العربية؟</h2>
                        <p>أنشئ حسابًا في دقائق، واختر مرحلة طفلك، ودع مجد ولمى يقودان الدرس الأول.</p>
                        <div className="ap-actions">
                            <Link href={route('register')} className="ap-cta">إنشاء حساب مجاني</Link>
                            <Link href={route('explore.index')} className="ap-cta-ghost">تصفّح الدورات</Link>
                        </div>
                    </div>
                </section>

                <footer className="ap-footer">
                    <div className="ap-footer-wave" aria-hidden="true">
                        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                            <path fill="currentColor" d="M0,78 C140,28 240,105 380,82 C540,55 650,8 810,44 C970,80 1080,108 1220,66 C1320,36 1390,50 1440,60 L1440,0 L0,0 Z" />
                        </svg>
                    </div>
                    <div className="ap-wrap">
                        <div className="ap-footer-inner ap-reveal">
                            <h2>
                                محبوب من الأهل. موثوق من الأطفال.
                                <Icon name="heart" className="h-6 w-6" />
                            </h2>
                            <div className="ap-footer-mid">
                                <div className="ap-stars" aria-label="تقييم ٤٫٨ من ٥">
                                    {[0, 1, 2, 3, 4].map((n) => (
                                        <svg key={n} width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></svg>
                                    ))}
                                </div>
                                <p>٤٫٨ / ٥ من آلاف التقييمات</p>
                                <div className="ap-avatars" aria-hidden="true">
                                    <span style={{ '--a1': '#93c5fd', '--a2': '#60a5fa' }} />
                                    <span style={{ '--a1': '#f9a8d4', '--a2': '#fb7185' }} />
                                    <span style={{ '--a1': '#86efac', '--a2': '#34d399' }} />
                                    <span style={{ '--a1': '#c4b5fd', '--a2': '#a78bfa' }} />
                                </div>
                            </div>
                            <div className="ap-badge">
                                <Icon name="shield" className="h-5 w-5" />
                                بيئة آمنة ومناسبة للأطفال
                            </div>
                        </div>
                        <div className="ap-copy">
                            <span>© {new Date().getFullYear()} عربيتي</span>
                            <span>
                                <Link href={route('explore.index')}>الدورات</Link>
                                {' · '}
                                <Link href={route('marketing.contact')}>تواصل</Link>
                                {' · '}
                                <Link href={route('marketing.about')}>عنّا</Link>
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </PublicSiteLayout>
    );
}
