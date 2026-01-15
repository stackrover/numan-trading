<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePartnerRequest;
use App\Http\Requests\UpdatePartnerRequest;
use App\Models\Partner;

class PartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(\Illuminate\Http\Request $request)
    {
        $query = Partner::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->boolean('nopaginate')) {
            return response()->json(['data' => $query->get()]);
        }

        return response()->json($query->paginate($request->input('limit', 15)));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartnerRequest $request)
    {
        $validated = $request->validated();
        $partner = Partner::create($validated);
        return response()->json($partner, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Partner $partner)
    {
        return response()->json($partner);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartnerRequest $request, Partner $partner)
    {
        $validated = $request->validated();
        $partner->update($validated);
        return response()->json($partner);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partner $partner)
    {
        $partner->delete();
        return response()->json(null, 204);
    }
}
