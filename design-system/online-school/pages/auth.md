# Page Override: تسجيل الدخول / إنشاء حساب

## Layout

`GuestLayout` — split: form + character zone (`.login-character-zone`)

## ثيم

- قبل login: `student-login-theme` في localStorage (معاينة boy/girl)
- الشخصية: `girl-hero` / `boy-hero` حسب `useStudentTheme().theme`
- Register: اختيار gender → يحدّد الثيم

## الملفات

- `Pages/Auth/Login.jsx`
- `Pages/Auth/Register.jsx`
- CSS: `.login-*` في `app.css`

## قواعد

1. لا `PublicSiteLayout` — GuestLayout منفصل
2. بعد login طالب → `/` (AuthRedirect)
3. gender: `male` → boy theme, `female` → girl theme
