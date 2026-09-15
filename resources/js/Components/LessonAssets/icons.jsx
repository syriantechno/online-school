const svgProps = {
    viewBox: '0 0 120 120',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
};

function Balloon({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <ellipse cx="60" cy="48" rx="32" ry="38" fill="#60A5FA" />
            <ellipse cx="48" cy="34" rx="8" ry="12" fill="#BFDBFE" opacity="0.7" />
            <path d="M60 86 L54 98 H66 Z" fill="#F472B6" />
            <path d="M60 98 C52 108 68 112 60 118" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function Duck({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <ellipse cx="58" cy="72" rx="34" ry="22" fill="#FACC15" />
            <circle cx="78" cy="46" r="20" fill="#FDE047" />
            <circle cx="86" cy="42" r="3.5" fill="#0F172A" />
            <path d="M96 48 L112 52 L96 58 Z" fill="#FB923C" />
            <path d="M40 84 Q34 96 44 98" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <path d="M54 86 Q50 98 60 100" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
        </svg>
    );
}

function Door({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <rect x="28" y="18" width="64" height="84" rx="8" fill="#F9A8D4" />
            <rect x="36" y="26" width="48" height="68" rx="4" fill="#FBCFE8" />
            <circle cx="72" cy="60" r="5" fill="#BE185D" />
            <rect x="24" y="100" width="72" height="8" rx="2" fill="#FDA4AF" />
        </svg>
    );
}

function Apple({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <path d="M60 34 C40 34 28 52 30 72 C32 94 48 104 60 104 C72 104 88 94 90 72 C92 52 80 34 60 34 Z" fill="#F87171" />
            <path d="M60 34 C54 24 62 16 70 18" stroke="#65A30D" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="48" cy="58" rx="7" ry="11" fill="#FECACA" opacity="0.8" />
        </svg>
    );
}

function Fish({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <ellipse cx="58" cy="60" rx="34" ry="22" fill="#38BDF8" />
            <path d="M90 60 L110 42 V78 Z" fill="#0EA5E9" />
            <circle cx="42" cy="54" r="4" fill="#0F172A" />
            <path d="M58 48 Q66 60 58 72" stroke="#0284C7" strokeWidth="3" />
        </svg>
    );
}

function Flower({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <circle cx="60" cy="42" r="12" fill="#FDE047" />
            <circle cx="42" cy="42" r="14" fill="#FB7185" />
            <circle cx="78" cy="42" r="14" fill="#FB7185" />
            <circle cx="50" cy="26" r="14" fill="#F472B6" />
            <circle cx="70" cy="26" r="14" fill="#F472B6" />
            <circle cx="50" cy="58" r="14" fill="#F9A8D4" />
            <circle cx="70" cy="58" r="14" fill="#F9A8D4" />
            <path d="M60 68 V102" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
            <path d="M60 86 Q42 78 36 90" stroke="#4ADE80" strokeWidth="5" fill="none" />
        </svg>
    );
}

function House({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <path d="M20 58 L60 22 L100 58 Z" fill="#FDBA74" />
            <rect x="34" y="58" width="52" height="42" fill="#FED7AA" />
            <rect x="52" y="72" width="16" height="28" fill="#EA580C" />
            <rect x="40" y="66" width="12" height="12" fill="#7DD3FC" />
            <rect x="68" y="66" width="12" height="12" fill="#7DD3FC" />
        </svg>
    );
}

function Moon({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <path d="M70 20 C40 24 28 54 40 82 C52 104 84 108 100 90 C70 96 48 70 54 44 C58 30 64 24 70 20 Z" fill="#FDE68A" />
            <circle cx="62" cy="52" r="3" fill="#F59E0B" opacity="0.5" />
            <circle cx="50" cy="68" r="2.5" fill="#F59E0B" opacity="0.45" />
        </svg>
    );
}

function Star({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <path d="M60 14 L70 44 H102 L76 64 L86 96 L60 76 L34 96 L44 64 L18 44 H50 Z" fill="#FACC15" />
        </svg>
    );
}

function Tree({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <rect x="52" y="72" width="16" height="30" rx="3" fill="#A16207" />
            <circle cx="60" cy="48" r="30" fill="#4ADE80" />
            <circle cx="42" cy="56" r="18" fill="#22C55E" />
            <circle cx="78" cy="56" r="18" fill="#22C55E" />
        </svg>
    );
}

function Cat({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <ellipse cx="60" cy="70" rx="30" ry="24" fill="#FDBA74" />
            <circle cx="60" cy="44" r="22" fill="#FED7AA" />
            <path d="M42 30 L36 12 L52 26 Z" fill="#FDBA74" />
            <path d="M78 30 L84 12 L68 26 Z" fill="#FDBA74" />
            <circle cx="52" cy="42" r="3" fill="#0F172A" />
            <circle cx="68" cy="42" r="3" fill="#0F172A" />
            <path d="M56 52 H64" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function Book({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <path d="M24 30 H56 V96 H24 C20 96 18 92 18 88 V38 C18 34 20 30 24 30 Z" fill="#60A5FA" />
            <path d="M96 30 H64 V96 H96 C100 96 102 92 102 88 V38 C102 34 100 30 96 30 Z" fill="#93C5FD" />
            <rect x="56" y="30" width="8" height="66" fill="#1D4ED8" />
        </svg>
    );
}

function Pencil({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <path d="M34 78 L78 34 L90 46 L46 90 Z" fill="#FBBF24" />
            <path d="M78 34 L90 46 L100 36 L88 24 Z" fill="#F472B6" />
            <path d="M34 78 L26 98 L46 90 Z" fill="#FDBA74" />
            <path d="M30 90 L26 98 L34 94 Z" fill="#0F172A" />
        </svg>
    );
}

function Cloud({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <ellipse cx="48" cy="64" rx="28" ry="20" fill="#E2E8F0" />
            <ellipse cx="72" cy="60" rx="30" ry="24" fill="#F1F5F9" />
            <ellipse cx="58" cy="52" rx="22" ry="18" fill="#FFFFFF" />
        </svg>
    );
}

function Camel({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <ellipse cx="58" cy="68" rx="34" ry="18" fill="#D97706" />
            <path d="M40 54 Q48 28 60 34 Q72 28 78 52" fill="#F59E0B" />
            <circle cx="88" cy="52" r="14" fill="#FBBF24" />
            <circle cx="94" cy="48" r="2.5" fill="#0F172A" />
            <path d="M40 82 V100" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
            <path d="M70 84 V102" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
        </svg>
    );
}

function Sun({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <circle cx="60" cy="60" r="24" fill="#FACC15" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                    key={deg}
                    x1="60"
                    y1="60"
                    x2={60 + Math.cos((deg * Math.PI) / 180) * 48}
                    y2={60 + Math.sin((deg * Math.PI) / 180) * 48}
                    stroke="#F59E0B"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
            ))}
        </svg>
    );
}

function Watermelon({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <path d="M20 70 A40 40 0 0 1 100 70 L60 110 Z" fill="#4ADE80" />
            <path d="M28 70 A32 32 0 0 1 92 70 L60 98 Z" fill="#FB7185" />
            <circle cx="48" cy="78" r="3" fill="#0F172A" />
            <circle cx="62" cy="84" r="3" fill="#0F172A" />
            <circle cx="74" cy="76" r="3" fill="#0F172A" />
        </svg>
    );
}

function Girl({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <circle cx="60" cy="40" r="18" fill="#FED7AA" />
            <path d="M36 40 Q60 8 84 40" fill="#0F172A" />
            <rect x="42" y="58" width="36" height="40" rx="12" fill="#F9A8D4" />
            <circle cx="53" cy="38" r="2.5" fill="#0F172A" />
            <circle cx="67" cy="38" r="2.5" fill="#0F172A" />
        </svg>
    );
}

function Boy({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <circle cx="60" cy="40" r="18" fill="#FED7AA" />
            <path d="M40 34 Q60 18 80 34" fill="#1D4ED8" />
            <rect x="42" y="58" width="36" height="40" rx="12" fill="#93C5FD" />
            <circle cx="53" cy="38" r="2.5" fill="#0F172A" />
            <circle cx="67" cy="38" r="2.5" fill="#0F172A" />
        </svg>
    );
}

function Milk({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <rect x="38" y="28" width="44" height="72" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="4" />
            <rect x="38" y="28" width="44" height="18" fill="#F472B6" />
            <rect x="48" y="56" width="24" height="28" rx="4" fill="#E2E8F0" />
        </svg>
    );
}

function Key({ className = 'h-full w-full' }) {
    return (
        <svg {...svgProps} className={className}>
            <circle cx="42" cy="48" r="18" fill="#FACC15" />
            <circle cx="42" cy="48" r="8" fill="#FEF3C7" />
            <rect x="56" y="42" width="42" height="12" rx="4" fill="#EAB308" />
            <rect x="84" y="54" width="8" height="14" fill="#CA8A04" />
            <rect x="72" y="54" width="8" height="10" fill="#CA8A04" />
        </svg>
    );
}

const icons = {
    balloon: Balloon,
    duck: Duck,
    door: Door,
    apple: Apple,
    fish: Fish,
    flower: Flower,
    house: House,
    moon: Moon,
    star: Star,
    tree: Tree,
    cat: Cat,
    book: Book,
    pencil: Pencil,
    cloud: Cloud,
    camel: Camel,
    sun: Sun,
    watermelon: Watermelon,
    girl: Girl,
    boy: Boy,
    milk: Milk,
    key: Key,
};

export function LessonIcon({ name, className = 'h-16 w-16', title }) {
    const Icon = icons[name] || Star;
    return (
        <span className={`inline-flex items-center justify-center ${className}`} title={title || name}>
            <Icon className="h-full w-full" />
        </span>
    );
}

export const iconNames = Object.keys(icons);
export default icons;
