<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_bank_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete();
            $table->string('grade_level')->nullable();
            $table->string('skill')->nullable();
            $table->string('difficulty')->default('medium');
            $table->string('type')->default('single');
            $table->text('prompt');
            $table->json('options')->nullable();
            $table->json('correct_answers')->nullable();
            $table->unsignedInteger('points')->default(1);
            $table->text('explanation')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('times_used')->default(0);
            $table->timestamps();

            $table->index(['course_id', 'skill', 'difficulty']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('question_bank_items');
    }
};
