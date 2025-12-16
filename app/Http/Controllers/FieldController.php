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
        $field->delete();
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
