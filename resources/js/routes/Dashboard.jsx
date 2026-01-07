import { useDashboardStats } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";

export default function Dashboard() {
    const { data, isLoading } = useDashboardStats();

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
    );

    const stats = data?.stats || {};
    const topPages = data?.top_pages || [];
    const topProducts = data?.top_products || [];

    const statCards = [
        { title: "Active Enquiries", value: stats.total_enquiries, icon: "solar:chat-round-line-bold", color: "text-indigo-600", bg: "bg-indigo-50", description: `${stats.unread_enquiries} waiting response` },
        { title: "Product Inventory", value: stats.total_products, icon: "solar:box-bold", color: "text-emerald-600", bg: "bg-emerald-50", description: "Catalog items" },
        { title: "Total Engagement", value: stats.total_views, icon: "solar:graph-up-bold", color: "text-blue-600", bg: "bg-blue-50", description: "Lifetime views" },
        { title: "System Status", value: "Online", icon: "solar:check-circle-bold", color: "text-slate-600", bg: "bg-slate-50", description: "All systems active" },
    ];

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto font-sans">
            {/* Simple Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Icon icon="solar:calendar-minimalistic-linear" className="text-lg" />
                        <span>Filter by Date</span>
                    </button>
                    <button className="h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm">
                        <Icon icon="solar:download-linear" className="text-lg" />
                        <span>Export Report</span>
                    </button>
                </div>
            </header>

            {/* Clean Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="border-slate-200/60 shadow-none hover:shadow-md hover:border-slate-300 transition-all rounded-xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`size-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <Icon icon={stat.icon} className="text-2xl" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                                    <p className="text-xs text-slate-500 font-medium">{stat.description}</p>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-slate-900 leading-none">
                                    {stat.value}
                                </h3>
                                <div className="flex items-center gap-0.5 text-emerald-600 font-bold text-xs">
                                    <Icon icon="solar:arrow-up-linear" />
                                    <span>12%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Section */}
                <Card className="lg:col-span-2 border-slate-200/60 shadow-none rounded-xl overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-bold text-slate-900">Engagement Trends</CardTitle>
                        <CardDescription className="text-sm">Regional visibility analytics over the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[360px] flex items-center justify-center bg-slate-50/30">
                        <div className="text-center space-y-4">
                            <div className="size-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
                                <Icon icon="solar:chart-2-linear" width="32" className="text-slate-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Processing Analytics</h4>
                                <p className="text-sm text-slate-500 max-w-[280px] mx-auto">Click 'Refresh' to update the visual data metrics for this period.</p>
                            </div>
                            <button className="px-6 h-10 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
                                Refresh Data
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Trending List */}
                <Card className="border-slate-200/60 shadow-none rounded-xl flex flex-col overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-bold text-slate-900">Popular Content</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <div className="divide-y divide-slate-50">
                            {[...topPages, ...topProducts]
                                .sort((a, b) => b.views_count - a.views_count)
                                .slice(0, 5)
                                .map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-default">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                <Icon icon={item.views_count > 50 ? 'solar:fire-bold' : 'solar:document-linear'} className="text-xl" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 truncate max-w-[140px]">{item.title}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Views</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                            <span className="text-base">{item.views_count}</span>
                                            <Icon icon="solar:eye-bold" className="text-slate-300" />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
