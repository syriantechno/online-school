<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $certificates = Certificate::query()
            ->with(['course:id,title,subject', 'user:id,name'])
            ->when($user->isStudent(), fn ($q) => $q->where('user_id', $user->id))
            ->when($user->isParent(), fn ($q) => $q->whereIn('user_id', $user->children()->pluck('users.id')))
            ->when($user->isTeacher(), function ($q) use ($user) {
                $q->whereHas('course', fn ($c) => $c->where('teacher_id', $user->id));
            })
            ->latest('issued_at')
            ->paginate(12);

        return Inertia::render('Certificates/Index', [
            'certificates' => $certificates,
        ]);
    }

    public function show(Request $request, Certificate $certificate): Response
    {
        $certificate->load(['course:id,title,subject,level,teacher_id', 'user:id,name']);

        $user = $request->user();
        $allowed = $user->isAdmin()
            || $certificate->user_id === $user->id
            || ($user->isTeacher() && $certificate->course?->teacher_id === $user->id)
            || ($user->isParent() && $user->children()->where('users.id', $certificate->user_id)->exists());

        abort_unless($allowed, 403);

        return Inertia::render('Certificates/Show', [
            'certificate' => $certificate,
        ]);
    }
}
