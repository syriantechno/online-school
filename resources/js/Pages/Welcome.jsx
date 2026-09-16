import { Head, Link, usePage } from '@inertiajs/react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import ArabetiLogo from '@/Components/ArabetiLogo';

const characterPair = '/assets/home/characters/boy-girl-3d.png';
const boy = '/assets/home/characters/boy-hero.png';
const girl = '/assets/home/characters/girl-hero.png';

function PlayIcon({ size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8.5 5.2v13.6c0 .8.9 1.3 1.6.9l10.3-6.8c.7-.4.7-1.4 0-1.8L10.1 4.3c-.7-.4-1.6.1-1.6.9Z" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 4 4L19 6" />
        </svg>
    );
}

function Spark({ className = '' }) {
    return (
        <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2.8 14 9l6.2 2-6.2 2-2 6.2-2-6.2-6.2-2 6.2-2 2-6.2Z" fill="currentColor" />
        </svg>
    );
}

function VideoMockup({ compact = false }) {
    return (
        <div className={`video-mockup ${compact ? 'video-mockup--compact' : ''}`}>
            <div className="video-art">
                <div className="video-grid" />
                <div className="video-word">عَرَبِيَّتِي</div>
                <img src={characterPair} alt="شخصيات عربيتي" />
                <div className="video-play"><PlayIcon size={compact ? 17 : 22} /></div>
                <div className="video-duration">08:42</div>
            </div>
            <div className="video-info">
                <div>
                    <strong>درس جديد</strong>
                    <span>تعلّم مع مجد ولمى</span>
                </div>
                <span className="video-level">فيديو</span>
            </div>
        </div>
    );
}

export default function Welcome({ content = {}, courses = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const visibleCourses = Array.isArray(courses) ? courses.slice(0, 6) : [];

    return (
        <PublicSiteLayout fullBleed hideFooter hideHeader>
            <Head title="عربيتي — تعلّم العربية بطريقة ممتعة" />
            <div className="arabeti-home" dir="rtl">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

                    :root {
                        --a-ink:#171a2d;
                        --a-muted:#74798e;
                        --a-purple:#6254ee;
                        --a-purple-2:#8b7bff;
                        --a-teal:#39bfc0;
                        --a-yellow:#ffbd57;
                        --a-coral:#ff7f70;
                        --a-bg:#fbfbf8;
                        --a-cream:#f7f3ea;
                        --a-line:#e9e8e2;
                    }

                    .arabeti-home{font-family:'Cairo',system-ui,sans-serif;color:var(--a-ink);background:var(--a-bg);overflow:hidden;line-height:1.55}
                    .arabeti-home *{box-sizing:border-box}
                    .arabeti-home a{text-decoration:none;color:inherit}
                    .a-container{width:min(1180px,calc(100% - 40px));margin:auto}

                    .a-nav{position:absolute;inset:0 0 auto;z-index:50;padding:22px 0}
                    .a-nav-inner{display:flex;align-items:center;justify-content:space-between;gap:24px}
                    .a-logo{display:flex;align-items:center;gap:10px}
                    .a-logo-mark{width:44px;height:44px;border-radius:15px;background:#fff;box-shadow:0 8px 24px rgba(26,27,44,.08);display:grid;place-items:center;overflow:hidden}
                    .a-logo-mark img{width:34px;height:34px;object-fit:contain}
                    .a-logo-text{font-size:1.22rem;font-weight:900;letter-spacing:-.05em}
                    .a-logo-sub{display:block;color:#9295a4;font-size:.62rem;font-weight:700;margin-top:-4px}
                    .a-nav-links{display:flex;align-items:center;gap:30px;color:#666b7d;font-size:.82rem;font-weight:800}
                    .a-nav-links a:hover{color:var(--a-purple)}
                    .a-nav-actions{display:flex;align-items:center;gap:8px}
                    .a-login{padding:10px 14px;color:#666b7d;font-size:.8rem;font-weight:800}
                    .a-nav-button{padding:11px 19px;border-radius:12px;background:var(--a-ink);color:#fff;font-size:.78rem;font-weight:800;box-shadow:0 10px 24px rgba(23,26,45,.12)}

                    .a-hero{position:relative;padding:142px 0 105px;min-height:790px;background:linear-gradient(180deg,#fff 0%,#fbfaf5 100%)}
                    .a-hero:before{content:'';position:absolute;width:680px;height:680px;left:-240px;top:-280px;border-radius:50%;background:rgba(98,84,238,.07);filter:blur(2px)}
                    .a-hero:after{content:'';position:absolute;width:500px;height:500px;right:-200px;bottom:-240px;border-radius:50%;background:rgba(57,191,192,.08)}
                    .a-hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1.04fr;gap:65px;align-items:center;direction:ltr}
                    .a-hero-copy{direction:rtl;max-width:600px}
                    .a-kicker{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:999px;background:#fff;border:1px solid #ecebf1;box-shadow:0 7px 25px rgba(30,31,50,.04);color:var(--a-purple);font-size:.69rem;font-weight:900}
                    .a-kicker-dot{width:7px;height:7px;border-radius:50%;background:var(--a-teal);box-shadow:0 0 0 5px rgba(57,191,192,.1)}
                    .a-hero h1{font-size:clamp(3.1rem,6vw,5.7rem);line-height:1.04;letter-spacing:-.075em;margin:24px 0 21px;font-weight:900}
                    .a-hero h1 em{font-style:normal;color:var(--a-purple)}
                    .a-hero-lead{font-size:1rem;color:#6f7487;line-height:1.95;font-weight:600;max-width:560px;margin:0 0 30px}
                    .a-actions{display:flex;align-items:center;gap:11px;flex-wrap:wrap}
                    .a-primary,.a-secondary{min-height:53px;border-radius:14px;padding:0 21px;display:inline-flex;align-items:center;justify-content:center;gap:9px;font-size:.82rem;font-weight:900;transition:.2s ease}
                    .a-primary{background:var(--a-purple);color:#fff;box-shadow:0 15px 30px rgba(98,84,238,.22)}
                    .a-secondary{background:#fff;border:1px solid #e8e7e3;color:var(--a-ink);box-shadow:0 8px 20px rgba(30,31,50,.04)}
                    .a-primary:hover,.a-secondary:hover{transform:translateY(-2px)}
                    .a-hero-note{display:flex;align-items:center;gap:12px;margin-top:26px;color:#85899a;font-size:.7rem;font-weight:700}
                    .a-note-check{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;color:var(--a-teal);background:#e9f8f5}

                    .a-hero-visual{direction:rtl;position:relative;min-height:535px}
                    .a-character-a{position:absolute;z-index:5;right:2%;bottom:-20px;width:54%;max-width:320px;filter:drop-shadow(0 25px 30px rgba(31,33,60,.16));animation:a-float 5s ease-in-out infinite}
                    .a-character-b{position:absolute;z-index:4;left:1%;bottom:-4px;width:53%;max-width:310px;filter:drop-shadow(0 25px 30px rgba(31,33,60,.14));animation:a-float 5.6s ease-in-out infinite reverse}
                    .a-visual-backdrop{position:absolute;inset:48px 0 0;background:linear-gradient(145deg,#f1efff,#edf9f7);border-radius:44px 44px 110px 44px;transform:rotate(-2deg);border:1px solid #eeece8}
                    .a-visual-ring{position:absolute;width:470px;height:470px;right:3%;top:15px;border:1px solid rgba(98,84,238,.13);border-radius:50%}
                    .a-visual-ring:after{content:'';position:absolute;inset:52px;border:1px dashed rgba(57,191,192,.24);border-radius:50%}
                    .a-video-card{position:absolute;z-index:8;right:0;top:0;width:255px;padding:10px;border-radius:22px;background:rgba(255,255,255,.9);border:1px solid #eeece9;box-shadow:0 24px 50px rgba(38,39,63,.13);transform:rotate(4deg)}
                    .a-stat-card{position:absolute;z-index:9;left:0;top:118px;padding:13px 16px;border-radius:17px;background:#fff;border:1px solid #eceae5;box-shadow:0 20px 42px rgba(38,39,63,.1);transform:rotate(-4deg);min-width:150px}
                    .a-stat-label{color:#8a8e9e;font-size:.58rem;font-weight:800}.a-stat-value{font-size:1.35rem;font-weight:900;margin-top:2px}.a-stat-value span{color:var(--a-teal);font-size:.7rem;margin-right:4px}
                    .a-bubble{position:absolute;z-index:10;right:18%;bottom:58px;padding:10px 14px;border-radius:15px 15px 4px 15px;background:#fff;color:#53586b;font-size:.64rem;font-weight:900;box-shadow:0 15px 35px rgba(38,39,63,.11);border:1px solid #efede9}
                    .a-spark{position:absolute;color:var(--a-yellow)}.a-spark.one{top:88px;left:28%;transform:rotate(12deg)}.a-spark.two{right:18%;top:185px;color:var(--a-coral);transform:scale(.7)}
                    @keyframes a-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}

                    .a-strip{position:relative;z-index:10;margin-top:-1px;background:#fff;border-top:1px solid #eeeDE9;border-bottom:1px solid #eeeDE9}
                    .a-strip-inner{display:grid;grid-template-columns:repeat(3,1fr);padding:22px 0}
                    .a-strip-item{display:flex;align-items:center;justify-content:center;gap:12px;color:#5f6477;font-size:.72rem;font-weight:800;border-left:1px solid #eeeDE9}.a-strip-item:last-child{border-left:0}
                    .a-strip-icon{width:35px;height:35px;border-radius:11px;display:grid;place-items:center;background:#f1efff;color:var(--a-purple)}

                    .a-section{padding:105px 0}.a-section.soft{background:#f8f7f2}.a-section.cream{background:var(--a-cream)}
                    .a-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin-bottom:40px}.a-heading-copy{max-width:600px}.a-eyebrow{color:var(--a-purple);font-size:.68rem;font-weight:900;margin-bottom:8px}.a-heading h2{font-size:clamp(2rem,4vw,3.7rem);line-height:1.08;letter-spacing:-.065em;margin:0;font-weight:900}.a-heading p{margin:13px 0 0;color:#777c8e;font-size:.9rem;line-height:1.9;font-weight:600}.a-heading-link{display:inline-flex;align-items:center;gap:7px;color:var(--a-purple);font-size:.75rem;font-weight:900;white-space:nowrap}

                    .a-learning-layout{display:grid;grid-template-columns:.9fr 1.1fr;gap:34px;align-items:center;direction:ltr}.a-learning-copy{direction:rtl}.a-learning-copy h3{font-size:2rem;line-height:1.2;letter-spacing:-.05em;margin:0 0 13px;font-weight:900}.a-learning-copy>p{color:#777c8e;line-height:1.9;font-size:.88rem;font-weight:600;margin:0 0 25px}.a-points{display:grid;gap:12px}.a-point{display:flex;align-items:center;gap:10px;color:#4d5266;font-size:.75rem;font-weight:800}.a-point i{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#edf9f7;color:#22a999;font-style:normal}.a-learning-preview{direction:rtl;background:#fff;border:1px solid #e8e6df;border-radius:30px;padding:15px;box-shadow:0 25px 65px rgba(38,39,63,.09);position:relative}.a-preview-screen{position:relative;border-radius:22px;overflow:hidden;background:#ecebff;min-height:370px}.a-preview-screen .video-art{height:370px}.a-preview-side{display:flex;align-items:center;justify-content:space-between;padding:15px 5px 2px}.a-preview-side strong{font-size:.78rem}.a-preview-side span{color:#888c9c;font-size:.62rem;font-weight:700}

                    .video-mockup{background:#fff;border:1px solid #e9e7e1;border-radius:21px;padding:8px;box-shadow:0 16px 35px rgba(30,31,50,.07)}
                    .video-art{height:170px;border-radius:15px;position:relative;overflow:hidden;background:linear-gradient(135deg,#eceaff 0%,#dff7f3 100%)}
                    .video-art img{position:absolute;bottom:-9px;right:12%;height:125%;width:auto;max-width:80%;object-fit:contain;filter:drop-shadow(0 12px 12px rgba(26,29,51,.13))}
                    .video-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(98,84,238,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(98,84,238,.07) 1px,transparent 1px);background-size:22px 22px;opacity:.6}.video-word{position:absolute;top:17px;right:16px;font-size:.7rem;font-weight:900;color:rgba(98,84,238,.48);letter-spacing:.15em}.video-play{position:absolute;left:14px;bottom:14px;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--a-purple);box-shadow:0 10px 20px rgba(30,31,50,.13)}.video-duration{position:absolute;left:14px;top:14px;background:rgba(23,26,45,.76);color:#fff;padding:3px 7px;border-radius:6px;font-size:.52rem;font-weight:800}.video-info{display:flex;align-items:center;justify-content:space-between;padding:10px 4px 3px}.video-info strong{display:block;font-size:.68rem}.video-info span{display:block;color:#9295a3;font-size:.55rem;font-weight:700;margin-top:2px}.video-level{padding:5px 8px;border-radius:7px;background:#f3f1ff!important;color:var(--a-purple)!important;font-size:.5rem!important}

                    .a-courses{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.a-course{background:#fff;border:1px solid #e9e7e0;border-radius:24px;padding:10px;transition:transform .2s ease,box-shadow .2s ease}.a-course:hover{transform:translateY(-5px);box-shadow:0 20px 45px rgba(35,36,58,.09)}.a-course-media{height:185px;border-radius:17px;overflow:hidden;background:linear-gradient(135deg,#f0eeff,#e4f7f4);position:relative}.a-course-media img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 15px 15px rgba(30,31,50,.12))}.a-course-play{position:absolute;left:13px;bottom:13px;width:37px;height:37px;border-radius:50%;background:#fff;color:var(--a-purple);display:grid;place-items:center;box-shadow:0 9px 18px rgba(30,31,50,.13)}.a-course-body{padding:13px 5px 5px}.a-course-body h3{font-size:.86rem;margin:0 0 5px;font-weight:900}.a-course-body p{margin:0;color:#888c9c;font-size:.6rem;font-weight:700;min-height:19px}.a-course-meta{display:flex;align-items:center;justify-content:space-between;margin-top:12px;color:#757a8b;font-size:.58rem;font-weight:800}.a-course-meta b{color:var(--a-purple)}

                    .a-character-section{position:relative;overflow:hidden}.a-character-grid{display:grid;grid-template-columns:.9fr 1.1fr;align-items:center;gap:70px;direction:ltr}.a-character-copy{direction:rtl}.a-character-copy h2{font-size:clamp(2.3rem,4.5vw,4.4rem);line-height:1.05;letter-spacing:-.07em;margin:0 0 18px;font-weight:900}.a-character-copy h2 span{color:var(--a-purple)}.a-character-copy p{color:#767b8c;font-size:.9rem;line-height:2;font-weight:600;max-width:510px}.a-character-stage{direction:rtl;position:relative;min-height:500px;border-radius:40px;background:#fff;border:1px solid #e8e5dc;overflow:hidden;box-shadow:0 25px 60px rgba(31,33,50,.06)}.a-character-stage:before{content:'';position:absolute;width:500px;height:500px;border-radius:50%;background:#f0eeff;left:-80px;top:-90px}.a-character-stage img{position:absolute;z-index:2;object-fit:contain;filter:drop-shadow(0 24px 28px rgba(31,33,50,.14))}.a-character-stage .boy{height:78%;right:4%;bottom:-1%}.a-character-stage .girl{height:72%;left:3%;bottom:1%}.a-character-tag{position:absolute;z-index:4;background:#fff;border:1px solid #ebe9e2;border-radius:15px;padding:9px 12px;box-shadow:0 15px 30px rgba(31,33,50,.08);font-size:.62rem;font-weight:900}.a-character-tag.one{top:25px;right:23px}.a-character-tag.two{bottom:32px;left:22px}.a-character-tag b{color:var(--a-purple);display:block;font-size:.5rem;margin-bottom:2px}

                    .a-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:17px}.a-step{position:relative;padding:28px;border-radius:25px;background:#fff;border:1px solid #e9e7e0;min-height:220px}.a-step-num{font-size:.65rem;color:#aaaebc;font-weight:900}.a-step-icon{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;margin:22px 0 15px;background:#f1efff;color:var(--a-purple);font-size:1.1rem;font-weight:900}.a-step:nth-child(2) .a-step-icon{background:#e9f8f5;color:#1ca999}.a-step:nth-child(3) .a-step-icon{background:#fff4df;color:#e09a28}.a-step h3{font-size:.95rem;margin:0 0 7px;font-weight:900}.a-step p{font-size:.66rem;color:#85899a;line-height:1.8;margin:0;font-weight:700}

                    .a-final{padding:95px 0;background:#6254ee;color:#fff;position:relative;overflow:hidden}.a-final:before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;right:-190px;top:-270px;border:1px solid rgba(255,255,255,.13);box-shadow:0 0 0 70px rgba(255,255,255,.025),0 0 0 140px rgba(255,255,255,.018)}.a-final-grid{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:40px;direction:ltr}.a-final-copy{direction:rtl}.a-final h2{font-size:clamp(2.5rem,5vw,4.8rem);line-height:1.03;letter-spacing:-.07em;margin:0 0 16px;font-weight:900}.a-final p{color:rgba(255,255,255,.72);font-size:.88rem;line-height:1.9;font-weight:600;max-width:520px}.a-final .a-primary{background:#fff;color:var(--a-purple);box-shadow:none}.a-final-characters{height:360px;position:relative}.a-final-characters img{position:absolute;height:100%;object-fit:contain;filter:drop-shadow(0 24px 24px rgba(28,24,80,.18))}.a-final-characters .f-boy{right:3%}.a-final-characters .f-girl{left:5%;height:90%;bottom:0}

                    .a-footer{background:#fff;padding:55px 0 25px}.a-footer-top{display:flex;align-items:flex-start;justify-content:space-between;gap:40px;padding-bottom:40px;border-bottom:1px solid #eceae4}.a-footer-brand{max-width:330px}.a-footer-brand p{color:#8b8f9e;font-size:.65rem;line-height:1.9;font-weight:700;margin:13px 0 0}.a-footer-links{display:flex;gap:70px}.a-footer-col h4{font-size:.68rem;margin:0 0 13px;font-weight:900}.a-footer-col a{display:block;color:#858a9b;font-size:.62rem;font-weight:700;margin:8px 0}.a-footer-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:20px;color:#a0a3af;font-size:.55rem;font-weight:700}

                    @media(max-width:900px){
                        .a-nav-links{display:none}.a-nav-actions .a-login{display:none}.a-hero-grid,.a-learning-layout,.a-character-grid,.a-final-grid{grid-template-columns:1fr;gap:30px}.a-hero{padding-top:120px}.a-hero-copy{max-width:700px}.a-hero-visual{min-height:510px}.a-courses{grid-template-columns:repeat(2,1fr)}.a-steps{grid-template-columns:1fr}.a-character-grid{direction:rtl}.a-character-stage{min-height:460px}.a-final-grid{direction:rtl}.a-footer-top{flex-direction:column}.a-footer-links{gap:55px}.a-video-card{right:5%}
                    }
                    @media(max-width:620px){
                        .a-container{width:min(100% - 28px,1180px)}.a-nav{padding:15px 0}.a-nav-button{padding:10px 13px}.a-logo-text{font-size:1rem}.a-logo-sub{display:none}.a-hero{padding:105px 0 55px;min-height:auto}.a-hero h1{font-size:clamp(2.65rem,14vw,4.2rem)}.a-hero-lead{font-size:.86rem}.a-hero-visual{min-height:430px;margin-top:8px}.a-visual-ring{width:350px;height:350px;right:4%}.a-character-a{width:58%;right:0}.a-character-b{width:58%;left:0}.a-video-card{width:205px;top:5px}.a-stat-card{top:100px;left:-2px;min-width:125px}.a-bubble{right:16%;bottom:48px}.a-strip-inner{grid-template-columns:1fr;padding:10px 0}.a-strip-item{border-left:0;border-bottom:1px solid #eeeDE9;padding:11px}.a-strip-item:last-child{border-bottom:0}.a-section{padding:72px 0}.a-heading{display:block}.a-heading-link{margin-top:15px}.a-courses{grid-template-columns:1fr}.a-course-media{height:210px}.a-preview-screen,.a-preview-screen .video-art{min-height:260px;height:260px}.a-character-stage{min-height:390px}.a-character-stage .boy{height:73%}.a-character-stage .girl{height:67%}.a-final{padding:70px 0}.a-final-characters{height:300px}.a-footer-links{gap:28px;flex-wrap:wrap}.a-footer-bottom{display:block}.a-footer-bottom span{display:block;margin-top:7px}
                    }
                `}</style>

                <header className="a-nav">
                    <div className="a-container a-nav-inner">
                        <Link href="/" className="a-logo" aria-label="عربيتي">
                            <div className="a-logo-mark"><ArabetiLogo /></div>
                            <div><span className="a-logo-text">عربيتي</span><span className="a-logo-sub">تعلّم العربية بطريقة مختلفة</span></div>
                        </Link>
                        <nav className="a-nav-links">
                            <a href="#learn">كيف تتعلم</a>
                            <a href="#videos">الدروس</a>
                            <a href="#characters">مجد ولمى</a>
                        </nav>
                        <div className="a-nav-actions">
                            {!user && <Link href={route('login')} className="a-login">تسجيل الدخول</Link>}
                            <Link href={user ? route('dashboard') : route('register')} className="a-nav-button">{user ? 'لوحتي' : 'ابدأ الآن'}</Link>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="a-hero">
                        <div className="a-container a-hero-grid">
                            <div className="a-hero-copy">
                                <span className="a-kicker"><i className="a-kicker-dot" /> تعلّم العربية أونلاين</span>
                                <h1>العربية أسهل<br /><em>لما تتعلّمها</em><br />معنا.</h1>
                                <p className="a-hero-lead">دروس فيديو ممتعة وواضحة، يقدمها مجد ولمى خطوة بخطوة. شاهد، استمع، جرّب، وخلّي العربية جزءاً من يومك.</p>
                                <div className="a-actions">
                                    <Link href={user ? route('dashboard') : route('register')} className="a-primary">ابدأ التعلّم <ArrowIcon /></Link>
                                    <a href="#videos" className="a-secondary"><PlayIcon size={16} /> شاهد الدروس</a>
                                </div>
                                <div className="a-hero-note"><span className="a-note-check"><CheckIcon /></span> تعلّم بالفيديو مع شخصيات عربيتي</div>
                            </div>

                            <div className="a-hero-visual">
                                <div className="a-visual-backdrop" />
                                <div className="a-visual-ring" />
                                <Spark className="a-spark one" /><Spark className="a-spark two" />
                                <div className="a-video-card"><VideoMockup compact /></div>
                                <div className="a-stat-card"><div className="a-stat-label">رحلتك التعليمية</div><div className="a-stat-value">فيديو بعد فيديو <span>●</span></div></div>
                                <div className="a-bubble">جاهز للدرس؟ ✦</div>
                                <img className="a-character-a" src={boy} alt="مجْد من شخصيات عربيتي" />
                                <img className="a-character-b" src={girl} alt="لمى من شخصيات عربيتي" />
                            </div>
                        </div>
                    </section>

                    <div className="a-strip">
                        <div className="a-container a-strip-inner">
                            <div className="a-strip-item"><span className="a-strip-icon"><PlayIcon size={15} /></span> دروس فيديو واضحة وممتعة</div>
                            <div className="a-strip-item"><span className="a-strip-icon">ع</span> تعلّم العربية خطوة بخطوة</div>
                            <div className="a-strip-item"><span className="a-strip-icon">★</span> تعلّم مع مجد ولمى</div>
                        </div>
                    </div>

                    <section className="a-section" id="learn">
                        <div className="a-container">
                            <div className="a-heading">
                                <div className="a-heading-copy"><div className="a-eyebrow">تجربة عربيتي</div><h2>مو بس تشاهد الدرس.<br />أنت تعيشه.</h2><p>صممنا تجربة التعلم حول الفيديو، بحيث يكون الدرس واضحاً وقريباً وسهل المتابعة من أول دقيقة.</p></div>
                                <a className="a-heading-link" href="#videos">استكشف الدروس <ArrowIcon /></a>
                            </div>
                            <div className="a-learning-layout">
                                <div className="a-learning-copy">
                                    <h3>كل شيء يبدأ بفيديو.</h3>
                                    <p>مجد ولمى يقدمان الدرس بطريقة طبيعية، والطالب يتقدم معهما من مفهوم إلى آخر بدون تعقيد أو حشو.</p>
                                    <div className="a-points">
                                        <div className="a-point"><i><CheckIcon /></i> شرح بصري وصوتي واضح</div>
                                        <div className="a-point"><i><CheckIcon /></i> دروس قصيرة وسهلة المتابعة</div>
                                        <div className="a-point"><i><CheckIcon /></i> تجربة مصممة للتعلّم المستمر</div>
                                    </div>
                                </div>
                                <div className="a-learning-preview">
                                    <div className="a-preview-screen"><VideoMockup /></div>
                                    <div className="a-preview-side"><strong>شاهد الدرس بطريقتك</strong><span>فيديو تعليمي</span></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="a-section soft" id="videos">
                        <div className="a-container">
                            <div className="a-heading">
                                <div className="a-heading-copy"><div className="a-eyebrow">الدروس</div><h2>دروس تشعر معها<br />أنك تتعلم مع أحد.</h2><p>اختر الدرس الذي تريد، واضغط تشغيل. المحتوى الفعلي المرسل من المنصة يظهر هنا تلقائياً.</p></div>
                            </div>
                            <div className="a-courses">
                                {visibleCourses.length > 0 ? visibleCourses.map((course, index) => (
                                    <Link href={course?.url || '#'} className="a-course" key={course?.id || index}>
                                        <div className="a-course-media">
                                            <img src={course?.thumbnail || course?.image || characterPair} alt="" />
                                            <span className="a-course-play"><PlayIcon size={15} /></span>
                                        </div>
                                        <div className="a-course-body"><h3>{course?.title || 'درس عربيتي'}</h3><p>{course?.description || 'درس فيديو تعليمي'}</p><div className="a-course-meta"><span>{course?.duration || 'فيديو'}</span><b>شاهد الدرس ←</b></div></div>
                                    </Link>
                                )) : (
                                    [1,2,3].map((item) => <div className="a-course" key={item}><VideoMockup /></div>)
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="a-section a-character-section" id="characters">
                        <div className="a-container a-character-grid">
                            <div className="a-character-stage">
                                <div className="a-character-tag one"><b>مقدّما الدروس</b>نتعلم معهم كل يوم</div>
                                <div className="a-character-tag two"><b>عربيتي</b>تعلم أقرب إليك</div>
                                <img className="boy" src={boy} alt="مجْد" />
                                <img className="girl" src={girl} alt="لمى" />
                            </div>
                            <div className="a-character-copy">
                                <div className="a-eyebrow">شخصيات عربيتي</div>
                                <h2>مجد ولمى.<br /><span>رفقاء التعلّم.</span></h2>
                                <p>الشخصيتان الأساسيتان في عربيتي موجودتان مع الطالب داخل الدروس نفسها. يحكوا، يشرحوا، ويساعدوا على جعل تعلم العربية تجربة محببة وسهلة التذكّر.</p>
                                <div className="a-actions"><a href="#videos" className="a-primary">شاهد الدروس <ArrowIcon /></a></div>
                            </div>
                        </div>
                    </section>

                    <section className="a-section cream">
                        <div className="a-container">
                            <div className="a-heading"><div className="a-heading-copy"><div className="a-eyebrow">كيف تبدأ؟</div><h2>ثلاث خطوات.<br />وتبدأ رحلتك.</h2></div></div>
                            <div className="a-steps">
                                <div className="a-step"><span className="a-step-num">01</span><div className="a-step-icon">▶</div><h3>اختر درساً</h3><p>ادخل إلى الدروس واختر الفيديو المناسب لك.</p></div>
                                <div className="a-step"><span className="a-step-num">02</span><div className="a-step-icon">ع</div><h3>تعلّم مع مجد ولمى</h3><p>شاهد، استمع، وتابع الشرح خطوة بخطوة.</p></div>
                                <div className="a-step"><span className="a-step-num">03</span><div className="a-step-icon">✓</div><h3>استمر وتقدّم</h3><p>ارجع لدروسك واستمر في بناء مهاراتك بالعربية.</p></div>
                            </div>
                        </div>
                    </section>

                    <section className="a-final">
                        <div className="a-container a-final-grid">
                            <div className="a-final-copy"><h2>خلّي العربية<br />جزءاً من يومك.</h2><p>ابدأ أول درس مع عربيتي، وخلي مجد ولمى يكونوا معك في كل خطوة.</p><div className="a-actions"><Link href={user ? route('dashboard') : route('register')} className="a-primary">ابدأ التعلّم <ArrowIcon /></Link></div></div>
                            <div className="a-final-characters"><img className="f-boy" src={boy} alt="مجْد" /><img className="f-girl" src={girl} alt="لمى" /></div>
                        </div>
                    </section>
                </main>

                <footer className="a-footer">
                    <div className="a-container">
                        <div className="a-footer-top">
                            <div className="a-footer-brand"><Link href="/" className="a-logo"><div className="a-logo-mark"><ArabetiLogo /></div><div><span className="a-logo-text">عربيتي</span><span className="a-logo-sub">تعلّم العربية بطريقة مختلفة</span></div></Link><p>منصة عربية للتعلّم أونلاين، تجمع الطالب مع دروس فيديو واضحة وشخصيات يحبها.</p></div>
                            <div className="a-footer-links">
                                <div className="a-footer-col"><h4>عربيتي</h4><a href="#learn">كيف تتعلم</a><a href="#videos">الدروس</a><a href="#characters">مجد ولمى</a></div>
                                <div className="a-footer-col"><h4>الحساب</h4><Link href={route('login')}>تسجيل الدخول</Link><Link href={route('register')}>إنشاء حساب</Link></div>
                                <div className="a-footer-col"><h4>روابط</h4><Link href="/explore">استكشف</Link><Link href="/teachers">المعلمون</Link><Link href="/contact">تواصل معنا</Link></div>
                            </div>
                        </div>
                        <div className="a-footer-bottom"><span>© {new Date().getFullYear()} عربيتي. جميع الحقوق محفوظة.</span><span>تعلّم العربية. خطوة بخطوة.</span></div>
                    </div>
                </footer>
            </div>
        </PublicSiteLayout>
    );
}
