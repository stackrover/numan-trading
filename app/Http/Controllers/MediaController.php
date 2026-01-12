<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMediaRequest;
use App\Http\Requests\UpdateMediaRequest;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $media = Media::all();
        return response()->json($media);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMediaRequest $request)
    {
        \Illuminate\Support\Facades\Log::info('Media Store Request Started', [
            'has_file' => $request->hasFile('file'),
            'file_name' => $request->file('file')?->getClientOriginalName(),
        ]);

        $file = $request->file('file');

        // 1. File Details
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();

        // 2. Generate Filename and Path
        $filename = Str::uuid() . '.' . $extension;
        $path = $file->storeAs('uploads', $filename, 'public');

        // 3. Image Dimensions & Placeholder
        $width = null;
        $height = null;
        $placeholder = null;

        if ($mimeType === 'image/svg+xml' || $extension === 'svg') {
            // Skip processing for SVG
            // Optionally parse XML for width/height, but for now leave null
        } else {
            try {
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file->getRealPath());
                $width = $image->width();
                $height = $image->height();

                // Generate Placeholder (20px width, blur, base64)
                $placeholder = $image->scale(width: 20)
                    ->blur(5)
                    ->toPng()
                    ->toDataUri();
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning('Image processing failed for file: ' . $filename, [
                    'error' => $e->getMessage()
                ]);
            }
        }

        // 4. Create Media Record
        $media = Media::create([
            'original_name' => $originalName,
            'filename' => $filename,
            'mime_type' => $mimeType,
            'extension' => $extension,
            'size' => $size,
            'width' => $width,
            'height' => $height,
            'placeholder' => $placeholder,
            'path' => $path,
            'url' => Storage::url($path),
        ]);

        return response()->json($media, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Media $media)
    {
        return response()->json($media);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMediaRequest $request, Media $media)
    {
        $validated = $request->validated();
        $media->update($validated);
        return response()->json($media);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $media)
    {
        $media->delete();
        return response()->json(null, 204);
    }
}
