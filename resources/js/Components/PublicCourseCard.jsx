import { formatDuration } from '@/Components/PublicSiteLayout';
import CourseCardActions from '@/Components/CourseCardActions';

export default function PublicCourseCard({ course, index = 0, showDescription = false }) {
    return (
        <article className="home-pro-course group flex h-full min-h-[300px] flex-col overflow-hidden">
            <div className="home-pro-course-media">
                {course.cover_url ? (
                    <img src={course.cover_url} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                ) : (
                    <div className="home-pro-course-fallback" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zm0 0A2.5 2.5 0 006.5 22H20" />
                        </svg>
                    </div>
                )}
                <span className="home-pro-course-tag">{course.subject || 'اللغة العربية'}</span>
            </div>

            <div className="flex min-h-[180px] flex-1 flex-col p-4">
                <h3 className="line-clamp-2 min-h-[3rem] text-[0.95rem] font-black leading-7 text-[var(--site-text)]">
                    {course.title}
                </h3>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="home-pro-chip">{course.level || 'كل المستويات'}</span>
                    <span className="home-pro-chip">{course.lessons_count || 0} درس</span>
                    <span className="home-pro-chip">{formatDuration(course.total_minutes)}</span>
                </div>

                {showDescription && (
                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-[var(--site-muted)]">
                        {course.description || 'دورة تفاعلية في اللغة العربية'}
                    </p>
                )}

                <div className="mt-auto pt-3">
                    <CourseCardActions course={course} />
                </div>
            </div>
        </article>
    );
}
