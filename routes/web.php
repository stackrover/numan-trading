<?php

use App\Http\Controllers\BlockController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PagesController;
use Illuminate\Support\Facades\Route;

// csrf protection can be applied here if needed
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

// Auth Routes for named generation
Route::get('/reset-password/{token}', function ($token) {
    return view('welcome');
})->middleware('guest')->name('password.reset');

Route::get('/forgot-password', function () {
    return view('welcome');
})->middleware('guest')->name('password.request');

Route::get('/register', function () {
    return view('welcome');
})->middleware('guest')->name('register');

Route::get('/login', function () {
    return view('welcome');
})->middleware('guest')->name('login');

Route::middleware('auth:web')->get('/auth/me', function () {
    return response()->json(auth()->user());
});


Route::middleware('auth:web')->prefix('api')->group(function () {
    Route::prefix('pages')->group(function () {
        Route::get('/', [PagesController::class, 'index'])->name('pages.index');
        Route::get('/{slug}', [PagesController::class, 'show'])->name('pages.show');
        Route::post('/', [PagesController::class, 'store'])->name('pages.store');
        Route::put('/{page}', [PagesController::class, 'update'])->name('pages.update');
        Route::put('/{slug}/seo', [PagesController::class, 'updateSeo'])->name('pages.seo.update');
        Route::delete('/{page}', [PagesController::class, 'destroy'])->name('pages.destroy');
        Route::delete('/{id}/permanent', [PagesController::class, 'forceDelete'])->name('pages.permanentDelete');
        Route::post('/{id}/restore', [PagesController::class, 'restore'])->name('pages.restore');
    });

    // Blocks web routes
    Route::prefix('blocks')->group(function () {
        Route::get('/', [BlockController::class, 'index'])->name('blocks.index');
        Route::get('/{slug}', [BlockController::class, 'show'])->name('blocks.show');
        Route::post('/', [BlockController::class, 'store'])->name('blocks.store');
        Route::put('/{slug}', [BlockController::class, 'update'])->name('blocks.update');
        Route::delete('/{slug}', [BlockController::class, 'destroy'])->name('blocks.destroy');
        Route::post('/{slug}/restore', [BlockController::class, 'restore'])->name('blocks.restore');
        Route::delete('/{slug}/permanent', [BlockController::class, 'forceDelete'])->name('blocks.forceDelete');
    });



    // Fields web routes
    Route::prefix('fields')->group(function () {
        Route::get('/', [FieldController::class, 'index'])->name('fields.index');
        Route::get('/{field}', [FieldController::class, 'show'])->name('fields.show');
        Route::post('/', [FieldController::class, 'store'])->name('fields.store');
        Route::put('/{field}', [FieldController::class, 'update'])->name('fields.update');
        Route::delete('/{field}', [FieldController::class, 'destroy'])->name('fields.destroy');
        Route::post('/{id}/restore', [FieldController::class, 'restore'])->name('fields.restore');
        Route::delete('/{id}/permanent', [FieldController::class, 'forceDelete'])->name('fields.forceDelete');
    });

    // Documents web routes
    Route::prefix('documents')->group(function () {
        Route::post('/save-page', [DocumentsController::class, 'savePageDocument'])->name('documents.savePage');
        Route::get('/', [DocumentsController::class, 'index'])->name('documents.index');
        Route::get('/{document}', [DocumentsController::class, 'show'])->name('documents.show');
        Route::post('/', [DocumentsController::class, 'store'])->name('documents.store');
        Route::put('/{document}', [DocumentsController::class, 'update'])->name('documents.update');
        Route::delete('/{document}', [DocumentsController::class, 'destroy'])->name('documents.destroy');
        Route::post('/{id}/restore', [DocumentsController::class, 'restore'])->name('documents.restore');
        Route::delete('/{id}/permanent', [DocumentsController::class, 'forceDelete'])->name('documents.forceDelete');
    });

    // Media web routes
    Route::prefix('media')->group(function () {
        Route::get('/', [MediaController::class, 'index'])->name('media.index');
        Route::get('/{media}', [MediaController::class, 'show'])->name('media.show');
        Route::post('/', [MediaController::class, 'store'])->name('media.store');
        Route::put('/{media}', [MediaController::class, 'update'])->name('media.update');
        Route::delete('/{media}', [MediaController::class, 'destroy'])->name('media.destroy');
    });

    // Dashboard routes
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard.stats');

    // Enquiry routes
    Route::prefix('enquiries')->group(function () {
        Route::get('/', [\App\Http\Controllers\EnquiryController::class, 'index'])->name('enquiries.index');
        Route::get('/{enquiry}', [\App\Http\Controllers\EnquiryController::class, 'show'])->name('enquiries.show');
        Route::post('/{enquiry}/reply', [\App\Http\Controllers\EnquiryController::class, 'reply'])->name('enquiries.reply');
        Route::delete('/{enquiry}', [\App\Http\Controllers\EnquiryController::class, 'destroy'])->name('enquiries.destroy');
    });

    // Product routes (basic CRUD)
    Route::prefix('products')->group(function () {
        Route::get('/', [\App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
        Route::post('/', [\App\Http\Controllers\ProductController::class, 'store'])->name('products.store');
        Route::get('/{product}', [\App\Http\Controllers\ProductController::class, 'show'])->name('products.show');
        Route::put('/{product}', [\App\Http\Controllers\ProductController::class, 'update'])->name('products.update');
        Route::delete('/{product}', [\App\Http\Controllers\ProductController::class, 'destroy'])->name('products.destroy');
    });
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
