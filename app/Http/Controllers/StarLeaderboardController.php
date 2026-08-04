<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class StarLeaderboardController extends Controller
{
    public function __invoke(): Response
    {
        $leaders = User::query()
            ->where('role', User::ROLE_STUDENT)
            ->where('is_active', true)
            ->orderByDesc('stars')
            ->orderBy('name')
            ->limit(50)
            ->get(['id', 'name', 'stars']);

        return Inertia::render('Stars/Leaderboard', [
            'leaders' => $leaders,
            'me' => [
                'id' => auth()->id(),
                'stars' => auth()->user()->stars,
                'average_rating' => auth()->user()->isStudent() ? auth()->user()->averageRating() : null,
            ],
        ]);
    }
}
