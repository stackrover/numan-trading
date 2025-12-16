<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSeoRequest;
use App\Http\Requests\UpdateSeoRequest;
use App\Models\Seo;
use Illuminate\Http\Request;

class SeoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $seos = Seo::all();
        return response()->json($seos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSeoRequest $request)
    {
        $validated = $request->validated();
        $seo = Seo::create($validated);
        return response()->json($seo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Seo $seo)
    {
        return response()->json($seo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSeoRequest $request, Seo $seo)
    {
        $validated = $request->validated();
        $seo->update($validated);
        return response()->json($seo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seo $seo)
    {
        $seo->delete();
        return response()->json(null, 204);
    }
}
