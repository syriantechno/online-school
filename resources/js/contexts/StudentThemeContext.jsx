import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

const STORAGE_KEY = 'student-login-theme';
/** ثيم الزائر على الرئيسية — غير محدد الجنس */
export const PUBLIC_SITE_THEME = 'general';

const THEME_CLASSES = ['site-theme-boy', 'site-theme-girl', 'site-theme-general'];

const StudentThemeContext = createContext(null);

function readStoredTheme() {
    if (typeof window === 'undefined') {
        return 'boy';
    }

    return window.localStorage.getItem(STORAGE_KEY) === 'girl' ? 'girl' : 'boy';
}

export function pagePath(url) {
    if (!url) {
        return '/';
    }

    try {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return new URL(url).pathname.replace(/\/$/, '') || '/';
        }
    } catch {
        // ignore invalid URL
    }

    return url.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
}

export function isPublicHomepage(page) {
    return pagePath(page?.url) === '/';
}

export function themeFromGender(gender) {
    return gender === 'female' ? 'girl' : 'boy';
}

function themeFromUser(user) {
    if (!user) {
        return null;
    }

    return themeFromGender(user.gender);
}

export function applyThemeClass(theme) {
    const root = document.documentElement;
    root.classList.remove(...THEME_CLASSES);
    if (theme === 'girl') {
        root.classList.add('site-theme-girl');
    } else if (theme === 'general') {
        root.classList.add('site-theme-general');
    } else {
        root.classList.add('site-theme-boy');
    }
}

export function resolveSiteTheme({ user, guestPreview, pageUrl }) {
    const isStudent = user?.role === 'student';
    const onPublicHome = pagePath(pageUrl) === '/';

    const accountTheme = isStudent && user
        ? themeFromUser(user)
        : guestPreview;

    // الصفحة الرئيسية للزوار → ثيم عام (مو ولد/بنت)
    const theme = onPublicHome && !user
        ? PUBLIC_SITE_THEME
        : accountTheme;

    return { theme, accountTheme, onPublicHome, isStudent };
}

export function StudentThemeProvider({ children }) {
    const page = usePage();
    const { auth } = page.props;
    const user = auth?.user;

    const [guestPreview, setGuestPreview] = useState(() => readStoredTheme());

    const { theme, accountTheme, onPublicHome, isStudent } = useMemo(
        () => resolveSiteTheme({
            user,
            guestPreview,
            pageUrl: typeof window !== 'undefined' ? window.location.pathname : page.url,
        }),
        [user, guestPreview, page.url],
    );

    useEffect(() => {
        applyThemeClass(theme);

        if (isStudent && user && !onPublicHome) {
            window.localStorage.setItem(STORAGE_KEY, accountTheme);
        }
    }, [theme, accountTheme, isStudent, user, onPublicHome]);

    useEffect(() => {
        const syncAfterNavigation = () => {
            const next = resolveSiteTheme({
                user,
                guestPreview,
                pageUrl: window.location.pathname,
            });
            applyThemeClass(next.theme);
        };

        const removeFinish = router.on('finish', syncAfterNavigation);

        return () => {
            removeFinish();
        };
    }, [user, guestPreview]);

    const setTheme = useCallback((nextTheme) => {
        if ((isStudent && user) || onPublicHome) {
            return;
        }

        const value = nextTheme === 'girl' ? 'girl' : 'boy';
        setGuestPreview(value);
        window.localStorage.setItem(STORAGE_KEY, value);
        applyThemeClass(value);
    }, [isStudent, user, onPublicHome]);

    const value = useMemo(() => ({
        theme,
        accountTheme,
        isPublicHome: onPublicHome && !user,
        isGirl: accountTheme === 'girl',
        isGeneral: theme === 'general',
        isLocked: Boolean(isStudent && user),
        setTheme,
    }), [theme, accountTheme, onPublicHome, isStudent, user, setTheme]);

    return (
        <StudentThemeContext.Provider value={value}>
            {children}
        </StudentThemeContext.Provider>
    );
}

export function useStudentTheme() {
    const context = useContext(StudentThemeContext);

    if (!context) {
        throw new Error('useStudentTheme must be used within StudentThemeProvider');
    }

    return context;
}
