<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->is_active) {
            abort(403, 'غير مصرح.');
        }

        if ($roles !== [] && ! in_array($user->role, $roles, true)) {
            abort(403, 'ليس لديك صلاحية للوصول.');
        }

        return $next($request);
    }
}
