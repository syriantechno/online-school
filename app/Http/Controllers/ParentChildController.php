<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParentChildController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isParent(), 403);

        $user = $request->user();

        if ($user->isAdmin()) {
            $parents = User::query()
                ->where('role', User::ROLE_PARENT)
                ->with(['children:id,name,email,stars'])
                ->orderBy('name')
                ->get(['id', 'name', 'email']);

            $students = User::query()
                ->where('role', User::ROLE_STUDENT)
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'stars']);

            return Inertia::render('Parents/Manage', [
                'parents' => $parents,
                'students' => $students,
            ]);
        }

        $children = $user->children()
            ->with(['enrollments.course:id,title', 'ratingsReceived'])
            ->get(['users.id', 'users.name', 'users.email', 'users.stars']);

        return Inertia::render('Parents/Children', [
            'children' => $children->map(fn (User $child) => [
                'id' => $child->id,
                'name' => $child->name,
                'email' => $child->email,
                'stars' => $child->stars,
                'average_rating' => round((float) $child->ratingsReceived->avg('stars'), 1),
                'enrollments' => $child->enrollments->map(fn ($e) => [
                    'id' => $e->id,
                    'progress_percent' => $e->progress_percent,
                    'status' => $e->status,
                    'course' => $e->course,
                ]),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        $data = $request->validate([
            'parent_id' => ['required', 'exists:users,id'],
            'student_id' => ['required', 'exists:users,id', 'different:parent_id'],
        ]);

        $parent = User::query()->findOrFail($data['parent_id']);
        $student = User::query()->findOrFail($data['student_id']);

        abort_unless($parent->isParent(), 422, 'المستخدم المحدد ليس ولي أمر.');
        abort_unless($student->isStudent(), 422, 'المستخدم المحدد ليس طالباً.');

        $parent->children()->syncWithoutDetaching([$student->id]);

        return back()->with('success', 'تم ربط الطالب بولي الأمر.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        $data = $request->validate([
            'parent_id' => ['required', 'exists:users,id'],
            'student_id' => ['required', 'exists:users,id'],
        ]);

        $parent = User::query()->findOrFail($data['parent_id']);
        $parent->children()->detach($data['student_id']);

        return back()->with('success', 'تم فك الربط.');
    }
}
