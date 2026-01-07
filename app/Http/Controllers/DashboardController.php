<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use App\Models\Page;
use App\Models\PageView;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_enquiries' => Enquiry::count(),
            'unread_enquiries' => Enquiry::where('status', 'unread')->count(),
            'total_products' => Product::count(),
            'total_pages' => Page::count(),
            'total_views' => PageView::count(),
        ];

        // Daily views for last 30 days
        $dailyViews = PageView::select(DB::raw('viewed_at as date'), DB::raw('count(*) as views'))
            ->where('viewed_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Top viewed pages
        $topPages = Page::withCount('views')
            ->orderBy('views_count', 'desc')
            ->take(5)
            ->get();

        // Top viewed products (assuming they are projects)
        $topProducts = Product::withCount('views')
            ->orderBy('views_count', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'daily_views' => $dailyViews,
            'top_pages' => $topPages,
            'top_products' => $topProducts,
        ]);
    }
}
