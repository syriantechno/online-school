import { useState } from 'react';
import { Link } from '@inertiajs/react';
import BrandLetters from '@/Components/BrandLetters';
import PublicCourseCard from '@/Components/PublicCourseCard';

const icons = {
    play: 'M8 5v14l11-7L8 5z',
    arrow: 'M19 12H5m7-7l-7 7 7 7',
    graduation: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6-3.3V15c0 2.5-2.7 4.5-6 4.5S6 17.5 6 15v-4.3L12 14z',
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
};

const Icon = ({ name, className = 'h-5 w-5' }) => (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d={icons[name]} />
    </svg>
);

const reviews = [
    ['صار ابني يطلب الدرس بنفسه، والتقارير تساعدني أعرف أين أدعمه في البيت.', 'أم يزن', 'وليّة أمر'],
    ['واجهة واضحة، والدروس قصيرة تناسب تركيز الطفل دون إرهاق.', 'أبو كريم', 'ولي أمر'],
    ['أحب النجوم والقصص، وصرت أقرأ أكثر من قبل.', 'سارة', 'طالبة'],
];

export default function HomeLowerSections({ start, courses = [], content = {} }) {
    const [review, setReview] = useState(0);
    const shown = courses.length
        ? courses.slice(0, 6)
        : [
            { id: 'demo-a', slug: null, title: 'أساسيات اللغة العربية', subject: 'التأسيس', level: 'تأسيس–ابتدائي', lessons_count: 12, total_minutes: 180, teacher: { name: 'قريباً' } },
            { id: 'demo-b', slug: null, title: 'فهم النصوص والتعبير', subject: 'القراءة', level: 'متوسط–إعدادي', lessons_count: 8, total_minutes: 120, teacher: { name: 'قريباً' } },
            { id: 'demo-c', slug: null, title: 'النحو والبلاغة', subject: 'اللغة', level: 'إعدادي–ثانوي', lessons_count: 10, total_minutes: 150, teacher: { name: 'قريباً' } },
        ];

    const ctaTitle = content.cta_title || 'جاهزون للبداية؟';
    const ctaDesc = content.cta_description || 'اختر دورة مناسبة لعمر طفلك، وابدأ أول درس اليوم.';

    return (
        <>
            <section id="courses" className="home-pro-section arabeti-section" aria-labelledby="courses-heading">
                <BrandLetters variant="courses" />
                <div className="home-pro-wrap">
                    <div className="arabeti-section-head">
                        <span className="arabeti-kicker-pill">
                            <Icon name="play" />
                            الدورات
                        </span>
                        <h2 id="courses-heading">ابدأ من دورة <em>واضحة</em></h2>
                        <p>عدد الدروس والمدة ظاهرة مسبقاً — بدون تشتيت.</p>
                    </div>
                    <div className="arabeti-courses-grid cinematic-courses">
                        {shown.map((course, idx) => (
                            <div key={course.id} className="cinematic-course-wrapper" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <PublicCourseCard course={course} index={idx} />
                            </div>
                        ))}
                    </div>
                    <div className="arabeti-courses-more">
                        <Link href={route('explore.index')} className="site-btn site-btn-ghost site-btn-sm cinematic-btn cinematic-btn-ghost cinematic-btn-sm">
                            <Icon name="arrow" className="h-4 w-4" />
                            كل الدورات
                        </Link>
                    </div>
                </div>
            </section>

            <section className="home-pro-section home-pro-section-soft arabeti-section cinematic-reveal" aria-labelledby="reviews-heading">
                <BrandLetters variant="courses" />
                <div className="home-pro-wrap home-pro-reviews">
                    <div className="arabeti-section-head home-pro-section-head-start">
                        <span className="arabeti-kicker-pill">
                            <Icon name="users" />
                            آراء العائلات
                        </span>
                        <h2 id="reviews-heading">ثقة الأهل… <em>ومتعة الطفل</em></h2>
                        <div className="home-pro-review-dots" role="tablist" aria-label="آراء">
                            {reviews.map((r, i) => (
                                <button
                                    key={r[1]}
                                    type="button"
                                    role="tab"
                                    aria-selected={review === i}
                                    aria-label={`رأي ${r[1]}`}
                                    onClick={() => setReview(i)}
                                    className={`home-pro-review-dot ${review === i ? 'is-active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                    <blockquote className="home-pro-review-card">
                        <p key={review} className="review-enter">“{reviews[review][0]}”</p>
                        <footer>
                            <span className="home-pro-review-avatar" aria-hidden="true">{reviews[review][1][0]}</span>
                            <cite>
                                <strong>{reviews[review][1]}</strong>
                                <small>{reviews[review][2]}</small>
                            </cite>
                        </footer>
                    </blockquote>
                </div>
            </section>

            <section className="arabeti-section cinematic-reveal" aria-label="ابدأ الآن">
                <div className="home-pro-wrap">
                    <div className="home-pro-cta-band">
                        <BrandLetters variant="cta" />
                        <div className="home-pro-cta-inner">
                            <div>
                                <h2 className="cinematic-cta-title">{ctaTitle}</h2>
                                <p>{ctaDesc}</p>
                            </div>
                            <div className="home-pro-cta-row">
                                <Link href={route('explore.index')} className="site-btn site-btn-accent cinematic-btn cinematic-btn-primary min-h-[52px] px-8">
                                    <Icon name="play" className="h-5 w-5" />
                                    تصفّح الدورات
                                </Link>
                                <Link href={start} className="site-btn site-btn-ghost site-btn-on-dark cinematic-btn cinematic-btn-ghost min-h-[52px] px-7">
                                    <Icon name="graduation" className="h-5 w-5" />
                                    ابدأ من هنا
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
