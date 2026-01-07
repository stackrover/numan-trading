<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Settings;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Get page data including blocks, fields, SEO and hydrated document content.
     */
    public function getPage($slug)
    {
        $page = Page::with(['blocks.fields', 'seo', 'document'])
            ->where('slug', $slug)
            ->whereNotNull('published_at')
            ->firstOrFail();

        if ($page->document) {
            $page->document->hydrateMedia();
        }

        return response()->json([
            'title' => $page->title,
            'slug' => $page->slug,
            'seo' => $page->seo,
            'content' => $page->document ? $page->document->data : null,
            'structure' => $page->blocks,
            'published_at' => $page->published_at,
        ]);
    }

    /**
     * Get global site settings.
     */
    public function getSettings()
    {
        // Assuming a settings table or similar exists, or returning a default shim
        return response()->json([
            'site_name' => config('app.name'),
            'logo' => null,
            'footer_text' => '© ' . date('Y') . ' Numan Trading.',
        ]);
    }
}
