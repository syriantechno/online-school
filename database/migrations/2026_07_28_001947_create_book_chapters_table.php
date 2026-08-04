<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->unsignedInteger('page_from')->default(1);
            $table->unsignedInteger('page_to')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_interactive')->default(true);
            $table->json('interactive_payload')->nullable();
            $table->unsignedTinyInteger('stars_reward')->default(3);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_chapters');
    }
};
