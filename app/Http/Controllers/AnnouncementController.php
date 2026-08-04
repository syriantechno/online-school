<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $announcements = Announcement::query()
            ->with(['author:id,name', 'course:id,title'])
            ->when(
                $user->isStudent() || $user->isParent(),
                fn ($q) => $q->where('is_published', true)
            )
            ->when(
                $user->isTeacher(),
                fn ($q) => $q->where(function ($inner) use ($user) {
                    $inner->where('author_id', $user->id)
                        ->orWhereHas('course', fn ($c) => $c->where('teacher_id', $user->id))
                        ->orWhere(fn ($g) => $g->whereNull('course_id')->where('is_published', true));
                })
            )
            ->when(
                $user->isStudent(),
                function ($q) use ($user) {
                    $q->where(function ($inner) use ($user) {
                        $inner->whereNull('course_id')
                            ->orWhereHas('course.enrollments', fn ($e) => $e->where('user_id', $user->id));
                    });
                }
            )
            ->latest('published_at')
            ->latest()
            ->paginate(12);

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'canManage' => $user->isAdmin() || $user->isTeacher(),
            'courses' => ($user->isAdmin() || $user->isTeacher())
                ? Course::query()
                    ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
                    ->orderBy('title')
                    ->get(['id', 'title'])
                : [],
        ]);
    }

    public function store(Request $request, NotificationService $notifications): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        if (! empty($data['course_id']) && $request->user()->isTeacher()) {
            abort_unless(
                Course::query()->where('id', $data['course_id'])->where('teacher_id', $request->user()->id)->exists(),
                403
            );
        }

        $announcement = Announcement::query()->create([
            'title' => $data['title'],
            'body' => $data['body'],
            'course_id' => $data['course_id'] ?? null,
            'author_id' => $request->user()->id,
            'is_published' => $data['is_published'] ?? true,
            'published_at' => now(),
        ]);

        if ($announcement->is_published) {
            $recipients = empty($data['course_id'])
                ? User::query()->whereIn('role', [User::ROLE_STUDENT, User::ROLE_PARENT])->where('is_active', true)->get()
                : User::query()->whereIn('id', Enrollment::query()->where('course_id', $data['course_id'])->pluck('user_id'))->get();

            $notifications->sendMany(
                $recipients,
                'announcement',
                'إعلان جديد: '.$announcement->title,
                str($announcement->body)->limit(120),
                route('announcements.index')
            );
        }

        return back()->with('success', 'تم نشر الإعلان.');
    }

    public function destroy(Request $request, Announcement $announcement): RedirectResponse
    {
        abort_unless(
            $request->user()->isAdmin() || $announcement->author_id === $request->user()->id,
            403
        );

        $announcement->delete();

        return back()->with('success', 'تم حذف الإعلان.');
    }
}
