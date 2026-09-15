/**
 * ✨ حبات ضوء منطفةة تطفو في خلفية الهيرو.
 * تُعطي مشهد الـ "cinema" طاقة خافتة — نجوم، غبار، وشرارات خفيفة.
 * الألوان تعتمد على الثيم الفعال (ولد / بنت / عام).
 */
import { useMemo } from 'react';

const COUNT = 34;

// positions ثابتة لضمان استقرار الرسم وتكرار الـ CSS
const SHAPE = [...Array(COUNT).keys()];

export default function CinematicParticles() {
    const particles = useMemo(() => {
        return SHAPE.map((i) => {
            const seed = (i * 9301 + 49297) % 233280; // pseudo-random ثابت
            const rnd = seed / 233280;
            const rnd2 = ((i * 5273) % 233280) / 233280;
            const rnd3 = ((i * 1171) % 233280) / 233280;

            return {
                id: i,
                size: 1.4 + rnd * 3.2,
                left: rnd * 100,
                top: rnd2 * 100,
                // horizontal drift
                drift: rnd3 * 60 - 30,
                delay: rnd * 5,
                duration: 5 + rnd * 4,
                // type: sparkle | dot | streak
                type: rnd < 0.55 ? 'sparkle' : rnd < 0.85 ? 'dot' : 'streak',
            };
        });
    }, []);

    // --pp-color / --pp-glow are inherited from the parent .arabeti-hero
    // which sets them via .char-theme-boy / .char-theme-girl / .char-theme-general
    return (
        <div
            className="cinematic-particles"
            aria-hidden="true"
            role="presentation"
        >
            {particles.map((p) => (
                <span
                    key={p.id}
                    className={`cinematic-particle cinematic-particle--${p.type}`}
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        '--pp-drift': `${p.drift}px`,
                    }}
                />
            ))}
        </div>
    );
}
