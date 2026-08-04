<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Course;
use App\Models\VideoRoom;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VideoRoomController extends Controller
{
    public function index(Request $request): Response
    {
        $rooms = VideoRoom::query()
            ->with(['host:id,name', 'course:id,title'])
            ->when($request->user()->isTeacher(), fn ($q) => $q->where('host_id', $request->user()->id))
            ->when($request->user()->isStudent(), fn ($q) => $q->where('is_active', true))
            ->latest()
            ->paginate(12);

        return Inertia::render('VideoRooms/Index', [
            'rooms' => $rooms,
            'canManage' => $request->user()->isAdmin() || $request->user()->isTeacher(),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        return Inertia::render('VideoRooms/Form', [
            'room' => null,
            'courses' => Course::query()
                ->when($request->user()->isTeacher(), fn ($q) => $q->where('teacher_id', $request->user()->id))
                ->orderBy('title')
                ->get(['id', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'scheduled_at' => ['nullable', 'date'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $title = $data['title'];
        $room = VideoRoom::query()->create([
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(4)),
            'room_code' => VideoRoom::generateRoomCode(),
            'description' => $data['description'] ?? null,
            'host_id' => $request->user()->id,
            'course_id' => $data['course_id'] ?? null,
            'scheduled_at' => $data['scheduled_at'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return redirect()->route('video-rooms.show', $room)->with('success', 'تم إنشاء غرفة الفيديو.');
    }

    public function show(Request $request, VideoRoom $videoRoom): Response
    {
        $user = $request->user();
        $videoRoom->load(['host:id,name', 'course:id,title,teacher_id']);

        $checkedIn = AttendanceRecord::query()
            ->where('video_room_id', $videoRoom->id)
            ->where('user_id', $user->id)
            ->exists();

        return Inertia::render('VideoRooms/Show', [
            'room' => $videoRoom,
            'jitsiUrl' => $videoRoom->jitsiUrl(),
            'displayName' => $user->name,
            'checkedIn' => $checkedIn,
            'attendanceCount' => $videoRoom->attendanceRecords()->count(),
            'canManageAttendance' => $user->isAdmin() || $videoRoom->host_id === $user->id,
        ]);
    }

    public function destroy(Request $request, VideoRoom $videoRoom): RedirectResponse
    {
        abort_unless(
            $request->user()->isAdmin() || $videoRoom->host_id === $request->user()->id,
            403
        );

        $videoRoom->delete();

        return redirect()->route('video-rooms.index')->with('success', 'تم حذف الغرفة.');
    }
}
