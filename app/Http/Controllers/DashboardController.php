<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use App\Models\Page;
use App\Models\PageView;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Gallery;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $applyFilters = function ($query) use ($startDate, $endDate) {
            if ($startDate) $query->whereDate('created_at', '>=', $startDate);
            if ($endDate) $query->whereDate('created_at', '<=', $endDate);
        };

        $stats = [
            'total_enquiries' => Enquiry::where($applyFilters)->count(),
            'unread_enquiries' => Enquiry::where('status', 'unread')->where($applyFilters)->count(),
            'total_products' => Product::where($applyFilters)->count(),
            'total_categories' => Category::where($applyFilters)->count(),
            'total_brands' => Brand::where($applyFilters)->count(),
            'total_visitors' => Visitor::where($applyFilters)->count(),
            'unique_visitors' => Visitor::where($applyFilters)->distinct('ip_address')->count('ip_address'),
        ];

        // Media Stats
        $mediaStats = DB::table('media')
            ->select(
                DB::raw('count(*) as total_items'),
                DB::raw('sum(size) as total_size'),
                DB::raw("count(case when mime_type like 'image/%' then 1 end) as image_count"),
                DB::raw("count(case when mime_type like 'video/%' then 1 end) as video_count")
            )
            ->first();

        // Recently Added Products
        $recentProducts = Product::with(['category'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Featured Products
        $featuredProducts = Product::with(['category'])
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Daily visitors
        $dailyVisitors = Visitor::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->when($startDate, fn($q) => $q->whereDate('created_at', '>=', $startDate))
            ->when($endDate, fn($q) => $q->whereDate('created_at', '<=', $endDate))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'stats' => $stats,
            'gallery_stats' => [
                'total_items' => (int)($mediaStats->total_items ?? 0),
                'total_size' => round(($mediaStats->total_size ?? 0) / 1024 / 1024, 2),
                'images' => (int)($mediaStats->image_count ?? 0),
                'videos' => (int)($mediaStats->video_count ?? 0),
            ],
            'recent_products' => $recentProducts,
            'featured_products' => $featuredProducts,
            'daily_visitors' => $dailyVisitors,
        ]);
    }
}
