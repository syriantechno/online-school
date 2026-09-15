const cards = [
    {
        key: 'letters',
        title: 'الحروف',
        text: 'نطق لطيف وواضح',
        tone: 'a',
        icon: (
            <span className="arabeti-chip-letter" aria-hidden="true">أ</span>
        ),
    },
    {
        key: 'read',
        title: 'القراءة',
        text: 'قصص قصيرة ممتعة',
        tone: 'b',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zm0 0A2.5 2.5 0 006.5 22H20" />
            </svg>
        ),
    },
];

function Spark({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M12 1.6l1.55 6.1 6.1 1.55-6.1 1.55L12 16.9l-1.55-6.1-6.1-1.55 6.1-1.55L12 1.6zm7.2 11.2l.85 3.35 3.35.85-3.35.85-.85 3.35-.85-3.35-3.35-.85 3.35-.85.85-3.35z"
            />
        </svg>
    );
}

/**
 * مشهد الهيرو: كروت هادئة + نجوم تطفي وتشعل
 */
export default function HeroOrbitScene({
    showPair,
    primarySrc,
    primaryAlt,
    secondarySrc,
    secondaryAlt,
}) {
    return (
        <div className={`arabeti-stage ${showPair ? 'is-pair' : 'is-solo'}`}>
            <div className="arabeti-orbit-cards" aria-hidden="true">
                {cards.map((card) => (
                    <article key={card.key} className={`arabeti-orbit-card arabeti-orbit-card-${card.key}`}>
                        <span className={`arabeti-orbit-chip tone-${card.tone}`}>{card.icon}</span>
                        <span>
                            <strong>{card.title}</strong>
                            <small>{card.text}</small>
                        </span>
                    </article>
                ))}
            </div>

            <div className="arabeti-twinkles" aria-hidden="true">
                <Spark className="arabeti-twinkle t1" />
                <Spark className="arabeti-twinkle t2" />
                <Spark className="arabeti-twinkle t3" />
                <Spark className="arabeti-twinkle t4" />
                <Spark className="arabeti-twinkle t5" />
                <Spark className="arabeti-twinkle t6" />
            </div>

            <span className="arabeti-stage-glow" aria-hidden="true" />

            {showPair ? (
                <>
                    <div className="arabeti-fig-slot">
                        <img src={primarySrc} alt={primaryAlt} className="hero-character arabeti-fig-a" />
                    </div>
                    <div className="arabeti-fig-slot">
                        <img src={secondarySrc} alt={secondaryAlt} className="hero-character hero-character-left arabeti-fig-b" />
                    </div>
                </>
            ) : (
                <div className="arabeti-fig-solo-wrap">
                    <img src={primarySrc} alt={primaryAlt} className="hero-character arabeti-fig-solo" />
                </div>
            )}
        </div>
    );
}
