<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (function_exists('ini_set')) {
            $current = (string) ini_get('memory_limit');
            if ($current !== '-1') {
                ini_set('memory_limit', '256M');
            }
        }

        Vite::prefetch(concurrency: 3);
    }
}
