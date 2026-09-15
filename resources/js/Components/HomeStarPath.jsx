import { Link } from '@inertiajs/react';

const A = '/assets/home/characters';

const levels = [
    { id: 1, title: 'التأسيس', hint: 'أساس لغوي متين', icon: `${A}/lamp.png`, tint: 'a' },
    { id: 2, title: 'الابتدائي', hint: 'قراءة وكتابة', icon: `${A}/book.png`, tint: 'b' },
    { id: 3, title: 'المتوسط', hint: 'فهم وتحليل', icon: `${A}/think.png`, tint: 'c' },
    { id: 4, title: 'الإعدادي', hint: 'نحو وتعبير', icon: `${A}/pag.png`, tint: 'd' },
    { id: 5, title: 'الثانوي', hint: 'بلاغة متقدمة', icon: `${A}/ipad.png`, tint: 'e' },
    { id: 6, title: 'الإتقان', hint: 'طلاقة وثقة', icon: `${A}/ka2s.png`, tint: 'f' },
];

/**
 * مسار المراحل — بطاقات أفقية بأيقونات ولمعة هوفر.
 * يضيف نجمة صاحبة منطفة تطير فوق المسار لإحساس بالحركة السينمائية.
 */
export default function HomeStarPath({ startHref }) {
    return (
        <div className="arabeti-path-scene">
            <ol className="arabeti-path-rail" aria-label="مسار التعلّم">
                {levels.map((level, index) => (
                    <li
                        key={level.id}
                        className={`arabeti-path-step tint-${level.tint}`}
                        style={{ '--d': index }}
                    >
                        <Link href={startHref} className="arabeti-path-link">
                            <span className="arabeti-path-shine" aria-hidden="true" />
                            <span className="arabeti-path-icon-wrap" aria-hidden="true">
                                <img src={level.icon} alt="" className="arabeti-path-icon" />
                            </span>
                            <span className="arabeti-path-copy">
                                <strong>{level.title}</strong>
                                <small>{level.hint}</small>
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>
            {/* نجمة الرحلة المنطفة */}
            <span className="arabeti-path-star" aria-hidden="true" />
        </div>
    );
}
