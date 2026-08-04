<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl" class="default">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
            (function () {
                try {
                    var t = localStorage.getItem('theme-color') || 'default';
                    var allowed = ['default','theme-1','theme-2','theme-3','theme-4','theme-5','theme-6','theme-7','theme-8','theme-9','theme-10','theme-11','theme-12','theme-13','theme-14','theme-15','theme-16','theme-17'];
                    if (allowed.indexOf(t) === -1) t = 'default';
                    document.documentElement.className = t;
                } catch (e) {}
            })();
        </script>

        @php
            $seo = \App\Models\SeoSetting::getCurrent();
            $description = $seo->default_meta_description;
            $keywords = $seo->default_meta_keywords;
            $canonical = \App\Support\SeoMeta::canonicalUrl();
            $ogImage = \App\Support\SeoMeta::ogImageUrl();
            $verification = \App\Support\SeoMeta::siteVerification();
            $title = $seo->default_meta_title ?: ($seo->site_name ?: config('app.name'));
        @endphp

        <title inertia>{{ $seo->site_name ?: config('app.name', 'المدرسة الإلكترونية') }}</title>
        @if($description)
            <meta name="description" content="{{ $description }}">
        @endif
        @if($keywords)
            <meta name="keywords" content="{{ $keywords }}">
        @endif
        <meta name="robots" content="index,follow">
        <link rel="canonical" href="{{ $canonical }}">
        <link rel="sitemap" type="application/xml" href="{{ url('/sitemap.xml') }}">
        @if($verification)
            <meta name="google-site-verification" content="{{ $verification }}">
        @endif

        <meta property="og:locale" content="ar_SA">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $title }}">
        <meta property="og:description" content="{{ $description }}">
        <meta property="og:url" content="{{ $canonical }}">
        <meta property="og:site_name" content="{{ $seo->site_name ?: config('app.name') }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $title }}">
        <meta name="twitter:description" content="{{ $description }}">
        <meta name="twitter:image" content="{{ $ogImage }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=cairo:400,500,600,700&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        @include('components.google-gtag')
    </head>
    <body class="font-sans antialiased bg-slate-50 text-slate-600">
        @inertia
    </body>
</html>
