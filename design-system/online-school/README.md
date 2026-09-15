# نظام التصميم — تعلم العربية

مرجع موحّد لكل UI الموقع. **ابدأ من هنا:**

| الملف | الغرض |
|-------|--------|
| [MASTER.md](./MASTER.md) | القواعد العامة — الألوان، المكوّنات، الثيم، anti-patterns |
| [TOKENS.md](./TOKENS.md) | CSS variables و class prefixes — نسخ سريع |
| [pages/](./pages/) | قواعد خاصة لكل صفحة (تتجاوز MASTER) |

## صفحات موثّقة

- [welcome.md](./pages/welcome.md) — الرئيسية
- [student-profile.md](./pages/student-profile.md) — ملفي
- [my-learning.md](./pages/my-learning.md) — تعلّmي
- [auth.md](./pages/auth.md) — دخول / تسجيل
- [courses.md](./pages/courses.md) — explore + دورة

## أدوات UI Pro Max

```bash
py -3 .agents/skills/ui-ux-pro-max/scripts/search.py "kids education RTL" --design-system -p "Online School"
```

Skill: `.agents/skills/ui-ux-pro-max/SKILL.md`

## Cursor Rule

`.cursor/rules/design-system.mdc` — يذكّر الـ AI بقراءة هذا المجلد قبل أي تصميم.
