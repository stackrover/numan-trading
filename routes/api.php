<?php

use App\Http\Controllers\BlockController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Pages api
    Route::apiResource('pages', PagesController::class);
    Route::put('pages/{slug}/seo', [PagesController::class, 'updateSeo'])->name('pages.seo');

    // Blocks api
    Route::apiResource('blocks', BlockController::class)->except(['show']);
    Route::get('blocks/{slug}', [BlockController::class, 'show'])->name('blocks.show');

    // Fields api
    Route::get('fields/by-block/{block_slug_or_id}', [FieldController::class, 'getByBlock'])->name('fields.by-block');
    Route::apiResource('fields', FieldController::class);

    // Documents api
    Route::post('documents/save', [DocumentsController::class, 'savePageDocument'])->name('documents.save');
    Route::apiResource('documents', DocumentsController::class);

    // Media api
    Route::apiResource('media', MediaController::class);

    // Testimonials api
    Route::apiResource('testimonials', TestimonialController::class);

    // Teams api
    Route::apiResource('teams', TeamController::class);

    // Categories api
    Route::apiResource('categories', CategoryController::class);

    // Brands api
    Route::apiResource('brands', BrandController::class);

    // Partners api
    Route::apiResource('partners', \App\Http\Controllers\PartnerController::class);

    // Gallery api
    Route::apiResource('image-categories', \App\Http\Controllers\ImageCategoryController::class);
    Route::apiResource('gallery', \App\Http\Controllers\GalleryController::class);

    // Products api
    Route::apiResource('products', ProductController::class);

    // Enquiries api
    Route::post('enquiries/{id}/reply', [EnquiryController::class, 'reply'])->name('enquiries.reply');
    Route::apiResource('enquiries', EnquiryController::class);
});

// Public API
Route::prefix('public')->group(function () {
    Route::get('/pages/{slug}', [PublicController::class, 'getPage'])->name('public.pages.show');
    Route::get('/settings', [PublicController::class, 'getSettings'])->name('public.settings');
});
