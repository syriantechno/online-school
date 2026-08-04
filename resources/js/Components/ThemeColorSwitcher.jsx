import { applyTheme, getStoredTheme, THEME_COLORS } from '@/lib/theme';
import { useEffect, useState } from 'react';

export default function ThemeColorSwitcher() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('default');

    useEffect(() => {
        setActive(applyTheme(getStoredTheme()));
    }, []);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const pick = (theme) => {
        setActive(applyTheme(theme));
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-5 left-5 z-[60] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-theme-1 text-white shadow-lg transition hover:scale-105 hover:bg-theme-2"
                aria-label="اختيار لون الواجهة"
                title="ألوان النظام"
            >
                <svg className="h-5 w-5 animate-spin [animation-duration:3s]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            {open && (
                <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="ألوان النظام">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/40"
                        aria-label="إغلاق"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl sm:max-w-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div>
                                <p className="text-base font-medium text-slate-800">ألوان النظام</p>
                                <p className="mt-0.5 text-sm text-slate-500">اختر ألوان الواجهة</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                                aria-label="إغلاق"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-5">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {THEME_COLORS.map((theme) => (
                                    <button
                                        key={theme}
                                        type="button"
                                        onClick={() => pick(theme)}
                                        className={`h-12 cursor-pointer rounded-full border bg-slate-50 p-1 transition ${
                                            active === theme
                                                ? 'border-2 border-theme-1/60'
                                                : 'border-slate-300/80 hover:border-slate-400'
                                        }`}
                                        aria-label={`اختيار ${theme}`}
                                        aria-pressed={active === theme}
                                    >
                                        <div className="h-full overflow-hidden rounded-full">
                                            <div className="-mx-2 flex h-full items-center gap-1">
                                                <div className={`h-[140%] w-1/2 rotate-12 bg-theme-1 ${theme}`} />
                                                <div className={`h-[140%] w-1/2 rotate-12 bg-theme-2 ${theme}`} />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
