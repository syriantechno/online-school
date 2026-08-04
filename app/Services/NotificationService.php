<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Support\Collection;

class NotificationService
{
    public function send(User $user, string $type, string $title, ?string $body = null, ?string $link = null): AppNotification
    {
        return AppNotification::query()->create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'link' => $link,
        ]);
    }

    public function sendMany(Collection|array $users, string $type, string $title, ?string $body = null, ?string $link = null): void
    {
        foreach ($users as $user) {
            if ($user instanceof User) {
                $this->send($user, $type, $title, $body, $link);
            }
        }
    }
}
