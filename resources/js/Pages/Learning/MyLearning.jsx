import PublicSiteLayout from '@/Components/PublicSiteLayout';
import SiteIcon from '@/Components/SiteIcon';
import { Head, Link } from '@inertiajs/react';

const cardPictures = {
    courses: '/assets/home/characters/card-pic2.png',
    completed: '/assets/home/characters/card-pic5.png',
    progress: '/assets/home/characters/card-pic4.png',
    assignments: '/assets/home/characters/card-pic1.png',
    exams: '/assets/home/characters/card-pic4.png',
};

export default function MyLearning({ continueItems = [], pendingAssignments = [], pendingExams = [], stats = {} }) {
    const statCards = [
        ['دوراتي', stats.courses ?? 0, cardPictures.courses],
        ['مكتملة', stats.completed ?? 0, cardPictures.completed],
        ['متوسط التقدّم', `${stats.avg_progress ?? 0}%`, cardPictures.progress],
    ];

    return (
        <PublicSiteLayout title="تعلّمي">
            <Head title="تعلّمي" />
            <div className="learning-public-wrap">
                <div className="learning-stat-grid">
                    {statCards.map(([label, value, picture], index) => (
                        <article key={label} className={`learning-stat-card learning-stat-${index + 1}`}>
                            <span className="learning-card-orb" aria-hidden="true" />
                            <div><small>{label}</small><strong>{value}</strong></div>
                            <img src={picture} alt="" aria-hidden="true" />
                        </article>
                    ))}
                </div>

                <section className="learning-panel learning-journey-panel">
                    <div className="learning-panel-heading">
                        <div><span>خطوتك التالية</span><h2>تابع من حيث توقفت</h2></div>
                        <Link href={route('explore.index')}>استكشف الدورات ←</Link>
                    </div>
                    {continueItems.length === 0 ? (
                        <div className="learning-empty">
                            <img src={cardPictures.courses} alt="" />
                            <div>
                                <strong>رحلتك بانتظارك!</strong>
                                <p>اختر دورة وابدأ مغامرة جديدة في اللغة العربية.</p>
                            </div>
                            <Link href={route('explore.index')} className="site-btn site-btn-primary site-btn-sm mt-4 inline-flex">
                                <SiteIcon name="book" />
                                تصفّح الدورات
                            </Link>
                        </div>
                    ) : (
                        <div className="learning-course-grid">
                            {continueItems.map((item) => (
                                <article key={item.enrollment.id} className="learning-course-card">
                                    <span className="learning-course-art" aria-hidden="true"><img src={cardPictures.courses} alt="" /></span>
                                    <div className="learning-course-copy">
                                        <Link href={item.course.slug ? route('explore.show', item.course.slug) : route('courses.show', item.course.id)}>{item.course.title}</Link>
                                        <small>{item.course.teacher?.name || 'المعلّم'} · أنجزت {item.enrollment.progress_percent}%</small>
                                        <div className="learning-progress" aria-label={`نسبة التقدم ${item.enrollment.progress_percent}%`}>
                                            <span style={{ width: `${item.enrollment.progress_percent}%` }} />
                                        </div>
                                        {item.next_lesson && <p>التالي: {item.next_lesson.title}</p>}
                                    </div>
                                    <div className="learning-course-actions">
                                        <Link href={item.course.slug ? route('explore.show', item.course.slug) : route('courses.path', item.course.id)} className="learning-secondary-button">الدورة</Link>
                                        {item.next_lesson ? (
                                            <Link href={item.course.slug ? route('explore.learn', { course: item.course.slug, lesson: item.next_lesson.id }) : route('lessons.show', item.next_lesson.id)} className="learning-primary-button">متابعة ←</Link>
                                        ) : (
                                            <Link href={route('certificates.index')} className="learning-primary-button">الشهادة</Link>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <div className="learning-panels-grid">
                    <LearningTasks title="واجبات معلّقة" kicker="أنجز واجباتك" href={route('assignments.index')} items={pendingAssignments} picture={cardPictures.assignments} empty="لا واجبات معلّقة. أحسنت!" action="تسليم" routeName="assignments.show" />
                    <LearningTasks title="فحوصات بانتظارك" kicker="اختبر مهاراتك" href={route('exams.index')} items={pendingExams} picture={cardPictures.exams} empty="لا فحوصات معلّقة حالياً." action="ابدأ" routeName="exams.show" exam />
                </div>
            </div>
        </PublicSiteLayout>
    );
}

function LearningTasks({ title, kicker, href, items, picture, empty, action, routeName, exam = false }) {
    return (
        <section className="learning-panel learning-task-panel">
            <div className="learning-panel-heading">
                <div><span>{kicker}</span><h2>{title}</h2></div>
                <Link href={href}>عرض الكل ←</Link>
            </div>
            {items.length === 0 ? (
                <div className="learning-empty learning-empty-small">
                    <img src={picture} alt="" />
                    <div><strong>{empty}</strong><p>استمر بالتعلّم وجمع النجوم.</p></div>
                </div>
            ) : (
                <div className="learning-task-list">
                    {items.map((item) => (
                        <article key={item.id} className="learning-task-card">
                            <span className="learning-task-art"><img src={picture} alt="" aria-hidden="true" /></span>
                            <div>
                                <strong>{item.title}</strong>
                                <small>{item.course?.title}{exam && item.duration_minutes ? ` · ${item.duration_minutes} دقيقة` : ''}{exam ? ` · ${item.questions_count || 0} سؤال` : ''}</small>
                            </div>
                            <Link href={route(routeName, item.id)}>{action} ←</Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
