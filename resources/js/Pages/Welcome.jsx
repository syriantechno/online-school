import { Head } from '@inertiajs/react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import { useStudentTheme } from '@/contexts/StudentThemeContext';
import { useEffect } from 'react';

const A = {
    boyHero: '/assets/home/characters/boy-hero.png',
    girlHero: '/assets/home/characters/girl-hero.png',
    boySmall: '/assets/home/characters/hero-color-boy.png',
    girlSmall: '/assets/home/characters/hero-color-girl.png',
    book: '/assets/home/characters/book.png',
    game: '/assets/home/characters/game.png',
    trophy: '/assets/home/characters/ka2s.png',
    target: '/assets/home/characters/hadaf.png',
};

const WORLDS = [
    { id: 'letters', title: 'الحروف', tag: 'أ، ب، ت', color: '#fb7185', soft: '#ffe4e6', icon: 'letters' },
    { id: 'words', title: 'الكلمات', tag: 'اقرأ كلمات', color: '#38bdf8', soft: '#e0f2fe', icon: 'words' },
    { id: 'songs', title: 'الأغاني', tag: 'تعلّم بالغناء', color: '#fbbf24', soft: '#fef3c7', icon: 'songs' },
    { id: 'games', title: 'الألعاب', tag: 'العب وتعلّم', color: '#34d399', soft: '#d1fae5', icon: 'games' },
];

const JOURNEY = [
    { step: 1, title: 'استكشف', desc: 'كُن فضولياً في العالم' },
    { step: 2, title: 'تعلّم', desc: 'خُطوات صغيرة كل يوم' },
    { step: 3, title: 'مارس', desc: 'دُرّب ولوّن وأعِد' },
    { step: 4, title: 'أَنجز', desc: 'اجمع نجومك بفخر' },
];

export default function Welcome({ content = {}, courses = [], stats: liveStats = [] }) {
    const { isPublicHome } = useStudentTheme();
    const startRoute = isPublicHome ? route('explore.index') : route('learning.my');

    useEffect(() => {
        const targets = document.querySelectorAll('.rise-on-scroll');
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                }),
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );
        targets.forEach((t) => observer.observe(t));
        return () => observer.disconnect();
    }, []);

    return (
        <PublicSiteLayout fullBleed overlayHero>
            <Head title="عربيتي" />
            <meta name="description" content={content.hero_description || 'عربيتي — منصة تعليم للأطفال والأهل.'} />

            <style>{`
                /* ---------- world base ---------- */
                .world-page{position:relative;overflow:hidden;background:linear-gradient(180deg,#bfe6ff 0%,#dff4ff 22%,#fdf6d8 45%,#fff2ec 70%,#ffe9f2 100%);}
                .scene{position:relative;overflow:hidden;}
                .scene-inner{position:relative;z-index:5;margin:0 auto;max-width:1200px;padding:0 1.25rem;}

                /* ---------- motion ---------- */
                @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
                @keyframes floatSoft{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
                @keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(26px)}}
                @keyframes twinkle{0%,100%{opacity:.35;transform:scale(.85)}50%{opacity:1;transform:scale(1.15)}}
                @keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
                @keyframes riseIn{0%{opacity:0;transform:translateY(34px)}100%{opacity:1;transform:translateY(0)}}
                @keyframes popIn{0%{opacity:0;transform:scale(.6)}70%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
                .anim-float{animation:floatY 5.5s ease-in-out infinite;}
                .anim-float-soft{animation:floatSoft 4.5s ease-in-out infinite;}
                .anim-drift{animation:drift 9s ease-in-out infinite alternate;}
                .anim-sway{animation:sway 4s ease-in-out infinite;transform-origin:center bottom;}
                .twinkle{animation:twinkle 2.6s ease-in-out infinite;}
                .rise-on-scroll{opacity:0;transform:translateY(36px);transition:opacity .9s ease,transform .9s ease;}
                .is-revealed{opacity:1;transform:none;}

                /* ---------- sky elements ---------- */
                .sun{position:absolute;right:8%;top:9%;width:110px;height:110px;border-radius:999px;background:radial-gradient(circle,#fff3b0 0%,#ffd75e 55%,#ffb347 100%);box-shadow:0 0 90px 40px rgba(255,214,92,.65);}
                .cloud{position:absolute;background:#fff;border-radius:999px;box-shadow:inset 0 -10px 0 rgba(150,200,230,.35);}
                .cloud::before,.cloud::after{content:'';position:absolute;background:#fff;border-radius:999px;}
                .cloud::before{width:55%;height:160%;top:-55%;left:12%;}
                .cloud::after{width:38%;height:120%;top:-30%;right:14%;}

                /* ---------- land ---------- */
                .hill{position:absolute;border-radius:50%;}
                .hill-far{background:#c9e9b8;filter:blur(2px);}
                .hill-mid{background:#a8d97e;}
                .hill-near{background:#8fce60;}

                /* ---------- typography helpers ---------- */
                .font-display{font-weight:900;letter-spacing:-.5px;line-height:1.15;}
                .ink{color:#3d2c57;}

                /* ---------- buttons (part of world) ---------- */
                .btn-world{display:inline-flex;align-items:center;gap:.6rem;border-radius:999px;padding:.85rem 1.9rem;font-weight:800;color:#fff;box-shadow:0 10px 0 rgba(0,0,0,.12),0 18px 30px -12px rgba(61,44,87,.55);transition:transform .18s ease,box-shadow .18s ease;border:3px solid rgba(255,255,255,.65);}
                .btn-world:hover{transform:translateY(-3px);box-shadow:0 13px 0 rgba(0,0,0,.12),0 24px 36px -12px rgba(61,44,87,.55);}
                .btn-world:active{transform:translateY(4px);box-shadow:0 4px 0 rgba(0,0,0,.12);}
                .btn-candy{background:linear-gradient(180deg,#fb7185,#f43f5e);}
                .btn-sky{background:linear-gradient(180deg,#38bdf8,#0284c7);}

                /* ---------- world map ---------- */
                .road{fill:none;stroke:#f6b26b;stroke-width:34;stroke-linecap:round;stroke-linejoin:round;}
                .road-edge{fill:none;stroke:#8b5a2b;stroke-width:42;stroke-linecap:round;stroke-linejoin:round;opacity:.5;}
                .world-stop{position:relative;cursor:pointer;transition:transform .2s ease;}
                .world-stop:hover{transform:translateY(-6px) rotate(-1deg);}
                .stop-plate{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:2.4rem;padding:1.6rem 1.9rem 1.4rem;box-shadow:0 18px 34px -14px rgba(61,44,87,.5),inset 0 2px 0 rgba(255,255,255,.7);border:4px solid rgba(255,255,255,.8);}

                /* ---------- journey ---------- */
                .trail{fill:none;stroke:#d8b56a;stroke-width:26;stroke-linecap:round;stroke-linejoin:round;}
                .trail-dot{fill:#f7f7ef;stroke:#d8b56a;stroke-width:5;}

                /* ---------- treasure ---------- */
                .star-shape{filter:drop-shadow(0 4px 0 rgba(61,44,87,.18));}

                /* ---------- observatory ---------- */
                .scope{position:relative;background:linear-gradient(180deg,#fff,#fdf2d8);border-radius:2rem;box-shadow:0 24px 44px -20px rgba(61,44,87,.45),inset 0 3px 0 rgba(255,255,255,.9);border:4px solid #fff;}
                .grow-track{position:relative;height:26px;border-radius:999px;background:#eef0ea;box-shadow:inset 0 3px 6px rgba(61,44,87,.12);overflow:hidden;}
                .grow-fill{position:absolute;top:0;bottom:0;right:0;border-radius:999px;background:linear-gradient(90deg,#ffd75e,#34d399);}

                /* ---------- responsive ---------- */
                @media (max-width:768px){
                    .scene-inner{padding:0 .9rem;}
                    .sun{width:70px;height:70px;top:4%;}
                }
                @media (prefers-reduced-motion:reduce){
                    *{animation:none !important;transition:none !important;}
                }
            `}</style>

            <div className="world-page">

                {/* ============================================================
                    SCENE 1 — HERO: giant illustrated environment
                ============================================================ */}
                <section className="scene" data-reveal="hero" style={{ minHeight:'100vh', paddingTop:'84px' }}>
                    {/* sun + clouds + stars (background) */}
                    <div className="sun anim-drift" aria-hidden="true" />
                    <div className="cloud anim-drift" style={{ width:'210px', height:'56px', top:'12%', left:'6%' }} aria-hidden="true" />
                    <div className="cloud" style={{ width:'150px', height:'42px', top:'20%', left:'24%' }} aria-hidden="true" />
                    <div className="cloud anim-float-soft" style={{ width:'260px', height:'66px', top:'8%', right:'-2%' }} aria-hidden="true" />

                    {/* stars */}
                    {[
                        [8, 26], [16, 34], [70, 18], [82, 30], [55, 12],
                    ].map(([l, t], i) => (
                        <svg key={i} className="twinkle" style={{ position:'absolute', left:`${l}%`, top:`${t}%`, animationDelay:`${i * .4}s` }} width="20" height="20" viewBox="0 0 24 24" fill="#ffd75e">
                            <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
                        </svg>
                    ))}

                    {/* far hills */}
                    <div className="hill hill-far" style={{ bottom:'-46vh', right:'-12vw', width:'60vw', height:'60vh' }} />
                    <div className="hill hill-far" style={{ bottom:'-50vh', left:'-14vw', width:'70vw', height:'60vh' }} />

                    {/* mid hills */}
                    <div className="hill hill-mid" style={{ bottom:'-30vh', left:'-10vw', width:'80vw', height:'46vh' }} />
                    <div className="hill hill-mid" style={{ bottom:'-34vh', right:'-12vw', width:'74vw', height:'48vh' }} />

                    {/* near ground */}
                    <div className="hill hill-near" style={{ bottom:'-22vh', left:'-8vw', width:'110vw', height:'34vh' }} />

                    {/* FG grass tufts */}
                    <div className="hill" style={{ bottom:'-6vh', left:'-4vw', width:'108vw', height:'16vh', background:'#7cbf4d', borderRadius:'50% 50% 0 0' }} aria-hidden="true" />

                    {/* ===== content (part of the scene) ===== */}
                    <div className="scene-inner flex flex-col items-center gap-10 pb-[46vh] pt-10 text-center lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:pb-[44vh] lg:text-right">
                        <div className="rise-on-scroll" style={{ maxWidth:'560px' }}>
                            <span className="anim-float-soft inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/80 px-4 py-1.5 text-sm font-bold text-rose-500 shadow">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></svg>
                                منصة عربية تعليمية للأطفال
                            </span>
                            <h1 className="font-display ink mt-4 text-5xl sm:text-6xl lg:text-7xl" style={{ textShadow:'0 6px 0 rgba(255,255,255,.8)' }}>
                                عالم صغير
                                <span className="block text-rose-500" style={{ WebkitTextStroke:'2px #fff' }}>وكلّه للتعلّم</span>
                            </h1>
                            <p className="mt-5 max-w-md text-lg font-semibold leading-relaxed text-[#5b4876]">
                                عربيتي تأخذ طفلك في مغامرة حروف وكلمات وأغاني وألعاب، مع شخصيات تحبّها.
                            </p>
                            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                                <a href={startRoute} className="btn-world btn-candy">
                                    ابدأ المغامرة
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                                </a>
                                <a href={route('explore.index')} className="btn-world btn-sky">
                                    استكشف العوالم
                                </a>
                            </div>
                        </div>

                        {/* characters physically in the scene */}
                        <div className="relative flex items-end justify-center gap-2 lg:w-[42%]">
                            <img
                                src={A.boyHero}
                                alt="الصبي رامز مرشدك في عربيتي"
                                className="anim-float relative z-10"
                                style={{ width:'min(46vw,290px)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 26px 18px rgba(61,44,87,.35))' }}
                            />
                            <img
                                src={A.girlHero}
                                alt="الفتاة سيلينا رفيقة التعلم"
                                className="anim-float-soft relative z-20 -mr-8"
                                style={{ width:'min(46vw,280px)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 26px 18px rgba(61,44,87,.35))' }}
                            />
                            {/* a floating open book between them */}
                            <img
                                src={A.book}
                                alt="كتاب القصص المفتوح"
                                className="anim-float absolute left-1/2 top-[6%] z-30 -translate-x-1/2"
                                style={{ width:'86px', transform:'translateX(-50%) rotate(-6deg)', animationDelay:'.9s' }}
                            />
                        </div>
                    </div>
                </section>

                {/* curved transition */}
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ position:'relative', zIndex:6, display:'block', marginTop:'-1px' }} aria-hidden="true">
                    <path fill="#fff8e7" d="M0,80 C320,10 720,120 1440,30 L1440,120 L0,120 Z" />
                </svg>

                {/* ============================================================
                    SCENE 2 — LEARNING WORLDS: an illustrated adventure map
                ============================================================ */}
                <section className="scene" data-reveal="map" style={{ background:'#fff8e7' }}>
                    <div className="scene-inner py-16 lg:py-24">
                        <h2 className="font-display ink text-center text-4xl sm:text-5xl">
                            خريطة المغامرة <span className="text-emerald-500">الأربع عوالم</span>
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-center text-base font-semibold text-[#7a6795]">
                            اختر عالمك المفضّل وابدأ المشوار — كل عالم مكانٍ سحري بانتظارك.
                        </p>

                        <div className="relative mt-12" style={{ height:'auto', minHeight:'520px' }}>
                            {/* winding road under the stops */}
                            <svg viewBox="0 0 1200 520" preserveAspectRatio="none" className="absolute inset-0 w-full" style={{ height:'100%' }} aria-hidden="true">
                                <path className="road-edge" d="M60,70 C320,210 300,430 620,320 C860,240 980,300 1140,220" />
                                <path className="road" d="M60,70 C320,210 300,430 620,320 C860,240 980,300 1140,220" />
                                {/* dashes */}
                                <path fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="18 26" strokeLinecap="round" d="M60,70 C320,210 300,430 620,320 C860,240 980,300 1140,220" />
                            </svg>

                            <div
                                className="world-stop rise-on-scroll"
                                style={{ position:'absolute', top:'0%', right:'2%', zIndex:3 }}
                                onClick={() => (window.location.href = route('explore.index'))}
                            >
                                <div className="stop-plate" style={{ background:WORLDS[0].soft, borderColor:WORLDS[0].color }}>
                                    <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={WORLDS[0].color} strokeWidth="1.6"><path d="M3 20h18M6 20V8l6-5 6 5v12M10 20v-6h4v6" /></svg>
                                    <strong className="font-display ink text-3xl">{WORLDS[0].title}</strong>
                                    <span className="mt-1 text-sm font-bold text-[#7a6795]">{WORLDS[0].tag}</span>
                                </div>
                            </div>

                            <div
                                className="world-stop rise-on-scroll"
                                style={{ position:'absolute', bottom:'2%', right:'38%', zIndex:3, animationDelay:'.12s' }}
                                onClick={() => (window.location.href = route('explore.index'))}
                            >
                                <div className="stop-plate" style={{ background:WORLDS[1].soft, borderColor:WORLDS[1].color }}>
                                    <img src={A.book} alt="" style={{ width:'56px', height:'auto' }} />
                                    <strong className="font-display ink text-3xl">{WORLDS[1].title}</strong>
                                    <span className="mt-1 text-sm font-bold text-[#7a6795]">{WORLDS[1].tag}</span>
                                </div>
                            </div>

                            <div
                                className="world-stop rise-on-scroll"
                                style={{ position:'absolute', top:'6%', left:'22%', zIndex:3, animationDelay:'.24s' }}
                                onClick={() => (window.location.href = route('explore.index'))}
                            >
                                <div className="stop-plate" style={{ background:WORLDS[2].soft, borderColor:WORLDS[2].color }}>
                                    <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={WORLDS[2].color} strokeWidth="2">
                                        <circle cx="12" cy="12" r="8" /><path d="M9 10h.01M15 10h.01M9 15c1 .8 2 1.2 3 1.2s2-.4 3-1.2" />
                                    </svg>
                                    <strong className="font-display ink text-3xl">{WORLDS[2].title}</strong>
                                    <span className="mt-1 text-sm font-bold text-[#7a6795]">{WORLDS[2].tag}</span>
                                </div>
                            </div>

                            <div
                                className="world-stop rise-on-scroll"
                                style={{ position:'absolute', top:'42%', left:'0%', zIndex:3, animationDelay:'.36s' }}
                                onClick={() => (window.location.href = route('explore.index'))}
                            >
                                <div className="stop-plate" style={{ background:WORLDS[3].soft, borderColor:WORLDS[3].color }}>
                                    <img src={A.game} alt="" style={{ width:'56px', height:'auto' }} />
                                    <strong className="font-display ink text-3xl">{WORLDS[3].title}</strong>
                                    <span className="mt-1 text-sm font-bold text-[#7a6795]">{WORLDS[3].tag}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================================
                    SCENE 3 — CHARACTERS: boy & girl tell the story
                ============================================================ */}
                <section className="scene" data-reveal="characters" style={{ background:'#fff8e7' }}>
                    <div className="hill hill-mid" style={{ bottom:'-34vh', left:'-16vw', width:'90vw', height:'48vh' }} aria-hidden="true" />
                    <div className="scene-inner relative flex flex-col items-center py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
                        <div className="order-2 flex gap-2 lg:order-1 lg:w-[45%]">
                            <img
                                src={A.boySmall}
                                alt=""
                                className="anim-float"
                                style={{ width:'min(40vw,220px)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 18px 12px rgba(61,44,87,.3))' }}
                            />
                            <img
                                src={A.girlSmall}
                                alt=""
                                className="anim-float-soft -mr-6"
                                style={{ width:'min(44vw,240px)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 18px 12px rgba(61,44,87,.3))' }}
                            />
                        </div>

                        <div className="order-1 lg:order-2 lg:w-[48%]">
                            <h2 className="font-display ink text-4xl sm:text-5xl">
                                رامز <span className="text-sky-500">&</span> سيلينا
                            </h2>
                            <p className="mt-4 text-lg font-semibold leading-relaxed text-[#5b4876]">
                                رفيقاك في كل درس — يشيران لك إلى العالم المطلوب، يجلسان على الكتاب الكبير
                                ويشرحانه بأسلوب ممتع، وينتظرانك عند كل محطة جديدة.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {WORLDS.map((w) => (
                                    <span key={w.id} className="rounded-full border-2 px-4 py-1 text-sm font-bold" style={{ background:w.soft, borderColor:w.color, color:'#3d2c57' }}>
                                        {w.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================================
                    SCENE 4 — LEARNING JOURNEY: a visible path
                ============================================================ */}
                <section className="scene" data-reveal="journey" style={{ background:'#fff8e7' }}>
                    <div className="scene-inner py-16 lg:py-24">
                        <h2 className="font-display ink text-center text-4xl sm:text-5xl">
                            طريق المغامرة <span className="text-amber-500">خطوة خطوة</span>
                        </h2>

                        <div className="relative mt-14" style={{ paddingTop:'80px' }}>
                            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full" style={{ height:'200px' }} aria-hidden="true">
                                <path className="trail" d="M60,120 L300,120 L300,40 L700,40 L700,160 L940,160" />
                                <circle className="trail-dot" cx="60" cy="120" r="22" />
                                <circle className="trail-dot" cx="300" cy="120" r="22" />
                                <circle className="trail-dot" cx="300" cy="40" r="22" />
                                <circle className="trail-dot" cx="700" cy="40" r="22" />
                                <circle className="trail-dot" cx="700" cy="160" r="22" />
                                <circle className="trail-dot" cx="940" cy="160" r="22" />
                            </svg>

                            <div className="relative z-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                                {JOURNEY.map((s, i) => (
                                    <div key={s.step} className="rise-on-scroll flex flex-col items-center text-center">
                                        <span
                                            className="anim-float-soft flex h-24 w-24 items-center justify-center rounded-full border-4 border-white font-display text-4xl text-white shadow-xl"
                                            style={{ background:['#fb7185', '#38bdf8', '#fbbf24', '#34d399'][i], boxShadow:'0 14px 24px -10px rgba(61,44,87,.5)', animationDelay:`${i * .25}s` }}
                                        >
                                            {s.step}
                                        </span>
                                        <strong className="font-display ink mt-4 text-2xl">{s.title}</strong>
                                        <span className="mt-1 text-sm font-semibold text-[#7a6795]">{s.desc}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <a href={startRoute} className="btn-world btn-candy">
                                    سر على الطريق الآن
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================================
                    SCENE 5 — ACHIEVEMENTS: treasure / celebration garden
                ============================================================ */}
                <section className="scene" data-reveal="treasure" style={{ background:'#fdf2d8' }}>
                    <div className="hill hill-mid" style={{ bottom:'-36vh', right:'-14vw', width:'80vw', height:'50vh', background:'#cbe5c0' }} aria-hidden="true" />
                    <div className="scene-inner py-16 lg:py-24">
                        <h2 className="font-display ink text-center text-4xl sm:text-5xl">
                            حديقة <span className="text-amber-500">الكنوز</span>
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-center text-base font-semibold text-[#7a6795]">
                            كل نجمة تجمعها من درس تضيفها إلى حديقتك — شاهد كيف تكبر!
                        </p>

                        <div className="relative mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-6 lg:gap-10">
                            {/* big trophy */}
                            <div className="anim-sway flex flex-col items-center">
                                <img src={A.trophy} alt="كأس الإنجاز" className="star-shape" style={{ width:'120px', height:'auto' }} />
                                <span className="font-display ink mt-2">كأس المجتهد</span>
                            </div>

                            {/* stars */}
                            <div className="flex flex-col items-center">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} className="twinkle star-shape" style={{ width:'44px', height:'44px', margin:'0 -4px', animationDelay:`${i * .3}s` }} viewBox="0 0 24 24" fill="#ffb347">
                                            <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="font-display ink mt-2">نجومك الليلة</span>
                            </div>

                            {/* open book */}
                            <div className="anim-float-soft flex flex-col items-center">
                                <img src={A.book} alt="" className="star-shape" style={{ width:'110px', height:'auto' }} />
                                <span className="font-display ink mt-2">شهادة القارئ</span>
                            </div>

                            {/* target */}
                            <div className="anim-float flex flex-col items-center">
                                <img src={A.target} alt="" className="star-shape" style={{ width:'110px', height:'auto' }} />
                                <span className="font-display ink mt-2">هدف الحروف</span>
                            </div>
                        </div>

                        {/* stats live inside the environment */}
                        <div className="scope mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-5 p-6 sm:grid-cols-4 sm:p-8">
                            {(liveStats && liveStats.length
                                ? liveStats
                                : [
                                      { label: 'طالب وطالبة', value: '+10K' },
                                      { label: 'درس تفاعلي', value: '+500' },
                                      { label: 'عالم تعلّم', value: '4' },
                                      { label: 'تقييم الأهل', value: '4.9★' },
                                  ]
                            ).map((stat, i) => (
                                <div key={`${stat.label}-${i}`} className="flex flex-col items-center text-center">
                                    <strong className="font-display text-3xl text-emerald-600 sm:text-4xl">{stat.value ?? stat.label}</strong>
                                    <span className="mt-1 text-sm font-bold text-[#7a6795]">{stat.label ?? stat.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================================
                    SCENE 6 — PARENTS: a calm observatory window
                ============================================================ */}
                <section className="scene" data-reveal="parents" style={{ background:'#eef6ff' }}>
                    <div className="scene-inner py-16 lg:py-24">
                        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
                            <div>
                                <h2 className="font-display ink text-4xl sm:text-5xl">
                                    نافذة <span className="text-indigo-500">الأهل</span>
                                </h2>
                                <p className="mt-4 text-lg font-semibold leading-relaxed text-[#5b4876]">
                                    من هنا ترى كل شيء بنظرة هادئة: تقدّم طفلك، دروسه المنجزة، أهدافه التالية
                                    وإنجازاته — من دون أي تعقيد.
                                </p>
                            </div>

                            <div className="scope p-6 sm:p-8">
                                <div className="flex items-center justify-between">
                                    <span className="font-display ink text-lg">تقدم رامز هذا الأسبوع</span>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">رائع!</span>
                                </div>
                                <div className="grow-track mt-4">
                                    <div className="grow-fill" style={{ width:'78%' }} />
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                                    {[
                                        { label: 'دروس منجزة', value: '14' },
                                        { label: 'أهداف تحققت', value: '9' },
                                        { label: 'نجوم جمعها', value: '38' },
                                    ].map((b) => (
                                        <div key={b.label} className="rounded-2xl bg-[#fdf6e3] p-3">
                                            <strong className="font-display text-xl text-indigo-600">{b.value}</strong>
                                            <span className="mt-1 block text-xs font-bold text-[#8a77a6]">{b.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <a href={route('register')} className="btn-world btn-sky mt-6 w-full justify-center">
                                    أنشئ حساب طفلك
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================================
                    SCENE 7 — FINAL CTA: entrance to the school
                ============================================================ */}
                <section className="scene" data-reveal="cta" style={{ minHeight:'100vh', display:'flex', alignItems:'center' }}>
                    <div className="sun" style={{ right:'auto', left:'6%', top:'12%', width:'80px', height:'80px' }} aria-hidden="true" />
                    <div className="cloud anim-drift" style={{ width:'200px', height:'54px', top:'10%', left:'auto', right:'4%' }} aria-hidden="true" />

                    {/* far + mid hills for depth */}
                    <div className="hill hill-far" style={{ bottom:'-44vh', left:'-14vw', width:'70vw', height:'58vh' }} />
                    <div className="hill hill-mid" style={{ bottom:'-28vh', right:'-10vw', width:'78vw', height:'44vh' }} />
                    <div className="hill hill-near" style={{ bottom:'-16vh', left:'-6vw', width:'112vw', height:'26vh' }} />

                    <div className="scene-inner relative z-10 flex w-full flex-col items-center pb-[34vh] pt-20 text-center">
                        <h2 className="font-display ink text-5xl sm:text-6xl lg:text-7xl">
                            جاهز تبدأ <span className="text-rose-500" style={{ WebkitTextStroke:'2px #fff' }}>المغامرة؟</span>
                        </h2>
                        <p className="mt-4 max-w-md text-lg font-semibold text-[#5b4876]">
                            المدخل أمامك مفتوح — باتجاه الحروف والكلمات وكل الألعاب.
                        </p>

                        <div className="relative mt-8">
                            <a href={startRoute} className="btn-world btn-candy relative z-10 text-xl" style={{ padding:'.95rem 2.5rem' }}>
                                ابدأ الآن
                            </a>
                        </div>

                        {/* the two protagonists waiting by the entrance */}
                        <div className="relative mt-10 flex items-end justify-center">
                            <img src={A.boyHero} alt="" className="anim-float relative z-10" style={{ width:'min(32vw,180px)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 20px 14px rgba(61,44,87,.3))' }} />
                            <img src={A.girlHero} alt="" className="anim-float-soft -mr-6" style={{ width:'min(32vw,184px)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 20px 14px rgba(61,44,87,.3))' }} />
                        </div>
                    </div>
                </section>

            </div>
        </PublicSiteLayout>
    );
}