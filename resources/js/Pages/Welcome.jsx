import { Head } from '@inertiajs/react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import { useStudentTheme } from '@/contexts/StudentThemeContext';
import { useEffect, useRef, useState } from 'react';

const worldAssets = {
    boyHero: '/assets/home/characters/boy-hero.png',
    girlHero: '/assets/home/characters/girl-hero.png',
    boy1: '/Boy1.png',
    girl1: '/Girl.png',
    boySchool: '/assets/home/characters/boy-schoolbag.png',
    girlSchool: '/assets/home/characters/girl-schoolbag.png',
    book: '/assets/home/characters/book.png',
    ipad: '/assets/home/characters/ipad.png',
    lamp: '/assets/home/characters/lamp.png',
    think: '/assets/home/characters/think.png',
    heroBoy: '/assets/home/characters/hero-color-boy.png',
    heroGirl: '/assets/home/characters/hero-color-girl.png',
};

const worlds = [
    { key: 'letters', title: 'الحروف', subtitle: 'تعلّم الحروف العربية وأصواتها', color: 'from-rose-400 to-pink-500', accent: '#fb7185' },
    { key: 'words', title: 'الكلمات', subtitle: 'اقرأ كلمات جديدة يوميًا', color: 'from-sky-400 to-indigo-500', accent: '#38bdf8' },
    { key: 'songs', title: 'الأغاني', subtitle: 'أغاني تفاعلية للتعلم بالإنشاء', color: 'from-amber-400 to-orange-500', accent: '#fbbf24' },
    { key: 'games', title: 'الألعاب', subtitle: 'تعلّم من خلال اللعب والاستمتاع', color: 'from-emerald-400 to-teal-500', accent: '#34d399' },
];

const journeySteps = [
    { step: 1, title: 'استكشف العالم', desc: 'اختر عالمًا مفضلًا وابدأ المغامرة', color: '#fb7185' },
    { step: 2, title: 'تعلّم مع الشخصيات', desc: 'الشخصيات المرشدة تصاحبك في كل درس', color: '#38bdf8' },
    { step: 3, title: 'مارس وتمرّن', desc: 'تمارين تفاعلية ممتعة وتحديات', color: '#fbbf24' },
    { step: 4, title: 'احصل على إنجازات', desc: 'اجمع النجوم والشارات وافتخر', color: '#34d399' },
];

const parentFeatures = [
    { icon: '📊', title: 'تتبع التقدم', desc: 'لوحة معلومات واضحة عن مستوى طفلك وإنجازاته.' },
    { icon: '🎯', title: 'أهداف تعلّم مخصصة', desc: 'حدّد أهدافًا مناسبة لمستوى وعمر طفلك.' },
    { icon: '⏱️', title: 'دروس قصيرة مركّزة', desc: 'محتوى قصير وفعّال يناسب انتباه الأطفال.' },
];

const stats = [
    { value: '+10K', label: 'طالب وطالبة' },
    { value: '+500', label: 'درس تفاعلي' },
    { value: '4.9★', label: 'تقييم الأهل' },
    { value: '12', label: 'عالم تعلّم' },
];

export default function Welcome({ content = {}, courses = [], stats: liveStats = [] }) {
    const { isPublicHome } = useStudentTheme();
    const startRoute = isPublicHome ? route('explore.index') : route('learning.my');
    const heroRef = useRef(null);
    const [scrollY, setScrollY] = useState(0);
    const [revealed, setRevealed] = useState({});

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll('.world-section');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setRevealed((prev) => ({ ...prev, [entry.target.dataset.reveal || '']: true }));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );
        sections.forEach((sec) => observer.observe(sec));
        return () => observer.disconnect();
    }, []);

    const reveal = (cond) => (key) => cond ? 'world-reveal is-visible' : `world-reveal ${key}`;

    return (
        <PublicSiteLayout fullBleed overlayHero>
            <Head title="عربيتي" />
            <meta name="description" content={content.hero_description || 'عربيتي — منصة تعليم للأطفال والأهل.'} />

            <style>{`
                @keyframes float-y {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-16px); }
                }
                @keyframes float-y-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-9px); }
                }
                @keyframes drift {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: .55; }
                    25% { transform: translate(24px, -20px) scale(1.08); opacity: .8; }
                    75% { transform: translate(-24px, -16px) scale(.92); opacity: .7; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rise {
                    0% { transform: translateY(24px) scale(.96); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes shimmer-bar {
                    0% { left: -60%; }
                    100% { left: 120%; }
                }
                @keyframes pop-in {
                    0% { transform: scale(.85); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes hero-float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(.3deg); }
                }
                @keyframes cloud-drift-1 {
                    0%, 100% { transform: translateX(0); opacity: .7; }
                    25% { transform: translateX(-40px); opacity: .85; }
                    50% { transform: translateX(-30px); opacity: .6; }
                    75% { transform: translateX(10px); opacity: .9; }
                }
                @keyframes cloud-drift-2 {
                    0%, 100% { transform: translateX(0); opacity: .45; }
                    33% { transform: translateX(-35px); opacity: .6; }
                    66% { transform: translateX(25px); opacity: .35; }
                }
                @keyframes cloud-drift-3 {
                    0%, 100% { transform: translateX(0); opacity: .4; }
                    50% { transform: translateX(-28px); opacity: .6; }
                }
                @keyframes star-pulse {
                    0%, 100% { transform: scale(.9) rotate(0deg); opacity: .7; }
                    50% { transform: scale(1.15) rotate(180deg); opacity: 1; }
                }
                @keyframes glow-pulse {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.2); }
                }
                .world-section { position: relative; overflow: hidden; }
                .world-reveal {
                    opacity: 0;
                    transform: translateY(34px) scale(.98);
                    filter: blur(6px);
                    transition: opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1), filter .8s cubic-bezier(.2,.8,.2,1);
                }
                .world-reveal.is-visible {
                    opacity: 1;
                    transform: none;
                    filter: blur(0);
                }
                .hero-sky { background: linear-gradient(160deg, #eaf6ff 0%, #f4f0ff 45%, #fff7ef 82%, #ffe3ec 100%); background-attachment: fixed; }
                .cloud { position: absolute; border-radius: 50%; pointer-events: none; will-change: transform, opacity; }
                .rainbow-arch { position: absolute; border-radius: 50%; mix-blend-mode: screen; pointer-events: none; z-index: 1; }
                .word-card { position: relative; overflow: hidden; isolation: isolate; }
                .word-card::after {
                    content: '';
                    position: absolute; top: 0; bottom: 0; width: 34%; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.6), rgba(255,255,255,0));
                    transform: translateX(-100%); animation: shimmer-bar 4.8s ease-in-out infinite; pointer-events: none; z-index: 1;
                }
                .world-tile { position: relative; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; cursor: pointer; }
                .world-tile:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 24px 48px -18px rgba(30,60,120,.3), 0 0 0 1px rgba(30,60,120,.15); }
                .world-tile > svg, .world-tile > img { position: relative; z-index: 1; transition: transform .4s cubic-bezier(.2,.8,.2,1), filter .4s ease; }
                .stat-pill { position: relative; overflow: hidden; cursor: default; }
                .stat-pill::after { content: ''; position: absolute; top: 0; bottom: 0; left: -50%; width: 40%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent); animation: shimmer-bar 3.8s ease-in-out infinite; }
                .journey-node { transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; cursor: pointer; position: relative; overflow: hidden; }
                .journey-node:hover { transform: translateY(-6px) scale(1.04); box-shadow: 0 22px 44px -20px rgba(30,60,120,.4), 0 8px 16px rgba(30,60,120,.15); }
                .journey-node::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, transparent, rgba(255,255,255,.4), transparent); opacity: 0; transition: opacity .3s; pointer-events: none; }
                .journey-node:hover::after { opacity: 1; }
                .parent-tile { transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s; cursor: default; position: relative; overflow: hidden; }
                .parent-tile:hover { transform: translateY(-4px); border-color: var(--tile-accent, #c7d2fe); box-shadow: 0 18px 36px -16px rgba(30,60,120,.25), inset 0 1px 0 rgba(255,255,255,.4); }
                .cta-orb { position: absolute; border-radius: 50%; filter: blur(48px); pointer-events: none; z-index: -1; }
                @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0.01ms !important; transform: none !important; filter: none !important; opacity: .55 !important; } }
                @media (max-width: 768px) { .hero-sky { background-attachment: scroll; min-height: auto; height: 92vh; } .cloud { display: none; } }
            `}</style>

            {/* ===================== HERO SCENE ===================== */}
            <section ref={heroRef} className="hero-sky world-section" data-reveal="hero" style={{ minHeight: '100vh', overflow: 'hidden' }}>
                {/* Background layers */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="cloud cloud-1" style={{ width: 280, height: 135, top: '6%', left: '4%', opacity: .9 }} />
                    <div className="cloud cloud-2" style={{ width: 210, height: 105, top: '14%', right: '8%', opacity: .75, animationDuration: '.3s' }} />
                    <div className="cloud cloud-3" style={{ width: 160, height: 90, top: '28%', left: '-2%', opacity: .6 }} />
                    <div className="cloud cloud-4" style={{ width: 150, height: 75, top: '38%', right: '-3%', opacity: .5 }} />
                    <div className="cloud cloud-5" style={{ width: 200, height: 95, top: '62%', left: '14%' }} />
                </div>

                {/* Rainbow arch behind characters */}
                <div className="rainbow-arch absolute pointer-events-none z-[1]" style={{ width: 780, height: 780, top: '-35%', right: '-25%' }} />

                {/* Hero content column */}
                <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-5 lg:flex-row lg:items-center lg:text-left">
                    <div className="flex-1 lg:pr-8" style={{ animation: 'rise 1.2s cubic-bezier(.2,.8,.2,1) both' }}>
                        {/* Badge */}
                        <span className="word-card inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/65 px-4 py-1.5 text-sm font-semibold text-indigo-600 shadow-lg backdrop-blur-md">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></svg>
                            منصة عربية تعليمية للأطفال
                        </span>

                        <h1 className="mt-7 text-4xl sm:text-5xl lg:text-[clamp(2rem,5vw,3.6rem)] font-black leading-tight text-slate-800 sm:leading-none">
                            عالمٌ صغير<br />
                            <span className="bg-gradient-to-r from-rose-500 via-fuchsia-500 to-sky-400 -webkit-background-clip bg-clip-text text-transparent">للتعلّم والاستمتاع</span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-xl text-lg leading-[1.8] text-slate-500">
                            عربيتي تأخذ طفلك في رحلة تعلّم غامرة مع شخصيات مرشدة ممتعة، دروس قصيرة، وتحديات تفاعلية تقربه من الحروف والكلمات والأغاني.
                        </p>

                        {/* CTA pills */}
                        <div className="mx-auto mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                            <a href={startRoute} className="word-card inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-600 to-sky-400 px-7 py-3.5 font-bold text-white shadow-xl shadow-fuchsia-500/25 transition hover:-translate-y-[1px] hover:shadow-2xl">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7l5 5-5 5" /></svg>
                                ابدأ المغامرة
                            </a>
                            <a href={route('explore.index')} className="inline-flex items-center gap-2 rounded-full border-2 border-indigo-300 bg-white/80 px-7 py-3.5 font-bold text-indigo-600 transition hover:-translate-y-[1px] hover:border-indigo-400 hover:shadow-lg">
                                استكشف الدورات
                            </a>
                        </div>

                        {/* Stat pills */}
                        <div className="mx-auto mt-12 flex flex-wrap justify-center lg:justify-start lg:max-w-md">
                            <div className="flex flex-wrap gap-3">
                                {stats.map((s) => (
                                    <div key={s.label} className="stat-pill flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 shadow-sm border border-white/60 backdrop-blur-md">
                                        <span className="text-xl font-black text-indigo-700">{s.value}</span>
                                        <span className="text-xs font-medium text-slate-500">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hero characters scene */}
                    <div className="relative mt-12 flex-1 lg:mt-0">
                        <div className="relative mx-auto flex max-w-md items-center justify-center lg:max-w-none">
                            {/* Ground / scene base */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 translate-y-6" style={{ width: 500, height: 130, borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(139,92,246,.18), rgba(139,92,246,0) 70%)', filter: 'blur(28px)' }} />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 translate-y-5" style={{ width: 360, height: 90, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(251,113,133,.08), transparent 70%)' }} />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-[6px]" style={{ width: 440, height: 95, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(56,189,248,.07), transparent 70%)' }} />

                            {/* Boy character (foreground) */}
                            <div className="relative z-20" style={{ transform: `translateY(${Math.sin(scrollY * 0.025) * 10}px)` }}>
                                <div className="float-anim relative" style={{ animation: 'hero-float 6s ease-in-out infinite' }}>
                                    <img src={worldAssets.boyHero} alt="شخصية الطفل المرشدة" style={{ width: 300, height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 28px 40px rgba(60,40,120,.3))' }} />
                                </div>
                            </div>

                            {/* Girl character (offset behind) */}
                            <div className="relative z-10 -ml-[5%] lg:-ml-[8%]" style={{ transform: `translateY(${Math.sin(scrollY * 0.02 + 1) * 7}px)` }}>
                                <div style={{ animation: 'hero-float-slow 6s ease-in-out infinite .3s' }}>
                                    <img src={worldAssets.girlHero} alt="شخصية الطفلة المرشدة" style={{ width: 250, height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 18px 26px rgba(60,40,120,.3))' }} />
                                </div>
                            </div>

                            {/* Floating decorative elements */}
                            <div className="relative z-30" style={{ top: '7%', left: '-5%' }}>
                                <img src={worldAssets.book} alt="" style={{ width: 68, height: 'auto', objectFit: 'contain' }} />
                            </div>
                            <div className="relative z-30" style={{ top: '14%', right: '-7%' }}>
                                <img src={worldAssets.ipad} alt="" style={{ width: 82, height: 'auto', objectFit: 'contain' }} />
                            </div>
                            <div className="relative z-30" style={{ bottom: '16%', left: '-4%' }}>
                                <img src={worldAssets.lamp} alt="" style={{ width: 58, height: 'auto', objectFit: 'contain' }} />
                            </div>
                            <div className="relative z-30" style={{ bottom: '12%', right: '-6%' }}>
                                <img src={worldAssets.think} alt="" style={{ width: 58, height: 'auto', objectFit: 'contain' }} />
                            </div>
                            <div className="relative z-30" style={{ top: '14%', left: '-2%' }}>
                                <img src={worldAssets.boySchool} alt="" style={{ width: 58, height: 'auto', objectFit: 'contain' }} />
                            </div>
                            <div className="relative z-30" style={{ top: '14%', right: '-2%' }}>
                                <img src={worldAssets.girlSchool} alt="" style={{ width: 58, height: 'auto', objectFit: 'contain' }} />
                            </div>

                            {/* Sparkle stars */}
                            {[
                                { t: '4%', r: '10%' }, { t: '26%', l: '-3%' }, { t: '58%', r: '-1%' },
                                { t: '78%', l: '3%' }, { t: '92%', r: '-4%' }, { t: '10%', r: '2%' },
                            ].map((p, i) => (
                                <div key={i} className="absolute" style={{ top: p.t, left: p.l }}>
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill={['#fbbf24', '#fb7185', '#34d399'][i % 3]}><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-[3px] opacity-55">
                    <span className="text-xs font-medium text-slate-400 tracking-wide">اسحب للتمرير</span>
                    <div className="relative h-[18px] w-[7px] rounded-full border-2 border-indigo-300">
                        <div className="absolute left-1/2 top-1.5 h-[6px] w-[4px] -translate-x-1/2 rounded-full bg-indigo-400" style={{ animation: 'float-y 2s ease-in-out infinite' }} />
                    </div>
                </div>
            </section>

            {/* ===================== LEARNING WORLDS ===================== */}
            <section className="world-section bg-gradient-to-b from-white/60 to-indigo-50/40 py-20 sm:py-28" data-reveal="worlds">
                <div className="mx-auto max-w-6xl px-5">
                    {/* Section header */}
                    <div className={reveal(true)('hero')} style={{ transitionDelay: '0ms' }}>
                        <div className="mx-auto flex max-w-md flex-col items-center text-center">
                            <span className="word-card inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
                                عوالم تعلّم غامرة
                            </span>
                            <h2 className="mt-5 text-3xl font-black text-slate-800 sm:text-4xl">استكشف العوالم</h2>
                            <p className="mt-4 max-w-lg text-base leading-[1.7] text-slate-600">كل عالم مليء بالشخصيات والدروس التفاعلية التي تجعل التعلّم مغامرة يومية.</p>
                        </div>
                    </div>

                    {/* World islands grid */}
                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {worlds.map((w, i) => (
                            <div key={w.key} className={reveal(true)('word-card')} style={{ transitionDelay: `${(i + 1) * 90}ms` }}>
                                <a href={route('explore.index')} className="world-tile block overflow-hidden rounded-3xl bg-white p-6 shadow-xl border border-slate-100">
                                    {/* World illustration area */}
                                    <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 to-white p-4 text-center mb-5" style={{ height: 230 }}>
                                        <div className={`mx-auto flex h-[108px] w-[108px] items-center justify-center rounded-full bg-gradient-to-br ${w.color} text-white shadow-lg`} style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.2))' }}>
                                            {w.icon}
                                        </div>
                                    </div>
                                    <h3 className="mt-5 text-xl font-black text-slate-800">{w.title}</h3>
                                    <p className="mt-1.5 text-sm leading-[1.6] text-slate-500">{w.subtitle}</p>
                                    <span className="mt-4 inline-flex items-center gap-1.5 font-bold text-indigo-600 group-hover:text-fuchsia-600 transition-colors duration-300">
                                        استكشف
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m14 0-7 7 7 7" /></svg>
                                    </span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== CHARACTER COMPANIONS ===================== */}
            <section className="world-section relative overflow-hidden bg-gradient-to-b from-sky-50/60 to-white py-20 sm:py-28" data-reveal="companions">
                <div className="mx-auto max-w-6xl px-5">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        {/* Scene */}
                        <div className="relative flex items-center justify-center lg:order-2" style={{ animation: 'rise 1.2s cubic-bezier(.2,.8,.2,1) both' }}>
                            <div className="relative w-full max-w-md">
                                {/* Background glow */}
                                <div className="absolute inset-0 mx-auto mt-10 h-[340px] w-[340px] rounded-full bg-gradient-to-br from-sky-200/65 to-fuchsia-200/65 blur-2xl" />
                                {/* Boy companion */}
                                <div className="relative z-10 flex justify-center">
                                    <div style={{ animation: 'float-y 4.8s ease-in-out infinite' }}>
                                        <img src={worldAssets.heroBoy} alt="الطفل كشخصية مرشدة" style={{ width: '76%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 14px 28px rgba(60,40,120,.3))' }} />
                                    </div>
                                </div>
                                {/* Girl companion */}
                                <div className="relative z-10 -mt-[5%] flex justify-center">
                                    <div style={{ animation: 'float-y-slow 5.8s ease-in-out infinite .6s' }}>
                                        <img src={worldAssets.heroGirl} alt="الطفلة كشخصية مرشدة" style={{ width: '70%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 14px 28px rgba(60,40,120,.3))' }} />
                                    </div>
                                </div>
                                {/* Think bubble */}
                                <div className="absolute right-3 top-[5%] z-20" style={{ animation: 'pop-in 1.2s ease-out .6s both' }}>
                                    <img src={worldAssets.think} alt="" style={{ width: 78, height: 'auto', objectFit: 'contain' }} />
                                </div>
                            </div>
                        </div>

                        {/* Copy */}
                        <div className="lg:pr-6" style={{ animation: 'rise 1.2s cubic-bezier(.2,.8,.2,1) .15s both' }}>
                            <span className="word-card inline-flex items-center gap-2 rounded-full bg-fuchsia-100 px-4 py-1.5 text-sm font-semibold text-fuchsia-600">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9C.8 9.5 2 6 5.5 6 8 6 9.5 7.5 12 5.5 14.5 7.5 16 6 18.5 6 22 6 23.2 9.5 21.5 12 19 16.5 12 21 12 21z" /></svg>
                                شخصيات مرشدة
                            </span>
                            <h2 className="mt-5 text-4xl font-black text-slate-800 sm:text-5xl">تعلّم مع أصدقائك</h2>
                            <p className="mt-4 max-w-lg text-base leading-[1.7] text-slate-600">شخصيتا الطفل والطفلة تصاحبان طفلك في كل درس، يشرحان، يسألان، ويحفزان على الاستمرار. ليس مجرد صور، بل رفقاء رحلة حقيقية.</p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {['يرشد بخطوات واضحة', 'يشرح بلغة بسيطة', 'يحفز على الإنجاز'].map((t) => (
                                    <span key={t} className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M8 7l5.5 3.5L16 7h-6z"/></svg>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== LEARNING JOURNEY ===================== */}
            <section className="world-section bg-gradient-to-b from-white to-violet-50/40 py-20 sm:py-28" data-reveal="journey">
                <div className="mx-auto max-w-6xl px-5">
                    {/* Section header */}
                    <div className={reveal(true)('hero')} style={{ transitionDelay: '0ms' }}>
                        <div className="mx-auto flex max-w-md flex-col items-center text-center">
                            <span className="word-card inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-600 shadow-lg shadow-amber-500/25">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><path d="M5 12h14m-7-7l5 5-5 5" /></svg>
                                مسار تعلّم مُخطّط
                            </span>
                            <h2 className="mt-6 text-3xl font-black text-slate-800 sm:text-4xl">رحلة التعلّم</h2>
                            <p className="mt-4 max-w-lg text-base leading-[1.7] text-slate-500">خطوات بسيطة ومتتابعة تأخذ طفلك من أول حرف إلى أول كلمة يقرأه بثقة.</p>
                        </div>
                    </div>

                    {/* Journey path */}
                    <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {journeySteps.map((step, i) => (
                            <div key={step.step} className={reveal(true)('journey-node')} style={{ transitionDelay: `${(i + 1) * 90}ms` }}>
                                <div className="relative h-full rounded-3xl bg-white p-6 shadow-lg border border-slate-100">
                                    {/* Step number circle */}
                                    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full text-xl font-black text-white" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.2))' }}>
                                        {step.step}
                                    </div>
                                    <h3 className="mt-5 text-xl font-black text-slate-800">{step.title}</h3>
                                    <p className="mt-1.5 text-sm leading-[1.6] text-slate-500">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== ACHIEVEMENTS / STATISTICS ===================== */}
            <section className="world-section relative overflow-hidden py-20 sm:py-28" data-reveal="achievements" style={{ background: 'linear-gradient(160deg, #4f46e5 0%, #7c3aed 45%, #a213da 100%)' }}>
                {/* Decorative orbs */}
                <div className="cta-orb" style={{ width: 380, height: 380, top: '-90px', left: '-70px', background: 'radial-gradient(circle, rgba(251,113,133,.6), transparent 70%)' }} />
                <div className="cta-orb" style={{ width: 340, height: 340, bottom: '-80px', right: '-50px', background: 'radial-gradient(circle, rgba(56,189,248,.5), transparent 70%)' }} />
                <div className="cta-orb" style={{ width: 300, height: 300, top: '40%', left: '-12%' }} />

                <div className="mx-auto max-w-6xl px-5 relative z-10">
                    {/* Section header */}
                    <div className={reveal(true)('hero')} style={{ transitionDelay: '0ms' }}>
                        <div className="mx-auto flex max-w-md flex-col items-center text-white">
                            <span className="word-card inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold border border-white/20 backdrop-blur-sm">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></svg>
                                الإنجازات والتقدّم
                            </span>
                            <h2 className="mt-5 text-4xl font-black sm:text-5xl">كل خطوة تُحتفى بها</h2>
                            <p className="mt-4 max-w-lg text-base leading-[1.7] text-white/80">نحتفي بكل إنجاز صغير، ونعرض الإحصائيات التي تحفّز على الاستمرار.</p>
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((s, i) => (
                            <div key={s.label} className={reveal(true)('stat-pill')} style={{ transitionDelay: `${(i + 1) * 90}ms` }}>
                                <div className="rounded-3xl bg-white/12 p-7 text-center border border-white/25 backdrop-blur-sm">
                                    <div className="text-4xl font-black text-white mb-1.5">{s.value}</div>
                                    <div className="mt-1.5 text-base font-medium text-white/80">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Achievement badges */}
                    <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
                        {[
                            { emoji: '🏅', label: 'نجم الحروف' },
                            { emoji: '🎨', label: 'بطل الإبداع' },
                            { emoji: '📚', label: 'قارئ الكلمات' },
                            { emoji: '🌟', label: 'مُجتاز المراحل' },
                        ].map((b, i) => (
                            <div key={b.label} className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 border border-white/20 backdrop-blur-sm" style={{ animation: `pop-in .6s ease-out ${0.3 + i * 0.1}s both` }}>
                                <span className="text-xl">{b.emoji}</span>
                                <span className="text-sm font-semibold text-white/95">{b.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== PARENTS SECTION ===================== */}
            <section className="world-section bg-gradient-to-b from-white to-rose-50/40 py-20 sm:py-28" data-reveal="parents">
                <div className="mx-auto max-w-6xl px-5">
                    {/* Layout row */}
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        {/* Copy */}
                        <div style={{ animation: 'rise 1.2s cubic-bezier(.2,.8,.2,1) both' }}>
                            <span className="word-card inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-600 shadow-lg shadow-emerald-500/25">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6m-3-4h3" /></svg>
                                للأهل
                            </span>
                            <h2 className="mt-5 text-3xl font-black text-slate-800 sm:text-4xl">تتبّع رحلة تعلّم طفلك</h2>
                            <p className="mt-4 max-w-lg text-base leading-[1.7] text-slate-600">صُممت لوحة الأهل لتعطيك صورة واضحة عن تقدّم طفلك، أهدافه، وإنجازاته، بدون تعقيد.</p>
                        </div>

                        {/* Parent tiles */}
                        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                            {parentFeatures.map((f, i) => (
                                <div key={f.title} className={reveal(true)('parent-tile')} style={{ transitionDelay: `${(i + 1) * 90}ms`, '--tile-accent': '#c7d2fe' }}>
                                    <div className="rounded-3xl bg-white p-5 shadow-lg border border-slate-100 flex items-start gap-4">
                                        <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-2xl">{f.icon}</div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800">{f.title}</h3>
                                            <p className="mt-1.5 text-sm leading-[1.6] text-slate-500">{f.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== FINAL CTA ===================== */}
            <section className="world-section relative overflow-hidden py-24 sm:py-32" data-reveal="cta" style={{ background: 'linear-gradient(160deg, #fde68a 0%, #fecdc3 50%, #ddd6fe 100%)' }}>
                <div className="cta-orb" style={{ width: 420, height: 420, top: '-90px', right: '-7%', background: 'radial-gradient(circle, rgba(251,113,133,.6), transparent 70%)' }} />
                <div className="cta-orb" style={{ width: 380, height: 380, bottom: '-90px', left: '-4%', background: 'radial-gradient(circle, rgba(56,189,248,.5), transparent 70%)' }} />
                <div className="cta-orb" style={{ width: 300, height: 300, top: '35%', left: '-12%' }} />

                {/* Scene wrapper */}
                <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center relative z-10">
                    {/* Character row - Boy + Girl together as scene anchors */}
                    <div className="flex -space-x-4 space-x-reverse mb-8" style={{ animation: 'pop-in .9s ease-out both' }}>
                        <img src={worldAssets.boy1} alt="شخصية الطفل" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '50%', border: '4px solid white', boxShadow: '0 8px 20px rgba(0,0,0,.15)' }} />
                        <img src={worldAssets.girl1} alt="شخصية الطفلة" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '50%', border: '4px solid white', boxShadow: '0 8px 20px rgba(0,0,0,.15)', marginRight: -20 }} />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-slate-800 sm:text-5xl">جاهز تبدأ المغامرة؟</h2>
                    <p className="mt-4 max-w-lg text-base leading-[1.7] text-slate-600">انضم إلى آلاف العائلات التي اختارت عربيتي لتعليم أطفالها بلغة ممتعة وموثوقة.</p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a href={startRoute} className="word-card inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-7 py-4 font-bold text-white shadow-xl shadow-fuchsia-500/25 transition hover:-translate-y-[1px] hover:shadow-2xl">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7l5 5-5 5" /></svg>
                            ابدأ مجاناً
                        </a>
                        <a href={route('register')} className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-7 py-4 font-bold text-slate-600 transition hover:-translate-y-[1px] hover:border-slate-400 hover:shadow-lg">
                            إنشاء حساب
                        </a>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}