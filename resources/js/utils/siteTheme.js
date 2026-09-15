import { applyThemeClass, resolveSiteTheme } from '@/contexts/StudentThemeContext';

function guestPreviewTheme() {
    if (typeof window === 'undefined') {
        return 'boy';
    }

    return window.localStorage.getItem('student-login-theme') === 'girl' ? 'girl' : 'boy';
}

export function syncSiteTheme(page) {
    if (!page) {
        return;
    }

    const user = page.props?.auth?.user ?? null;
    const pageUrl = typeof window !== 'undefined'
        ? window.location.pathname
        : (page.url ?? '/');

    const { theme } = resolveSiteTheme({
        user,
        guestPreview: guestPreviewTheme(),
        pageUrl,
    });

    applyThemeClass(theme);
}

export function initSiteTheme(initialPage) {
    syncSiteTheme(initialPage);

    if (typeof window === 'undefined') {
        return () => {};
    }

    const onNavigate = (event) => {
        syncSiteTheme(event.detail.page);
    };

    document.addEventListener('inertia:navigate', onNavigate);

    return () => {
        document.removeEventListener('inertia:navigate', onNavigate);
    };
}
