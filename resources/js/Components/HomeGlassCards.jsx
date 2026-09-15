import { Link, route } from '@inertiajs/react';
import BrandLetters from '@/Components/BrandLetters';

const lessonFlow = [
    { n: '01', title: 'أتعلّم', text: 'مفهوم واضح يناسب مرحلتك.' },
    { n: '02', title: 'أتدرّب', text: 'تمارين قصيرة تثبّت الفهم.' },
    { n: '03', title: 'أختبر', text: 'أسئلة تقيس ما استوعبته.' },
    { n: '04', title: 'أتقدّم', text: 'تنتقل للخطوة التالية بثقة.' },
];

const parentPillars = [
    { title: 'بيئة آمنة', text: 'محتوى مناسب ومتابعة واضحة لما يتعلّمه طفلك.' },
    { title: 'تقارير للأهل', text: 'تقدم الدروس، النجوم، ونقاط تحتاج دعماً.' },
    { title: 'معلمون متخصصون', text: 'مسارات مرتّبة حسب العمر والمستوى.' },
];

const iconPaths = {
    book: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zm0 0A2.5 2.5 0 006.5 22H20',
    play: 'M8 5v14l11-7L8 5z',
    users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m7-10a4 4 0 100-8 4 4 0 000 8zm13 10v-2a4 4 0 00-3-3.87m-2-7.26a4 4 0 010 7.75',
    check: 'M20 6L9 17l-5-5',
    star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z',
};

function Icon({ name, className = 'h-5 w-5' }) {
    return (
        <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[name]} />
        </svg>
    );
}

export default function HomeGlassCards({ start, courses = [], liveStats = [] }) {
    return (
        <>
            {/* قسم كيف يعمل الدرس */}
            <section className="n-section n-section-glass" aria-labelledby="lesson-flow-heading">
                <BrandLetters variant="path" />
                <div className="n-wrap">
                    <div className="n-section-head cinematic-reveal">
                        <span className="n-kicker-pill">
                            <Icon name="book" />
                            كيف يعمل الدرس
                        </span>
                        <h2 id="lesson-flow-heading">أربع خطوات <em>واضحة</em></h2>
                        <p>درس مركّز: تتعلّم، تتدرّب، تختبر، وتتقدّم بثقة.</p>
                    </div>
                    <div className="n-glass-grid">
                        {lessonFlow.map((step, i) => (
                            <article key={step.n} className="n-glass-card cinematic-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                                <span className="n-glass-n">{step.n}</span>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* قسم الأهل */}
            <section className="n-section n-section-glass n-section-soft" aria-labelledby="parents-heading">
                <BrandLetters variant="parents" />
                <div className="n-wrap">
                    <div className="n-section-head cinematic-reveal">
                        <span className="n-kicker-pill">
                            <Icon name="users" />
                            مساحة الأهل
                        </span>
                        <h2 id="parents-heading">اطمئنّوا… التقدم <em>واضح</em></h2>
                        <p>متابعة بسيطة ومهنية بدون ضوضاء بصرية.</p>
                    </div>
                    <div className="n-glass-grid n-glass-grid-3">
                        {parentPillars.map((item, i) => (
                            <article key={item.title} className="n-glass-card cinematic-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </article>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Link href={route('marketing.pricing')} className="n-btn n-btn-ghost n-btn-sm">
                            خطط الاشتراك
                        </Link>
                    </div>
                </div>
            </section>

            {/* قسم الإحصائيات */}
            {liveStats.length > 0 && (
                <section className="n-section n-section-stats" aria-labelledby="stats-heading">
                    <div className="n-wrap">
                        <div className="n-stats-grid">
                            {liveStats.map((s) => (
                                <div key={s.key ?? s.label} className="n-stat-card cinematic-reveal">
                                    <strong className="n-stat-val">{s.value}</strong>
                                    <span className="n-stat-label">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}