<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Settings;
use App\Models\Visitor;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Get page data including blocks, fields, SEO and hydrated document content.
     */
    public function getPage(Request $request, $slug)
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
     * Track a website visit.
     */
    public function trackVisitor(Request $request)
    {
        Visitor::create([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'page_url' => $request->input('page_url', $request->header('referer')),
            'referrer' => $request->input('referrer', $request->header('referer')),
        ]);

        return response()->json(['status' => 'success']);
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
