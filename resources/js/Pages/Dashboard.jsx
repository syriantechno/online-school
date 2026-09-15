import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const paths = {
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z',
    play: 'M8 5v14l11-7L8 5z', users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2',
    chart: 'M4 19V9m6 10V5m6 14v-7m5 7H2', star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z',
};
const Icon = ({ name, className = 'h-6 w-6' }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} /></svg>;

function StaffDashboard({ user, role, roleLabel, stats, recentCourses, announcements }) {
    const actions = role === 'admin'
        ? [['إعدادات المنصة', route('settings.index'), 'chart'], ['استوديو الدروس', route('lesson-generator.studio'), 'play'], ['إدارة المستخدمين', route('users.index'), 'users'], ['التقارير', route('analytics.index'), 'chart']]
        : role === 'teacher'
            ? [['استوديو الدروس', route('lesson-generator.studio'), 'play'], ['دوراتي', route('courses.index'), 'book'], ['الواجبات', route('assignments.index'), 'chart'], ['غرفة مباشرة', route('video-rooms.create'), 'users']]
            : [['متابعة الأبناء', route('children.index'), 'users'], ['الشهادات', route('certificates.index'), 'star'], ['الرسائل', route('messages.index'), 'book'], ['الإشعارات', route('notifications.index'), 'chart']];
    return <>
        <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-l from-blue-700 to-sky-500 p-6 text-white shadow-lg sm:p-8">
            <p className="text-sm font-bold text-blue-100">{roleLabel}</p>
            <h2 className="mt-2 text-3xl font-black">أهلاً {user.name}</h2>
            <p className="mt-3 text-blue-100">كل أدواتك ومعلوماتك المهمة في مكان واحد.</p>
        </section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {actions.map(([title, href, icon]) => (
                <Link key={title} href={href} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-600"><Icon name={icon} /></span>
                    <h3 className="mt-4 font-black text-slate-900">{title}</h3>
                </Link>
            ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white p-5">
                    <p className="text-xs font-bold text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
            ))}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl bg-white p-5">
                <h3 className="font-black">أحدث الدورات</h3>
                {recentCourses.map((c) => <Link key={c.id} href={route('courses.show', c.id)} className="block border-b py-3">{c.title}</Link>)}
            </section>
            <section className="rounded-2xl bg-white p-5">
                <h3 className="font-black">آخر الإعلانات</h3>
                {announcements.map((a) => <div key={a.id} className="border-b py-3">{a.title}</div>)}
            </section>
        </div>
    </>;
}

export default function Dashboard({ stats = [], recentCourses = [], announcements = [], roleLabel }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout header="لوحة التحكم">
            <Head title="لوحة التحكم" />
            <StaffDashboard user={user} role={user.role} roleLabel={roleLabel} stats={stats} recentCourses={recentCourses} announcements={announcements} />
        </AuthenticatedLayout>
    );
}
