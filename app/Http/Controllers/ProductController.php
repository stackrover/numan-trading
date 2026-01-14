<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_featured')) {
            $isFeatured = $request->input('is_featured');
            $val = filter_var($isFeatured, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($val !== null) {
                $query->where('is_featured', $val);
            }
        }

        if ($request->filled('category_id') && is_numeric($request->input('category_id'))) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($categorySlug = $request->input('category_slug')) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($category = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        return response()->json($query->latest()->paginate($request->input('limit', 15)));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'thumbnail' => 'nullable|string',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',

            'origin' => 'nullable|string',
            'origin_details' => 'nullable|string',
            'brand' => 'nullable|string',
            'brand_details' => 'nullable|string',

            'category_id' => 'nullable|exists:categories,id',

            'physical_form' => 'nullable|string',
            'stability' => 'nullable|string',
            'storage_conditions' => 'nullable|string',
            'solubility' => 'nullable|string',
            'specific_gravity' => 'nullable|string',
            'flash_point' => 'nullable|string',
            'arsenic_content' => 'nullable|string',
            'heavy_metals' => 'nullable|string',
            'usage_rate' => 'nullable|string',

            'usages' => 'nullable|array',
            'status' => 'string|in:draft,published',
            'is_featured' => 'nullable|boolean',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Allow fetching by ID or Slug
        $product = is_numeric($id)
            ? Product::with('category')->findOrFail($id)
            : Product::with('category')->where('slug', $id)->firstOrFail();

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|unique:products,slug,' . $id,
            'thumbnail' => 'nullable|string',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',

            'origin' => 'nullable|string',
            'origin_details' => 'nullable|string',
            'brand' => 'nullable|string',
            'brand_details' => 'nullable|string',

            'category_id' => 'nullable|exists:categories,id',

            'physical_form' => 'nullable|string',
            'stability' => 'nullable|string',
            'storage_conditions' => 'nullable|string',
            'solubility' => 'nullable|string',
            'specific_gravity' => 'nullable|string',
            'flash_point' => 'nullable|string',
            'arsenic_content' => 'nullable|string',
            'heavy_metals' => 'nullable|string',
            'usage_rate' => 'nullable|string',

            'usages' => 'nullable|array',
            'status' => 'string|in:draft,published',
            'is_featured' => 'nullable|boolean',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null, 204);
    }
}
