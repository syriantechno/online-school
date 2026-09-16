import { Head, Link, usePage } from '@inertiajs/react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import ArabetiLogo from '@/Components/ArabetiLogo';

const icons = {
    arrow: 'M5 12h14M13 6l6 6-6 6',
    play: 'M8 5v14l11-7L8 5z',
    spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z',
    book: 'M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 014 16.5v-11zM4 16.5A2.5 2.5 0 016.5 14H20',
    chart: 'M4 19V5M4 19h16M8 15l3-4 3 2 5-7',
    users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    shield: 'M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10zM9 12l2 2 4-5',
    target: 'M12 22a10 10 0 100-20 10 10 0 000 20zm0-5a5 5 0 100-10 5 5 0 000 10zm0-3a2 2 0 100-4 2 2 0 000 4z',
    clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
    check: 'M5 12l4 4L19 6',
    globe: 'M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2c3 3 4 6.3 4 10s-1 7-4 10c-3-3-4-6.3-4-10s1-7 4-10z',
    menu: 'M4 7h16M4 12h16M4 17h16',
    close: 'M6 6l12 12M18 6L6 18',
};

function Icon({ name, size = 20, strokeWidth = 1.8, className = '' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d={icons[name]} />
        </svg>
    );
}

function MiniChart() {
    return (
        <svg viewBox="0 0 340 120" className="mini-chart" preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6d5dfc" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#6d5dfc" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M0 104 C28 97 35 80 60 84 S91 65 112 72 S145 46 166 56 S195 71 218 48 S250 35 270 45 S307 25 340 15 V120 H0Z" fill="url(#areaFill)" />
            <path d="M0 104 C28 97 35 80 60 84 S91 65 112 72 S145 46 166 56 S195 71 218 48 S250 35 270 45 S307 25 340 15" fill="none" stroke="#6d5dfc" strokeWidth="3" strokeLinecap="round" />
            <circle cx="270" cy="45" r="5" fill="#fff" stroke="#6d5dfc" strokeWidth="3" />
        </svg>
    );
}

function LogoMark() {
    return (
        <div className="brand-lockup">
            <div className="brand-orbit"><span>ع</span></div>
            <div>
                <strong>عربيتي</strong>
                <small>تعلم. اكتشف. انطلق.</small>
            </div>
        </div>
    );
}

export default function Welcome({ content = {}, courses = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <PublicSiteLayout fullBleed hideFooter hideHeader>
            <Head title="عربيتي — منصة تعلم عربية حديثة" />
            <div className="academy-page" dir="rtl">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

                    :root {
                        --ink: #101226;
                        --muted: #68708a;
                        --soft: #f6f7fb;
                        --line: rgba(16,18,38,.09);
                        --primary: #5b4df7;
                        --primary-2: #8a72ff;
                        --cyan: #22c7d9;
                        --gold: #ffb84d;
                        --pink: #f36aa8;
                        --deep: #111329;
                        --white: #ffffff;
                    }

                    .academy-page {
                        font-family: 'Cairo', system-ui, sans-serif;
                        color: var(--ink);
                        background: #fff;
                        overflow-x: hidden;
                        line-height: 1.6;
                    }

                    .academy-page * { box-sizing: border-box; }
                    .academy-page a { text-decoration: none; color: inherit; }
                    .academy-page button { font: inherit; }

                    .container {
                        width: min(1180px, calc(100% - 40px));
                        margin: 0 auto;
                    }

                    .topbar {
                        position: absolute;
                        top: 0;
                        right: 0;
                        left: 0;
                        z-index: 30;
                        padding: 22px 0;
                    }

                    .nav {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 28px;
                    }

                    .brand-lockup { display:flex; align-items:center; gap:11px; min-width:max-content; }
                    .brand-lockup strong { display:block; font-size:1.18rem; font-weight:900; letter-spacing:-.04em; }
                    .brand-lockup small { display:block; color:#747b91; font-size:.64rem; font-weight:700; margin-top:-2px; }
                    .brand-orbit {
                        width:42px; height:42px; border-radius:14px;
                        display:grid; place-items:center; color:#fff; font-size:1.35rem; font-weight:900;
                        background: linear-gradient(145deg, #6b5cff, #43c9da);
                        box-shadow: 0 10px 25px rgba(91,77,247,.22);
                        transform: rotate(-5deg);
                    }

                    .nav-links { display:flex; align-items:center; gap:30px; color:#596078; font-size:.86rem; font-weight:700; }
                    .nav-links a { transition: color .2s ease; }
                    .nav-links a:hover { color:var(--primary); }
                    .nav-actions { display:flex; align-items:center; gap:10px; }
                    .nav-login { padding:10px 15px; color:#535a73; font-size:.85rem; font-weight:800; }
                    .nav-cta { padding:11px 18px; border-radius:12px; color:#fff; background:#15172d; font-size:.82rem; font-weight:800; box-shadow:0 8px 20px rgba(16,18,38,.12); transition:transform .2s ease; }
                    .nav-cta:hover { transform:translateY(-2px); }
                    .mobile-nav { display:none; border:0; background:transparent; color:var(--ink); padding:7px; cursor:pointer; }

                    .hero {
                        position:relative;
                        min-height: 760px;
                        padding: 145px 0 85px;
                        overflow:hidden;
                        background:
                            radial-gradient(circle at 13% 18%, rgba(91,77,247,.12), transparent 28%),
                            radial-gradient(circle at 84% 25%, rgba(34,199,217,.12), transparent 25%),
                            linear-gradient(180deg, #fbfbfe 0%, #f4f5fb 100%);
                    }

                    .hero-grid { display:grid; grid-template-columns: 1.02fr .98fr; align-items:center; gap:50px; direction:ltr; }
                    .hero-copy { direction:rtl; position:relative; z-index:4; }
                    .eyebrow {
                        display:inline-flex; align-items:center; gap:8px; padding:7px 11px 7px 13px;
                        border:1px solid rgba(91,77,247,.14); background:rgba(255,255,255,.72);
                        border-radius:999px; color:var(--primary); font-size:.72rem; font-weight:800;
                        box-shadow:0 8px 30px rgba(35,39,75,.04); backdrop-filter:blur(12px);
                    }
                    .eyebrow-dot { width:7px; height:7px; border-radius:50%; background:var(--cyan); box-shadow:0 0 0 5px rgba(34,199,217,.12); }
                    .hero h1 {
                        font-size:clamp(3.2rem, 6.5vw, 6.2rem);
                        line-height:1.02; letter-spacing:-.065em; font-weight:900; margin:24px 0 22px; max-width:760px;
                    }
                    .hero h1 .gradient { background:linear-gradient(110deg,#4f43ed 0%,#8b69ff 45%,#23bacb 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
                    .hero-lead { max-width:570px; color:#646b83; font-size:1.05rem; line-height:1.9; margin:0 0 31px; font-weight:600; }
                    .hero-actions { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
                    .btn-primary, .btn-secondary { display:inline-flex; align-items:center; justify-content:center; gap:10px; min-height:52px; padding:0 22px; border-radius:14px; font-size:.86rem; font-weight:800; cursor:pointer; transition:transform .2s ease, box-shadow .2s ease, background .2s ease; }
                    .btn-primary { color:#fff; background:linear-gradient(135deg,#5a4cf5,#7869ff); box-shadow:0 14px 28px rgba(91,77,247,.22); }
                    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 18px 34px rgba(91,77,247,.28); }
                    .btn-secondary { color:#24273c; background:#fff; border:1px solid var(--line); box-shadow:0 8px 20px rgba(16,18,38,.05); }
                    .btn-secondary:hover { transform:translateY(-2px); background:#fafaff; }
                    .hero-proof { display:flex; align-items:center; gap:18px; margin-top:32px; color:#70778c; font-size:.72rem; font-weight:700; }
                    .proof-avatars { display:flex; direction:ltr; }
                    .proof-avatar { width:30px; height:30px; border-radius:50%; border:2px solid #fff; margin-left:-7px; display:grid; place-items:center; color:#fff; font-size:.65rem; font-weight:900; }
                    .proof-avatar:nth-child(1){background:#5b4df7}.proof-avatar:nth-child(2){background:#22b9c9}.proof-avatar:nth-child(3){background:#f36aa8}.proof-avatar:nth-child(4){background:#ffad4c}
                    .stars { color:#ffb84d; letter-spacing:2px; font-size:.72rem; }

                    .hero-stage { position:relative; min-height:510px; direction:rtl; }
                    .hero-glow { position:absolute; width:420px; height:420px; border-radius:50%; right:8%; top:7%; background:radial-gradient(circle,rgba(91,77,247,.2),rgba(34,199,217,.05) 55%,transparent 70%); filter:blur(4px); }
                    .hero-orbit { position:absolute; inset:35px 5px auto auto; width:460px; height:460px; border:1px solid rgba(91,77,247,.12); border-radius:50%; transform:rotate(-15deg); }
                    .hero-orbit:before { content:''; position:absolute; inset:45px; border:1px dashed rgba(91,77,247,.13); border-radius:50%; }
                    .hero-card-main {
                        position:absolute; right:3%; top:80px; width:min(455px,82vw); border:1px solid rgba(255,255,255,.8); border-radius:26px;
                        background:rgba(255,255,255,.78); backdrop-filter:blur(20px); box-shadow:0 35px 80px rgba(27,29,66,.13); padding:17px; z-index:4;
                        transform:rotate(-2deg);
                    }
                    .dash-top { display:flex; align-items:center; justify-content:space-between; padding:6px 5px 16px; }
                    .dash-title { font-size:.72rem; font-weight:900; }
                    .dash-dots { display:flex; gap:5px; }
                    .dash-dots i { width:7px; height:7px; border-radius:50%; background:#d9dbe4; }
                    .dash-dots i:first-child{background:#5b4df7}.dash-dots i:nth-child(2){background:#22c7d9}.dash-dots i:nth-child(3){background:#ffb84d}
                    .dash-body { display:grid; grid-template-columns:1.25fr .75fr; gap:12px; }
                    .dash-panel { background:#f8f8fc; border:1px solid #eeeef5; border-radius:18px; padding:14px; }
                    .dash-label { color:#858b9e; font-size:.56rem; font-weight:800; margin-bottom:7px; }
                    .dash-big { font-size:1.45rem; font-weight:900; letter-spacing:-.04em; }
                    .dash-delta { display:inline-flex; align-items:center; gap:4px; color:#18a985; font-size:.54rem; font-weight:900; margin-top:5px; }
                    .dash-chart { margin-top:10px; }
                    .mini-chart { width:100%; height:115px; display:block; }
                    .progress-ring { width:94px; height:94px; margin:8px auto 11px; border-radius:50%; display:grid; place-items:center; background:conic-gradient(#6b5cff 0 78%,#e8e8f2 78% 100%); position:relative; }
                    .progress-ring:after { content:''; position:absolute; inset:8px; background:#f8f8fc; border-radius:50%; }
                    .progress-ring span { position:relative; z-index:2; font-size:.9rem; font-weight:900; }
                    .dash-list { display:grid; gap:7px; margin-top:11px; }
                    .dash-row { display:flex; align-items:center; justify-content:space-between; padding:8px 9px; background:#fff; border:1px solid #eeeeF5; border-radius:11px; font-size:.58rem; font-weight:800; }
                    .dash-row span:first-child { color:#686f84; }
                    .dash-pill { color:#5b4df7; background:#f0efff; padding:4px 7px; border-radius:999px; }
                    .float-card { position:absolute; z-index:8; background:#fff; border:1px solid rgba(16,18,38,.07); box-shadow:0 18px 40px rgba(24,26,58,.12); border-radius:16px; padding:12px 14px; }
                    .float-card.score { left:0; top:95px; width:150px; transform:rotate(4deg); }
                    .float-card.next { right:0; bottom:52px; width:165px; transform:rotate(2deg); }
                    .float-kicker { color:#8a90a3; font-size:.52rem; font-weight:800; }
                    .float-value { margin-top:3px; font-size:.82rem; font-weight:900; }
                    .float-line { height:5px; border-radius:99px; background:#ececf3; overflow:hidden; margin-top:8px; }
                    .float-line span { display:block; height:100%; width:76%; border-radius:inherit; background:linear-gradient(90deg,#5b4df7,#22c7d9); }
                    .float-icon { width:29px; height:29px; border-radius:10px; display:grid; place-items:center; background:#f0efff; color:#5b4df7; margin-bottom:8px; }
                    .hero-chip { position:absolute; left:78px; bottom:5px; z-index:9; padding:10px 13px; border-radius:13px; color:#fff; background:#15172d; box-shadow:0 16px 32px rgba(16,18,38,.18); font-size:.62rem; font-weight:800; }
                    .hero-chip span { color:#8fdded; }

                    .marquee { border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:#fff; }
                    .marquee-inner { display:grid; grid-template-columns:1fr 2fr; align-items:center; min-height:90px; gap:30px; }
                    .marquee-label { color:#8a90a2; font-size:.68rem; font-weight:800; }
                    .marquee-items { display:flex; align-items:center; justify-content:space-between; gap:25px; color:#a1a5b3; font-size:.78rem; font-weight:900; letter-spacing:.04em; }
                    .marquee-items span { display:flex; align-items:center; gap:8px; }
                    .marquee-items b { color:#5c6176; }

                    .section { padding:112px 0; }
                    .section.soft { background:#f7f8fb; }
                    .section.dark { background:#111329; color:#fff; }
                    .section-head { max-width:690px; margin-bottom:48px; }
                    .section-head.center { margin-left:auto; margin-right:auto; text-align:center; }
                    .kicker { color:var(--primary); font-size:.68rem; font-weight:900; letter-spacing:.08em; text-transform:uppercase; margin-bottom:10px; }
                    .section h2 { font-size:clamp(2rem,4.2vw,3.55rem); line-height:1.12; letter-spacing:-.055em; margin:0 0 15px; font-weight:900; }
                    .section-head p { margin:0; color:var(--muted); font-size:.96rem; font-weight:600; line-height:1.9; }

                    .feature-layout { display:grid; grid-template-columns:.85fr 1.15fr; gap:55px; align-items:center; }
                    .feature-visual { position:relative; min-height:420px; }
                    .feature-big-card { position:absolute; inset:25px 0 auto auto; width:92%; padding:28px; border-radius:26px; background:linear-gradient(145deg,#161832,#22254a); color:#fff; box-shadow:0 30px 70px rgba(16,18,38,.18); overflow:hidden; }
                    .feature-big-card:before { content:''; position:absolute; width:230px; height:230px; left:-80px; bottom:-110px; background:rgba(91,77,247,.34); border-radius:50%; filter:blur(2px); }
                    .feature-big-top { display:flex; align-items:center; justify-content:space-between; position:relative; z-index:2; }
                    .feature-big-title { font-size:.85rem; font-weight:900; }
                    .live-dot { display:flex; align-items:center; gap:6px; color:#9fe7dc; font-size:.58rem; font-weight:800; }
                    .live-dot i { width:6px; height:6px; border-radius:50%; background:#4bd5b8; box-shadow:0 0 0 5px rgba(75,213,184,.1); }
                    .feature-metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:30px; position:relative; z-index:2; }
                    .metric { padding:14px; border-radius:15px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.07); }
                    .metric small { color:#979bb4; font-size:.52rem; font-weight:700; display:block; }
                    .metric strong { display:block; font-size:1.25rem; margin-top:3px; }
                    .feature-big-chart { margin-top:20px; position:relative; z-index:2; }
                    .feature-big-chart .mini-chart { height:130px; }
                    .feature-float { position:absolute; left:0; bottom:0; width:210px; padding:17px; background:#fff; border:1px solid var(--line); border-radius:19px; box-shadow:0 20px 45px rgba(16,18,38,.12); z-index:5; }
                    .feature-float-row { display:flex; align-items:center; gap:10px; }
                    .feature-float-icon { width:35px; height:35px; display:grid; place-items:center; border-radius:11px; background:#eef0ff; color:#5b4df7; }
                    .feature-float strong { display:block; font-size:.7rem; }
                    .feature-float small { color:#8b91a4; font-size:.55rem; }
                    .feature-list { display:grid; gap:16px; }
                    .feature-item { display:grid; grid-template-columns:52px 1fr; gap:16px; align-items:start; padding:17px 0; border-bottom:1px solid var(--line); }
                    .feature-item:last-child { border-bottom:0; }
                    .feature-item-icon { width:52px; height:52px; display:grid; place-items:center; border-radius:16px; color:#5b4df7; background:#f0efff; }
                    .feature-item:nth-child(2) .feature-item-icon{color:#0fa6b8;background:#eafafd}.feature-item:nth-child(3) .feature-item-icon{color:#d78921;background:#fff6e7}.feature-item:nth-child(4) .feature-item-icon{color:#d6538f;background:#fff0f6}
                    .feature-item h3 { margin:1px 0 4px; font-size:.9rem; font-weight:900; }
                    .feature-item p { margin:0; color:#72798f; font-size:.76rem; line-height:1.75; font-weight:600; }

                    .journey { display:grid; grid-template-columns:repeat(5,1fr); gap:0; position:relative; }
                    .journey:before { content:''; position:absolute; top:35px; right:10%; left:10%; height:1px; background:linear-gradient(90deg,transparent,#d8d9e4,transparent); }
                    .journey-step { position:relative; text-align:center; padding:0 15px; z-index:2; }
                    .journey-number { width:70px; height:70px; margin:0 auto 18px; display:grid; place-items:center; border-radius:22px; background:#fff; border:1px solid var(--line); box-shadow:0 12px 30px rgba(16,18,38,.06); font-size:1rem; font-weight:900; color:#5b4df7; }
                    .journey-step:nth-child(2) .journey-number{color:#19aebf}.journey-step:nth-child(3) .journey-number{color:#db9029}.journey-step:nth-child(4) .journey-number{color:#dc5d98}.journey-step:nth-child(5) .journey-number{color:#5163dc}
                    .journey-step h3 { margin:0 0 5px; font-size:.82rem; font-weight:900; }
                    .journey-step p { margin:0; color:#7c8295; font-size:.68rem; line-height:1.7; font-weight:600; }

                    .audience { display:grid; grid-template-columns:1.1fr .9fr; gap:60px; align-items:center; }
                    .audience-visual { min-height:440px; position:relative; }
                    .audience-window { position:absolute; right:0; top:10px; width:90%; height:390px; border-radius:30px; background:linear-gradient(150deg,#f0efff,#edfafd); overflow:hidden; border:1px solid rgba(91,77,247,.09); }
                    .audience-window:before { content:''; position:absolute; width:280px; height:280px; background:rgba(91,77,247,.14); border-radius:50%; top:-110px; left:-70px; filter:blur(1px); }
                    .audience-grid { position:absolute; inset:35px; display:grid; grid-template-columns:1fr 1fr; gap:13px; }
                    .aud-card { background:rgba(255,255,255,.8); border:1px solid rgba(255,255,255,.8); border-radius:20px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 14px 30px rgba(46,49,88,.06); }
                    .aud-card.big { grid-row:span 2; background:#17192f; color:#fff; }
                    .aud-top { display:flex; align-items:center; justify-content:space-between; }
                    .aud-icon { width:36px; height:36px; border-radius:12px; display:grid; place-items:center; background:#efefff; color:#5b4df7; }
                    .aud-card.big .aud-icon { background:rgba(255,255,255,.1); color:#a8a0ff; }
                    .aud-card small { color:#83899d; font-size:.55rem; font-weight:800; }
                    .aud-card.big small { color:#8e93ad; }
                    .aud-card h3 { margin:20px 0 0; font-size:.88rem; font-weight:900; }
                    .aud-card p { margin:5px 0 0; color:#747b91; font-size:.62rem; line-height:1.7; font-weight:600; }
                    .aud-card.big p { color:#a4a8bb; }
                    .aud-bar { margin-top:18px; height:7px; background:rgba(255,255,255,.1); border-radius:99px; overflow:hidden; }
                    .aud-bar span { display:block; height:100%; width:84%; background:linear-gradient(90deg,#6d5dfc,#22c7d9); border-radius:inherit; }
                    .audience-copy .mini-stats { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:30px; }
                    .mini-stat { padding:16px; border-radius:17px; border:1px solid var(--line); background:#fff; }
                    .mini-stat strong { display:block; font-size:1.35rem; font-weight:900; letter-spacing:-.04em; }
                    .mini-stat span { color:#83899c; font-size:.61rem; font-weight:700; }

                    .courses-head { display:flex; align-items:end; justify-content:space-between; gap:30px; margin-bottom:35px; }
                    .courses-head .section-head { margin-bottom:0; }
                    .text-link { display:inline-flex; align-items:center; gap:8px; color:var(--primary); font-size:.76rem; font-weight:900; white-space:nowrap; }
                    .course-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
                    .course-card { border:1px solid var(--line); border-radius:23px; overflow:hidden; background:#fff; box-shadow:0 12px 32px rgba(16,18,38,.045); transition:transform .25s ease, box-shadow .25s ease; }
                    .course-card:hover { transform:translateY(-5px); box-shadow:0 20px 45px rgba(16,18,38,.09); }
                    .course-art { height:185px; position:relative; overflow:hidden; background:linear-gradient(135deg,#ecebff,#e7fbfd); }
                    .course-art:before { content:''; position:absolute; width:180px; height:180px; border-radius:50%; background:rgba(91,77,247,.14); top:-65px; right:-20px; }
                    .course-art:after { content:''; position:absolute; width:110px; height:110px; border-radius:30px; background:rgba(255,255,255,.55); bottom:-40px; left:30px; transform:rotate(25deg); }
                    .course-art .art-label { position:absolute; right:18px; top:18px; padding:6px 9px; border-radius:999px; background:rgba(255,255,255,.72); color:#5b4df7; font-size:.55rem; font-weight:900; z-index:2; }
                    .course-art .art-number { position:absolute; left:18px; bottom:11px; font-size:5rem; line-height:1; font-weight:900; color:rgba(91,77,247,.12); z-index:1; }
                    .course-art .art-shape { position:absolute; width:86px; height:86px; border-radius:26px; background:linear-gradient(145deg,#5b4df7,#8c76ff); right:50%; top:50%; transform:translate(50%,-35%) rotate(-8deg); box-shadow:0 18px 35px rgba(91,77,247,.25); z-index:2; }
                    .course-art .art-shape:before { content:''; position:absolute; inset:17px; border:2px solid rgba(255,255,255,.5); border-radius:18px; }
                    .course-body { padding:19px; }
                    .course-meta { display:flex; align-items:center; justify-content:space-between; color:#8b91a4; font-size:.58rem; font-weight:800; }
                    .course-body h3 { margin:9px 0 5px; font-size:.9rem; font-weight:900; }
                    .course-body p { margin:0; color:#7a8195; font-size:.67rem; line-height:1.7; font-weight:600; }
                    .course-footer { display:flex; align-items:center; justify-content:space-between; margin-top:17px; padding-top:14px; border-top:1px solid #f0f0f4; }
                    .course-price { font-size:.7rem; font-weight:900; color:#202238; }
                    .course-btn { padding:8px 12px; border-radius:10px; background:#f0efff; color:#5b4df7; font-size:.62rem; font-weight:900; }

                    .stats-band { background:#111329; padding:70px 0; color:#fff; position:relative; overflow:hidden; }
                    .stats-band:before { content:''; position:absolute; width:480px; height:480px; border-radius:50%; background:rgba(91,77,247,.16); top:-310px; right:-120px; filter:blur(10px); }
                    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; position:relative; z-index:2; }
                    .stat-block { padding:12px 24px; border-left:1px solid rgba(255,255,255,.1); }
                    .stat-block:last-child { border-left:0; }
                    .stat-block strong { display:block; font-size:2.5rem; letter-spacing:-.055em; font-weight:900; }
                    .stat-block span { display:block; color:#9da2b9; font-size:.68rem; font-weight:700; margin-top:4px; }

                    .testimonials { display:grid; grid-template-columns:1.2fr .8fr; gap:20px; }
                    .quote-main { padding:42px; border-radius:28px; background:#f4f2ff; position:relative; overflow:hidden; }
                    .quote-main:after { content:'“'; position:absolute; left:25px; bottom:-55px; font-family:Georgia,serif; font-size:240px; line-height:1; color:rgba(91,77,247,.09); }
                    .quote-mark { color:#5b4df7; font-size:2.2rem; font-weight:900; line-height:1; }
                    .quote-main blockquote { margin:20px 0 30px; max-width:700px; font-size:1.35rem; line-height:1.75; font-weight:800; letter-spacing:-.025em; position:relative; z-index:2; }
                    .person { display:flex; align-items:center; gap:12px; position:relative; z-index:2; }
                    .person-avatar { width:42px; height:42px; border-radius:14px; display:grid; place-items:center; color:#fff; background:linear-gradient(145deg,#5b4df7,#23b9ca); font-weight:900; }
                    .person strong { display:block; font-size:.72rem; }
                    .person small { color:#7e8498; font-size:.58rem; font-weight:700; }
                    .quote-side { display:grid; gap:20px; }
                    .small-quote { padding:25px; border:1px solid var(--line); border-radius:24px; background:#fff; }
                    .small-quote p { margin:0 0 18px; color:#646b82; font-size:.72rem; line-height:1.8; font-weight:700; }

                    .final-cta { padding:115px 0; background:linear-gradient(135deg,#14162e 0%,#191a3c 50%,#111329 100%); color:#fff; position:relative; overflow:hidden; }
                    .final-cta:before,.final-cta:after { content:''; position:absolute; border-radius:50%; pointer-events:none; }
                    .final-cta:before { width:500px; height:500px; background:rgba(91,77,247,.18); right:-160px; top:-300px; filter:blur(20px); }
                    .final-cta:after { width:380px; height:380px; background:rgba(34,199,217,.12); left:-140px; bottom:-260px; filter:blur(20px); }
                    .cta-inner { max-width:800px; margin:auto; text-align:center; position:relative; z-index:2; }
                    .cta-inner .kicker { color:#9f96ff; }
                    .cta-inner h2 { font-size:clamp(2.3rem,5vw,4.4rem); margin-bottom:17px; }
                    .cta-inner p { max-width:590px; margin:0 auto 30px; color:#a8acc0; font-size:.92rem; line-height:1.9; font-weight:600; }
                    .cta-inner .btn-primary { background:#fff; color:#191a33; box-shadow:0 16px 35px rgba(0,0,0,.2); }
                    .cta-note { margin-top:18px; color:#7f849a; font-size:.61rem; font-weight:700; }

                    .footer { background:#0b0d1d; color:#fff; padding:62px 0 28px; }
                    .footer-grid { display:grid; grid-template-columns:1.5fr repeat(3,1fr); gap:45px; padding-bottom:48px; border-bottom:1px solid rgba(255,255,255,.08); }
                    .footer-brand p { max-width:320px; margin:15px 0 0; color:#8d92a9; font-size:.68rem; line-height:1.9; font-weight:600; }
                    .footer .brand-lockup small { color:#777d96; }
                    .footer h4 { margin:0 0 14px; font-size:.68rem; font-weight:900; }
                    .footer-links { display:grid; gap:9px; color:#858ba2; font-size:.63rem; font-weight:700; }
                    .footer-links a:hover { color:#fff; }
                    .footer-bottom { display:flex; align-items:center; justify-content:space-between; gap:20px; padding-top:24px; color:#696f86; font-size:.58rem; font-weight:700; }
                    .footer-social { display:flex; gap:8px; }
                    .social { width:31px; height:31px; display:grid; place-items:center; border:1px solid rgba(255,255,255,.09); border-radius:10px; color:#9ba0b4; }
                    .social:hover { color:#fff; border-color:rgba(255,255,255,.2); }

                    .reveal { animation: rise .75s cubic-bezier(.2,.8,.2,1) both; }
                    .delay-1 { animation-delay:.08s; }.delay-2{animation-delay:.16s}.delay-3{animation-delay:.24s}
                    @keyframes rise { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
                    @keyframes floaty { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-9px) rotate(2deg)} }
                    .float-card.next { animation:floaty 4s ease-in-out infinite; }

                    @media (max-width: 980px) {
                        .nav-links { display:none; }
                        .mobile-nav { display:block; }
                        .hero { min-height:auto; padding-top:125px; }
                        .hero-grid { grid-template-columns:1fr; }
                        .hero-copy { text-align:center; }
                        .hero-lead { margin-left:auto; margin-right:auto; }
                        .hero-actions,.hero-proof { justify-content:center; }
                        .hero-stage { min-height:520px; margin-top:15px; }
                        .feature-layout,.audience,.testimonials { grid-template-columns:1fr; }
                        .feature-visual { min-height:430px; order:2; }
                        .feature-list { order:1; }
                        .audience-visual { order:2; }
                        .audience-copy { order:1; }
                        .journey { grid-template-columns:1fr; gap:28px; }
                        .journey:before { top:30px; bottom:30px; right:50%; left:auto; width:1px; height:auto; }
                        .journey-step { display:grid; grid-template-columns:70px 1fr; text-align:right; align-items:center; gap:18px; }
                        .journey-number { margin:0; }
                        .journey-step p { grid-column:2; margin-top:-18px; }
                        .course-grid { grid-template-columns:1fr 1fr; }
                        .stats-grid { grid-template-columns:1fr 1fr; }
                        .stat-block:nth-child(2){border-left:0}
                        .footer-grid { grid-template-columns:1.5fr 1fr 1fr; }
                        .footer-grid > :last-child { display:none; }
                    }

                    @media (max-width: 640px) {
                        .container { width:min(100% - 28px, 1180px); }
                        .topbar { padding:14px 0; }
                        .nav-actions .nav-login { display:none; }
                        .brand-lockup strong { font-size:1.02rem; }
                        .hero { padding:105px 0 55px; }
                        .hero h1 { font-size:clamp(2.65rem, 13vw, 4rem); }
                        .hero-lead { font-size:.88rem; }
                        .hero-stage { min-height:390px; transform:scale(.88); transform-origin:top center; margin-bottom:-45px; }
                        .hero-card-main { right:2%; top:60px; }
                        .float-card.score { left:-6px; top:72px; }
                        .float-card.next { right:-4px; bottom:38px; }
                        .hero-chip { left:25px; bottom:0; }
                        .marquee-inner { grid-template-columns:1fr; padding:25px 0; text-align:center; }
                        .marquee-items { justify-content:center; flex-wrap:wrap; }
                        .section { padding:75px 0; }
                        .feature-big-card { width:100%; }
                        .feature-float { left:0; }
                        .audience-window { width:100%; height:370px; }
                        .audience-grid { inset:20px; }
                        .course-grid { grid-template-columns:1fr; }
                        .courses-head { align-items:flex-start; flex-direction:column; }
                        .stats-grid { grid-template-columns:1fr 1fr; }
                        .stat-block { padding:10px 8px; text-align:center; border-left:0; }
                        .stat-block strong { font-size:1.85rem; }
                        .quote-main { padding:27px; }
                        .quote-main blockquote { font-size:1.03rem; }
                        .footer-grid { grid-template-columns:1fr 1fr; gap:30px; }
                        .footer-brand { grid-column:1 / -1; }
                        .footer-bottom { flex-direction:column; text-align:center; }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        *,*::before,*::after { scroll-behavior:auto !important; animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
                    }
                `}</style>

                <header className="topbar">
                    <div className="container nav">
                        <Link href="/" aria-label="عربيتي - الصفحة الرئيسية"><LogoMark /></Link>
                        <nav className="nav-links" aria-label="التنقل الرئيسي">
                            <a href="#platform">المنصة</a>
                            <a href="#journey">كيف تتعلم</a>
                            <a href="#audience">لمن؟</a>
                            <Link href="/explore">الدورات</Link>
                            <a href="#stories">قصص النجاح</a>
                        </nav>
                        <div className="nav-actions">
                            {user ? (
                                <Link href="/dashboard" className="nav-cta">مساحتي التعليمية</Link>
                            ) : (
                                <>
                                    <Link href="/login" className="nav-login">تسجيل الدخول</Link>
                                    <Link href="/register" className="nav-cta">ابدأ الآن</Link>
                                </>
                            )}
                            <button className="mobile-nav" aria-label="فتح القائمة"><Icon name="menu" /></button>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="hero">
                        <div className="container hero-grid">
                            <div className="hero-copy">
                                <div className="eyebrow reveal"><span className="eyebrow-dot" /> منصة عربية للتعلم الذي يصنع فرقاً</div>
                                <h1 className="reveal delay-1">تعلّم بطريقة<br /><span className="gradient">تليق بالمستقبل.</span></h1>
                                <p className="hero-lead reveal delay-2">عربيتي تجمع المحتوى العربي، المسارات الذكية، الممارسة التفاعلية، والتقدم الواضح في تجربة واحدة مصممة لتجعل التعلم عادة يومية، لا مهمة مؤجلة.</p>
                                <div className="hero-actions reveal delay-3">
                                    <Link href="/explore" className="btn-primary">اكتشف المسارات <Icon name="arrow" size={18} /></Link>
                                    <a href="#platform" className="btn-secondary"><Icon name="play" size={17} /> شاهد كيف تعمل المنصة</a>
                                </div>
                                <div className="hero-proof reveal delay-3">
                                    <div className="proof-avatars"><span className="proof-avatar">س</span><span className="proof-avatar">ل</span><span className="proof-avatar">م</span><span className="proof-avatar">ن</span></div>
                                    <div><div className="stars">★★★★★</div><span>آلاف المتعلمين يتقدمون معنا كل يوم</span></div>
                                </div>
                            </div>

                            <div className="hero-stage reveal delay-2" aria-hidden="true">
                                <div className="hero-glow" />
                                <div className="hero-orbit" />
                                <div className="hero-card-main">
                                    <div className="dash-top"><div className="dash-title">لوحة التعلّم</div><div className="dash-dots"><i /><i /><i /></div></div>
                                    <div className="dash-body">
                                        <div className="dash-panel">
                                            <div className="dash-label">نشاطك هذا الأسبوع</div>
                                            <div className="dash-big">+32% <span className="dash-delta">↗ نمو ممتاز</span></div>
                                            <div className="dash-chart"><MiniChart /></div>
                                        </div>
                                        <div className="dash-panel">
                                            <div className="dash-label">التقدم الكلي</div>
                                            <div className="progress-ring"><span>78%</span></div>
                                            <div className="dash-label" style={{ textAlign:'center', marginBottom:0 }}>في المسار الحالي</div>
                                        </div>
                                    </div>
                                    <div className="dash-list">
                                        <div className="dash-row"><span>الدرس التالي</span><span className="dash-pill">اللغة العربية</span></div>
                                        <div className="dash-row"><span>اختبار قصير</span><span className="dash-pill">غداً</span></div>
                                        <div className="dash-row"><span>إنجاز جديد</span><span className="dash-pill">+40 نقطة</span></div>
                                    </div>
                                </div>
                                <div className="float-card score"><div className="float-icon"><Icon name="target" size={16} /></div><div className="float-kicker">هدف هذا الشهر</div><div className="float-value">أكمل 12 درساً</div><div className="float-line"><span /></div></div>
                                <div className="float-card next"><div className="float-kicker">الموصى به لك</div><div className="float-value">رحلة في النحو</div><div style={{ color:'#7e8498', fontSize:'.54rem', marginTop:3 }}>8 دروس · 2 ساعة</div></div>
                                <div className="hero-chip"><span>●</span> تجربة تعلم شخصية، في كل خطوة</div>
                            </div>
                        </div>
                    </section>

                    <section className="marquee" aria-label="أرقام المنصة">
                        <div className="container marquee-inner">
                            <div className="marquee-label">كل ما تحتاجه لبناء رحلة تعلم مستمرة</div>
                            <div className="marquee-items"><span><b>120+</b> مساراً تعليمياً</span><span><b>18K+</b> درساً وتطبيقاً</span><span><b>94%</b> معدل إكمال</span><span><b>4.9/5</b> رضا المتعلمين</span></div>
                        </div>
                    </section>

                    <section className="section" id="platform">
                        <div className="container feature-layout">
                            <div className="feature-visual">
                                <div className="feature-big-card">
                                    <div className="feature-big-top"><div className="feature-big-title">نظرة ذكية على رحلة التعلم</div><div className="live-dot"><i /> مباشر</div></div>
                                    <div className="feature-metrics"><div className="metric"><small>جلسات مكتملة</small><strong>28</strong></div><div className="metric"><small>وقت التعلم</small><strong>14h</strong></div><div className="metric"><small>المهارات</small><strong>86%</strong></div></div>
                                    <div className="feature-big-chart"><MiniChart /></div>
                                </div>
                                <div className="feature-float"><div className="feature-float-row"><div className="feature-float-icon"><Icon name="spark" size={17} /></div><div><strong>اقتراح ذكي</strong><small>راجع هذا المفهوم قبل الدرس القادم</small></div></div></div>
                            </div>
                            <div>
                                <div className="section-head">
                                    <div className="kicker">منصة واحدة. رحلة كاملة.</div>
                                    <h2>التعلّم ليس فيديوهات. إنه نظام يتطور معك.</h2>
                                    <p>صممنا عربيتي حول رحلة المتعلم الحقيقية: ماذا يعرف الآن، ماذا يحتاج بعد ذلك، وكيف يرى تقدمه بوضوح من أول درس حتى آخر إنجاز.</p>
                                </div>
                                <div className="feature-list">
                                    <div className="feature-item"><div className="feature-item-icon"><Icon name="target" /></div><div><h3>مسارات واضحة</h3><p>بدلاً من التشتت بين المحتوى، تحصل على طريق مقترح وخطوات منطقية تقودك للأمام.</p></div></div>
                                    <div className="feature-item"><div className="feature-item-icon"><Icon name="spark" /></div><div><h3>تعلم يتكيف معك</h3><p>مستواك ووتيرتك ونتائجك تصنع تجربة مختلفة عن أي متعلم آخر.</p></div></div>
                                    <div className="feature-item"><div className="feature-item-icon"><Icon name="chart" /></div><div><h3>تقدم يمكن رؤيته</h3><p>إحصائيات بسيطة وواضحة تساعدك على معرفة ما أنجزته وما يستحق تركيزك الآن.</p></div></div>
                                    <div className="feature-item"><div className="feature-item-icon"><Icon name="shield" /></div><div><h3>بيئة عربية موثوقة</h3><p>تجربة مصممة بعناية للطلاب والأهل والمعلمين، مع خصوصية وأمان في الأساس.</p></div></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section soft" id="journey">
                        <div className="container">
                            <div className="section-head center"><div className="kicker">الرحلة ببساطة</div><h2>من الفضول إلى الإتقان</h2><p>خمس مراحل صغيرة تجعل التقدم واضحاً، قابلاً للقياس، وممتعاً للاستمرار.</p></div>
                            <div className="journey">
                                <div className="journey-step"><div className="journey-number">01</div><div><h3>اكتشف</h3><p>اختر ما يهمك وما يناسب مستواك.</p></div></div>
                                <div className="journey-step"><div className="journey-number">02</div><div><h3>تعلّم</h3><p>محتوى قصير وواضح يبني الفكرة.</p></div></div>
                                <div className="journey-step"><div className="journey-number">03</div><div><h3>طبّق</h3><p>حوّل المعرفة إلى مهارة بالممارسة.</p></div></div>
                                <div className="journey-step"><div className="journey-number">04</div><div><h3>أنجز</h3><p>شاهد تقدمك واحصل على إنجازاتك.</p></div></div>
                                <div className="journey-step"><div className="journey-number">05</div><div><h3>انطلق</h3><p>انتقل إلى تحدٍ جديد بثقة أكبر.</p></div></div>
                            </div>
                        </div>
                    </section>

                    <section className="section" id="audience">
                        <div className="container audience">
                            <div className="audience-copy">
                                <div className="section-head"><div className="kicker">مصممة للجميع</div><h2>نفس المنصة. تجربة مختلفة لكل متعلم.</h2><p>سواء كنت طالباً تبدأ طريقك، أو ولي أمر يريد صورة أوضح، أو معلماً يريد أدوات أفضل — عربيتي تتكيف مع الدور الذي تلعبه في رحلة التعلم.</p></div>
                                <div className="mini-stats"><div className="mini-stat"><strong>01</strong><span>تجربة الطالب</span></div><div className="mini-stat"><strong>02</strong><span>رؤية الأهل</span></div><div className="mini-stat"><strong>03</strong><span>أدوات المعلم</span></div><div className="mini-stat"><strong>04</strong><span>مسارات متقدمة</span></div></div>
                            </div>
                            <div className="audience-visual" aria-hidden="true">
                                <div className="audience-window">
                                    <div className="audience-grid">
                                        <div className="aud-card big"><div><div className="aud-top"><small>تجربة الطالب</small><div className="aud-icon"><Icon name="book" size={17} /></div></div><h3>كل درس يقود إلى التالي.</h3><p>خريطة تعلم مرئية، جلسات مركزة، ومؤشرات تقدم تساعد الطالب على الاستمرار.</p></div><div><small>التقدم هذا الشهر</small><div className="aud-bar"><span /></div></div></div>
                                        <div className="aud-card"><div className="aud-top"><small>الأهل</small><div className="aud-icon"><Icon name="users" size={16} /></div></div><div><h3>صورة أوضح</h3><p>تابع الإنجاز والوقت والمهارات بدون تعقيد.</p></div></div>
                                        <div className="aud-card"><div className="aud-top"><small>المعلم</small><div className="aud-icon"><Icon name="chart" size={16} /></div></div><div><h3>قرار أسرع</h3><p>بيانات مختصرة تساعد على معرفة أين يحتاج الطالب دعماً.</p></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section soft" id="courses">
                        <div className="container">
                            <div className="courses-head"><div className="section-head"><div className="kicker">محتوى يستحق وقتك</div><h2>مسارات تبدأ من مستواك</h2><p>اختيارات مصممة لتكون واضحة، عملية، ومناسبة للوقت الذي تملكه.</p></div><Link href="/explore" className="text-link">استكشف جميع الدورات <Icon name="arrow" size={16} /></Link></div>
                            <div className="course-grid">
                                <article className="course-card"><div className="course-art"><span className="art-label">الأكثر طلباً</span><span className="art-number">01</span><div className="art-shape" /></div><div className="course-body"><div className="course-meta"><span>لغة عربية</span><span>12 درساً</span></div><h3>أساسيات العربية بثقة</h3><p>مسار متدرج يبني المفردات والفهم والتعبير من الأساس.</p><div className="course-footer"><span className="course-price">مناسب للمبتدئين</span><Link href="/explore" className="course-btn">عرض المسار</Link></div></div></article>
                                <article className="course-card"><div className="course-art" style={{background:'linear-gradient(135deg,#e8fbfa,#edf1ff)'}}><span className="art-label" style={{color:'#0f9cac'}}>تفاعلي</span><span className="art-number" style={{color:'rgba(34,199,217,.14)'}}>02</span><div className="art-shape" style={{background:'linear-gradient(145deg,#13aebf,#55d7df)'}} /></div><div className="course-body"><div className="course-meta"><span>قراءة وفهم</span><span>9 دروس</span></div><h3>اقرأ. افهم. عبّر.</h3><p>تدريبات عملية لتحويل القراءة من واجب إلى مهارة يومية.</p><div className="course-footer"><span className="course-price">جلسات قصيرة</span><Link href="/explore" className="course-btn" style={{color:'#0f9cac',background:'#eafafa'}}>عرض المسار</Link></div></div></article>
                                <article className="course-card"><div className="course-art" style={{background:'linear-gradient(135deg,#fff6e7,#fff0f6)'}}><span className="art-label" style={{color:'#d78721'}}>متقدم</span><span className="art-number" style={{color:'rgba(255,184,77,.18)'}}>03</span><div className="art-shape" style={{background:'linear-gradient(145deg,#ef9e31,#f36aa8)'}} /></div><div className="course-body"><div className="course-meta"><span>نحو وتعبير</span><span>16 درساً</span></div><h3>رحلة في النحو الذكي</h3><p>افهم القاعدة من خلال السياق، ثم استخدمها في كتابة أفضل.</p><div className="course-footer"><span className="course-price">مستوى متقدم</span><Link href="/explore" className="course-btn" style={{color:'#d78721',background:'#fff6e7'}}>عرض المسار</Link></div></div></article>
                            </div>
                        </div>
                    </section>

                    <section className="stats-band">
                        <div className="container stats-grid">
                            <div className="stat-block"><strong>18K+</strong><span>درس وتطبيق متاح</span></div>
                            <div className="stat-block"><strong>120+</strong><span>مسار تعليمي متدرج</span></div>
                            <div className="stat-block"><strong>94%</strong><span>معدل إكمال المسارات</span></div>
                            <div className="stat-block"><strong>4.9/5</strong><span>متوسط رضا المتعلمين</span></div>
                        </div>
                    </section>

                    <section className="section" id="stories">
                        <div className="container">
                            <div className="section-head center"><div className="kicker">كلمات من الرحلة</div><h2>لما يصبح التقدم واضحاً، يصبح الاستمرار أسهل.</h2><p>تجارب حقيقية من أشخاص يستخدمون المنصة للتعلم والمتابعة وصناعة عادة أفضل.</p></div>
                            <div className="testimonials">
                                <div className="quote-main"><div className="quote-mark">“</div><blockquote>أول مرة أشعر أن ابني يعرف بالضبط ماذا عليه أن يتعلم بعد ذلك. صرنا نناقش تقدمه بدل أن نسأله فقط: «درست اليوم؟».</blockquote><div className="person"><div className="person-avatar">ر</div><div><strong>ريم أحمد</strong><small>ولية أمر · مستخدمة منذ 2026</small></div></div></div>
                                <div className="quote-side"><div className="small-quote"><div className="stars">★★★★★</div><p>الواجهة هادئة وواضحة، والأهم أنني أستطيع رؤية التقدم بدون الغرق في عشرات الأرقام.</p><div className="person"><div className="person-avatar" style={{background:'linear-gradient(145deg,#13aebf,#55d7df)'}}>م</div><div><strong>محمد خالد</strong><small>متعلم</small></div></div></div><div className="small-quote"><div className="stars">★★★★★</div><p>أداة جميلة للمعلم لأنها تربط المحتوى بالممارسة والتقدم في تجربة واحدة.</p><div className="person"><div className="person-avatar" style={{background:'linear-gradient(145deg,#ef9e31,#f36aa8)'}}>س</div><div><strong>سارة محمود</strong><small>معلمة لغة عربية</small></div></div></div></div>
                            </div>
                        </div>
                    </section>

                    <section className="final-cta">
                        <div className="container cta-inner"><div className="kicker">الخطوة الأولى أبسط مما تتخيل</div><h2>ابدأ رحلة تعلم<br />تريد أن تكملها.</h2><p>استكشف المحتوى، اختر مسارك، واترك لعربيتي مهمة تحويل التقدم الصغير إلى عادة كبيرة.</p><Link href="/register" className="btn-primary">ابدأ مجاناً <Icon name="arrow" size={18} /></Link><div className="cta-note">لا تحتاج بطاقة ائتمانية للبدء</div></div>
                    </section>
                </main>

                <footer className="footer">
                    <div className="container">
                        <div className="footer-grid">
                            <div className="footer-brand"><LogoMark /><p>عربيتي منصة تعلم عربية حديثة تجمع المحتوى، الممارسة، التقدم، والرحلة الشخصية في تجربة واحدة.</p></div>
                            <div><h4>المنصة</h4><div className="footer-links"><a href="#platform">كيف تعمل</a><a href="#journey">رحلة التعلم</a><a href="#audience">لمن المنصة؟</a><Link href="/explore">استكشف الدورات</Link></div></div>
                            <div><h4>روابط</h4><div className="footer-links"><Link href="/teachers">للمعلمين</Link><a href="#stories">قصص النجاح</a><Link href="/contact">تواصل معنا</Link><Link href="/register">إنشاء حساب</Link></div></div>
                            <div><h4>الدعم</h4><div className="footer-links"><a href="#">مركز المساعدة</a><a href="#">الخصوصية</a><a href="#">الشروط والأحكام</a><a href="#">سياسة الاستخدام</a></div></div>
                        </div>
                        <div className="footer-bottom"><span>© 2026 عربيتي. جميع الحقوق محفوظة.</span><div className="footer-social"><a className="social" href="#" aria-label="Instagram">ig</a><a className="social" href="#" aria-label="YouTube">yt</a><a className="social" href="#" aria-label="X">x</a></div></div>
                    </div>
                </footer>
            </div>
        </PublicSiteLayout>
    );
}
