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
use App\Http\Controllers\GradebookController;
use App\Http\Controllers\LearningPathController;
use App\Http\Controllers\LessonCompletionController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\LessonNoteController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MyLearningController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParentChildController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Settings\GoogleSettingsController;
use App\Http\Controllers\Settings\SeoSettingsController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\StarLeaderboardController;
use App\Http\Controllers\StudentRatingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoRoomController;
use App\Models\Book;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Support\SeoMeta;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
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
            ->take(5)
            ->get(['id', 'title', 'subject', 'level', 'teacher_id']),
    ]);
});

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', function () {
    $sitemap = SeoMeta::absoluteUrl('/sitemap.xml');
    $content = "User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /profile\nDisallow: /settings\nSitemap: {$sitemap}\n";

    return response($content, 200)->header('Content-Type', 'text/plain');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::resource('courses', CourseController::class);
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store'])->name('courses.enroll');
    Route::delete('/courses/{course}/enroll', [EnrollmentController::class, 'destroy'])->name('courses.unenroll');
    Route::post('/courses/{course}/reviews', [CourseReviewController::class, 'store'])->name('courses.reviews.store');
    Route::get('/courses/{course}/path', LearningPathController::class)->name('courses.path');
    Route::get('/courses/{course}/gradebook', GradebookController::class)->name('courses.gradebook');

    Route::get('/my-learning', MyLearningController::class)->name('learning.my');
    Route::get('/calendar', CalendarController::class)->name('calendar.index');
    Route::get('/analytics', AnalyticsController::class)->name('analytics.index');
    Route::get('/notes', [LessonNoteController::class, 'index'])->name('notes.index');

    Route::resource('lessons', LessonController::class);
    Route::post('/lessons/{lesson}/complete', [LessonCompletionController::class, 'store'])->name('lessons.complete');
    Route::post('/lessons/{lesson}/notes', [LessonNoteController::class, 'store'])->name('lessons.notes.store');
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
    Route::delete('/assignments/{assignment}', [AssignmentController::class, 'destroy'])->name('assignments.destroy');
    Route::post('/assignments/{assignment}/submit', [AssignmentSubmissionController::class, 'store'])->name('assignments.submit');
    Route::post('/assignments/{assignment}/submissions/{submission}/grade', [AssignmentSubmissionController::class, 'grade'])->name('assignments.grade');

    Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
    Route::post('/exams', [ExamController::class, 'store'])->name('exams.store');
    Route::get('/exams/{exam}', [ExamController::class, 'show'])->name('exams.show');
    Route::put('/exams/{exam}', [ExamController::class, 'update'])->name('exams.update');
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
        Route::resource('users', UserController::class)->except(['show']);
        Route::get('/settings/seo', [SeoSettingsController::class, 'edit'])->name('settings.seo.edit');
        Route::put('/settings/seo', [SeoSettingsController::class, 'update'])->name('settings.seo.update');
        Route::get('/settings/google', [GoogleSettingsController::class, 'edit'])->name('settings.google.edit');
        Route::put('/settings/google', [GoogleSettingsController::class, 'update'])->name('settings.google.update');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
