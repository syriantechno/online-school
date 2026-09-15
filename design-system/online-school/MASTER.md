# نظام التصميم الموحّد — تعلم العربية

> **قاعدة العمل:** قبل أي صفحة أو مكوّن UI جديد، اقرأ هذا الملف.
> إذا وُجد `design-system/online-school/pages/[اسم-الصفحة].md` فقواعده **تتجاوز** هذا الملف لتلك الصفحة فقط.

**المشروع:** عربيتي — Online School  
**الستاك:** Laravel + Inertia + React + Tailwind + CSS tokens  
**الروح:** تعليمي، مرح، آمن للأطفال، RTL، شخصيات (ولد/بنت)  
**زخرفة الهوية:** حروف عربية (ع ر ب ي ت) بخط ثلث/Amiri عبر `BrandLetters`  
**آخر تحديث:** 2026-08-26  
**مصدر CSS:** `resources/css/app.css`  
**مصدر الثيم:** `resources/js/contexts/StudentThemeContext.jsx`

---

## 1. الهوية والمبادئ

| المبدأ | التطبيق |
|--------|---------|
| **الاسم** | **عربيتي** — wordmark + حروف ثلث موزّعة (ليس دوائر/مسدسات) |
| **روح واحدة** | كل الصفحات العامة تستخدم `--site-*` + `PublicSiteLayout` |
| **ثيم الطالب** | `html.site-theme-general` · `site-theme-boy` · `site-theme-girl` |
| **لا ألوان صلبة** | ممنوع `blue-600` / `violet-700` في صفحات جديدة — استخدم `var(--site-primary)` أو `.site-*` |
| **شخصيات** | زائر: صبي+بنت · طالب: صبي+صبي · طالبة: بنت+بنت — الهيرو فقط غالباً |
| **RTL** | `dir="rtl"` على `.site-shell` — الأيقونات SVG stroke، النصوص عربية |
| **أيقونات** | SVG فقط (لا emoji كأيقونات) — Heroicons-style paths |
| **ظلال** | خفيفة ومحايدة — لا ظل زهري/بنفسجي تحت الأزرار |

### تجنّب (Anti-patterns)

- ❌ ألوان Tailwind ثابتة للثيم (`text-blue-600`, `border-violet-200`) في صفحات الطالب/الموقع
- ❌ ثيمات مختلفة بين «ملفي» و«تعلّمي» و«الرئيسية» للطالب المسجّل
- ❌ أزرار بدون `cursor-pointer` و transition 150–300ms
- ❌ hover يغيّر layout (scale كبير على عناصر block)
- ❌ نص أصغر من 12px للمحتوى الأساسي
- ❌ تجاهل `prefers-reduced-motion`

---

## 2. الألوان (Tokens)

### 2.1 مشترك

| Token | القيمة | الاستخدام |
|-------|--------|-----------|
| `--site-bg` | حسب الثيم | خلفية الموقع |
| `--site-surface` | `#ffffff` | بطاقات، هيدر |
| `--site-soft` | حسب الثيم | خلفيات ناعمة |
| `--site-border` | حسب الثيم | حدود |
| `--site-hero-bg` / `--site-hero-ink` | حسب الثيم | هيرو غامق + لون الحروف |

### 2.2 ثيم عام (`site-theme-general`) — زائر / غير محدد الجنس

كحلي ↔ بنفسجي — أزرار وكروت بتدرج زاوية→زاوية

| Token | القيمة |
|-------|--------|
| `--site-primary` | `#433d78` |
| `--site-primary-2` | `#5e548e` |
| `--site-secondary` | `#5e548e` |
| `--site-bg` | `#f6f5f9` |
| `--site-hero-bg` | `#f2f0f7` |
| `--site-hero-ink` | `#433d78` |
| `--site-grad` | `linear-gradient(to top right, #0a2463 → #5e548e)` مائل للبنفسجي |

### 2.3 ثيم الولد (`site-theme-boy`)

| Token | القيمة |
|-------|--------|
| `--site-primary` | `#2563eb` |
| `--site-primary-2` | `#38bdf8` |
| `--site-secondary` | `#f59e0b` |
| `--site-accent` | `#ec4899` |
| `--site-text` | `#0f172a` |
| `--site-muted` | `#64748b` |
| `--site-shadow` | `rgba(37,99,235,.18)` |
| `--site-footer` | `#0f172a` |

### 2.4 ثيم البنت (`site-theme-girl`)

| Token | القيمة |
|-------|--------|
| `--site-primary` | `#7546bd` |
| `--site-primary-2` | `#c084fc` |
| `--site-secondary` | `#f472b6` |
| `--site-accent` | `#ec4899` |
| `--site-text` | `#3b0764` |
| `--site-muted` | `#7e22ce` |
| `--site-shadow` | `rgba(117,70,189,.18)` |
| `--site-footer` | `#2e1065` |

### 2.5 منطق الثيم (JavaScript)

```
زائر على /           → site-theme-general (عام، تيل #0f5b6a)
طالب/طالبة مسجّل     → site-theme-boy | site-theme-girl حسب user.gender
زائر صفحات أخرى      → boy/girl من اختيار تسجيل الدخول
```

**الملفات:** `StudentThemeContext.jsx`, `app.blade.php`

---

## 3. الطباعة

| العنصر | المواصفات |
|--------|-----------|
| **الخط** | `font-sans` — Cairo / system (موجود في Tailwind) |
| **عناوين Hero** | `font-black`, `clamp(1.75rem, 4vw, 2.5rem)` |
| **عناوين أقسام** | `font-weight: 900`, ~`1.05–1.2rem` |
| **Body** | `font-weight: 600–700`, `0.875–0.92rem`, `line-height: 1.65–1.75` |
| **Kicker / Label** | `0.68–0.72rem`, `font-weight: 800`, `color: var(--site-primary)` |

> **ملاحظة:** Baloo 2 / Comic Neue مقترحة من UI Pro Max — **لم تُفعّل بعد**. لا تغيّر الخط بدون قرار صريح.

---

## 4. المسافات والزوايا

| Token | القيمة | الاستخدام |
|-------|--------|-----------|
| `--space-xs` | 4px | فجوات ضيقة |
| `--space-sm` | 8px | بين أيقونة ونص |
| `--space-md` | 16px | padding بطاقة |
| `--space-lg` | 24px | بين أقسام |
| `--space-xl` | 32px | padding hero |
| `--space-2xl` | 48px | margins أقسام كبيرة |

| المكوّن | border-radius |
|---------|---------------|
| أزرار `.site-btn` | `1rem` (16px) |
| بطاقات عامة | `1–1.35rem` |
| Hero banner | `1.75–2rem` |
| Badges / kicker | `999px` |

**Max width:** `1180–1200px` للمحتوى (`student-space-wrap`, `learning-public-wrap`)

---

## 5. الظلال

| المستوى | القيمة | الاستخدام |
|---------|--------|-----------|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,.04)` | بطاقات خفيفة |
| `--shadow-md` | `0 4px 16px rgba(15,23,42,.04)` | panels |
| `--shadow-lg` | `0 14px 40px color-mix(primary 10%, transparent)` | hero banner |
| أزرار primary | `0 2px 8px rgba(15,23,42,.1)` | `.site-btn-primary` |

**Hover أزرار:** `translateY(-1px)` + ظل أعمق قليلاً — **بدون** glow ملون ثقيل.

---

## 6. المكوّنات المعيارية

### 6.1 Layout

| Class / Component | الملف | الاستخدام |
|-------------------|-------|-----------|
| `PublicSiteLayout` | `Components/PublicSiteLayout.jsx` | كل الصفحات العامة + ملفي + تعلّmي |
| `.site-shell` | `app.css` | غلاف RTL + خلفية |
| `.site-header` | `app.css` | شريط ثابت 82px |
| `.site-main` | `app.css` | `padding-top: 82px` |

### 6.2 الأزرار

```html
<!-- Primary -->
<Link className="site-btn site-btn-primary">...</Link>

<!-- Secondary / Ghost -->
<Link className="site-btn site-btn-ghost">...</Link>

<!-- Small -->
<Link className="site-btn site-btn-primary site-btn-sm">...</Link>

<!-- Accent (CTA بنفس تدرج الثيم) -->
<Link className="site-btn site-btn-accent">...</Link>
```

**قواعد:** دائماً `<Link>` من Inertia للتنقل الداخلي · أيقونة SVG + نص · `min-height: 3rem`

### 6.3 البطاقات

| Pattern | Classes | متى |
|---------|---------|-----|
| **Site panel** | `.student-space-section` | ملفي، أقسام |
| **Course card** | `PublicCourseCard` | explore + homepage |
| **Learning card** | `.learning-course-card` | تعلّmي |
| **Stat card** | `.student-space-stat` / `.learning-stat-card` | إحصائيات |

### 6.4 الشخصيات

**المسار:** `/assets/home/characters/`

| الملف | الاستخدام |
|-------|-----------|
| `boy-hero.png` / `girl-hero.png` | Hero، ملفي، login |
| `boy-schoolbag.png` / `girl-schoolbag.png` | Hero جانبي، أقسام |
| `boy-card.png` / `girl-card.png` | كروت دورات |
| `hero-color-boy.png` / `hero-color-girl.png` | Blobs خلف الشخصية |

**القاعدة:** `useStudentTheme()` → `isGirl`, `isPublicHome` لاختيار الشخصية.

### 6.5 Progress bar

```html
<div className="student-space-progress" role="progressbar" aria-valuenow={n}>
  <span style={{ width: `${n}%` }} />
</div>
```

---

## 7. هيكل الصفحات

| الصفحة | Layout | ملف Page | ملف overrides |
|--------|--------|----------|---------------|
| الرئيسية | `PublicSiteLayout` | `Welcome.jsx` | `pages/welcome.md` |
| ملفي | `PublicSiteLayout` | `StudentProfile.jsx` | `pages/student-profile.md` |
| تعلّmي | `PublicSiteLayout` | `MyLearning.jsx` | `pages/my-learning.md` |
| استكشاف | `PublicSiteLayout` | `Explore/*` | `pages/courses.md` |
| تسجيل/دخول | `GuestLayout` | `Auth/*` | `pages/auth.md` |
| لوحة admin | `AuthenticatedLayout` | `Dashboard/*` | — (خارج النطاق العام) |

---

## 8. الحركة (Motion)

| النوع | المدة | Easing |
|-------|-------|--------|
| Hover buttons/cards | 200ms | ease |
| Theme switch | 350ms | ease (background على `.site-shell`) |
| Hero characters | 720ms enter | cubic-bezier — **respect reduced-motion** |

```css
@media (prefers-reduced-motion: reduce) {
  /* أوقف animation على hero و cards */
}
```

---

## 9. إمكانية الوصول

- [ ] Contrast ≥ 4.5:1 للنص الأساسي
- [ ] `aria-label` على أزرار icon-only
- [ ] `role="progressbar"` + `aria-valuenow` على أشرطة التقدّm
- [ ] Focus visible على links و buttons
- [ ] `alt` وصفية على صور المحتوى؛ `alt=""` + `aria-hidden` للزينة

---

## 10. قائمة ما قبل التسليم

- [ ] يستخدم `--site-*` أو classes `.site-*` / `.student-space-*` / `.learning-*`
- [ ] لا ألوان Tailwind ثابتة للbrand
- [ ] يعمل بثيم boy و girl
- [ ] Responsive: 375 · 768 · 1024 · 1280
- [ ] `npm run build` بدون أخطاء
- [ ] Inertia `<Link>` للتنقل الداخلي

---

## 11. مراجع سريعة

| الموضوع | الملف |
|---------|-------|
| Tokens تفصيلية | `TOKENS.md` |
| UI Pro Max skill | `.agents/skills/ui-ux-pro-max/SKILL.md` |
| CSS كامل | `resources/css/app.css` |
| ثيم React | `resources/js/contexts/StudentThemeContext.jsx` |

---

## 12. سجل القرارات

| التاريخ | القرار |
|---------|--------|
| 2026-08 | خلفية موحّدة `#f7f8fa` للثيمين |
| 2026-08 | الطالب: ملفي + تعلّmي على PublicSiteLayout (لا dashboard للطالب) |
| 2026-08 | الرئيسية: عام للزوار؛ المسجّل يرى ثيم حسابه |
| 2026-08 | الشخصيات حسب جنس الحساب بعد تسجيل الدخول |
