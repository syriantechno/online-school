# Page Override: تعلّmي (`/my-learning`)

## الهدف

متابعة الدروس — continue learning، واجبات، فحوصات.

## Layout

```
PublicSiteLayout title="تعلّmي"
└── .learning-public-wrap
    ├── .learning-stat-grid (3 stats)
    ├── .learning-panel (continue courses)
    └── .learning-panels-grid (assignments + exams)
```

## الملفات

- `Pages/Learning/MyLearning.jsx`
- CSS: `.learning-*` في `app.css`

## قواعد

1. استخدم `.learning-stat-card`, `.learning-course-card`, `.learning-panel-heading`
2. Empty state: `.learning-empty` + شخصية `card-pic*.png`
3. أزرار: `.learning-primary-button`, `.learning-secondary-button`
4. **TODO للتوحيد:** محاذاة visual مع `.student-space-*` (نفس border-radius و shadows)

## Personajes

Card pics: `/assets/home/characters/card-pic1.png` … `card-pic5.png`
