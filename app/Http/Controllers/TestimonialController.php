<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Testimonial::query();

        if ($search = $request->input('search')) {
            $query->where('client_name', 'like', "%{$search}%")
                ->orWhere('company', 'like', "%{$search}%");
        }

        if ($request->boolean('nopaginate')) {
            return response()->json(['data' => $query->get()]);
        }

        return response()->json($query->paginate($request->input('limit', 15)));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTestimonialRequest $request)
    {
        $validatedData = $request->validated();

        $testimonial = Testimonial::create($validatedData);

        return response()->json($testimonial, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial)
    {
        return response()->json($testimonial);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial)
    {
        $validatedData = $request->validated();

        $testimonial->update($validatedData);

        return response()->json($testimonial);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted successfully']);
    }
}
