<?php

namespace App\Http\Controllers;

use App\Models\ImageCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ImageCategoryController extends Controller
{
    public function index()
    {
        return response()->json(ImageCategory::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $category = ImageCategory::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
        ]);

        return response()->json($category, 201);
    }
}
