<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $books = Book::query()
            ->select(['id', 'title', 'slug', 'file_type', 'course_id', 'uploaded_by', 'is_published', 'created_at', 'updated_at'])
            ->with(['course:id,title', 'uploader:id,name'])
            ->when($user->isStudent(), fn ($q) => $q
                ->where('is_published', true)
                ->where(fn ($books) => $books
                    ->whereNull('course_id')
                    ->orWhere(fn ($linked) => $linked
                        ->whereHas('course', fn ($courses) => $courses->where('is_published', true))
                        ->whereHas('course.enrollments', fn ($enrollments) => $enrollments->where('user_id', $user->id)))))
            ->when($user->isTeacher(), fn ($q) => $q->where('uploaded_by', $user->id))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Books/Index', [
            'books' => $books,
            'canManage' => $user->isAdmin() || $user->isTeacher(),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        return Inertia::render('Books/Form', [
            'book' => null,
            'courses' => $this->coursesForUser($request),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'is_published' => ['sometimes', 'boolean'],
            'file' => ['required', 'file', 'mimes:pdf,epub', 'max:51200'],
        ]);

        $path = $request->file('file')->store('books', 'public');

        Book::create([
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['title']),
            'description' => $data['description'] ?? null,
            'course_id' => $data['course_id'] ?? null,
            'file_path' => $path,
            'file_type' => $request->file('file')->getClientOriginalExtension(),
            'uploaded_by' => $request->user()->id,
            'is_published' => $data['is_published'] ?? false,
        ]);

        return redirect()->route('books.index')->with('success', 'تم رفع الكتاب.');
    }

    public function show(Request $request, Book $book): Response
    {
        $user = $request->user();
        $canManage = $user->isAdmin() || ($user->isTeacher() && $book->uploaded_by === $user->id);

        if ($user->isStudent()) {
            abort_unless($book->is_published, 404);
            if ($book->course_id) {
                abort_unless($book->course()->where('is_published', true)->exists(), 404);
                abort_unless(
                    Enrollment::query()->where('user_id', $user->id)->where('course_id', $book->course_id)->exists(),
                    403
                );
            }
        } elseif (! $canManage) {
            abort(403);
        }

        $book->load(['course:id,title', 'uploader:id,name', 'chapters']);

        return Inertia::render('Books/Show', [
            'book' => $book,
            'fileUrl' => Storage::disk('public')->url($book->file_path),
            'canManage' => $canManage,
            'userStars' => $request->user()->stars,
        ]);
    }

    public function edit(Request $request, Book $book): Response
    {
        $this->authorizeManage($request, $book);

        return Inertia::render('Books/Form', [
            'book' => $book,
            'courses' => $this->coursesForUser($request),
        ]);
    }

    public function update(Request $request, Book $book): RedirectResponse
    {
        $this->authorizeManage($request, $book);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'is_published' => ['sometimes', 'boolean'],
            'file' => ['nullable', 'file', 'mimes:pdf,epub', 'max:51200'],
        ]);

        $payload = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'course_id' => $data['course_id'] ?? null,
            'is_published' => $data['is_published'] ?? false,
        ];

        if ($data['title'] !== $book->title) {
            $payload['slug'] = $this->uniqueSlug($data['title'], $book->id);
        }

        if ($request->hasFile('file')) {
            Storage::disk('public')->delete($book->file_path);
            $payload['file_path'] = $request->file('file')->store('books', 'public');
            $payload['file_type'] = $request->file('file')->getClientOriginalExtension();
        }

        $book->update($payload);

        return redirect()->route('books.index')->with('success', 'تم تحديث الكتاب.');
    }

    public function destroy(Request $request, Book $book): RedirectResponse
    {
        $this->authorizeManage($request, $book);
        Storage::disk('public')->delete($book->file_path);
        $book->delete();

        return redirect()->route('books.index')->with('success', 'تم حذف الكتاب.');
    }

    private function coursesForUser(Request $request)
    {
        $user = $request->user();

        return Course::query()
            ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
            ->orderBy('title')
            ->get(['id', 'title']);
    }

    private function authorizeManage(Request $request, Book $book): void
    {
        $user = $request->user();
        abort_unless(
            $user->isAdmin() || ($user->isTeacher() && $book->uploaded_by === $user->id),
            403
        );
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: Str::random(8);
        $slug = $base;
        $i = 1;
        while (
            Book::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
