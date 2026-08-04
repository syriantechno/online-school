<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonNote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LessonNoteController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user->isStudent() || $user->isAdmin(), 403);

        $notes = LessonNote::query()
            ->with(['lesson:id,title,course_id', 'lesson.course:id,title'])
            ->where('user_id', $user->id)
            ->when($request->bookmarked, fn ($q) => $q->where('is_bookmarked', true))
            ->latest('updated_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Notes/Index', [
            'notes' => $notes,
            'filters' => [
                'bookmarked' => (bool) $request->bookmarked,
            ],
        ]);
    }

    public function store(Request $request, Lesson $lesson): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isStudent() || $user->isAdmin(), 403);

        $enrolled = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $lesson->course_id)
            ->exists();

        abort_unless($enrolled || $user->isAdmin(), 403);

        $data = $request->validate([
            'body' => ['nullable', 'string', 'max:5000'],
            'is_bookmarked' => ['sometimes', 'boolean'],
        ]);

        LessonNote::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'body' => $data['body'] ?? null,
                'is_bookmarked' => $data['is_bookmarked'] ?? false,
            ]
        );

        return back()->with('success', 'تم حفظ الملاحظة.');
    }
}
