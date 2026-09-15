import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { StudentThemeProvider } from '@/contexts/StudentThemeContext';
import { initSiteTheme, syncSiteTheme } from '@/utils/siteTheme';

const appName = import.meta.env.VITE_APP_NAME || 'Online School';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ).then((module) => {
            const Page = module.default;

            return {
                default: function ThemedPage(props) {
                    return (
                        <StudentThemeProvider>
                            <Page {...props} />
                        </StudentThemeProvider>
                    );
                },
            };
        }),
    setup({ el, App, props }) {
        initSiteTheme(props.initialPage);

        router.on('navigate', (event) => {
            syncSiteTheme(event.detail.page);
        });

        router.on('success', (event) => {
            syncSiteTheme(event.detail.page);
        });

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#2563EB',
    },
});
