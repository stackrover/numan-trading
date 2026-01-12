<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json(Gallery::with(['media', 'category'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'files.*' => 'required|file|image|max:10240', // Max 10MB per file
            'category_id' => 'nullable|exists:image_categories,id',
            'is_active' => 'boolean',
        ]);

        $uploadedFiles = $request->file('files');
        $savedGalleries = [];

        if ($request->hasFile('files')) {
            foreach ($uploadedFiles as $file) {
                // Reuse Media Controller Logic (Simplified here)
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $mimeType = $file->getMimeType();
                $size = $file->getSize();

                $filename = Str::uuid() . '.' . $extension;
                $path = $file->storeAs('uploads', $filename, 'public');

                $width = null;
                $height = null;
                $placeholder = null;

                if ($mimeType !== 'image/svg+xml' && $extension !== 'svg') {
                    try {
                        $manager = new ImageManager(new Driver());
                        $image = $manager->read($file->getRealPath());
                        $width = $image->width();
                        $height = $image->height();
                        $placeholder = $image->scale(width: 20)->blur(5)->toPng()->toDataUri();
                    } catch (\Exception $e) {
                        // Ignore image processing errors
                    }
                }

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

                $gallery = Gallery::create([
                    'image_id' => $media->id,
                    'image_category_id' => $request->category_id,
                    'is_active' => $request->is_active ?? true,
                ]);

                $savedGalleries[] = $gallery->load(['media', 'category']);
            }
        }

        return response()->json($savedGalleries, 201);
    }

    public function destroy(Gallery $gallery)
    {
        // 1. Get associated media
        $media = $gallery->media;

        // 2. Delete gallery record
        $gallery->delete();

        // 3. Delete media record and file if it exists and no other gallery uses it (though 1-to-1 usage implies delete)
        // User requested: "if deleted then delete the entry from media table also and delete the image also from storage."
        if ($media) {
            if (Storage::disk('public')->exists($media->path)) {
                Storage::disk('public')->delete($media->path);
            }
            $media->delete();
        }

        return response()->json(null, 204);
    }
}
