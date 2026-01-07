import { useDashboardStats } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";

export default function Dashboard() {
    const { data, isLoading } = useDashboardStats();

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    const stats = data?.stats || {};
    const topPages = data?.top_pages || [];
    const topProducts = data?.top_products || [];

    const statCards = [
        { title: "Active Enquiries", value: stats.total_enquiries, icon: "solar:chat-round-line-bold", color: "text-orange-600", bg: "bg-orange-50", description: `${stats.unread_enquiries} unread messages` },
        { title: "Product Inventory", value: stats.total_products, icon: "solar:box-bold", color: "text-emerald-600", bg: "bg-emerald-50", description: "All colors & flavors" },
        { title: "Total Engagement", value: stats.total_views, icon: "solar:graph-up-bold", color: "text-blue-600", bg: "bg-blue-50", description: "Lifetime page views" },
        { title: "Avg. Daily Traffic", value: Math.round(stats.total_views / 30) || 0, icon: "solar:bolt-bold", color: "text-purple-600", bg: "bg-purple-50", description: "Last 30 days avg" },
    ];

    return (
        <div className="p-6 lg:p-10 space-y-12 max-w-7xl mx-auto">
            {/* Elegant Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-3">
                        <span className="size-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Live System Status</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none">
                        Dashboard <span className="text-gradient">Overview</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-md">Welcome back, manager. Here's a high-level summary of your business performance today.</p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button className="h-12 px-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2">
                        <Icon icon="solar:calendar-minimalistic-bold" className="text-xl text-slate-400" />
                        <span>Filter Period</span>
                    </button>
                    <button className="h-12 px-6 rounded-2xl bg-slate-950 text-white text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 border border-slate-800">
                        <Icon icon="solar:download-square-bold" className="text-xl text-orange-400" />
                        <span>Download Insights</span>
                    </button>
                </div>

                {/* Decorative background element */}
                <div className="absolute -top-24 -left-20 size-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            </header>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    >
                        <Card className="border border-slate-200/60 hover:border-orange-200/60 bg-white shadow-none transition-all group overflow-hidden relative rounded-3xl">
                            <CardContent className="p-7">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                        <Icon icon={stat.icon} className="text-2xl" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
                                        <Icon icon="solar:graph-up-linear" className="text-blue-500 text-xs" />
                                        <span className="text-[10px] font-bold text-slate-500">+12%</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-slate-950 leading-none tracking-tight">
                                        {typeof stat.value === 'number' && stat.value > 100 ? (
                                            <span className="text-gradient">{stat.value}</span>
                                        ) : stat.value}
                                    </h3>
                                    <div className="flex flex-col gap-0.5 pt-2">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                        <p className="text-[11px] font-bold text-slate-500/70">{stat.description}</p>
                                    </div>
                                </div>

                                {/* Abstract decorative background */}
                                <div className="absolute -right-6 -bottom-6 size-24 bg-slate-50 rounded-full group-hover:bg-orange-50 transition-colors pointer-events-none border border-slate-100 group-hover:border-orange-100 flex items-center justify-center">
                                    <Icon icon={stat.icon} className="text-4xl text-slate-100/30 group-hover:text-orange-500/10" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Section (Graph Placeholder) */}
                <Card className="lg:col-span-2 border border-slate-200/60 shadow-none bg-white rounded-3xl overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-0">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">System Performance</CardTitle>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time engagement metrics</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active session</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 h-[400px] relative flex flex-col items-center justify-center">
                        <div className="absolute inset-x-8 top-12 bottom-12 border-l border-b border-slate-100 pointer-events-none">
                            {/* Grid lines */}
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 divide-x divide-y divide-slate-50/50">
                                {Array.from({ length: 24 }).map((_, i) => <div key={i}></div>)}
                            </div>
                        </div>

                        <div className="text-center space-y-4 relative z-10">
                            <div className="size-20 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 transition-transform duration-500">
                                <Icon icon="solar:chart-square-bold" width="36" className="text-orange-500 opacity-20" />
                            </div>
                            <h4 className="text-lg font-black text-slate-800 tracking-tight">Data streams arriving...</h4>
                            <p className="text-sm text-slate-400 max-w-[280px] mx-auto font-medium">We're indexing the latest engagement events to build your visual reports.</p>

                            <div className="pt-4">
                                <button className="px-5 py-2 rounded-xl bg-orange-50 text-orange-600 text-[11px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-all">
                                    Refresh Stream
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Trending Content - Ultra Modern List */}
                <Card className="border border-slate-200/60 shadow-none bg-white rounded-3xl flex flex-col overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Trending Content</CardTitle>
                        <div className="flex gap-2 mt-3">
                            <span className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-100 text-[9px] font-black text-orange-600 uppercase tracking-widest">Today</span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">This Week</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 px-4 pt-4">
                        <div className="space-y-2">
                            {[...topPages.map(p => ({ ...p, type: 'Page' })), ...topProducts.map(p => ({ ...p, type: 'Product' }))]
                                .sort((a, b) => b.views_count - a.views_count)
                                .slice(0, 5)
                                .map((item, idx) => (
                                    <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-orange-50/40 border border-transparent hover:border-orange-100/50 transition-all cursor-default">
                                        <div className="flex items-center gap-4">
                                            <div className="size-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                                                <Icon
                                                    icon={item.type === 'Page' ? 'solar:document-bold' : 'solar:box-minimalistic-bold'}
                                                    className={`text-2xl ${item.type === 'Page' ? 'text-blue-500' : 'text-emerald-500'}`}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">{item.title}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                                                    <span className="size-1 rounded-full bg-slate-200"></span>
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">2h ago</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <div className="flex items-center gap-1">
                                                <Icon icon="solar:eye-bold" width="12" className="text-orange-400" />
                                                <span className="text-sm font-black text-slate-900">{item.views_count}</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Views</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                    <div className="p-8 pt-4">
                        <button className="w-full h-12 text-[11px] font-black text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-2xl border border-slate-100 transition-all uppercase tracking-widest">
                            Review Intelligence
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
