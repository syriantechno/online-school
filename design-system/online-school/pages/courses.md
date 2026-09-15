# Page Override: الدورات (`/explore`, `/explore/{slug}`)

## قائمة الدورات

- Layout: `PublicSiteLayout`
- Card: `PublicCourseCard` — **دائماً** استخدم هذا المكوّن
- شخصيات الكرت: mixed للزائر؛ boy-only أو girl-only للمسجّl حسب gender

## صفحة دورة

- Hero banner: cover أو fallback character
- مسار دروس: `CourseLessonPath`
- أزرار: `CourseCardActions` (تصفح / اشترك / تابع التعلّm)

## أزرار الكرت

| Class | الدور |
|-------|-------|
| `site-btn-primary` | اشترك / تابع |
| `site-btn-ghost` | تصفح |

## قواعد

1. ارتفاع موحّd للكروت (`min-h-[330px]`)
2. لا سهم زاوية — أزرار في أسفل الكرت
3. enrolled → إخفاء «اشترك»، إظهار «تابع التعلّm»
