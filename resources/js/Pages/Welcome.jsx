import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import ArabetiLogo from '@/Components/ArabetiLogo';
import { useStudentTheme } from '@/contexts/StudentThemeContext';

const A = '/assets/home/characters/';
const CHAR = {
    majd: `${A}boy-hero.png`,
    lama: `${A}girl-hero.png`,
    majd3d: `${A}boy-3d-1.png`,
    lama3d: `${A}girl-3d-1.png`,
    duo: `${A}boy-girl-3d.png`,
    book: `${A}book.png`,
    game: `${A}game.png`,
    trophy: `${A}ka2s.png`,
    target: `${A}hadaf.png`,
    lamp: `${A}lamp.png`,
    ipad: `${A}ipad.png`,
    think: `${A}think.png`,
};

const worlds = [
    { no: '٠١', title: 'جزيرة الحروف', text: 'نكتشف الحروف والأصوات من خلال اللعب والحكايات.', image: CHAR.book, tone: 'sun' },
    { no: '٠٢', title: 'غابة الكلمات', text: 'نبني مفردات جديدة ونستخدمها في جمل بسيطة.', image: CHAR.game, tone: 'leaf' },
    { no: '٠٣', title: 'مدينة الحكايات', text: 'نقرأ ونفهم ونكتب قصصاً قصيرة مع مجد ولمى.', image: CHAR.think, tone: 'sky' },
    { no: '٠٤', title: 'قلعة الإنجاز', text: 'نجمع النجوم ونفتح مراحل وتحديات جديدة.', image: CHAR.trophy, tone: 'violet' },
];

const steps = [
    ['١', 'نختار بوابتنا', 'العمر والمستوى المناسبان لكل طفل.'],
    ['٢', 'نبدأ المغامرة', 'دروس قصيرة وتحديات ممتعة مع مجد ولمى.'],
    ['٣', 'نجمع النجوم', 'كل إنجاز يفتح شيئاً جديداً في الرحلة.'],
];

const benefits = [
    ['shield', 'بيئة آمنة', 'تجربة مصممة للأطفال بعيداً عن التشتيت.'],
    ['target', 'تعلّم شخصي', 'المحتوى يتدرج مع مستوى الطفل وسرعته.'],
    ['star', 'تحفيز مستمر', 'نجوم وشارات تجعل التقدم مرئياً وممتعاً.'],
    ['chart', 'متابعة للأهل', 'صورة واضحة عن وقت التعلم والإنجاز.'],
];

const reviews = [
    ['سارة أحمد', 'أم لطفلين', 'ابني صار يطلب عربيتي بنفسه. العربية تحولت عنده إلى مغامرة يومية.'],
    ['خالد العلي', 'أب', 'أحببت أن رحلة الطفل واضحة ومفهومة بدون أن يشعر أنه داخل واجب مدرسي.'],
    ['نورة حسن', 'معلمة وأم', 'مجد ولمى أعطيا ابنتي شخصيات تحب العودة إليها كل يوم.'],
];

function Icon({ name, className = 'h-5 w-5' }) {
    const paths = {
        arrow: 'M5 12h14m-7-7 7 7-7 7',
        play: 'M8 5v14l11-7L8 5z',
        shield: 'M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z',
        target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-4a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
        star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z',
        chart: 'M4 19V5m0 14h16M8 17v-6m5 6V7m5 10v-4',
        heart: 'M12 21s-7-4.5-9.5-8.2C.7 10.2 1.3 6.5 4.2 5.1 6.4 4 9 5 12 7.5 15 5 17.6 4 19.8 5.1c2.9 1.4 3.5 5.1 1.7 7.7C19 16.5 12 21 12 21z',
        check: 'm5 13 4 4L19 7',
        menu: 'M4 7h16M4 12h16M4 17h16',
        close: 'm6 6 12 12M18 6 6 18',
    };
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export default function Welcome({ content = {}, courses = [] }) {
    const { isPublicHome } = useStudentTheme();
    const { auth } = usePage().props;
    const user = auth?.user;
    const startRoute = isPublicHome ? route('explore.index') : route('learning.my');
    const heroDesc = content.hero_description || 'منصة عربية أصيلة للأطفال، نحول تعلّم العربية إلى عالم مليء بالقصص واللعب والمغامرات.';
    const [menuOpen, setMenuOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;
        const nodes = root.querySelectorAll('.world-reveal');
        const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        }), { threshold: 0.1 });
        nodes.forEach((node) => io.observe(node));
        return () => io.disconnect();
    }, []);

    const nav = [
        ['الرئيسية', '#top'],
        ['العوالم', '#worlds'],
        ['الرحلة', '#journey'],
        ['مجد ولمى', '#heroes'],
        ['الدورات', '/explore'],
        ['تواصل', '/contact'],
    ];

    return (
        <PublicSiteLayout fullBleed hideFooter hideHeader>
            <Head title="عربيتي">
                <meta name="description" content={heroDesc} />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=baloo+bhaijaan+2:500,600,700,800&display=swap" rel="stylesheet" />
            </Head>

            <div ref={rootRef} className="world-page" id="top" dir="rtl">
                <style>{`
                    .world-page{--ink:#17345f;--blue:#2b69e7;--deep:#1946ad;--yellow:#ffc83d;--orange:#f49a31;--green:#55bd72;--pink:#ef7897;--cream:#fff9e9;--muted:#617493;--font:'Baloo Bhaijaan 2','Cairo',system-ui,sans-serif;background:#fff;color:var(--ink);font-family:var(--font);overflow:hidden}
                    .world-page *{box-sizing:border-box}.world-page a{text-decoration:none}.world-wrap{width:min(1180px,calc(100% - 32px));margin:auto}.world-reveal{opacity:0;transform:translateY(32px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}.world-reveal.visible{opacity:1;transform:none}
                    @keyframes floatA{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-14px) rotate(1deg)}}
                    @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}
                    @keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(25px)}}
                    @keyframes twinkle{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
                    @keyframes shine{0%{left:-80%}100%{left:150%}}
                    .sky-hero{position:relative;min-height:850px;background:linear-gradient(180deg,#d9efff 0%,#eaf7ff 55%,#fff 100%);overflow:hidden;padding:18px 0 0}
                    .sky-hero:after{content:"";position:absolute;inset:auto 0 0;height:210px;background:linear-gradient(180deg,transparent,#fff 76%);z-index:1;pointer-events:none}
                    .topbar{position:relative;z-index:30;background:rgba(255,255,255,.94);border-radius:999px;box-shadow:0 14px 40px rgba(44,91,160,.12);display:flex;align-items:center;gap:18px;padding:7px 9px 7px 20px;direction:ltr}
                    .brand{display:flex;align-items:center;gap:8px;color:var(--blue);font-weight:800;font-size:20px;white-space:nowrap}.brand .arabiti-logo{width:70px;height:auto}.nav{display:none;flex:1;justify-content:center;gap:2px;direction:rtl}.nav a{color:#5c7396;padding:9px 12px;border-radius:999px;font-size:15px;font-weight:700}.nav a:hover{background:#edf5ff;color:var(--blue)}
                    .top-actions{display:flex;align-items:center;gap:7px;margin-right:auto;direction:rtl}.login{color:var(--blue);padding:9px 12px;font-weight:800;font-size:14px}.register,.start-btn{background:var(--blue);color:#fff;padding:10px 18px;border-radius:999px;font-weight:800;box-shadow:0 5px 0 #1b4cae}.register:hover,.start-btn:hover{transform:translateY(-1px)}.menu-btn{border:0;background:#edf5ff;color:var(--blue);border-radius:50%;width:43px;height:43px;display:grid;place-items:center}
                    .mobile-nav{position:absolute;top:64px;left:0;right:0;background:#fff;border-radius:22px;padding:10px;box-shadow:0 18px 50px rgba(24,63,120,.18);display:grid;gap:4px;z-index:50}.mobile-nav a{padding:11px 14px;border-radius:14px;color:var(--ink);font-weight:800}.mobile-nav a:hover{background:#eef6ff}
                    .cloud{position:absolute;background:#fff;border-radius:999px;filter:drop-shadow(0 12px 14px rgba(95,153,198,.12));opacity:.88}.cloud:before,.cloud:after{content:"";position:absolute;background:#fff;border-radius:50%}.cloud:before{width:80px;height:80px;right:20px;bottom:0}.cloud:after{width:55px;height:55px;right:76px;bottom:2px}.c1{width:190px;height:40px;top:170px;left:4%;animation:drift 8s ease-in-out infinite}.c2{width:230px;height:46px;top:285px;right:3%;animation:drift 10s ease-in-out infinite reverse}.c3{width:135px;height:32px;top:430px;left:15%;animation:drift 12s ease-in-out infinite}.sun{position:absolute;width:170px;height:170px;border-radius:50%;background:#ffe79b;top:115px;right:10%;box-shadow:0 0 80px rgba(255,216,113,.65)}
                    .hero-copy{position:relative;z-index:10;width:min(620px,100%);padding-top:95px;margin-right:auto;margin-left:0;text-align:right}.eyebrow{display:inline-flex;align-items:center;gap:7px;background:#fff;border-radius:999px;padding:7px 13px;color:#55739e;font-weight:800;box-shadow:0 8px 25px rgba(46,96,150,.08);font-size:14px}.eyebrow i{width:8px;height:8px;background:#63c979;border-radius:50%;display:block}.hero-copy h1{font-size:clamp(48px,7vw,88px);line-height:.98;margin:20px 0 18px;letter-spacing:-2px;font-weight:800;color:#193f78}.hero-copy h1 strong{color:var(--blue);position:relative}.hero-copy h1 strong:after{content:"";position:absolute;bottom:-4px;right:5%;width:92%;height:10px;border-radius:50%;background:#ffd66a;z-index:-1;transform:rotate(-2deg)}.hero-copy p{font-size:21px;line-height:1.75;color:var(--muted);max-width:550px;margin:0 0 25px;font-weight:600}.hero-actions{display:flex;align-items:center;gap:15px;flex-wrap:wrap}.hero-primary{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:10px;background:var(--blue);color:#fff;border-radius:18px;padding:14px 23px;font-size:18px;font-weight:800;box-shadow:0 8px 0 #194ba9,0 18px 30px rgba(43,105,231,.2)}.hero-primary:after{content:"";position:absolute;top:0;bottom:0;width:45%;background:rgba(255,255,255,.25);transform:skewX(-18deg);animation:shine 3.5s infinite}.hero-secondary{display:inline-flex;align-items:center;gap:9px;color:#527096;font-weight:800;padding:13px}.play{width:43px;height:43px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--blue);box-shadow:0 8px 25px rgba(45,88,140,.13)}
                    .world-stage{position:absolute;z-index:8;left:2%;bottom:0;width:min(650px,55vw);height:560px}.hill{position:absolute;bottom:-120px;width:620px;height:360px;border-radius:50% 50% 0 0;background:#bfe6b0;transform:rotate(-7deg)}.hill.two{right:-180px;bottom:-100px;background:#9fd596;transform:rotate(8deg)}.path{position:absolute;bottom:0;left:20%;width:390px;height:260px;border-radius:50% 50% 0 0;background:#f8e4b5;transform:rotate(-14deg)}.tree{position:absolute;bottom:175px;width:55px;height:150px}.tree:before{content:"";position:absolute;bottom:0;left:22px;width:14px;height:90px;background:#8c653f;border-radius:10px}.tree:after{content:"";position:absolute;top:0;left:0;width:58px;height:70px;background:#69bd72;border-radius:50% 50% 45% 45%;box-shadow:20px 22px 0 #54ad67,-20px 22px 0 #77c97a}.tree.t1{left:3%;transform:scale(.85)}.tree.t2{left:38%;bottom:145px;transform:scale(1.15)}.tree.t3{right:2%;bottom:165px;transform:scale(.72)}
                    .hero-duo{position:absolute;z-index:14;bottom:120px;left:24%;width:390px;max-height:470px;object-fit:contain;filter:drop-shadow(0 25px 22px rgba(43,72,101,.18));animation:floatA 5s ease-in-out infinite}.hero-star{position:absolute;z-index:16;color:#ffc83d;font-size:42px;animation:twinkle 2.5s infinite}.s1{left:17%;top:130px}.s2{left:48%;top:205px;animation-delay:.7s}.s3{left:9%;bottom:285px;animation-delay:1.2s}.hero-note{position:absolute;z-index:18;left:8%;bottom:115px;background:#fff;border-radius:20px;padding:12px 17px;box-shadow:0 15px 35px rgba(47,80,125,.15);font-weight:800;color:#42648d;animation:floatB 4s ease-in-out infinite}.hero-note b{color:var(--blue)}
                    .ground-dots{position:absolute;bottom:85px;right:0;left:0;height:20px;background:radial-gradient(circle,#69bd72 2px,transparent 3px) 0 0/25px 18px;opacity:.35}

                    .intro{padding:100px 0 80px;background:#fff;text-align:center}.kicker{display:inline-block;color:#e99019;background:#fff3d0;border-radius:999px;padding:6px 14px;font-weight:800;font-size:14px}.section-title{font-size:clamp(38px,5vw,62px);line-height:1.05;margin:13px 0;color:#1b467e;font-weight:800}.section-lead{max-width:650px;margin:0 auto;color:var(--muted);font-size:18px;line-height:1.8;font-weight:600}
                    .map{position:relative;margin-top:55px;min-height:650px;border-radius:48px;background:#dff2ff;overflow:hidden;box-shadow:inset 0 -80px 0 #bfe4aa}.map:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 16% 25%,#fff 0 10px,transparent 11px),radial-gradient(circle at 78% 19%,#fff 0 7px,transparent 8px),radial-gradient(circle at 62% 55%,#fff 0 12px,transparent 13px);opacity:.7}.map-path{position:absolute;left:13%;right:13%;top:47%;height:130px;border:17px dashed #f0bd66;border-radius:50%;transform:rotate(-7deg);opacity:.9}.map-badge{position:absolute;top:27px;right:28px;background:#fff;border-radius:18px;padding:9px 15px;font-weight:800;color:#527198;box-shadow:0 10px 24px rgba(49,95,143,.12)}.world-node{position:absolute;width:220px;min-height:190px;text-align:center}.node-art{width:100px;height:100px;object-fit:contain;filter:drop-shadow(0 12px 10px rgba(45,77,103,.13));animation:floatB 4.5s ease-in-out infinite}.node-house{width:150px;height:105px;margin:auto;border-radius:55% 55% 18px 18px;background:#fff;border:7px solid #f6cf67;position:relative;box-shadow:0 13px 0 rgba(96,153,112,.12)}.node-house:before{content:"";position:absolute;top:-48px;left:13px;border-left:58px solid transparent;border-right:58px solid transparent;border-bottom:55px solid #f39c39}.node-house:after{content:"";position:absolute;bottom:0;left:58px;width:35px;height:53px;background:#a6d8f4;border-radius:9px 9px 0 0}.node-label{display:inline-block;margin-top:12px;background:#fff;border-radius:999px;padding:6px 14px;font-weight:800;box-shadow:0 8px 20px rgba(49,95,143,.1)}.n1{top:75px;left:8%}.n2{top:100px;right:8%}.n3{bottom:70px;left:29%}.n4{bottom:62px;right:20%}.node-label.sun{color:#d88411}.node-label.leaf{color:#3e9d58}.node-label.sky{color:#3475c9}.node-label.violet{color:#7957c9}

                    .journey{padding:100px 0;background:#fffaf0;position:relative;overflow:hidden}.journey:before{content:"";position:absolute;top:0;left:0;right:0;height:90px;background:#fff;border-radius:0 0 50% 50%}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:55px;position:relative}.steps:before{content:"";position:absolute;top:83px;left:16%;right:16%;border-top:4px dashed #efc76b}.step{position:relative;background:#fff;border-radius:32px;padding:28px;text-align:center;box-shadow:0 18px 50px rgba(77,102,130,.09);z-index:1}.step-no{width:66px;height:66px;border-radius:50%;display:grid;place-items:center;margin:-5px auto 16px;background:#ffd66a;color:#80591a;font-size:27px;font-weight:800;box-shadow:0 7px 0 #e8b94c}.step h3{font-size:25px;margin:0 0 7px;color:#234b80}.step p{color:var(--muted);line-height:1.7;margin:0;font-size:16px;font-weight:600}

                    .heroes{padding:110px 0 100px;background:#e9f7ff;position:relative;overflow:hidden}.heroes:before,.heroes:after{content:"";position:absolute;border-radius:50%;background:#d2f0ff}.heroes:before{width:480px;height:480px;right:-170px;top:60px}.heroes:after{width:330px;height:330px;left:-130px;bottom:-120px}.heroes-inner{display:grid;grid-template-columns:1fr 1.1fr;align-items:center;gap:60px;position:relative;z-index:2}.hero-characters{height:470px;position:relative}.character{position:absolute;bottom:0;width:300px;height:440px;object-fit:contain;filter:drop-shadow(0 25px 22px rgba(44,83,112,.16))}.character.majd{right:6%;animation:floatA 5s infinite}.character.lama{left:0;animation:floatB 4.5s infinite}.speech{position:absolute;background:#fff;border-radius:22px;padding:10px 16px;font-weight:800;box-shadow:0 12px 30px rgba(46,90,130,.12);z-index:5}.speech.one{right:3%;top:45px;color:#2d69df}.speech.two{left:0;top:105px;color:#e67e28}.hero-text h2{font-size:clamp(42px,5vw,64px);line-height:1.05;margin:13px 0;color:#1d467c}.hero-text p{color:var(--muted);font-size:19px;line-height:1.8;font-weight:600}.name-row{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap}.name-tag{background:#fff;border-radius:18px;padding:10px 16px;box-shadow:0 9px 22px rgba(49,95,143,.1);font-weight:800;color:#315e91}.name-tag span{display:block;font-size:12px;color:#8497b1;font-weight:600}

                    .benefits{padding:95px 0;background:#fff}.benefit-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-top:48px}.benefit{border:1px solid #edf1f5;border-radius:25px;padding:25px 20px;background:#fff;box-shadow:0 12px 34px rgba(55,78,110,.055)}.benefit-icon{width:50px;height:50px;border-radius:16px;background:#edf5ff;color:var(--blue);display:grid;place-items:center;margin-bottom:14px}.benefit h3{margin:0 0 5px;font-size:21px}.benefit p{margin:0;color:var(--muted);line-height:1.65;font-size:14px;font-weight:600}

                    .parent-zone{padding:100px 0;background:#f8fbff}.parent-box{background:#1d4e91;border-radius:42px;padding:55px;display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center;overflow:hidden;position:relative;color:#fff}.parent-box:before{content:"";position:absolute;width:430px;height:430px;border-radius:50%;background:rgba(255,255,255,.07);left:-130px;bottom:-190px}.parent-copy{position:relative;z-index:2}.parent-copy .kicker{background:rgba(255,255,255,.14);color:#ffe08a}.parent-copy h2{font-size:clamp(38px,4vw,58px);line-height:1.05;margin:15px 0}.parent-copy p{color:#d8e8ff;font-size:18px;line-height:1.8}.parent-list{display:grid;gap:10px;margin-top:25px}.parent-list span{display:flex;align-items:center;gap:9px;font-weight:700}.parent-list i{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#7bd28b;color:#185e2b}.parent-art{min-height:300px;position:relative;display:grid;place-items:center}.parent-art img{max-width:360px;max-height:330px;object-fit:contain;filter:drop-shadow(0 25px 25px rgba(0,0,0,.18));animation:floatA 5s infinite}.parent-orb{position:absolute;width:160px;height:160px;border-radius:50%;border:1px dashed rgba(255,255,255,.3);animation:drift 7s infinite}

                    .voices{padding:100px 0;background:#fff}.review-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}.review{background:#fffaf0;border-radius:28px;padding:28px;position:relative;border:1px solid #f5ead1}.review:before{content:"“";position:absolute;top:4px;left:22px;font-size:70px;color:#f3c75d;line-height:1}.stars{color:#f2ad28;letter-spacing:3px;font-size:18px}.review p{font-size:17px;line-height:1.8;color:#506887;font-weight:600;margin:20px 0}.review b{display:block;font-size:17px}.review small{color:#8a9bb0}

                    .courses{padding:90px 0;background:#f1f8ff}.course-strip{display:flex;gap:16px;overflow:auto;padding:12px 2px 25px;margin-top:35px}.course-card{min-width:270px;background:#fff;border-radius:25px;padding:23px;box-shadow:0 14px 35px rgba(44,79,119,.08)}.course-art{height:110px;background:#eaf5ff;border-radius:19px;display:grid;place-items:center;margin-bottom:17px}.course-art img{height:100px;max-width:150px;object-fit:contain}.course-card h3{font-size:21px;margin:0 0 5px}.course-card p{margin:0;color:var(--muted);font-size:14px}.course-more{display:flex;justify-content:center;margin-top:10px}

                    .cta{padding:100px 0 110px;background:#fff}.cta-box{position:relative;overflow:hidden;background:linear-gradient(135deg,#2d6fe9,#4f8ef1);border-radius:42px;text-align:center;color:#fff;padding:65px 25px;box-shadow:0 25px 70px rgba(43,105,231,.22)}.cta-box:before,.cta-box:after{content:"✦";position:absolute;color:#ffd966;font-size:45px;animation:twinkle 2s infinite}.cta-box:before{top:25px;right:8%}.cta-box:after{bottom:20px;left:9%;animation-delay:1s}.cta-box h2{font-size:clamp(40px,5vw,64px);line-height:1.05;margin:0 0 12px}.cta-box p{font-size:19px;color:#e5efff;margin:0 auto 25px;max-width:600px}.cta-box a{display:inline-flex;background:#fff;color:#2256ba;border-radius:17px;padding:13px 24px;font-size:18px;font-weight:800;box-shadow:0 7px 0 #cbdcff}

                    .footer{background:#173b70;color:#d7e7ff;padding:55px 0 25px}.footer-main{display:flex;align-items:center;justify-content:space-between;gap:25px}.footer-brand{display:flex;align-items:center;gap:10px;color:#fff;font-size:20px;font-weight:800}.footer-brand .arabiti-logo{width:74px;filter:brightness(0) invert(1)}.footer-links{display:flex;gap:18px;flex-wrap:wrap}.footer-links a{color:#d7e7ff;font-weight:700}.footer-copy{border-top:1px solid rgba(255,255,255,.12);margin-top:30px;padding-top:18px;text-align:center;font-size:13px;color:#9eb6d8}

                    @media(min-width:980px){.nav{display:flex}.menu-btn{display:none}}
                    @media(max-width:979px){.sky-hero{min-height:1000px}.hero-copy{padding-top:70px;text-align:center;margin:auto}.hero-copy p{margin-inline:auto}.hero-actions{justify-content:center}.world-stage{left:50%;transform:translateX(-50%);width:680px;max-width:100vw;bottom:-25px}.hero-duo{left:50%;transform:translateX(-50%);width:350px}.hero-note{left:8%}.heroes-inner{grid-template-columns:1fr}.hero-text{text-align:center;order:1}.hero-characters{order:2}.name-row{justify-content:center}.benefit-grid{grid-template-columns:repeat(2,1fr)}.parent-box{grid-template-columns:1fr;text-align:center}.parent-list{justify-items:center}.review-grid{grid-template-columns:1fr}.parent-art{min-height:260px}.map{min-height:760px}.n1{top:60px;left:4%}.n2{top:245px;right:2%}.n3{bottom:190px;left:3%}.n4{bottom:40px;right:15%}.steps{grid-template-columns:1fr}.steps:before{display:none}}
                    @media(max-width:620px){.world-wrap{width:min(100% - 22px,1180px)}.topbar{padding:6px 7px 6px 13px}.brand{font-size:17px}.brand .arabiti-logo{width:60px}.top-actions .login{display:none}.register{padding:9px 13px}.sky-hero{min-height:900px}.hero-copy{padding-top:58px}.hero-copy h1{font-size:52px}.hero-copy p{font-size:17px}.hero-primary{font-size:16px}.hero-secondary{font-size:14px}.world-stage{height:430px}.hero-duo{width:290px;bottom:100px}.hill{width:500px;height:280px}.path{width:300px}.hero-note{bottom:82px;font-size:13px}.sun{width:120px;height:120px;top:110px;right:4%}.intro,.journey,.heroes,.benefits,.parent-zone,.voices,.courses,.cta{padding-top:72px;padding-bottom:72px}.section-title{font-size:43px}.section-lead{font-size:16px}.map{border-radius:30px;min-height:690px}.world-node{width:155px}.node-art{width:78px;height:78px}.node-house{width:110px;height:80px}.node-house:before{top:-36px;border-left-width:43px;border-right-width:43px;border-bottom-width:40px}.node-house:after{left:43px;width:26px;height:40px}.n1{top:48px}.n2{top:225px}.n3{bottom:185px}.n4{bottom:35px}.node-label{font-size:13px}.benefit-grid{grid-template-columns:1fr}.parent-box{padding:35px 22px;border-radius:30px}.character{width:230px;height:350px}.hero-characters{height:400px}.character.majd{right:4%}.character.lama{left:-4%}.speech{font-size:12px;padding:7px 11px}.footer-main{flex-direction:column;text-align:center}.footer-links{justify-content:center}.course-card{min-width:245px}}
                    @media(prefers-reduced-motion:reduce){.world-page *{animation:none!important;transition:none!important}.world-reveal{opacity:1;transform:none}}
                `}</style>

                <section className="sky-hero">
                    <div className="world-wrap">
                        <div className="topbar">
                            <Link href="/" className="brand"><ArabetiLogo /><span>عربيتي</span></Link>
                            <nav className="nav">
                                {nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
                            </nav>
                            <div className="top-actions">
                                {user ? (
                                    <Link href={startRoute} className="start-btn">ابدأ رحلتك</Link>
                                ) : (
                                    <><Link href={route('login')} className="login">دخول</Link><Link href={route('register')} className="register">إنشاء حساب</Link></>
                                )}
                                <button type="button" className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="القائمة">
                                    <Icon name={menuOpen ? 'close' : 'menu'} />
                                </button>
                            </div>
                            {menuOpen && <div className="mobile-nav">{nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</div>}
                        </div>
                    </div>

                    <div className="sun" /><div className="cloud c1" /><div className="cloud c2" /><div className="cloud c3" />
                    <div className="world-wrap" style={{ position: 'relative', zIndex: 10 }}>
                        <div className="hero-copy world-reveal">
                            <span className="eyebrow"><i /> عالم عربي صُمم للطفل</span>
                            <h1>العربية صارت<br /><strong>مغامرة!</strong></h1>
                            <p>{heroDesc}</p>
                            <div className="hero-actions">
                                <Link href={startRoute} className="hero-primary">ابدأ المغامرة <Icon name="arrow" /></Link>
                                <a href="#worlds" className="hero-secondary"><span className="play"><Icon name="play" className="h-4 w-4" /></span> اكتشف العالم</a>
                            </div>
                        </div>
                    </div>

                    <div className="world-stage" aria-hidden="true">
                        <div className="hill" /><div className="hill two" /><div className="path" />
                        <div className="tree t1" /><div className="tree t2" /><div className="tree t3" />
                        <img className="hero-duo" src={CHAR.duo} alt="مجد ولمى" />
                        <span className="hero-star s1">✦</span><span className="hero-star s2">✦</span><span className="hero-star s3">✦</span>
                        <div className="hero-note">مع <b>مجد ولمى</b> كل درس مغامرة</div><div className="ground-dots" />
                    </div>
                </section>

                <section className="intro" id="worlds">
                    <div className="world-wrap">
                        <div className="world-reveal"><span className="kicker">العالم الذي ينتظرنا</span><h2 className="section-title">هيا نفتح الخريطة!</h2><p className="section-lead">بدلاً من صفحات مملة، الطفل يدخل عالماً حقيقياً من الأماكن والشخصيات والتحديات. كل مهارة جديدة تفتح طريقاً جديداً.</p></div>
                        <div className="map world-reveal">
                            <span className="map-badge">خريطة عربيتي ✦</span><div className="map-path" />
                            {worlds.map((w, i) => <div key={w.no} className={`world-node n${i + 1}`}><div className="node-house" />{w.image && <img className="node-art" src={w.image} alt="" />}<span className={`node-label ${w.tone}`}>{w.no} · {w.title}</span></div>)}
                        </div>
                    </div>
                </section>

                <section className="journey" id="journey">
                    <div className="world-wrap">
                        <div className="world-reveal" style={{ textAlign: 'center' }}><span className="kicker">الطريق واضح</span><h2 className="section-title">ثلاث خطوات ونبدأ</h2><p className="section-lead">رحلة بسيطة للطفل، ومفهومة للأهل من أول يوم.</p></div>
                        <div className="steps">{steps.map(([n, title, text], i) => <article className={`step world-reveal d${i + 1}`} key={n}><div className="step-no">{n}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
                    </div>
                </section>

                <section className="heroes" id="heroes">
                    <div className="world-wrap heroes-inner">
                        <div className="hero-characters world-reveal"><span className="speech one">هيا يا مجد!</span><span className="speech two">لنكتشف معاً ✦</span><img className="character majd" src={CHAR.majd} alt="مجد" /><img className="character lama" src={CHAR.lama} alt="لمى" /></div>
                        <div className="hero-text world-reveal"><span className="kicker">رفاق الرحلة</span><h2>مجد ولمى<br />مو مجرد شخصيات.</h2><p>هما رفيقا الطفل في كل خطوة: يشرحان، يلعبان، يحتفلان بالإنجاز، ويجعلان العودة إلى الدرس شيئاً ينتظره الطفل.</p><div className="name-row"><div className="name-tag">مجد<span>المستكشف الشجاع</span></div><div className="name-tag">لمى<span>رفيقة القراءة والقصص</span></div></div></div>
                    </div>
                </section>

                <section className="benefits">
                    <div className="world-wrap"><div className="world-reveal" style={{ textAlign: 'center' }}><span className="kicker">صُمم بعناية</span><h2 className="section-title">كل شيء له سبب</h2><p className="section-lead">تجربة مرحة من الخارج، ومدروسة من الداخل.</p></div><div className="benefit-grid">{benefits.map(([icon, title, text], i) => <article className={`benefit world-reveal d${i + 1}`} key={title}><div className="benefit-icon"><Icon name={icon} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div>
                </section>

                <section className="parent-zone">
                    <div className="world-wrap"><div className="parent-box world-reveal"><div className="parent-copy"><span className="kicker">وللأهل مكانهم أيضاً</span><h2>شاهد الرحلة،<br />ولا تقاطعها.</h2><p>تصل للأهل صورة واضحة عن تقدّم الطفل بدون تحويل عالمه الجميل إلى لوحة تحكم مزدحمة.</p><div className="parent-list"><span><i><Icon name="check" className="h-4 w-4" /></i> وقت التعلم والإنجازات</span><span><i><Icon name="check" className="h-4 w-4" /></i> المهارات التي تحسّنت</span><span><i><Icon name="check" className="h-4 w-4" /></i> الخطوة التالية في الرحلة</span></div></div><div className="parent-art"><span className="parent-orb" /><img src={CHAR.ipad} alt="متابعة تعلم الطفل" /></div></div></div>
                </section>

                <section className="voices">
                    <div className="world-wrap"><div className="world-reveal" style={{ textAlign: 'center' }}><span className="kicker">من عائلات عربيتي</span><h2 className="section-title">أصوات من الرحلة</h2></div><div className="review-grid">{reviews.map(([name, role, text], i) => <article className={`review world-reveal d${i + 1}`} key={name}><div className="stars">★★★★★</div><p>{text}</p><b>{name}</b><small>{role}</small></article>)}</div></div>
                </section>

                {courses.length > 0 && <section className="courses"><div className="world-wrap"><div className="world-reveal" style={{ textAlign: 'center' }}><span className="kicker">جاهز للانطلاق؟</span><h2 className="section-title">بعض بوابات التعلم</h2><p className="section-lead">استكشف الدورات المتاحة وابدأ من المكان المناسب.</p></div><div className="course-strip">{courses.slice(0, 6).map((course, i) => <article className="course-card world-reveal" key={course.id ?? i}><div className="course-art">{course.image ? <img src={course.image} alt="" /> : <img src={i % 2 ? CHAR.book : CHAR.game} alt="" />}</div><h3>{course.title ?? course.name ?? 'دورة تعليمية'}</h3><p>{course.description ?? 'رحلة جديدة تنتظرك.'}</p></article>)}</div><div className="course-more"><Link href="/explore" className="hero-secondary">مشاهدة كل الدورات <Icon name="arrow" /></Link></div></div></section>}

                <section className="cta"><div className="world-wrap"><div className="cta-box world-reveal"><h2>جاهزين للمغامرة؟</h2><p>افتحوا أول بوابة، واتركوا مجد ولمى يقودان الطفل في رحلة يحب العودة إليها.</p><Link href={startRoute}>ابدأ رحلة عربيتي <Icon name="arrow" /></Link></div></div></section>

                <footer className="footer"><div className="world-wrap"><div className="footer-main"><Link href="/" className="footer-brand"><ArabetiLogo /> عربيتي</Link><div className="footer-links">{nav.slice(1).map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div></div><div className="footer-copy">© {new Date().getFullYear()} عربيتي · نتعلم العربية بحب</div></div></footer>
            </div>
        </PublicSiteLayout>
    );
}
