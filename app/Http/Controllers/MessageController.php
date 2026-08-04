<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, Conversation $conversation, NotificationService $notifications): RedirectResponse
    {
        abort_unless($conversation->participants()->where('users.id', $request->user()->id)->exists(), 403);

        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        Message::query()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);
        $conversation->participants()->updateExistingPivot($request->user()->id, ['last_read_at' => now()]);

        $others = $conversation->participants()->where('users.id', '!=', $request->user()->id)->get();
        foreach ($others as $other) {
            $notifications->send(
                $other,
                'message',
                'رسالة جديدة من '.$request->user()->name,
                str($data['body'])->limit(100),
                route('messages.show', $conversation->id)
            );
        }

        return back()->with('success', 'تم الإرسال.');
    }
}
