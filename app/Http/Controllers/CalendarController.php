<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Enrollment;
use App\Models\VideoRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $rooms = VideoRoom::query()
            ->with(['host:id,name', 'course:id,title'])
            ->where('is_active', true)
            ->whereNotNull('scheduled_at')
            ->when($user->isTeacher(), fn ($q) => $q->where('host_id', $user->id))
            ->when($user->isStudent(), function ($q) use ($user) {
                $courseIds = Enrollment::query()->where('user_id', $user->id)->pluck('course_id');
                $q->where(function ($inner) use ($courseIds) {
                    $inner->whereIn('course_id', $courseIds)->orWhereNull('course_id');
                });
            })
            ->orderBy('scheduled_at')
            ->get();

        $assignments = Assignment::query()
            ->with('course:id,title')
            ->where('is_published', true)
            ->whereNotNull('due_at')
            ->when($user->isTeacher(), fn ($q) => $q->where('created_by', $user->id))
            ->when($user->isStudent(), function ($q) use ($user) {
                $q->whereHas('course.enrollments', fn ($e) => $e->where('user_id', $user->id));
            })
            ->orderBy('due_at')
            ->get();

        $events = collect()
            ->merge($rooms->map(fn (VideoRoom $room) => [
                'id' => 'room-'.$room->id,
                'type' => 'video',
                'title' => $room->title,
                'subtitle' => $room->course?->title ?: 'غرفة فيديو',
                'at' => $room->scheduled_at?->toIso8601String(),
                'href' => route('video-rooms.show', $room->id),
            ]))
            ->merge($assignments->map(fn (Assignment $a) => [
                'id' => 'assignment-'.$a->id,
                'type' => 'assignment',
                'title' => $a->title,
                'subtitle' => $a->course?->title ?: 'واجب',
                'at' => $a->due_at?->toIso8601String(),
                'href' => route('assignments.show', $a->id),
            ]))
            ->sortBy('at')
            ->values();

        return Inertia::render('Calendar/Index', [
            'events' => $events,
        ]);
    }
}
