/**
 * حروف عربيتي بخط ثلث/خطاطي (زينة موزّعة)
 * الحروف من اسم المنصة: ع · ر · ب · ي · ت
 */
const SETS = {
    hero: [
        { ch: 'ع', className: 'brand-letter-xl brand-letter-tr brand-rot-a' },
        { ch: 'ر', className: 'brand-letter-lg brand-letter-tl brand-rot-b' },
        { ch: 'ب', className: 'brand-letter-md brand-letter-ml brand-rot-c' },
        { ch: 'ي', className: 'brand-letter-lg brand-letter-bl brand-rot-d' },
        { ch: 'ت', className: 'brand-letter-md brand-letter-br brand-rot-e' },
        { ch: 'ع', className: 'brand-letter-sm brand-letter-mr brand-rot-f' },
        { ch: 'ي', className: 'brand-letter-md brand-letter-tc brand-rot-a' },
        { ch: 'ب', className: 'brand-letter-sm brand-letter-bc brand-rot-c' },
    ],
    path: [
        { ch: 'ر', className: 'brand-letter-xl brand-letter-tl brand-rot-b' },
        { ch: 'ب', className: 'brand-letter-lg brand-letter-tr brand-rot-a' },
        { ch: 'ي', className: 'brand-letter-md brand-letter-ml brand-rot-e' },
        { ch: 'ت', className: 'brand-letter-lg brand-letter-br brand-rot-d' },
        { ch: 'ع', className: 'brand-letter-sm brand-letter-bl brand-rot-c' },
        { ch: 'ر', className: 'brand-letter-md brand-letter-mr brand-rot-f' },
    ],
    parents: [
        { ch: 'ع', className: 'brand-letter-lg brand-letter-tr brand-rot-a' },
        { ch: 'ب', className: 'brand-letter-md brand-letter-tl brand-rot-b' },
        { ch: 'ي', className: 'brand-letter-sm brand-letter-mr brand-rot-e' },
        { ch: 'ت', className: 'brand-letter-md brand-letter-bl brand-rot-d' },
        { ch: 'ر', className: 'brand-letter-sm brand-letter-br brand-rot-c' },
    ],
    courses: [
        { ch: 'ي', className: 'brand-letter-lg brand-letter-tl brand-rot-b' },
        { ch: 'ر', className: 'brand-letter-md brand-letter-tr brand-rot-a' },
        { ch: 'ع', className: 'brand-letter-sm brand-letter-ml brand-rot-f' },
        { ch: 'ب', className: 'brand-letter-md brand-letter-br brand-rot-e' },
        { ch: 'ت', className: 'brand-letter-sm brand-letter-bl brand-rot-c' },
    ],
    cta: [
        { ch: 'ع', className: 'brand-letter-xl brand-letter-tr is-on-dark brand-rot-a' },
        { ch: 'ر', className: 'brand-letter-lg brand-letter-tl is-on-dark brand-rot-b' },
        { ch: 'ب', className: 'brand-letter-md brand-letter-mr is-on-dark brand-rot-c' },
        { ch: 'ي', className: 'brand-letter-lg brand-letter-bl is-on-dark brand-rot-d' },
        { ch: 'ت', className: 'brand-letter-md brand-letter-br is-on-dark brand-rot-e' },
    ],
    footer: [
        { ch: 'ع', className: 'brand-letter-lg brand-letter-tl is-on-dark brand-rot-b' },
        { ch: 'ر', className: 'brand-letter-md brand-letter-tr is-on-dark brand-rot-a' },
        { ch: 'ي', className: 'brand-letter-sm brand-letter-ml is-on-dark brand-rot-f' },
        { ch: 'ت', className: 'brand-letter-md brand-letter-br is-on-dark brand-rot-e' },
        { ch: 'ب', className: 'brand-letter-sm brand-letter-bl is-on-dark brand-rot-c' },
    ],
};

export default function BrandLetters({ variant = 'hero' }) {
    const letters = SETS[variant] || SETS.hero;
    return (
        <div className="brand-letters" aria-hidden="true">
            {letters.map((item, i) => (
                <span key={`${item.ch}-${item.className}-${i}`} className={`brand-letter ${item.className}`}>
                    {item.ch}
                </span>
            ))}
        </div>
    );
}
