<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Course;
use App\Support\SeoMeta;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = [
            ['loc' => SeoMeta::absoluteUrl('/'), 'priority' => '1.0'],
            ['loc' => SeoMeta::absoluteUrl('/login'), 'priority' => '0.5'],
            ['loc' => SeoMeta::absoluteUrl('/register'), 'priority' => '0.5'],
        ];

        foreach (Course::query()->where('is_published', true)->get(['slug', 'updated_at']) as $course) {
            $urls[] = [
                'loc' => SeoMeta::absoluteUrl('/courses/'.$course->id),
                'lastmod' => optional($course->updated_at)->toAtomString(),
                'priority' => '0.8',
            ];
        }

        foreach (Book::query()->where('is_published', true)->get(['id', 'updated_at']) as $book) {
            $urls[] = [
                'loc' => SeoMeta::absoluteUrl('/books/'.$book->id),
                'lastmod' => optional($book->updated_at)->toAtomString(),
                'priority' => '0.7',
            ];
        }

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
