import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { usePage } from '@inertiajs/react';

const TOUR_KEY = 'learning-tour-seen';

const sidebarTourSteps = [
    { label: 'لوحة التحكم', title: 'لوحة التحكم', text: 'بدايتك هنا. كل ملخص تقدمك وإحصائياتك في مكان واحد.' },
    { label: 'تعلّمي', title: 'مسار التعلّم', text: 'هنا تكمل رحلتك من آخر درس وصلت إليه. اضغط للمتابعة.' },
    { label: 'الدورات', title: 'دوراتي', text: 'استكشف جميع الدورات المتاحة واختر مغامرتك القادمة.' },
    { label: 'الواجبات', title: 'واجباتي', text: 'أنجز مهامك اليومية واجمع النجوم مع كل إنجاز.' },
    { label: 'الفحوصات', title: 'الفحوصات', text: 'اختبر مهاراتك وأظهر ما تعلّمته في الفحوصات.' },
    { label: 'ملاحظاتي', title: 'ملاحظاتي', text: 'رتّب أفكارك واحتفظ بكل ملاحظاتك المهمة هنا.' },
    { label: 'الشهادات', title: 'شهاداتي', text: 'كل إنجاز تحققه يستحق أن نفتخر به. شهاداتك محفوظة هنا.' },
    { label: 'التقويم', title: 'التقويم', text: 'نظّم وقتك ولا تفوّت أي موعد مهم في رحلتك.' },
    { label: 'غرف الفيديو', title: 'غرف الفيديو', text: 'استعد للقاء تفاعلي ممتع مع معلّمك وزملائك.' },
    { label: 'الكتب', title: 'المكتبة', text: 'افتح كتاباً وابدأ رحلة جديدة مع الكلمات والقصص.' },
    { label: 'الرسائل', title: 'الرسائل', text: 'تواصل مع معلّميك وزملائك بسهولة من هنا.' },
    { label: 'الإشعارات', title: 'الإشعارات', text: 'تابع كل جديد في رحلتك التعليمية لحظة بلحظة.' },
    { label: 'الإعلانات', title: 'الإعلانات', text: 'اكتشف أخبار المدرسة والأنشطة الجديدة أولاً بأول.' },
    { label: 'لوحة النجوم', title: 'لوحة الأبطال', text: 'اجمع النجوم وتقدّم بين أبطال المدرسة. راقب ترتيبك.' },
];

const BOY_CHARACTERS = [
    '/assets/home/characters/boy-hero.png',
    '/assets/home/characters/boy-hero2.png',
    '/assets/home/characters/boy-hero3.png',
    '/assets/home/characters/boy-hero4.png',
];

const GIRL_CHARACTERS = [
    '/assets/home/characters/girl-hero.png',
    '/assets/home/characters/girl-hero2.png',
    '/assets/home/characters/girl-hero3.png',
    '/assets/home/characters/girl-hero4.png',
];

function getCharacterForStep(stepIndex, gender, customChars = {}) {
    const pool = gender === 'female' ? (customChars.girls || GIRL_CHARACTERS) : (customChars.boys || BOY_CHARACTERS);
    return pool[stepIndex % pool.length];
}

function computeDialogPosition(targetRect, dialogWidth = 460, dialogHeight = 320, viewportPadding = 16) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 14;

    const charW = 200;
    const charH = 260;
    const separation = 16;

    const positions = [
        // character left, dialog right
        {
            char: { right: vw - targetRect.left + gap, top: targetRect.top + (targetRect.height - charH) / 2 },
            dialog: { right: vw - targetRect.left + gap + charW + separation, top: targetRect.top + (targetRect.height - dialogHeight) / 2 },
        },
        // character right, dialog left
        {
            char: { left: targetRect.right + gap, top: targetRect.top + (targetRect.height - charH) / 2 },
            dialog: { left: targetRect.right + gap + charW + separation, top: targetRect.top + (targetRect.height - dialogHeight) / 2 },
        },
        // character above, dialog below
        {
            char: { left: targetRect.left + (targetRect.width - charW) / 2, bottom: vh - targetRect.top + gap },
            dialog: { left: targetRect.left + (targetRect.width - dialogWidth) / 2, top: targetRect.bottom + gap + charH + separation },
        },
        // character below, dialog above
        {
            char: { left: targetRect.left + (targetRect.width - charW) / 2, top: targetRect.bottom + gap },
            dialog: { left: targetRect.left + (targetRect.width - dialogWidth) / 2, bottom: vh - targetRect.top + gap + charH + separation },
        },
    ];

    for (const pos of positions) {
        const cl = pos.char.left ?? (vw - (pos.char.right ?? 0) - charW);
        const ct = pos.char.top ?? (vh - (pos.char.bottom ?? 0) - charH);
        const cr = cl + charW;
        const cb = ct + charH;

        const dl = pos.dialog.left ?? (vw - (pos.dialog.right ?? 0) - dialogWidth);
        const dt = pos.dialog.top ?? (vh - (pos.dialog.bottom ?? 0) - dialogHeight);
        const dr = dl + dialogWidth;
        const db = dt + dialogHeight;

        const charOk = cl >= viewportPadding && cr <= vw - viewportPadding && ct >= viewportPadding && cb <= vh - viewportPadding;
        const dialogOk = dl >= viewportPadding && dr <= vw - viewportPadding && dt >= viewportPadding && db <= vh - viewportPadding;

        // ensure no overlap between character and dialog
        const noOverlap = cr <= dl || cl >= dr || cb <= dt || ct >= db;

        if (charOk && dialogOk && noOverlap) {
            return {
                character: { left: cl, top: ct, right: 'auto', bottom: 'auto' },
                dialog: { left: dl, top: dt, right: 'auto', bottom: 'auto' },
            };
        }
    }

    // robust fallback: character top-right, dialog bottom-left
    const cl = Math.max(viewportPadding, vw - charW - 24);
    const ct = Math.max(viewportPadding, 24);
    const dl = Math.max(viewportPadding, 24);
    const dt = Math.min(vh - dialogHeight - viewportPadding, ct + charH + separation);

    return {
        character: { left: cl, top: ct, right: 'auto', bottom: 'auto' },
        dialog: { left: dl, top: dt, right: 'auto', bottom: 'auto' },
    };
}

function buildMaskStyle(targetRect) {
    if (!targetRect) return {};
    const { left, top, width, height } = targetRect;
    const r = 12;
    const pad = 4;

    const l = left - pad;
    const t = top - pad;
    const w = width + pad * 2;
    const h = height + pad * 2;

    const svgMask = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${window.innerWidth}" height="${window.innerHeight}" viewBox="0 0 ${window.innerWidth} ${window.innerHeight}">
            <defs>
                <mask id="ltour-mask" maskUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="${window.innerWidth}" height="${window.innerHeight}" fill="white"/>
                    <rect x="${l}" y="${t}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="black"/>
                </mask>
            </defs>
            <rect x="0" y="0" width="${window.innerWidth}" height="${window.innerHeight}" fill="white" mask="url(#ltour-mask)"/>
        </svg>
    `.replace(/\s+/g, ' ').trim();

    const dataUri = `url("data:image/svg+xml;base64,${btoa(svgMask)}")`;

    return {
        WebkitMaskImage: dataUri,
        maskImage: dataUri,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'cover',
        maskSize: 'cover',
    };
}

const BOY_THEME = {
    '--student': '#1674d1',
    '--student-2': '#38a9eb',
    '--student-soft': '#e8f5ff',
    '--student-border': '#c6e7fb',
    '--student-shadow': 'rgba(22,116,209,.18)',
};

const GIRL_THEME = {
    '--student': '#7546bd',
    '--student-2': '#ae72df',
    '--student-soft': '#f3eafa',
    '--student-border': '#e1cef3',
    '--student-shadow': 'rgba(117,70,189,.18)',
};

const THEME_MAP = {
    boy: BOY_THEME,
    girl: GIRL_THEME,
};

const LearningTourComponent = forwardRef(function LearningTour({ children, autoStart = true, manualOpen = false, onClose = null, userGender = 'male', customCharacters = {}, theme = 'boy' }, ref) {
    const themeVars = THEME_MAP[theme] || BOY_THEME;
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [charPos, setCharPos] = useState(null);
    const [dialogPos, setDialogPos] = useState(null);
    const { url } = usePage();
    const highlightedElRef = useRef(null);

    const shouldAutoStart = useCallback(() => {
        if (manualOpen) return true;
        if (!autoStart) return false;
        try {
            const seen = localStorage.getItem(TOUR_KEY);
            const currentPath = new URL(url, window.location.origin).pathname;
            return !seen && (currentPath === '/' || currentPath === '/dashboard');
        } catch {
            return false;
        }
    }, [url, autoStart, manualOpen]);

    useEffect(() => {
        if (shouldAutoStart()) {
            const timer = setTimeout(() => setIsOpen(true), 800);
            return () => clearTimeout(timer);
        }
    }, [shouldAutoStart]);

    const markAsSeen = () => {
        try { localStorage.setItem(TOUR_KEY, 'true'); } catch {}
    };

    const getTargetEl = useCallback(() => {
        const current = sidebarTourSteps[step];
        if (!current?.label) return null;
        return document.querySelector(`[data-tour-sidebar="${current.label}"]`);
    }, [step]);

    const updateTargetRect = useCallback(() => {
        const el = getTargetEl();
        if (!el) {
            setTargetRect(null);
            setCharPos(null);
            setDialogPos(null);
            highlightedElRef.current = null;
            return;
        }
        const r = el.getBoundingClientRect();
        const newRect = { top: r.top, left: r.left, width: r.width, height: r.height };
        setTargetRect(newRect);

        // Step 0 (first step) fixed center position for better UX
        let pos;
        if (step === 0) {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const dialogWidth = 640;
            const dialogHeight = 380;
            pos = {
                character: { left: 0, top: 0, right: 'auto', bottom: 'auto' }, // unused but kept for API
                dialog: {
                    left: Math.max(16, (vw - dialogWidth) / 2),
                    top: Math.max(16, (vh - dialogHeight) / 2),
                    right: 'auto',
                    bottom: 'auto',
                },
            };
        } else {
            pos = computeDialogPosition(r);
        }

        setCharPos(pos.character);
        setDialogPos(pos.dialog);
        highlightedElRef.current = el;
    }, [getTargetEl, step]);

    const scrollToTarget = useCallback(() => {
        const el = getTargetEl();
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [getTargetEl]);

    useEffect(() => {
        if (!isOpen) return;
        const id = requestAnimationFrame(() => {
            scrollToTarget();
            updateTargetRect();
        });
        const onResize = () => updateTargetRect();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onResize, true);
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onResize, true);
        };
    }, [isOpen, step, scrollToTarget, updateTargetRect]);

    const next = () => {
        const nextStep = step + 1;
        if (nextStep < sidebarTourSteps.length) {
            setStep(nextStep);
        } else {
            markAsSeen();
            setIsOpen(false);
            onClose?.();
        }
    };

    const skip = () => {
        markAsSeen();
        setIsOpen(false);
        onClose?.();
    };

    const current = sidebarTourSteps[step];
    const character = getCharacterForStep(step, userGender, customCharacters);

    useImperativeHandle(ref, () => ({
        openTour() {
            setStep(0);
            setIsOpen(true);
        },
        closeTour() {
            markAsSeen();
            setIsOpen(false);
        },
        isOpen: !!isOpen,
    }));

    if (!isOpen) return <>{children}</>;

    const spotlightStyle = targetRect ? {
        top: targetRect.top - 3,
        left: targetRect.left - 3,
        width: targetRect.width + 6,
        height: targetRect.height + 6,
        ...themeVars,
    } : { display: 'none' };

    const overlayMaskStyle = targetRect ? buildMaskStyle(targetRect) : {};

    const dialogStyle = dialogPos ? {
        ...dialogPos,
        maxWidth: 640,
        width: '96vw',
        ...themeVars,
    } : { display: 'none' };

    return (
        <>
            {children}
            <div className="ltour-overlay" aria-hidden="false" style={{ ...overlayMaskStyle, '--overlay-open': isOpen ? 1 : 0 }}>
                {targetRect && (
                    <div className="ltour-spotlight" style={spotlightStyle} aria-hidden="true">
                        <div className="ltour-spotlight-ring" />
                        <div className="ltour-spotlight-glow" />
                    </div>
                )}

                <div className="ltour-dialog" role="alertdialog" aria-modal="true" aria-labelledby="ltour-title" aria-describedby="ltour-message" style={dialogStyle}>
                    <button type="button" className="ltour-close" onClick={skip} aria-label="تخطي الجولة">×</button>

                    <div className="ltour-header">
                        <img src={character} alt="" className="ltour-character" aria-hidden="true" />
                        <div className="ltour-copy">
                            <span className="ltour-kicker">{step + 1} / {sidebarTourSteps.length}</span>
                            <h2 id="ltour-title">{current.title}</h2>
                            <p id="ltour-message">{current.text}</p>
                        </div>
                    </div>

                    <div className="ltour-dots">
                        {sidebarTourSteps.map((_, i) => (
                            <span
                                key={i}
                                className={`ltour-dot ${i === step ? 'ltour-dot-active' : ''} ${i < step ? 'ltour-dot-done' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="ltour-actions">
                        <button onClick={skip} className="ltour-btn-secondary">تخطي</button>
                        <button onClick={next} className="ltour-btn-primary">
                            {step + 1 === sidebarTourSteps.length ? 'ابدأ رحلتك!' : 'التالي'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
});

export default LearningTourComponent;