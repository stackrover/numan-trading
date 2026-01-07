<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Requests\QueryPageRequest;
use App\Http\Requests\UpdateSeoRequest;
use App\Models\Page;
use App\Models\Seo;

class PagesController extends Controller
{

    /**
     * Get a listing of the resource.
     * 
     */
    public function index(QueryPageRequest $request)
    {
        $query = Page::query();

        /* Search */
        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        }

        /* Filter by published status */
        if ($published = $request->input('published')) {
            if ($published === 'true') {
                $query->whereNotNull('published_at');
            } elseif ($published === 'false') {
                $query->whereNull('published_at');
            }
        }

        /* Sorting */
        if ($request->validated('sort_by')) {
            $query->orderBy(
                $request->validated('sort_by'),
                $request->validated('sort_dir', 'desc')
            );
        }

        /* Pagination */
        $pages = $query->paginate($request->validated('size', 15));
        return response()->json($pages, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $page = Page::with("blocks", "blocks.fields", "seo", "document")->where('slug', $slug)->firstOrFail();

        if ($page->document) {
            $page->document->hydrateMedia();
        }

        return response()->json($page, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePageRequest $request)
    {
        $page = Page::create($request->validated());


        $page->seo()->create([
            'title' => $request->input('title'),
            'description' => null,
            'keywords' => null,
            'author' => null,
            'robots' => null,
            'canonical_url' => null,
            'twitter_title' => null,
            'twitter_description' => null,
            'twitter_image' => null,
        ]);
        return response()->json($page, 201);
    }

    /** 
     * Update the specified resource in storage.
     */
    public function update(UpdatePageRequest $request, Page $page)
    {
        $page->update($request->validated());
        return response()->json($page, 200);
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(Page $page)
    {
        $page->softDelete();
        return response()->json(null, 204);
    }

    /**
     * Restore the specified resource from soft deletion.
     */
    public function restore($id)
    {
        $page = Page::withTrashed()->findOrFail($id);
        $page->restore();
        return response()->json($page, 200);
    }

    /**
     * Permanently delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $page = Page::withTrashed()->findOrFail($id);
        $page->forceDelete();
        return response()->json(null, 204);
    }

    /**
     * Update the SEO for the specified page.
     */
    public function updateSeo(UpdateSeoRequest $request, $slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        $data = $request->validated();

        if (isset($data['keywords']) && is_array($data['keywords'])) {
            $data['keywords'] = implode(', ', $data['keywords']);
        }

        $seo = $page->seo()->updateOrCreate(
            ['page_id' => $page->id],
            $data
        );

        return response()->json($seo, 200);
    }
}
