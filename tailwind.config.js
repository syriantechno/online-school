import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import plugin from 'tailwindcss/plugin';
import colors from 'tailwindcss/colors';
import { parseColor } from 'tailwindcss/lib/util/color.js';

/** Converts HEX color to RGB channel string for CSS variables */
const toRGB = (value) => parseColor(value).color.join(' ');

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    safelist: [
        ...['primary', 'secondary', 'success', 'info', 'warning', 'pending', 'danger'].flatMap((color) => [
            `bg-${color}`,
            `bg-${color}/10`,
            `bg-${color}/20`,
            `text-${color}`,
            `border-${color}`,
            `border-${color}/20`,
        ]),
        ...Array.from({ length: 17 }, (_, i) => `theme-${i + 1}`),
        'default',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Cairo', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                theme: {
                    1: 'rgb(var(--color-theme-1) / <alpha-value>)',
                    2: 'rgb(var(--color-theme-2) / <alpha-value>)',
                },
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                success: 'rgb(var(--color-success) / <alpha-value>)',
                info: 'rgb(var(--color-info) / <alpha-value>)',
                warning: 'rgb(var(--color-warning) / <alpha-value>)',
                pending: 'rgb(var(--color-pending) / <alpha-value>)',
                danger: 'rgb(var(--color-danger) / <alpha-value>)',
                light: 'rgb(var(--color-light) / <alpha-value>)',
                dark: 'rgb(var(--color-dark) / <alpha-value>)',
            },
            backgroundImage: {
                'texture-white':
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2346.899' height='1200.894' viewBox='0 0 2346.899 1200.894'%3E%3Cg transform='translate(-33.74 508.575)'%3E%3Cg transform='translate(33.74 -458.541)'%3E%3Crect width='745.289' height='650.113' transform='translate(296.729 261.648) rotate(12.007)' fill='rgba(255,255,255,0.014)'/%3E%3Crect width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(255,255,255,0.014)'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
            borderRadius: {
                box: '0.6rem',
            },
            boxShadow: {
                box: '0px 3px 5px #0000000b',
                'menu-active': '0px 2px 3px #0000000b',
                clay: '0 8px 0 0 #bae6fd, 0 15px 20px 0 rgba(14, 165, 233, 0.35)',
                'clay-hover': '0 6px 0 0 #7dd3fc, 0 12px 16px 0 rgba(14, 165, 233, 0.25)',
                'clay-amber': '0 8px 0 0 #fde68a, 0 15px 20px 0 rgba(217, 119, 6, 0.35)',
                'clay-amber-hover': '0 6px 0 0 #fcd34d, 0 12px 16px 0 rgba(217, 119, 6, 0.25)',
                'clay-teal': '0 8px 0 0 #99f6e4, 0 15px 20px 0 rgba(13, 148, 136, 0.35)',
                'clay-teal-hover': '0 6px 0 0 #5eead4, 0 12px 16px 0 rgba(13, 148, 136, 0.25)',
                'clay-green': '0 8px 0 0 #86efac, 0 15px 20px 0 rgba(22, 163, 74, 0.35)',
                'clay-green-hover': '0 6px 0 0 #4ade80, 0 12px 16px 0 rgba(22, 163, 74, 0.25)',
            },
        },
    },
    plugins: [
        forms,
        plugin(function ({ addBase }) {
            const status = {
                '--color-secondary': toRGB(colors.slate['200']),
                '--color-success': toRGB(colors.teal['600']),
                '--color-info': toRGB(colors.cyan['600']),
                '--color-warning': toRGB(colors.yellow['600']),
                '--color-pending': toRGB(colors.orange['700']),
                '--color-danger': toRGB(colors.red['700']),
                '--color-light': toRGB(colors.slate['100']),
                '--color-dark': toRGB(colors.slate['800']),
            };

            const makeTheme = (a, b) => ({
                '--color-theme-1': toRGB(a),
                '--color-theme-2': toRGB(b),
                '--color-primary': toRGB(a),
                ...status,
            });

            addBase({
                ':root, .default': makeTheme('#03045e', '#0c4a6e'),
                '.theme-1': makeTheme(colors.violet['900'], colors.rose['800']),
                '.theme-2': makeTheme(colors.purple['900'], colors.cyan['700']),
                '.theme-3': makeTheme(colors.cyan['700'], colors.violet['800']),
                '.theme-4': makeTheme(colors.sky['700'], colors.rose['800']),
                '.theme-5': makeTheme(colors.sky['800'], colors.emerald['800']),
                '.theme-6': makeTheme('#247ba0', '#0a2463'),
                '.theme-7': makeTheme(colors.lime['950'], colors.teal['900']),
                '.theme-8': makeTheme('#357266', '#0E3B43'),
                '.theme-9': makeTheme('#6C6C60', '#4D4D42'),
                '.theme-10': makeTheme(colors.indigo['800'], colors.blue['900']),
                '.theme-11': makeTheme('#2f3e46', '#52796f'),
                '.theme-12': makeTheme('#5e503f', '#22333b'),
                '.theme-13': makeTheme('#5e548e', '#231942'),
                '.theme-14': makeTheme('#02292f', '#767522'),
                '.theme-15': makeTheme('#4c956c', '#006466'),
                '.theme-16': makeTheme(colors.sky['900'], colors.blue['950']),
                '.theme-17': makeTheme(colors.slate['900'], colors.slate['800']),
            });
        }),
    ],
};
