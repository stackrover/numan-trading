<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $query = Brand::query();

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('company', 'like', "%{$search}%");
        }

        return response()->json($query->paginate($request->input('limit', 15)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:brands,slug',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'website' => 'nullable|url',
        ]);

        $brand = Brand::create($validated);

        return response()->json($brand, 201);
    }

    public function show(Brand $brand)
    {
        return response()->json($brand);
    }

    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|unique:brands,slug,' . $brand->id,
            'company' => 'string|max:255',
            'location' => 'string|max:255',
            'short_description' => 'nullable|string',
            'website' => 'nullable|url',
        ]);

        $brand->update($validated);

        return response()->json($brand);
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();
        return response()->json(null, 204);
    }
}
