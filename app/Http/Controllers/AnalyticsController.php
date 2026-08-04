<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\AttendanceRecord;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonCompletion;
use App\Models\VideoRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user->isAdmin() || $user->isTeacher(), 403);

        $courseQuery = Course::query()
            ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id));

        $courseIds = (clone $courseQuery)->pluck('id');

        $enrollments = Enrollment::query()->whereIn('course_id', $courseIds);
        $pendingSubmissions = AssignmentSubmission::query()
            ->where('status', 'submitted')
            ->whereHas('assignment', fn ($q) => $q->whereIn('course_id', $courseIds))
            ->count();

        $attendanceWeek = AttendanceRecord::query()
            ->where('checked_in_at', '>=', now()->subDays(7))
            ->whereHas('videoRoom', function ($q) use ($user, $courseIds) {
                $q->when($user->isTeacher(), fn ($inner) => $inner->where('host_id', $user->id))
                    ->when($user->isAdmin() && $courseIds->isNotEmpty(), function ($inner) use ($courseIds) {
                        $inner->where(function ($w) use ($courseIds) {
                            $w->whereIn('course_id', $courseIds)->orWhereNull('course_id');
                        });
                    });
            })
            ->count();

        $courseStats = (clone $courseQuery)
            ->withCount(['enrollments', 'lessons', 'assignments'])
            ->withAvg('enrollments', 'progress_percent')
            ->orderByDesc('enrollments_count')
            ->take(10)
            ->get()
            ->map(fn (Course $c) => [
                'id' => $c->id,
                'title' => $c->title,
                'enrollments_count' => $c->enrollments_count,
                'lessons_count' => $c->lessons_count,
                'assignments_count' => $c->assignments_count,
                'avg_progress' => (int) round($c->enrollments_avg_progress_percent ?? 0),
                'completed' => Enrollment::query()
                    ->where('course_id', $c->id)
                    ->where('progress_percent', '>=', 100)
                    ->count(),
            ]);

        $progressBuckets = Enrollment::query()
            ->whereIn('course_id', $courseIds)
            ->selectRaw("
                SUM(CASE WHEN progress_percent < 25 THEN 1 ELSE 0 END) as low,
                SUM(CASE WHEN progress_percent >= 25 AND progress_percent < 50 THEN 1 ELSE 0 END) as mid_low,
                SUM(CASE WHEN progress_percent >= 50 AND progress_percent < 75 THEN 1 ELSE 0 END) as mid_high,
                SUM(CASE WHEN progress_percent >= 75 AND progress_percent < 100 THEN 1 ELSE 0 END) as high,
                SUM(CASE WHEN progress_percent >= 100 THEN 1 ELSE 0 END) as done
            ")
            ->first();

        $topStudents = Enrollment::query()
            ->select('user_id', DB::raw('AVG(progress_percent) as avg_progress'), DB::raw('COUNT(*) as courses_count'))
            ->whereIn('course_id', $courseIds)
            ->groupBy('user_id')
            ->orderByDesc('avg_progress')
            ->take(8)
            ->with('user:id,name,email,stars')
            ->get()
            ->map(fn ($row) => [
                'user' => $row->user,
                'avg_progress' => (int) round($row->avg_progress),
                'courses_count' => $row->courses_count,
            ]);

        return Inertia::render('Analytics/Index', [
            'summary' => [
                'courses' => $courseIds->count(),
                'students' => (clone $enrollments)->distinct('user_id')->count('user_id'),
                'enrollments' => (clone $enrollments)->count(),
                'avgProgress' => (int) round((clone $enrollments)->avg('progress_percent') ?? 0),
                'pendingSubmissions' => $pendingSubmissions,
                'attendanceWeek' => $attendanceWeek,
                'certificates' => Certificate::query()->whereIn('course_id', $courseIds)->count(),
                'completions' => LessonCompletion::query()
                    ->whereHas('lesson', fn ($q) => $q->whereIn('course_id', $courseIds))
                    ->count(),
                'liveRooms' => VideoRoom::query()
                    ->when($user->isTeacher(), fn ($q) => $q->where('host_id', $user->id))
                    ->where('scheduled_at', '>=', now()->subDay())
                    ->where('scheduled_at', '<=', now()->addDays(7))
                    ->count(),
                'assignments' => Assignment::query()->whereIn('course_id', $courseIds)->count(),
            ],
            'courseStats' => $courseStats,
            'progressBuckets' => [
                ['label' => '0–24%', 'value' => (int) ($progressBuckets->low ?? 0)],
                ['label' => '25–49%', 'value' => (int) ($progressBuckets->mid_low ?? 0)],
                ['label' => '50–74%', 'value' => (int) ($progressBuckets->mid_high ?? 0)],
                ['label' => '75–99%', 'value' => (int) ($progressBuckets->high ?? 0)],
                ['label' => 'مكتمل', 'value' => (int) ($progressBuckets->done ?? 0)],
            ],
            'topStudents' => $topStudents,
        ]);
    }
}
