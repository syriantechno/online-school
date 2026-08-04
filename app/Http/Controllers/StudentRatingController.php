<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\StudentRating;
use App\Models\User;
use App\Services\StarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentRatingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $ratings = StudentRating::query()
            ->with(['student:id,name,stars', 'rater:id,name', 'course:id,title'])
            ->when($user->isStudent(), fn ($q) => $q->where('student_id', $user->id))
            ->when($user->isTeacher(), fn ($q) => $q->where('rated_by', $user->id))
            ->latest()
            ->paginate(15);

        $students = User::query()
            ->where('role', User::ROLE_STUDENT)
            ->orderBy('name')
            ->get(['id', 'name', 'stars']);

        return Inertia::render('Ratings/Index', [
            'ratings' => $ratings,
            'students' => $students,
            'courses' => Course::query()->orderBy('title')->get(['id', 'title']),
            'canRate' => $user->isAdmin() || $user->isTeacher(),
            'myStars' => $user->stars,
            'myAverage' => $user->isStudent() ? $user->averageRating() : null,
        ]);
    }

    public function store(Request $request, StarService $stars): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $request->validate([
            'student_id' => ['required', 'exists:users,id'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $student = User::query()->findOrFail($data['student_id']);
        abort_unless($student->isStudent(), 422, 'يمكن تقييم الطلاب فقط.');

        $rating = StudentRating::query()->create([
            'student_id' => $student->id,
            'rated_by' => $request->user()->id,
            'course_id' => $data['course_id'] ?? null,
            'stars' => $data['stars'],
            'comment' => $data['comment'] ?? null,
        ]);

        // Bonus stars equal to rating value
        $stars->award(
            $student,
            (int) $data['stars'],
            'rating',
            $rating,
            'تقييم من '.$request->user()->name
        );

        return back()->with('success', 'تم حفظ التقييم ومنح النجوم للطالب.');
    }
}
