<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
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
            <meta name="description" content="{{ \Illuminate\Support\Str::limit(strip_tags($description), 300, '') }}">
        @endif
        @if($keywords)
            <meta name="keywords" content="{{ \Illuminate\Support\Str::limit(strip_tags($keywords), 300, '') }}">
        @endif
        <meta name="robots" content="index,follow">
        <link rel="canonical" href="{{ $canonical }}">
        <link rel="sitemap" type="application/xml" href="{{ url('/sitemap.xml') }}">
        @if($verification)
            <meta name="google-site-verification" content="{{ $verification }}">
        @endif

        <meta property="og:locale" content="ar_SA">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ \Illuminate\Support\Str::limit($title, 120, '') }}">
        <meta property="og:description" content="{{ \Illuminate\Support\Str::limit(strip_tags($description), 300, '') }}">
        <meta property="og:url" content="{{ $canonical }}">
        <meta property="og:site_name" content="{{ $seo->site_name ?: config('app.name') }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ \Illuminate\Support\Str::limit($title, 120, '') }}">
        <meta name="twitter:description" content="{{ \Illuminate\Support\Str::limit(strip_tags($description), 300, '') }}">
        <meta name="twitter:image" content="{{ $ogImage }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=amiri:400,700|cairo:400,500,600,700|mirza:400,500,600,700&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        @include('components.google-gtag')
    </head>
    <body class="font-sans antialiased bg-[#f7f8fa] text-slate-600">
        <script>
            (function () {
                @if(request()->is('/') && ! auth()->check())
                    var theme = 'general';
                @elseif(auth()->check())
                    @if(auth()->user()->role === 'student')
                        var theme = @json(auth()->user()->gender === 'female' ? 'girl' : 'boy');
                    @else
                        var theme = 'boy';
                    @endif
                @else
                    var theme = localStorage.getItem('student-login-theme') === 'girl' ? 'girl' : 'boy';
                @endif
                var cls = theme === 'girl'
                    ? 'site-theme-girl'
                    : (theme === 'general' ? 'site-theme-general' : 'site-theme-boy');
                document.documentElement.classList.add(cls);
            })();
        </script>
        @inertia
    </body>
</html>
