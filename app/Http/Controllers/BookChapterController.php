<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookChapter;
use App\Services\StarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BookChapterController extends Controller
{
    public function store(Request $request, Book $book): RedirectResponse
    {
        $this->authorizeManage($request, $book);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'page_from' => ['required', 'integer', 'min:1'],
            'page_to' => ['nullable', 'integer', 'min:1'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'stars_reward' => ['nullable', 'integer', 'min:1', 'max:20'],
            'is_interactive' => ['sometimes', 'boolean'],
            'interactive_payload' => ['nullable', 'array'],
            'interactive_payload.questions' => ['nullable', 'array'],
            'interactive_payload.questions.*.question' => ['required_with:interactive_payload.questions', 'string'],
            'interactive_payload.questions.*.options' => ['required_with:interactive_payload.questions', 'array', 'min:2'],
            'interactive_payload.questions.*.options.*' => ['required', 'string'],
            'interactive_payload.questions.*.correct_index' => ['required_with:interactive_payload.questions', 'integer', 'min:0'],
            'interactive_payload.questions.*.explanation' => ['nullable', 'string'],
        ]);

        $book->chapters()->create([
            'title' => $data['title'],
            'page_from' => $data['page_from'],
            'page_to' => $data['page_to'] ?? null,
            'sort_order' => $data['sort_order'] ?? (($book->chapters()->max('sort_order') ?? 0) + 1),
            'stars_reward' => $data['stars_reward'] ?? 3,
            'is_interactive' => $data['is_interactive'] ?? true,
            'interactive_payload' => $data['interactive_payload'] ?? ['questions' => []],
        ]);

        return back()->with('success', 'تم إضافة الفصل التفاعلي.');
    }

    public function update(Request $request, Book $book, BookChapter $chapter): RedirectResponse
    {
        abort_unless($chapter->book_id === $book->id, 404);
        $this->authorizeManage($request, $book);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'page_from' => ['required', 'integer', 'min:1'],
            'page_to' => ['nullable', 'integer', 'min:1'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'stars_reward' => ['nullable', 'integer', 'min:1', 'max:20'],
            'is_interactive' => ['sometimes', 'boolean'],
            'interactive_payload' => ['nullable', 'array'],
        ]);

        $chapter->update($data);

        return back()->with('success', 'تم تحديث الفصل.');
    }

    public function destroy(Request $request, Book $book, BookChapter $chapter): RedirectResponse
    {
        abort_unless($chapter->book_id === $book->id, 404);
        $this->authorizeManage($request, $book);
        $chapter->delete();

        return back()->with('success', 'تم حذف الفصل.');
    }

    public function complete(Request $request, Book $book, BookChapter $chapter, StarService $stars): RedirectResponse
    {
        abort_unless($chapter->book_id === $book->id, 404);
        abort_unless($book->is_published || $request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $request->validate([
            'score' => ['required', 'integer', 'min:0'],
            'total' => ['required', 'integer', 'min:1'],
        ]);

        $pass = ($data['score'] / $data['total']) >= 0.5;
        $user = $request->user();

        if ($pass && ! $stars->alreadyAwarded($user, $chapter, 'quiz_book')) {
            $reward = (int) $chapter->stars_reward;
            $stars->award($user, $reward, 'quiz_book', $chapter, 'إتمام فصل: '.$chapter->title);

            return back()->with('success', "أحسنت! حصلت على {$reward} نجوم.");
        }

        if ($pass) {
            return back()->with('success', 'أحسنت! سبق وحصلت على نجوم هذا الفصل.');
        }

        return back()->with('error', 'حاول مرة أخرى للحصول على النجوم (يلزم نصف الإجابات على الأقل).');
    }

    private function authorizeManage(Request $request, Book $book): void
    {
        $user = $request->user();
        abort_unless(
            $user->isAdmin() || ($user->isTeacher() && $book->uploaded_by === $user->id),
            403
        );
    }
}
