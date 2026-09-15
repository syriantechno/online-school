import { Link, router, usePage } from '@inertiajs/react';
import SiteIcon from '@/Components/SiteIcon';
import { loginForCourse } from '@/utils/authRedirect';

export default function CourseCardActions({ course, className = '' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const enrolledCourseIds = auth?.enrolledCourseIds ?? [];
    const isEnrolled = Boolean(course.is_enrolled) || enrolledCourseIds.includes(course.id);
    const browseHref = course.slug ? route('explore.show', course.slug) : route('explore.index');

    const handleSubscribe = () => {
        if (!course.slug || !course.id) {
            router.visit(route('explore.index'));
            return;
        }
        if (!user) {
            window.location.href = loginForCourse(course);
            return;
        }
        router.post(route('courses.enroll', course.id), {}, {
            preserveScroll: true,
            onSuccess: () => router.visit(route('explore.show', course.slug)),
        });
    };

    if (isEnrolled) {
        return (
            <div className={className}>
                <Link href={browseHref} className="site-btn site-btn-primary site-btn-sm h-10 w-full">
                    <SiteIcon name="play" />
                    تابع التعلّم
                </Link>
            </div>
        );
    }

    return (
        <div className={`flex gap-2 ${className}`}>
            <button
                type="button"
                onClick={handleSubscribe}
                className="site-btn site-btn-accent site-btn-sm h-10 flex-1"
            >
                <SiteIcon name="star" />
                اشترك
            </button>
            <Link
                href={browseHref}
                className="site-btn site-btn-ghost site-btn-sm h-10 flex-1"
            >
                <SiteIcon name="book" />
                تصفح
            </Link>
        </div>
    );
}
