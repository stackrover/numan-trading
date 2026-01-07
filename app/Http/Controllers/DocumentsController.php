<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Document::query();

        if ($request->has('page_id')) {
            $query->where('page_id', $request->input('page_id'));
        }

        $documents = $query->with('page')->get()->map(function ($doc) {
            return $doc->hydrateMedia();
        });
        return response()->json($documents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentRequest $request)
    {
        $validated = $request->validated();
        $document = Document::create($validated);
        return response()->json($document, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($document)
    {
        $document = Document::with('page')->where('slug', $document)->firstOrFail();
        return response()->json($document->hydrateMedia());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, Document $document)
    {
        $validated = $request->validated();
        $document->update($validated);
        return response()->json($document);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        $document->delete();
        return response()->json(null, 204);
    }

    /**
     * Save page document with nested structure.
     */
    public function savePageDocument(Request $request)
    {
        $validated = $request->validate([
            'page_id' => 'required|integer|exists:pages,id',
            'slug' => 'required|string',
            'data' => 'required|array',
        ]);

        $document = Document::updateOrCreate(
            ['page_id' => $validated['page_id']],
            [
                'slug' => $validated['slug'],
                'data' => $validated['data'],
            ]
        );

        $document->load('page');
        return response()->json($document->hydrateMedia());
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $document = Document::onlyTrashed()->findOrFail($id);
        $document->restore();
        return response()->json($document);
    }

    /**
     * Permanently remove the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $document = Document::onlyTrashed()->findOrFail($id);
        $document->forceDelete();
        return response()->json(null, 204);
    }
}
