import { Head, Link, usePage } from '@inertiajs/react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import ArabetiLogo from '@/Components/ArabetiLogo';

const boy = '/assets/home/characters/boy-hero.png';
const girl = '/assets/home/characters/girl-hero.png';
const pair = '/assets/home/characters/boy-girl-3d.png';

function Play({ size = 18 }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.7 5.1v13.8c0 .8.9 1.3 1.6.9l10.4-6.9c.7-.4.7-1.4 0-1.8L10.3 4.2c-.7-.4-1.6.1-1.6.9Z" /></svg>;
}

function Arrow() {
    return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function Check() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>;
}

function PauseBars() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
}

function LessonFrame({ large = false, character = pair }) {
    return (
        <div className={`lesson-frame ${large ? 'lesson-frame-large' : ''}`}>
            <div className="lesson-top">
                <span className="lesson-live"><i /> درس عربيتي</span>
                <span className="lesson-time">08:42</span>
            </div>
            <div className="lesson-stage">
                <div className="stage-glow glow-a" />
                <div className="stage-glow glow-b" />
                <div className="stage-word">لِنَتَعَلَّمْ</div>
                <div className="stage-line" />
                <img src={character} alt="مجد ولمى" className="lesson-character" />
                <div className="speech speech-one">مرحباً! 👋</div>
                <div className="speech speech-two">هيا نتعلّم معاً</div>
                <div className="lesson-play"><Play size={large ? 25 : 19} /></div>
            </div>
            <div className="lesson-controls">
                <div className="control-left"><span className="pause"><PauseBars /></span><span className="progress"><i /></span><b>02:16</b></div>
                <span className="hd">HD</span>
            </div>
        </div>
    );
}

export default function Welcome({ content = {}, courses = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const lessons = Array.isArray(courses) ? courses.slice(0, 4) : [];

    return (
        <PublicSiteLayout fullBleed hideFooter hideHeader>
            <Head title="عربيتي — العربية كما لم تتعلمها من قبل" />
            <div className="arab-home" dir="rtl">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
                    :root{--ink:#1d2232;--muted:#72788a;--purple:#6656e8;--purple2:#8274f3;--mint:#36b7a9;--yellow:#f5bd54;--coral:#ed7d70;--paper:#fbfaf7;--cream:#f5f0e5;--line:#e8e5dc}
                    .arab-home{font-family:'Cairo',system-ui,sans-serif;color:var(--ink);background:var(--paper);overflow:hidden;line-height:1.55}.arab-home *{box-sizing:border-box}.arab-home a{text-decoration:none;color:inherit}.wrap{width:min(1180px,calc(100% - 44px));margin:auto}
                    .topnav{position:absolute;z-index:30;inset:0 0 auto;padding:24px 0}.navin{display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px}.brandmark{width:43px;height:43px;background:#fff;border:1px solid #eeeae1;border-radius:14px;display:grid;place-items:center;box-shadow:0 8px 25px #2626380b}.brandmark img{width:34px;height:34px}.brandname{font-size:1.15rem;font-weight:900;letter-spacing:-.05em}.brandtag{font-size:.56rem;color:#9296a3;font-weight:800;margin-top:-5px}.navlinks{display:flex;gap:31px;color:#6e7384;font-size:.74rem;font-weight:800}.navlinks a:hover{color:var(--purple)}.navactions{display:flex;align-items:center;gap:7px}.login{font-size:.74rem;font-weight:800;color:#74798a;padding:10px 14px}.join{font-size:.73rem;font-weight:900;background:var(--ink);color:#fff;padding:12px 18px;border-radius:12px;box-shadow:0 10px 25px #25283a17}
                    .hero{position:relative;min-height:790px;padding:140px 0 80px;background:#fff}.hero:before{content:'';position:absolute;width:700px;height:700px;right:-330px;top:-380px;border-radius:50%;background:#f1efff}.hero:after{content:'';position:absolute;width:520px;height:520px;left:-280px;bottom:-320px;border-radius:50%;background:#edf8f4}.hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1.08fr;gap:70px;align-items:center;direction:ltr}.hero-copy{direction:rtl;padding-top:18px}.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:7px 11px;border-radius:999px;border:1px solid #eae7df;background:#fff;color:var(--purple);font-size:.65rem;font-weight:900;box-shadow:0 8px 25px #26263808}.eyebrow i{width:7px;height:7px;border-radius:50%;background:var(--mint);box-shadow:0 0 0 5px #36b7a91a}.hero h1{font-size:clamp(3.25rem,6.1vw,5.85rem);line-height:1.02;letter-spacing:-.08em;font-weight:900;margin:23px 0 20px}.hero h1 span{color:var(--purple)}.hero-copy>p{max-width:545px;color:var(--muted);font-size:.93rem;font-weight:600;line-height:2;margin:0 0 28px}.hero-buttons{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.primary,.secondary{height:53px;border-radius:14px;padding:0 20px;display:inline-flex;align-items:center;justify-content:center;gap:9px;font-size:.76rem;font-weight:900;transition:.2s}.primary{background:var(--purple);color:#fff;box-shadow:0 17px 34px #6656e83b}.secondary{background:#fff;border:1px solid var(--line);box-shadow:0 10px 25px #25283a09}.primary:hover,.secondary:hover{transform:translateY(-2px)}.hero-proof{display:flex;align-items:center;gap:12px;margin-top:24px;color:#858998;font-size:.65rem;font-weight:700}.prooficon{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#e8f8f3;color:#24a594}
                    .hero-scene{direction:rtl;position:relative;height:540px}.scene-card{position:absolute;inset:45px 0 5px;background:linear-gradient(135deg,#f0eeff,#edf8f4);border:1px solid #ebe8df;border-radius:46px 46px 125px 46px;transform:rotate(-2deg)}.scene-ring{position:absolute;width:490px;height:490px;right:3%;top:5px;border:1px solid #6656e81f;border-radius:50%}.scene-ring:after{content:'';position:absolute;inset:48px;border:1px dashed #36b7a933;border-radius:50%}.char{position:absolute;z-index:7;bottom:-15px;filter:drop-shadow(0 27px 28px #20233c25);object-fit:contain}.char-boy{right:4%;width:50%;max-width:305px;animation:float 5.4s ease-in-out infinite}.char-girl{left:2%;width:50%;max-width:300px;bottom:0;animation:float 6s ease-in-out infinite reverse}.hero-video{position:absolute;z-index:10;right:0;top:0;width:270px;transform:rotate(4deg);box-shadow:0 25px 55px #24263d20}.hero-note{position:absolute;z-index:12;left:0;top:112px;background:#fff;border:1px solid #ece8e0;border-radius:18px;padding:13px 15px;box-shadow:0 20px 42px #24263d18;transform:rotate(-5deg);min-width:160px}.hero-note small{display:block;color:#9296a3;font-size:.53rem;font-weight:800}.hero-note strong{display:block;font-size:.95rem;margin-top:2px}.hero-note strong b{color:var(--mint);font-size:.65rem;margin-right:4px}.bubble{position:absolute;z-index:12;right:22%;bottom:55px;background:#fff;border:1px solid #ece8e0;border-radius:17px 17px 4px 17px;padding:10px 13px;font-size:.61rem;font-weight:900;box-shadow:0 15px 35px #24263d18}.star{position:absolute;z-index:11;color:var(--yellow)}.star.s1{top:92px;left:30%}.star.s2{right:17%;top:205px;color:var(--coral);transform:scale(.7)}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
                    .ribbon{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.ribbonin{display:grid;grid-template-columns:repeat(3,1fr);padding:20px 0}.ribbonitem{display:flex;justify-content:center;align-items:center;gap:10px;color:#656a7a;font-size:.68rem;font-weight:800;border-left:1px solid var(--line)}.ribbonitem:last-child{border-left:0}.ribbonicon{width:34px;height:34px;border-radius:11px;background:#f1efff;color:var(--purple);display:grid;place-items:center}
                    .section{padding:110px 0}.section.cream{background:var(--cream)}.section.soft{background:#f7f6f1}.section-head{display:flex;align-items:end;justify-content:space-between;gap:30px;margin-bottom:38px}.head-copy{max-width:650px}.mini{font-size:.64rem;font-weight:900;color:var(--purple);margin-bottom:8px}.section h2{font-size:clamp(2.15rem,4vw,3.8rem);line-height:1.08;letter-spacing:-.07em;margin:0;font-weight:900}.section-head p{color:var(--muted);font-size:.83rem;font-weight:600;line-height:1.9;margin:12px 0 0}.head-link{color:var(--purple);font-size:.7rem;font-weight:900;display:flex;gap:7px;align-items:center;white-space:nowrap}
                    .experience{display:grid;grid-template-columns:.9fr 1.1fr;gap:55px;align-items:center;direction:ltr}.experience-copy{direction:rtl}.experience-copy h3{font-size:2.05rem;line-height:1.2;letter-spacing:-.06em;margin:0 0 13px;font-weight:900}.experience-copy>p{color:var(--muted);font-size:.83rem;font-weight:600;line-height:2;margin:0 0 24px}.points{display:grid;gap:12px}.point{display:flex;align-items:center;gap:10px;font-size:.7rem;font-weight:800;color:#53586a}.point i{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#e8f8f3;color:#239f8f;font-style:normal}.experience-video{direction:rtl;background:#fff;border:1px solid #e6e2d8;border-radius:31px;padding:13px;box-shadow:0 28px 70px #282a3a12}.experience-video .lesson-frame{box-shadow:none;border:0}.experience-video .lesson-stage{height:360px}.experience-video .lesson-character{height:91%}.experience-video .stage-word{font-size:4.2rem}
                    .lesson-frame{background:#fff;border:1px solid #e6e3dc;border-radius:23px;padding:8px;box-shadow:0 20px 45px #27293b12;overflow:hidden}.lesson-frame-large{border-radius:28px}.lesson-top{height:31px;display:flex;align-items:center;justify-content:space-between;padding:0 6px;color:#7f8494;font-size:.55rem;font-weight:800}.lesson-live{display:flex;align-items:center;gap:6px}.lesson-live i{width:6px;height:6px;background:var(--coral);border-radius:50%}.lesson-stage{height:166px;border-radius:17px;position:relative;overflow:hidden;background:linear-gradient(135deg,#eeeaff,#e4f7f2)}.stage-glow{position:absolute;border-radius:50%;filter:blur(3px)}.glow-a{width:180px;height:180px;background:#6656e81c;right:-50px;top:-60px}.glow-b{width:150px;height:150px;background:#36b7a91b;left:-30px;bottom:-65px}.stage-word{position:absolute;z-index:1;left:16px;top:18px;color:#6656e812;font-size:2.3rem;font-weight:900;letter-spacing:-.08em}.stage-line{position:absolute;width:130px;height:1px;background:#6656e81c;left:21px;top:67px}.lesson-character{position:absolute;z-index:4;height:122%;width:auto;max-width:75%;right:17%;bottom:-15px;object-fit:contain;filter:drop-shadow(0 12px 12px #25283a18)}.speech{position:absolute;z-index:7;background:#fff;padding:7px 10px;border-radius:12px 12px 3px 12px;font-size:.52rem;font-weight:900;box-shadow:0 9px 20px #25283a12}.speech-one{right:11%;top:29px}.speech-two{left:9%;bottom:28px;border-radius:12px 12px 12px 3px;color:var(--purple)}.lesson-play{position:absolute;z-index:8;left:50%;top:50%;transform:translate(-50%,-50%);width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--purple);box-shadow:0 12px 28px #24263d24}.lesson-controls{height:30px;display:flex;align-items:center;justify-content:space-between;padding:0 5px;color:#9296a3;font-size:.5rem;font-weight:800}.control-left{display:flex;align-items:center;gap:7px}.pause{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:#f0eeff;color:var(--purple)}.progress{display:block;width:86px;height:3px;background:#e7e4dc;border-radius:99px;overflow:hidden}.progress i{display:block;width:39%;height:100%;background:var(--purple);border-radius:99px}.hd{padding:3px 6px;border:1px solid #e5e2da;border-radius:5px}
                    .story{position:relative}.story-layout{display:grid;grid-template-columns:1.1fr .9fr;gap:45px;align-items:center}.story-art{position:relative;height:440px}.story-bg{position:absolute;inset:30px 0 0;background:#fff;border:1px solid var(--line);border-radius:40px 40px 100px 40px}.story-girl{position:absolute;height:92%;right:4%;bottom:0;z-index:4;filter:drop-shadow(0 25px 25px #25283a19)}.story-boy{position:absolute;height:73%;left:5%;bottom:0;z-index:5;filter:drop-shadow(0 25px 25px #25283a19)}.story-card{position:absolute;z-index:7;left:15px;top:0;background:#f5f2ff;border:1px solid #e7e2ff;padding:15px 17px;border-radius:18px;box-shadow:0 20px 40px #25283a10}.story-card b{font-size:1rem}.story-card span{display:block;color:#818697;font-size:.57rem;font-weight:700;margin-top:2px}.story-copy{padding-right:10px}.story-copy h3{font-size:2.25rem;line-height:1.2;letter-spacing:-.06em;margin:0 0 14px;font-weight:900}.story-copy p{color:var(--muted);font-size:.83rem;line-height:2;font-weight:600;margin:0 0 23px}.story-number{display:flex;align-items:center;gap:12px;margin-bottom:13px}.story-number b{font-size:.65rem;color:var(--purple)}.story-number span{height:1px;width:55px;background:#dcd9d0}.story-quote{padding:15px 17px;background:#fff;border:1px solid var(--line);border-radius:17px;color:#64697a;font-size:.67rem;font-weight:700;line-height:1.9}
                    .lesson-gallery{display:grid;grid-template-columns:1.25fr .75fr;gap:18px}.gallery-side{display:grid;gap:18px}.gallery-main .lesson-stage{height:355px}.gallery-main .lesson-character{height:96%}.gallery-main .stage-word{font-size:4.5rem}.gallery-side .lesson-stage{height:168px}.gallery-side .lesson-character{height:120%}.gallery-caption{padding:12px 4px 3px}.gallery-caption strong{display:block;font-size:.72rem}.gallery-caption span{display:block;color:#898d9d;font-size:.56rem;font-weight:700;margin-top:2px}
                    .final-cta{position:relative;overflow:hidden;padding:95px 0;background:#6254df;color:#fff}.final-cta:before,.final-cta:after{content:'';position:absolute;border:1px solid #ffffff1c;border-radius:50%}.final-cta:before{width:520px;height:520px;right:-180px;top:-280px}.final-cta:after{width:420px;height:420px;left:-170px;bottom:-280px}.cta-grid{position:relative;z-index:2;display:grid;grid-template-columns:1fr .7fr;align-items:center;gap:50px}.cta-copy h2{font-size:clamp(2.5rem,5vw,4.6rem);line-height:1.02;letter-spacing:-.08em;margin:0 0 17px;font-weight:900}.cta-copy p{color:#eeecff;font-size:.82rem;font-weight:600;line-height:1.9;max-width:520px;margin:0 0 25px}.cta-button{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--purple);height:52px;padding:0 20px;border-radius:14px;font-size:.74rem;font-weight:900}.cta-art{height:260px;position:relative}.cta-boy{position:absolute;height:100%;right:12%;bottom:-20px;filter:drop-shadow(0 20px 22px #29204b2b)}.cta-girl{position:absolute;height:88%;left:5%;bottom:-16px;filter:drop-shadow(0 20px 22px #29204b2b)}
                    .footer{background:#191d2a;color:#fff;padding:44px 0 30px}.footer-top{display:flex;align-items:center;justify-content:space-between;gap:30px}.footer-brand{display:flex;align-items:center;gap:10px}.footer-mark{width:40px;height:40px;background:#fff;border-radius:12px;display:grid;place-items:center}.footer-mark img{width:31px;height:31px}.footer-brand b{font-size:1rem}.footer-links{display:flex;gap:25px;color:#b6bac7;font-size:.64rem;font-weight:700}.footer-bottom{border-top:1px solid #ffffff12;margin-top:30px;padding-top:18px;color:#777d8e;font-size:.57rem;font-weight:600;display:flex;justify-content:space-between}
                    @media(max-width:900px){.navlinks{display:none}.hero{padding-top:115px;min-height:auto}.hero-grid,.experience,.story-layout,.cta-grid{grid-template-columns:1fr;gap:35px}.hero-copy{text-align:center}.hero-copy>p{margin-left:auto;margin-right:auto}.hero-buttons,.hero-proof{justify-content:center}.hero-scene{height:500px}.experience-video{order:-1}.story-copy{text-align:center;padding:0}.story-number{justify-content:center}.lesson-gallery{grid-template-columns:1fr}.gallery-side{grid-template-columns:1fr 1fr}.cta-art{order:-1;height:210px}.footer-top{flex-direction:column}.footer-bottom{flex-direction:column;gap:8px;text-align:center}}
                    @media(max-width:620px){.wrap{width:min(100% - 28px,1180px)}.navactions .login{display:none}.hero h1{font-size:3.25rem}.hero-scene{height:420px}.scene-card{inset:35px 0 0;border-radius:30px 30px 75px 30px}.scene-ring{width:350px;height:350px}.hero-video{width:190px}.hero-note{top:100px;min-width:130px}.char-boy{width:54%;right:0}.char-girl{width:53%;left:0}.bubble{right:24%;bottom:40px}.ribbonin{grid-template-columns:1fr}.ribbonitem{border-left:0;border-bottom:1px solid var(--line);padding:10px}.ribbonitem:last-child{border-bottom:0}.section{padding:78px 0}.section-head{display:block}.head-link{margin-top:18px}.experience-video .lesson-stage{height:260px}.experience-video .stage-word{font-size:2.8rem}.story-art{height:350px}.lesson-gallery .gallery-side{grid-template-columns:1fr}.gallery-main .lesson-stage{height:270px}.footer-links{flex-wrap:wrap;justify-content:center}}
                `}</style>

                <header className="topnav"><div className="wrap navin">
                    <Link href="/" className="brand"><span className="brandmark"><ArabetiLogo /></span><span><b className="brandname">عربيتي</b><small className="brandtag">تعلّم العربية بحب</small></span></Link>
                    <nav className="navlinks"><Link href="/">الرئيسية</Link><Link href="/explore">الدروس</Link><a href="#experience">التجربة</a><a href="#about">عن عربيتي</a></nav>
                    <div className="navactions">{user ? <Link className="join" href={route('dashboard')}>حسابي</Link> : <><Link className="login" href={route('login')}>تسجيل الدخول</Link><Link className="join" href={route('register')}>ابدأ الآن</Link></>}</div>
                </div></header>

                <main>
                    <section className="hero">
                        <div className="wrap hero-grid">
                            <div className="hero-copy">
                                <div className="eyebrow"><i /> تعلّم العربية كما يجب أن تكون</div>
                                <h1>العربية<br /><span>تُحكى.</span> وتُعاش.</h1>
                                <p>في عربيتي، لا تشاهد درساً فقط. تدخل إلى عالم من الحكايات والمواقف والحوارات، وتتعلم العربية مع مجد ولمى خطوةً خطوة عبر دروس فيديو مصممة لتبقى في الذاكرة.</p>
                                <div className="hero-buttons"><Link href="/explore" className="primary">اكتشف الدروس <Arrow /></Link><a href="#experience" className="secondary"><Play size={16} /> شاهد كيف نتعلّم</a></div>
                                <div className="hero-proof"><span className="prooficon"><Check /></span> دروس فيديو قصيرة · شرح بصري · تعلّم بالعربية</div>
                            </div>
                            <div className="hero-scene">
                                <div className="scene-card" /><div className="scene-ring" />
                                <div className="hero-video"><LessonFrame /></div>
                                <div className="hero-note"><small>رحلة اليوم</small><strong>درس جديد <b>●</b></strong><small>مستعدون؟</small></div>
                                <img src={girl} className="char char-girl" alt="لمى" /><img src={boy} className="char char-boy" alt="مجد" />
                                <div className="bubble">هيا نبدأ! ✨</div>
                                <div className="star s1">✦</div><div className="star s2">✦</div>
                            </div>
                        </div>
                    </section>

                    <div className="ribbon"><div className="wrap ribbonin"><div className="ribbonitem"><span className="ribbonicon"><Play size={15}/></span> فيديوهات قصيرة وواضحة</div><div className="ribbonitem"><span className="ribbonicon">✦</span> مجد ولمى معك في كل درس</div><div className="ribbonitem"><span className="ribbonicon">ع</span> تجربة عربية بالكامل</div></div></div>

                    <section className="section" id="experience"><div className="wrap">
                        <div className="section-head"><div className="head-copy"><div className="mini">التجربة أولاً</div><h2>لا نضعك أمام كتاب.<br />نضعك داخل القصة.</h2><p>كل درس في عربيتي مبني ليُرى ويُسمع ويُتذكّر. الشخصيات تتحدث، والفكرة تتحرك أمامك، وأنت تتعلم من خلال التجربة.</p></div><a className="head-link" href="#lessons">شاهد الدروس <Arrow /></a></div>
                        <div className="experience"><div className="experience-copy"><h3>درس واحد يمكن أن يغيّر طريقة تعلّمك.</h3><p>بدلاً من صفحات طويلة وتعريفات جافة، نأخذ المفردة والجملة ونضعها في موقف حي. مجد ولمى يشرحان، يحاوران، ويتركان لك مساحة لتفهم وتجرّب.</p><div className="points"><div className="point"><i><Check /></i> شرح بصري داخل الفيديو</div><div className="point"><i><Check /></i> حوارات طبيعية باللغة العربية</div><div className="point"><i><Check /></i> دروس قصيرة يمكن إكمالها بسهولة</div></div></div><div className="experience-video"><LessonFrame large /></div></div>
                    </div></section>

                    <section className="section cream" id="about"><div className="wrap story-layout"><div className="story-art"><div className="story-bg"/><img src={girl} className="story-girl" alt="لمى"/><img src={boy} className="story-boy" alt="مجد"/><div className="story-card"><b>مجد + لمى</b><span>رفيقا رحلتك في عربيتي</span></div></div><div className="story-copy"><div className="story-number"><b>01</b><span/><b>الشخصيات</b></div><h3>تعلّم مع شخصيات<br />تريد أن تراها من جديد.</h3><p>مجد ولمى ليسا زينة على الصفحة. هما جزء من تجربة التعلّم نفسها. يظهران في الدروس، يتحدثان معك، ويجعلان العربية شيئاً قريباً ومألوفاً.</p><div className="story-quote">«نريد أن يشعر الطالب أنه دخل إلى عالم عربي صغير، وليس إلى منصة دراسية أخرى.»</div></div></div></section>

                    <section className="section soft" id="lessons"><div className="wrap"><div className="section-head"><div className="head-copy"><div className="mini">من داخل عربيتي</div><h2>كل فيديو له حكاية.</h2><p>واجهة بسيطة تترك التركيز للدرس والشخصيات، بدون ازدحام أو عناصر تشتّت الانتباه.</p></div><Link className="head-link" href="/explore">استكشف كل الدروس <Arrow /></Link></div><div className="lesson-gallery"><div className="gallery-main"><LessonFrame large /><div className="gallery-caption"><strong>{lessons[0]?.title || 'رحلة جديدة تبدأ من هنا'}</strong><span>فيديو تعليمي من عربيتي</span></div></div><div className="gallery-side"><div><LessonFrame character={boy}/><div className="gallery-caption"><strong>{lessons[1]?.title || 'نتحدث العربية معاً'}</strong><span>مع مجد</span></div></div><div><LessonFrame character={girl}/><div className="gallery-caption"><strong>{lessons[2]?.title || 'كلمة اليوم'}</strong><span>مع لمى</span></div></div></div></div></div></section>

                    <section className="final-cta"><div className="wrap cta-grid"><div className="cta-copy"><h2>جاهز تدخل عالم عربيتي؟</h2><p>ابدأ من أول فيديو، وتعرّف على الطريقة التي نجعل فيها تعلّم العربية تجربة تحب العودة إليها.</p><Link href={user ? '/explore' : route('register')} className="cta-button">{user ? 'تابع التعلّم' : 'ابدأ رحلتك الآن'} <Arrow /></Link></div><div className="cta-art"><img src={girl} className="cta-girl" alt="لمى"/><img src={boy} className="cta-boy" alt="مجد"/></div></div></section>
                </main>

                <footer className="footer"><div className="wrap"><div className="footer-top"><Link href="/" className="footer-brand"><span className="footer-mark"><ArabetiLogo /></span><b>عربيتي</b></Link><div className="footer-links"><Link href="/">الرئيسية</Link><Link href="/explore">الدروس</Link><Link href="/teachers">المعلمون</Link><Link href="/contact">تواصل معنا</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} عربيتي. جميع الحقوق محفوظة.</span><span>تعلّم العربية بحب.</span></div></div></footer>
            </div>
        </PublicSiteLayout>
    );
}
