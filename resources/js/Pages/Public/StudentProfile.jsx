import PublicSiteLayout from '@/Components/PublicSiteLayout';
import StudentProfileContent from '@/Components/StudentProfileContent';
import { Head, usePage } from '@inertiajs/react';

export default function StudentProfile({ stats = [], recentCourses = [], announcements = [], enrollments = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <PublicSiteLayout>
            <Head title="ملفي الشخصي" />
            <div className="student-space-wrap">
                <StudentProfileContent
                    user={user}
                    stats={stats}
                    recentCourses={recentCourses}
                    announcements={announcements}
                    enrollments={enrollments}
                />
            </div>
        </PublicSiteLayout>
    );
}
