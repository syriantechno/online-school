<?php

namespace App\Services;

use App\Models\StarTransaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class StarService
{
    public function award(User $user, int $amount, string $reason, ?Model $source = null, ?string $note = null): StarTransaction
    {
        return DB::transaction(function () use ($user, $amount, $reason, $source, $note) {
            $tx = StarTransaction::query()->create([
                'user_id' => $user->id,
                'amount' => $amount,
                'reason' => $reason,
                'source_type' => $source?->getMorphClass(),
                'source_id' => $source?->getKey(),
                'note' => $note,
            ]);

            $user->increment('stars', $amount);

            return $tx;
        });
    }

    public function alreadyAwarded(User $user, Model $source, string $reason): bool
    {
        return StarTransaction::query()
            ->where('user_id', $user->id)
            ->where('reason', $reason)
            ->where('source_type', $source->getMorphClass())
            ->where('source_id', $source->getKey())
            ->exists();
    }
}
