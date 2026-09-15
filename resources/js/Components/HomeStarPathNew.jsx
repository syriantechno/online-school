import { Link } from '@inertiajs/react';
import BrandLetters from '@/Components/BrandLetters';

const levels = [
    { id: 1, title: 'التأسيس', hint: 'أساس لغوي متين' },
    { id: 2, title: 'الابتدائي', hint: 'قراءة وكتابة' },
    { id: 3, title: 'المتوسط', hint: 'فهم وتحليل' },
    { id: 4, title: 'الإعدادي', hint: 'نحو وتعبير' },
    { id: 5, title: 'الثانوي', hint: 'بلاغة متقدمة' },
    { id: 6, title: 'الإتقان', hint: 'طلاقة وثقة' },
];

const icons = {
    1: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z',
    2: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zm0 0A2.5 2.5 0 006.5 22H20',
    3: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    4: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6-3.3V15c0 2.5-2.7 4.5-6 4.5S6 17.5 6 15v-4.3L12 14z',
    5: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    6: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
};

function Icon({ name, className = 'h-6 w-6' }) {
    return (
        <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d={icons[name]} />
        </svg>
    );
}

export default function HomeStarPathNew({ startHref }) {
    return (
        <section className="n-section n-section-path" aria-labelledby="path-heading">
            <BrandLetters variant="path" />
            <div className="n-wrap">
                <div className="n-section-head cinematic-reveal">
                    <span className="n-kicker-pill">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></svg>
                        مسار التعلّم
                    </span>
                    <h2 id="path-heading">من التأسيس… إلى <em>الإتقان</em></h2>
                    <p>رحلة عبر المراحل الدراسية — من البداية حتى الصفوف العليا.</p>
                </div>
                <div className="n-path-scene">
                    <ol className="n-path-rail">
                        {levels.map((level, index) => (
                            <li key={level.id} className={`n-path-step`} style={{ '--i': index }}>
                                <Link href={startHref} className="n-path-link">
                                    <span className="n-path-icon"><Icon name={level.id} /></span>
                                    <span className="n-path-copy">
                                        <strong>{level.title}</strong>
                                        <small>{level.hint}</small>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}