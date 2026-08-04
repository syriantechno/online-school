export const THEME_COLORS = [
    'default',
    'theme-1',
    'theme-2',
    'theme-3',
    'theme-4',
    'theme-5',
    'theme-6',
    'theme-7',
    'theme-8',
    'theme-9',
    'theme-10',
    'theme-11',
    'theme-12',
    'theme-13',
    'theme-14',
    'theme-15',
    'theme-16',
    'theme-17',
];

export const THEME_STORAGE_KEY = 'theme-color';

export function getStoredTheme() {
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        return THEME_COLORS.includes(value) ? value : 'default';
    } catch {
        return 'default';
    }
}

export function applyTheme(theme) {
    const next = THEME_COLORS.includes(theme) ? theme : 'default';
    const html = document.documentElement;

    THEME_COLORS.forEach((name) => html.classList.remove(name));
    html.classList.add(next);

    try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
        // ignore
    }

    return next;
}
