<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->nullable();
            $table->string('default_meta_title')->nullable();
            $table->text('default_meta_description')->nullable();
            $table->string('default_meta_keywords')->nullable();
            $table->string('og_image_url')->nullable();
            $table->string('google_analytics_id')->nullable();
            $table->string('google_analytics_property_id')->nullable();
            $table->string('google_ads_aw_id')->nullable();
            $table->string('google_ads_conversion_label')->nullable();
            $table->string('google_search_console_api_key')->nullable();
            $table->boolean('auto_submit_google')->default(true);
            $table->string('meta_title_template')->nullable();
            $table->string('meta_description_template')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
    }
};
