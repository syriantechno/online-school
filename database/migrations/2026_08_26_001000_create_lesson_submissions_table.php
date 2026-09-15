<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lesson_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('block_id', 80)->nullable();
            $table->string('kind', 40)->default('voice_reading');
            $table->string('file_path')->nullable();
            $table->text('content')->nullable();
            $table->string('status')->default('submitted');
            $table->unsignedTinyInteger('score')->nullable();
            $table->text('teacher_feedback')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();

            $table->unique(['lesson_id', 'user_id', 'block_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_submissions');
    }
};
