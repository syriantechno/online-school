# Online School

منصة تعليم إلكتروني عربية (RTL) مبنية على:

- **Laravel 13** — Backend + API لاحقاً
- **Inertia.js + React** — واجهات مخصصة (بدون Filament)
- **Tailwind CSS** — تصميم مع خط Cairo
- مهارة تصميم: `.agents/skills/ui-ux-pro-max`

## التشغيل

```bash
cd "E:\louai laravel\online-school"
composer install
npm install
php artisan migrate --seed
npm run dev
php artisan serve
```

افتح: http://127.0.0.1:8000

### معلومات الدخول (حسابات تجريبية)

كلمة المرور لجميع الحسابات: `password`

| الدور | البريد | كلمة المرور |
|--------|--------|-------------|
| مدير | admin@school.test | password |
| معلم | teacher@school.test | password |
| طالب | student@school.test | password |
| ولي أمر | parent@school.test | password |

## الهيكل الحالي

- `users` — أدوار: admin / teacher / student / parent
- `courses` — الدورات/المواد
- `lessons` — الدروس (فيديو + تفاعلي)
- `books` — الكتب PDF
- `enrollments` — تسجيل الطلاب في الدورات

## قادم

- CRUD للدورات والدروس والكتب
- قارئ كتب PDF
- دروس تفاعلية
- اتصال فيديو (LiveKit)
- تطبيق موبايل/آيباد
