<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ConversationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = $user->conversations()
            ->with(['participants:id,name,role', 'latestMessage.user:id,name'])
            ->orderByDesc('last_message_at')
            ->paginate(20);

        $contacts = User::query()
            ->where('id', '!=', $user->id)
            ->where('is_active', true)
            ->when($user->isStudent(), fn ($q) => $q->whereIn('role', [User::ROLE_TEACHER, User::ROLE_ADMIN]))
            ->when($user->isTeacher(), fn ($q) => $q->whereIn('role', [User::ROLE_STUDENT, User::ROLE_ADMIN, User::ROLE_PARENT, User::ROLE_TEACHER]))
            ->when($user->isParent(), fn ($q) => $q->whereIn('role', [User::ROLE_TEACHER, User::ROLE_ADMIN]))
            ->orderBy('name')
            ->limit(50)
            ->get(['id', 'name', 'role']);

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
            'contacts' => $contacts,
        ]);
    }

    public function store(Request $request, NotificationService $notifications): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'different:'.$request->user()->id],
            'body' => ['required', 'string', 'max:5000'],
            'subject' => ['nullable', 'string', 'max:255'],
        ]);

        $other = User::query()->findOrFail($data['user_id']);
        $me = $request->user();

        $conversation = $this->findOrCreateDirect($me, $other, $data['subject'] ?? null);

        Message::query()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $me->id,
            'body' => $data['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);
        $conversation->participants()->updateExistingPivot($me->id, ['last_read_at' => now()]);

        $notifications->send(
            $other,
            'message',
            'رسالة جديدة من '.$me->name,
            str($data['body'])->limit(100),
            route('messages.show', $conversation->id)
        );

        return redirect()->route('messages.show', $conversation)->with('success', 'تم إرسال الرسالة.');
    }

    public function show(Request $request, Conversation $conversation): Response
    {
        abort_unless($conversation->participants()->where('users.id', $request->user()->id)->exists(), 403);

        $conversation->load(['participants:id,name,role']);
        $messages = $conversation->messages()->with('user:id,name')->get();

        $conversation->participants()->updateExistingPivot($request->user()->id, [
            'last_read_at' => now(),
        ]);

        $other = $conversation->participants->firstWhere('id', '!=', $request->user()->id);

        return Inertia::render('Messages/Show', [
            'conversation' => $conversation,
            'messages' => $messages,
            'other' => $other,
        ]);
    }

    private function findOrCreateDirect(User $me, User $other, ?string $subject = null): Conversation
    {
        $existingId = DB::table('conversation_user as cu1')
            ->join('conversation_user as cu2', 'cu1.conversation_id', '=', 'cu2.conversation_id')
            ->where('cu1.user_id', $me->id)
            ->where('cu2.user_id', $other->id)
            ->whereIn('cu1.conversation_id', function ($q) {
                $q->select('conversation_id')
                    ->from('conversation_user')
                    ->groupBy('conversation_id')
                    ->havingRaw('COUNT(*) = 2');
            })
            ->value('cu1.conversation_id');

        if ($existingId) {
            return Conversation::query()->findOrFail($existingId);
        }

        $conversation = Conversation::query()->create([
            'subject' => $subject,
            'last_message_at' => now(),
        ]);

        $conversation->participants()->attach([$me->id, $other->id]);

        return $conversation;
    }
}
