import { Link, usePage } from '@inertiajs/react';
import { LogoMark } from '@/Layouts/GuestLayout';

const Icon = ({ d }) => (
    <svg className="h-[18px] w-[18px] shrink-0 stroke-theme-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} fill="rgb(3 4 94 / 0.08)" />
    </svg>
);

const icons = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
    learn: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.908.076-1.747.17-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342',
    courses: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    lessons: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    books: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    assign: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    cert: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
    calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
    stars: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    ratings: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    announce: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511-.523.298-1.18.093-1.487-.444a22.56 22.56 0 01-2.17-5.85m12.44-3.9a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.75a.75.75 0 00-.75.75v.84m0 0a22.5 22.5 0 01-2.17 5.85c-.307.537-.964.742-1.487.444-.523-.3-.71-.96-.463-1.51.4-.892.732-1.822.985-2.783',
    bell: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
    messages: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.199C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
    children: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
    users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    seo: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    google: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
    profile: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    analytics: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    notes: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
};

function navForRole(role) {
    const items = [
        { label: 'لوحة التحكم', href: route('dashboard'), routeName: 'dashboard', icon: icons.dashboard },
    ];

    if (role === 'parent') {
        items.push(
            { label: 'أبنائي', href: route('children.index'), routeName: 'children.*', icon: icons.children },
            { label: 'الشهادات', href: route('certificates.index'), routeName: 'certificates.*', icon: icons.cert },
            { label: 'الإشعارات', href: route('notifications.index'), routeName: 'notifications.*', icon: icons.bell },
            { label: 'الرسائل', href: route('messages.index'), routeName: 'messages.*', icon: icons.messages },
            { label: 'الإعلانات', href: route('announcements.index'), routeName: 'announcements.*', icon: icons.announce },
            { label: 'لوحة النجوم', href: route('stars.leaderboard'), routeName: 'stars.*', icon: icons.stars },
        );
    } else if (role === 'student') {
        items.push(
            { label: 'تعلّمي', href: route('learning.my'), routeName: 'learning.*', icon: icons.learn },
            { label: 'الدورات', href: route('courses.index'), routeName: 'courses.*', icon: icons.courses },
            { label: 'الواجبات', href: route('assignments.index'), routeName: 'assignments.*', icon: icons.assign },
            { label: 'الفحوصات', href: route('exams.index'), routeName: 'exams.*', icon: icons.cert },
            { label: 'ملاحظاتي', href: route('notes.index'), routeName: 'notes.*', icon: icons.notes },
            { label: 'الشهادات', href: route('certificates.index'), routeName: 'certificates.*', icon: icons.cert },
            { label: 'التقويم', href: route('calendar.index'), routeName: 'calendar.*', icon: icons.calendar, divider: 'التفاعل' },
            { label: 'غرف الفيديو', href: route('video-rooms.index'), routeName: 'video-rooms.*', icon: icons.video },
            { label: 'الكتب', href: route('books.index'), routeName: 'books.*', icon: icons.books },
            { label: 'الرسائل', href: route('messages.index'), routeName: 'messages.*', icon: icons.messages },
            { label: 'الإشعارات', href: route('notifications.index'), routeName: 'notifications.*', icon: icons.bell },
            { label: 'الإعلانات', href: route('announcements.index'), routeName: 'announcements.*', icon: icons.announce },
            { label: 'لوحة النجوم', href: route('stars.leaderboard'), routeName: 'stars.*', icon: icons.stars },
        );
    } else {
        items.push(
            { label: 'الدورات', href: route('courses.index'), routeName: 'courses.*', icon: icons.courses },
            { label: 'الدروس', href: route('lessons.index'), routeName: 'lessons.*', icon: icons.lessons },
            { label: 'الكتب', href: route('books.index'), routeName: 'books.*', icon: icons.books },
            { label: 'الواجبات', href: route('assignments.index'), routeName: 'assignments.*', icon: icons.assign },
            { label: 'الفحوصات', href: route('exams.index'), routeName: 'exams.*', icon: icons.cert },
            { label: 'التقارير', href: route('analytics.index'), routeName: 'analytics.*', icon: icons.analytics },
            { label: 'غرف الفيديو', href: route('video-rooms.index'), routeName: 'video-rooms.*', icon: icons.video, divider: 'التفاعل' },
            { label: 'التقويم', href: route('calendar.index'), routeName: 'calendar.*', icon: icons.calendar },
            { label: 'الشهادات', href: route('certificates.index'), routeName: 'certificates.*', icon: icons.cert },
            { label: 'الرسائل', href: route('messages.index'), routeName: 'messages.*', icon: icons.messages },
            { label: 'الإشعارات', href: route('notifications.index'), routeName: 'notifications.*', icon: icons.bell },
            { label: 'الإعلانات', href: route('announcements.index'), routeName: 'announcements.*', icon: icons.announce },
            { label: 'التقييمات', href: route('ratings.index'), routeName: 'ratings.*', icon: icons.ratings },
            { label: 'لوحة النجوم', href: route('stars.leaderboard'), routeName: 'stars.*', icon: icons.stars },
        );
    }

    if (role === 'admin') {
        items.push(
            { label: 'المستخدمون', href: route('users.index'), routeName: 'users.*', icon: icons.users, divider: 'الإدارة' },
            { label: 'ربط الأولياء', href: route('children.index'), routeName: 'children.*', icon: icons.children },
            { label: 'إعدادات SEO', href: route('settings.seo.edit'), routeName: 'settings.seo.*', icon: icons.seo },
            { label: 'إعدادات Google', href: route('settings.google.edit'), routeName: 'settings.google.*', icon: icons.google },
        );
    }

    items.push({ label: 'الملف الشخصي', href: route('profile.edit'), routeName: 'profile.*', icon: icons.profile, divider: 'الحساب' });

    return items;
}

export default function Sidebar({ open, onClose }) {
    const { auth, appName } = usePage().props;
    const items = navForRole(auth.user?.role);

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 transition xl:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={onClose}
            />

            <aside
                className={`fixed inset-y-0 right-0 z-50 flex w-[275px] flex-col px-3 py-3 transition-transform duration-300 xl:static xl:translate-x-0 ${
                    open ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
                }`}
            >
                <div className="box flex h-full flex-col bg-white/[0.95] xl:rounded-xl">
                    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-5">
                        <LogoMark className="!h-11 !w-11 [&_>div]:!h-10 [&_>div]:!w-10" />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                                {appName || 'المدرسة الإلكترونية'}
                            </p>
                            <p className="text-xs text-slate-500">لوحة الإدارة</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
                        {items.map((item) => (
                            <div key={item.label}>
                                {item.divider && (
                                    <div className="mb-2 mt-4 px-2 text-xs text-slate-500">{item.divider}</div>
                                )}
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className={`side-link ${route().current(item.routeName) ? 'side-link-active' : 'side-link-idle'}`}
                                >
                                    <Icon d={item.icon} />
                                    <span>{item.label}</span>
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <div className="m-3 rounded-box border border-slate-100 bg-slate-50 px-3 py-3">
                        <p className="truncate text-sm font-medium text-slate-800">{auth.user?.name}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{auth.user?.email}</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
