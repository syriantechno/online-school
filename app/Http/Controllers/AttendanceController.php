<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Enrollment;
use App\Models\VideoRoom;
use App\Services\StarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function checkIn(Request $request, VideoRoom $videoRoom, StarService $stars): RedirectResponse
    {
        $user = $request->user();
        abort_unless($videoRoom->is_active, 403);

        if ($user->isStudent() && $videoRoom->course_id) {
            abort_unless(
                Enrollment::query()
                    ->where('user_id', $user->id)
                    ->where('course_id', $videoRoom->course_id)
                    ->exists(),
                403,
                'سجّل في الدورة أولاً.'
            );
        }

        $existing = AttendanceRecord::query()
            ->where('video_room_id', $videoRoom->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return back()->with('success', 'سجّلت حضورك مسبقاً.');
        }

        $late = $videoRoom->scheduled_at && now()->gt($videoRoom->scheduled_at->copy()->addMinutes(15));

        $record = AttendanceRecord::query()->create([
            'video_room_id' => $videoRoom->id,
            'user_id' => $user->id,
            'checked_in_at' => now(),
            'status' => $late ? 'late' : 'present',
        ]);

        if ($user->isStudent() && ! $stars->alreadyAwarded($user, $record, 'attendance')) {
            $stars->award($user, 1, 'attendance', $record, 'حضور حصة: '.$videoRoom->title);
        }

        return back()->with('success', $late ? 'تم تسجيل الحضور (متأخر).' : 'تم تسجيل الحضور (+1 نجمة).');
    }

    public function index(Request $request, VideoRoom $videoRoom): Response
    {
        abort_unless(
            $request->user()->isAdmin() || $videoRoom->host_id === $request->user()->id,
            403
        );

        $videoRoom->load('course:id,title,teacher_id');

        $records = AttendanceRecord::query()
            ->with('user:id,name,email')
            ->where('video_room_id', $videoRoom->id)
            ->latest('checked_in_at')
            ->get();

        return Inertia::render('Attendance/Index', [
            'room' => $videoRoom,
            'records' => $records,
            'presentCount' => $records->where('status', 'present')->count(),
            'lateCount' => $records->where('status', 'late')->count(),
        ]);
    }
}
