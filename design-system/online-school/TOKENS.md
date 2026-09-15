# Design Tokens — مرجع سريع

> انسخ من هنا عند بناء CSS/JSX جديد. **المصدر الحي:** `resources/css/app.css` (ابحث عن `--site-`).

## CSS Variables (Public Site)

```css
/* Shared */
--site-surface: #ffffff;
--site-hero-bg / --site-hero-ink / --site-hero-muted; /* هيرو غامق */

/* General theme — زائر / غير محدد الجنس (html.site-theme-general) */
--site-bg: #f6f5f9;
--site-soft: #efecf5;
--site-border: #ddd8e8;
--site-primary: #433d78;      /* مائل للبنفسجي */
--site-primary-2: #5e548e;    /* بنفسجي */
--site-secondary: #5e548e;
--site-text: #2a2758;
--site-muted: #6b6580;
--site-footer: #2a2758;
--site-hero-bg: #0a2463;
--site-hero-ink: #f3f0fa;
--site-grad: linear-gradient(to top right, #0a2463 0%, #433d78 28%, #5e548e 62%, #5e548e 100%);

/* Boy theme (html.site-theme-boy) */
--site-primary: #2563eb;
--site-primary-2: #38bdf8;
--site-secondary: #f59e0b;
--site-accent: #ec4899;
--site-text: #0f172a;
--site-muted: #64748b;
--site-shadow: rgba(37, 99, 235, 0.18);
--site-footer: #0f172a;

/* Girl theme (html.site-theme-girl) */
--site-primary: #7546bd;
--site-primary-2: #c084fc;
--site-secondary: #f472b6;
--site-accent: #ec4899;
--site-text: #3b0764;
--site-muted: #7e22ce;
--site-shadow: rgba(117, 70, 189, 0.18);
--site-footer: #2e1065;
```

## Class Prefixes

| Prefix | Scope |
|--------|-------|
| `.site-*` | Layout, header, footer, buttons — كل الموقع العام |
| `.arabeti-hero.is-dark` | هيرو غامق + ناف بار `is-on-hero` |
| `.student-space-*` | صفحة ملفي |
| `.learning-*` | صفحة تعلّمي |
| `.login-*` | صفحات Auth |

## Button Sizes

| Class | min-height | padding |
|-------|------------|---------|
| `.site-btn` | 3rem | 0 1.25rem |
| `.site-btn-sm` | 2.5rem | 0 1rem |

## Breakpoints (Tailwind)

| Breakpoint | px | Typical use |
|------------|-----|-------------|
| default | <640 | mobile |
| `sm:` | 640 | padding |
| `md:` | 768 | grids 2-col |
| `lg:` | 1024 | sidebar layouts |
| `xl:` | 1280 | desktop nav |

## Character Assets

```
/public/assets/home/characters/
  boy-hero.png, girl-hero.png
  boy-schoolbag.png, girl-schoolbag.png
  boy-card.png, girl-card.png
  hero-color-boy.png, hero-color-girl.png
```

## Theme Hook (React)

```jsx
import { useStudentTheme } from '@/contexts/StudentThemeContext';

const { theme, isGirl, isGeneral, isPublicHome, accountTheme } = useStudentTheme();
// theme: 'general' | 'boy' | 'girl'
```
