<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlockRequest;
use App\Http\Requests\UpdateBlockRequest;
use App\Models\Block;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    /** fetch all blocks by page slug */
    public function index(Request $request, Block $block)
    {
        $request->validate([
            'page_slug' => 'required|string|exists:pages,slug',
        ]);

        $pageSlug = $request->input('page_slug');
        $blocks = $block->where('page_slug', $pageSlug)->get();
        return response()->json($blocks);
    }

    /** fetch a single block by slug and page slug */
    public function show(Request $request, Block $block, $slug)
    {
        $request->validate([
            'page_slug' => 'required|string|exists:pages,slug',
        ]);

        $pageSlug = $request->input('page_slug');
        $block = $block->where('slug', $slug)->where(
            'page_slug',
            $pageSlug
        )->firstOrFail();
        return response()->json($block);
    }

    /** create a new block */
    public function store(StoreBlockRequest $request, Block $block)
    {
        $validated = $request->validated();
        $block = $block->create($validated);
        return response()->json($block, 201);
    }

    /** update an existing block */
    public function update(UpdateBlockRequest $request, Block $block, $slug)
    {
        $validated = $request->validated();
        $block = $block->where('slug', $slug)->orWhere('id', $slug)->firstOrFail();
        $block->update($validated);
        return response()->json($block);
    }


    /** delete a block (soft delete) */
    public function destroy(Block $block, $slug)
    {
        $block = $block->where('slug', $slug)->firstOrFail();
        $block->delete();
        return response()->json(null, 204);
    }

    /** restore a soft-deleted block */
    public function restore(Request $request, Block $block, $slug)
    {
        $block = $block->onlyTrashed()->where('slug', $slug)->first
            ->restore();
        return response()->json($block);
    }

    /** permanently delete a block */
    public function forceDelete(Request $request, Block $block, $slug)
    {
        $block = $block->onlyTrashed()->where('slug', $slug)->first
            ->forceDelete();
        return response()->json(null, 204);
    }
}
