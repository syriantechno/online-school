<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class FailedLoginSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('failed_logins')->insert([
            [
                'email' => 'unknown@example.com',
                'ip_address' => '192.168.1.10',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
                'failed_at' => $now->subMinutes(5),
                'created_at' => $now->subMinutes(5),
                'updated_at' => $now->subMinutes(5),
            ],
            [
                'email' => 'hacker@example.com',
                'ip_address' => '10.0.0.5',
                'user_agent' => 'curl/7.68.0',
                'failed_at' => $now->subMinutes(12),
                'created_at' => $now->subMinutes(12),
                'updated_at' => $now->subMinutes(12),
            ],
            [
                'email' => 'admin@school.test',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'PostmanRuntime/7.29.0',
                'failed_at' => $now->subMinutes(30),
                'created_at' => $now->subMinutes(30),
                'updated_at' => $now->subMinutes(30),
            ],
        ]);
    }
}
