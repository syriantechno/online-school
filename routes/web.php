<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AssignmentSubmissionController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BookChapterController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseReviewController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\DiscussionReplyController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ExamAttemptController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\GeneratedLessonController;
use App\Http\Controllers\GradebookController;
use App\Http\Controllers\LearningPathController;
use App\Http\Controllers\LessonCompletionController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\LessonNoteController;
use App\Http\Controllers\LessonSubmissionController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MyLearningController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParentChildController;
use App\Http\Controllers\PublicCourseController;
use App\Http\Controllers\PublicLessonController;
use App\Http\Controllers\QuestionBankController;
use App\Http\Controllers\Settings\GoogleSettingsController;
use App\Http\Controllers\Settings\HomepageSettingsController;
use App\Http\Controllers\Settings\SeoSettingsController;
use App\Http\Controllers\Settings\UnifiedSettingsController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\StarLeaderboardController;
use App\Http\Controllers\StudentRatingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoRoomController;
use App\Http\Controllers\WorksheetController;
use App\Models\Book;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Support\SeoMeta;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'content' => HomepageSettingsController::content(),
        'stats' => [
            [
                'label' => 'الدورات',
                'value' => Course::query()->where('is_published', true)->count(),
                'icon' => 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
            ],
            [
                'label' => 'الدروس',
                'value' => Lesson::query()->where('is_published', true)->count(),
                'icon' => 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            ],
            [
                'label' => 'الكتب',
                'value' => Book::query()->where('is_published', true)->count(),
                'icon' => 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
            ],
            [
                'label' => 'المعلمون',
                'value' => User::query()->where('role', User::ROLE_TEACHER)->where('is_active', true)->count(),
                'icon' => 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
            ],
        ],
        'courses' => Course::query()
            ->with('teacher:id,name')
            ->where('is_published', true)
            ->latest()
            ->take(6)
            ->get(['id', 'title', 'slug', 'description', 'subject', 'level', 'cover_image', 'teacher_id']),
    ]);
});

Route::get('/explore', [PublicCourseController::class, 'index'])->name('explore.index');
Route::get('/explore/{course:slug}', [PublicCourseController::class, 'show'])->name('explore.show');

$marketingPages = [
    'about' => ['badge' => 'قصتنا', 'title' => 'مدرسة عربية صُممت من أجل الطفل', 'description' => 'نحوّل تعلم العربية إلى رحلة مليئة بالفضول والإنجاز والثقة.', 'cards' => [['title' => 'رؤيتنا', 'text' => 'أن يحب كل طفل لغته ويستخدمها بثقة في حياته اليومية.'], ['title' => 'طريقتنا', 'text' => 'دروس قصيرة وتفاعلية تراعي العمر والمستوى وأسلوب التعلم.'], ['title' => 'مجتمعنا', 'text' => 'أهل ومعلمون وطلاب يعملون معاً في بيئة آمنة وإيجابية.']]],
    'teachers' => ['badge' => 'فريقنا', 'title' => 'معلمون يصنعون فرقاً حقيقياً', 'description' => 'خبرات تربوية وشغف باللغة وقدرة على الوصول إلى كل طفل.', 'cards' => [['title' => 'اختيار دقيق', 'text' => 'نختار المعلمين وفق خبرتهم وقدرتهم على التواصل مع الأطفال.'], ['title' => 'تدريب مستمر', 'text' => 'ورش دورية في التعليم التفاعلي والتقنيات الحديثة.'], ['title' => 'متابعة شخصية', 'text' => 'ملاحظات واضحة وخطة دعم تناسب تقدم كل طالب.']]],
    'pricing' => ['badge' => 'خطط مرنة', 'title' => 'اختر الخطة التي تناسب رحلة طفلك', 'description' => 'خيارات بسيطة وشفافة تبدأ بالتجربة وتكبر مع احتياج الطالب.', 'cards' => [['title' => 'التجربة المجانية', 'text' => 'اختبار مستوى ومجموعة دروس تمهيدية بلا التزام.'], ['title' => 'الخطة الشهرية', 'text' => 'دروس وأنشطة وتقارير تقدم شهرية للأهل.'], ['title' => 'الخطة المتقدمة', 'text' => 'متابعة أوسع وجلسات مباشرة ودعم شخصي إضافي.']]],
    'blog' => ['badge' => 'مدونة المدرسة', 'title' => 'أفكار تساعد طفلك على حب العربية', 'description' => 'مقالات عملية للأهل والمعلمين حول القراءة والتعلم والتحفيز.', 'cards' => [['title' => 'كيف نشجع القراءة؟', 'text' => 'خطوات يومية صغيرة تجعل الكتاب صديقاً للطفل.'], ['title' => 'التعلم باللعب', 'text' => 'لماذا يتذكر الأطفال ما يتعلمونه أثناء اللعب؟'], ['title' => 'بناء عادة التعلم', 'text' => 'روتين بسيط ومستمر أفضل من جلسات طويلة ومتباعدة.']]],
    'contact' => ['badge' => 'نحن قريبون منك', 'title' => 'تواصل معنا في أي وقت', 'description' => 'فريقنا جاهز للإجابة عن أسئلتك ومساعدتك في اختيار البداية المناسبة.', 'cards' => [['title' => 'الدعم', 'text' => 'راسلنا على hello@taallam.school وسنرد عليك بأقرب وقت.'], ['title' => 'الهاتف', 'text' => 'اتصل بنا على +971 50 000 0000 خلال ساعات العمل.'], ['title' => 'زيارة المدرسة', 'text' => 'دبي، الإمارات العربية المتحدة — الزيارة بموعد مسبق.']]],
];
foreach ($marketingPages as $slug => $page) Route::get('/'.$slug, fn () => Inertia::render('MarketingPage', ['page' => $page]))->name('marketing.'.$slug);

Route::get('/lab/gradient', fn () => Inertia::render('Lab/GradientBg'))->name('lab.gradient');

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', function () {
    $sitemap = SeoMeta::absoluteUrl('/sitemap.xml');
    $content = "User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /profile\nDisallow: /settings\nSitemap: {$sitemap}\n";

    return response($content, 200)->header('Content-Type', 'text/plain');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/my-space', StudentProfileController::class)->name('student.profile');

    Route::resource('courses', CourseController::class);
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store'])->name('courses.enroll');
    Route::delete('/courses/{course}/enroll', [EnrollmentController::class, 'destroy'])->name('courses.unenroll');
    Route::post('/courses/{course}/reviews', [CourseReviewController::class, 'store'])->name('courses.reviews.store');
    Route::get('/courses/{course}/path', LearningPathController::class)->name('courses.path');
    Route::get('/courses/{course}/gradebook', GradebookController::class)->name('courses.gradebook');

    Route::get('/my-learning', MyLearningController::class)->name('learning.my');
    Route::get('/explore/{course:slug}/learn/{lesson}', [PublicLessonController::class, 'show'])->name('explore.learn');
    Route::get('/calendar', CalendarController::class)->name('calendar.index');
    Route::get('/analytics', AnalyticsController::class)->name('analytics.index');
    Route::get('/notes', [LessonNoteController::class, 'index'])->name('notes.index');

    Route::resource('lessons', LessonController::class);
    Route::get('/worksheets/create', [WorksheetController::class, 'create'])->name('worksheets.create');
    Route::post('/worksheets', [WorksheetController::class, 'store'])->name('worksheets.store');
    Route::get('/worksheets/{lesson}/edit', [WorksheetController::class, 'edit'])->name('worksheets.edit');
    Route::put('/worksheets/{lesson}', [WorksheetController::class, 'update'])->name('worksheets.update');
    Route::post('/worksheets/images', [WorksheetController::class, 'upload'])->name('worksheets.images.store');
    Route::delete('/worksheets/images', [WorksheetController::class, 'destroyImage'])->name('worksheets.images.destroy');
    Route::get('/lesson-generator/studio', [GeneratedLessonController::class, 'studio'])->name('lesson-generator.studio');
    Route::get('/lesson-generator/create', [GeneratedLessonController::class, 'create'])->name('lesson-generator.create');
    Route::post('/lesson-generator', [GeneratedLessonController::class, 'store'])->name('lesson-generator.store');
    Route::get('/lesson-generator/{lesson}/edit', [GeneratedLessonController::class, 'edit'])->name('lesson-generator.edit');
    Route::put('/lesson-generator/{lesson}', [GeneratedLessonController::class, 'update'])->name('lesson-generator.update');
    Route::post('/lessons/{lesson}/complete', [LessonCompletionController::class, 'store'])->name('lessons.complete');
    Route::post('/lessons/{lesson}/notes', [LessonNoteController::class, 'store'])->name('lessons.notes.store');
    Route::post('/lessons/{lesson}/audio', [LessonSubmissionController::class, 'store'])->name('lessons.audio.store');
    Route::post('/lessons/{lesson}/audio/{submission}/grade', [LessonSubmissionController::class, 'grade'])->name('lessons.audio.grade');
    Route::resource('books', BookController::class);

    Route::post('/books/{book}/chapters', [BookChapterController::class, 'store'])->name('books.chapters.store');
    Route::put('/books/{book}/chapters/{chapter}', [BookChapterController::class, 'update'])->name('books.chapters.update');
    Route::delete('/books/{book}/chapters/{chapter}', [BookChapterController::class, 'destroy'])->name('books.chapters.destroy');
    Route::post('/books/{book}/chapters/{chapter}/complete', [BookChapterController::class, 'complete'])->name('books.chapters.complete');

    Route::resource('video-rooms', VideoRoomController::class)->except(['edit', 'update']);
    Route::post('/video-rooms/{video_room}/check-in', [AttendanceController::class, 'checkIn'])->name('attendance.check-in');
    Route::get('/video-rooms/{video_room}/attendance', [AttendanceController::class, 'index'])->name('attendance.index');

    Route::get('/courses/{course}/discussions', [DiscussionController::class, 'index'])->name('discussions.index');
    Route::post('/courses/{course}/discussions', [DiscussionController::class, 'store'])->name('discussions.store');
    Route::get('/courses/{course}/discussions/{thread}', [DiscussionController::class, 'show'])->name('discussions.show');
    Route::delete('/courses/{course}/discussions/{thread}', [DiscussionController::class, 'destroy'])->name('discussions.destroy');
    Route::post('/courses/{course}/discussions/{thread}/replies', [DiscussionReplyController::class, 'store'])->name('discussions.replies.store');

    Route::get('/messages', [ConversationController::class, 'index'])->name('messages.index');
    Route::post('/messages', [ConversationController::class, 'store'])->name('messages.store');
    Route::get('/messages/{conversation}', [ConversationController::class, 'show'])->name('messages.show');
    Route::post('/messages/{conversation}/reply', [MessageController::class, 'store'])->name('messages.reply');

    Route::get('/ratings', [StudentRatingController::class, 'index'])->name('ratings.index');
    Route::post('/ratings', [StudentRatingController::class, 'store'])->name('ratings.store');
    Route::get('/stars', StarLeaderboardController::class)->name('stars.leaderboard');

    Route::get('/assignments', [AssignmentController::class, 'index'])->name('assignments.index');
    Route::post('/assignments', [AssignmentController::class, 'store'])->name('assignments.store');
    Route::get('/assignments/{assignment}', [AssignmentController::class, 'show'])->name('assignments.show');
    Route::put('/assignments/{assignment}', [AssignmentController::class, 'update'])->name('assignments.update');
    Route::post('/assignments/{assignment}/duplicate', [AssignmentController::class, 'duplicate'])->name('assignments.duplicate');
    Route::delete('/assignments/{assignment}', [AssignmentController::class, 'destroy'])->name('assignments.destroy');
    Route::post('/assignments/{assignment}/submit', [AssignmentSubmissionController::class, 'store'])->name('assignments.submit');
    Route::post('/assignments/{assignment}/submissions/{submission}/grade', [AssignmentSubmissionController::class, 'grade'])->name('assignments.grade');

    Route::get('/question-bank', [QuestionBankController::class, 'index'])->name('question-bank.index');
    Route::post('/question-bank', [QuestionBankController::class, 'store'])->name('question-bank.store');
    Route::put('/question-bank/{question}', [QuestionBankController::class, 'update'])->name('question-bank.update');
    Route::delete('/question-bank/{question}', [QuestionBankController::class, 'destroy'])->name('question-bank.destroy');
    Route::post('/question-bank/generate', [QuestionBankController::class, 'generate'])->name('question-bank.generate');
    Route::post('/question-bank/from-lesson', [QuestionBankController::class, 'generateFromLesson'])->name('question-bank.from-lesson');

    Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
    Route::post('/exams', [ExamController::class, 'store'])->name('exams.store');
    Route::get('/exams/{exam}', [ExamController::class, 'show'])->name('exams.show');
    Route::put('/exams/{exam}', [ExamController::class, 'update'])->name('exams.update');
    Route::post('/exams/{exam}/duplicate', [ExamController::class, 'duplicate'])->name('exams.duplicate');
    Route::delete('/exams/{exam}', [ExamController::class, 'destroy'])->name('exams.destroy');
    Route::post('/exams/{exam}/questions', [ExamController::class, 'storeQuestion'])->name('exams.questions.store');
    Route::delete('/exams/{exam}/questions/{question}', [ExamController::class, 'destroyQuestion'])->name('exams.questions.destroy');
    Route::post('/exams/{exam}/start', [ExamAttemptController::class, 'start'])->name('exams.start');
    Route::get('/exams/{exam}/attempts/{attempt}/take', [ExamAttemptController::class, 'take'])->name('exams.take');
    Route::post('/exams/{exam}/attempts/{attempt}/submit', [ExamAttemptController::class, 'submit'])->name('exams.submit');
    Route::get('/exams/{exam}/attempts/{attempt}/result', [ExamAttemptController::class, 'result'])->name('exams.result');
    Route::post('/exams/{exam}/attempts/{attempt}/answers/{answer}/grade', [ExamAttemptController::class, 'gradeAnswer'])->name('exams.answers.grade');

    Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates.index');
    Route::get('/certificates/{certificate}', [CertificateController::class, 'show'])->name('certificates.show');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');

    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

    Route::get('/children', [ParentChildController::class, 'index'])->name('children.index');
    Route::post('/parent-links', [ParentChildController::class, 'store'])->name('parent-links.store');
    Route::delete('/parent-links', [ParentChildController::class, 'destroy'])->name('parent-links.destroy');

    Route::middleware('role:admin')->group(function () {
        Route::get('/settings', [UnifiedSettingsController::class, 'edit'])->name('settings.index');
        Route::put('/settings', [UnifiedSettingsController::class, 'update'])->name('settings.update');
        Route::resource('users', UserController::class)->except(['show']);
        Route::get('/settings/seo', [SeoSettingsController::class, 'edit'])->name('settings.seo.edit');
        Route::put('/settings/seo', [SeoSettingsController::class, 'update'])->name('settings.seo.update');
        Route::get('/settings/google', [GoogleSettingsController::class, 'edit'])->name('settings.google.edit');
        Route::put('/settings/google', [GoogleSettingsController::class, 'update'])->name('settings.google.update');
        Route::get('/settings/homepage', [HomepageSettingsController::class, 'edit'])->name('settings.homepage.edit');
        Route::put('/settings/homepage', [HomepageSettingsController::class, 'update'])->name('settings.homepage.update');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
