# Page Override: ملفي الشخصي (`/my-space`)

> يتجاوز `MASTER.md` لهذه الصفحة.

## الهدف

Hub شخصي للطالب — ترحيب، إحصائيات، اختصارات، تقدّم، إعلانات.

## Layout

```
PublicSiteLayout (بدون site-page-title — العنوان داخل البanner)
└── .student-space-wrap (max 1180px)
    └── .student-space
        ├── .student-space-banner (hero + stats)
        ├── .student-space-shortcuts (4 cards)
        └── .student-space-layout
            ├── main: تقدّم الدورات
            └── aside: إعلانات + آخر الدورات
```

## الملفات

- `Pages/Public/StudentProfile.jsx`
- `Components/StudentProfileContent.jsx`
- CSS: `.student-space-*` في `app.css`

## قواعد خاصة

1. **لا** عنوان مكرر «ملفي الشخصي» في layout — الهيرو يكفي
2. خروج: زر صغير أعلى البanner (`.student-space-logout`)
3. شخصية: `girl-hero` / `boy-hero` حسب `isGirl`
4. إحصائيات داخل البanner — ليس section منفصل
5. Empty states: `.student-space-empty` + CTA

## أزرار أساسية

- Primary: «ابدأ التعلّm» → `learning.my`
- Ghost: النجوم → `stars.leaderboard`
