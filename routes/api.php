<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\MediaController;


Route::prefix('v1')->group(function () {

  // Pages api
  Route::prefix('pages')->group(function () {
    Route::get('/', [PagesController::class, 'index'])->name('pages.index');
    Route::get('/{slug}', [PagesController::class, 'show'])->name('pages.show');
  });

  // Blocks api
  Route::prefix('blocks')->group(function () {
    Route::get('/', [BlockController::class, 'index'])->name('api.blocks.index');
    Route::get('/{slug}', [BlockController::class, 'show'])->name('api.blocks.show');
  });

  // Seos api
  Route::prefix('seos')->group(function () {
    Route::get('/', [SeoController::class, 'index'])->name('api.seos.index');
    Route::get('/{seo}', [SeoController::class, 'show'])->name('api.seos.show');
  });

  // Fields api
  Route::prefix('fields')->group(function () {
    Route::get('/', [FieldController::class, 'index'])->name('api.fields.index');
    Route::get('/{field}', [FieldController::class, 'show'])->name('api.fields.show');
  });

  // Documents api
  Route::prefix('documents')->group(function () {
    Route::get('/', [DocumentsController::class, 'index'])->name('api.documents.index');
    Route::get('/{document}', [DocumentsController::class, 'show'])->name('api.documents.show');
  });

  // Media api
  Route::prefix('media')->group(function () {
    Route::get('/', [MediaController::class, 'index'])->name('api.media.index');
    Route::get('/{media}', [MediaController::class, 'show'])->name('api.media.show');
  });
});
