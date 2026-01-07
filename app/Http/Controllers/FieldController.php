<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFieldRequest;
use App\Http\Requests\UpdateFieldRequest;
use App\Models\Field;
use Illuminate\Http\Request;

class FieldController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Field::query();

        if ($request->has('block_id')) {
            $query->where('block_id', $request->input('block_id'));
        }

        $fields = $query->get();
        return response()->json($fields);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFieldRequest $request)
    {
        $validated = $request->validated();
        $field = Field::create($validated);
        return response()->json($field, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Field $field)
    {
        return response()->json($field);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFieldRequest $request, Field $field)
    {
        $validated = $request->validated();
        $field->update($validated);
        return response()->json($field);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Field $field)
    {
        // 1. Clean up data in documents
        $block = $field->block;
        if ($block && $block->page_id) {
            $document = \App\Models\Document::where('page_id', $block->page_id)->first();
            if ($document && $document->data) {
                $data = json_decode(json_encode($document->data), true);
                $blockSlug = $block->slug;

                if (isset($data[$blockSlug]) && isset($data[$blockSlug][$field->name])) {
                    unset($data[$blockSlug][$field->name]);

                    // If block is now empty, you might want to keep it or remove it.
                    // Usually safer to keep the block key if it exists in the schema.

                    $document->data = (object) $data;
                    $document->save();
                }
            }
        }

        // 2. Hard delete the field
        $field->forceDelete();

        return response()->json(null, 204);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $field = Field::onlyTrashed()->findOrFail($id);
        $field->restore();
        return response()->json($field);
    }

    /**
     * Permanently remove the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $field = Field::onlyTrashed()->findOrFail($id);
        $field->forceDelete();
        return response()->json(null, 204);
    }
}
