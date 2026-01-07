import { useDashboardStats } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";

export default function Dashboard() {
    const { data, isLoading } = useDashboardStats();

    if (isLoading) return <div className="p-8 text-center">Loading Dashboard...</div>;

    const stats = data?.stats || {};
    const topPages = data?.top_pages || [];
    const topProducts = data?.top_products || [];

    const statCards = [
        { title: "Total Enquiries", value: stats.total_enquiries, icon: "solar:letter-linear", color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Unread Enquiries", value: stats.unread_enquiries, icon: "solar:unread-linear", color: "text-orange-500", bg: "bg-orange-50" },
        { title: "Total Products", value: stats.total_products, icon: "solar:box-linear", color: "text-green-500", bg: "bg-green-50" },
        { title: "Total Page Views", value: stats.total_views, icon: "solar:eye-linear", color: "text-purple-500", bg: "bg-purple-50" },
    ];

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                    </div>
                                    <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                        <Icon icon={stat.icon} width="24" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Views Placeholder (Needs a chart library implementation) */}
                <Card className="min-h-[300px]">
                    <CardHeader>
                        <CardTitle>Daily Views (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-8 bg-gray-50/50 rounded-b-lg m-4 border-dashed border-2 border-gray-200">
                        <div className="text-center">
                            <Icon icon="solar:chart-linear" width="48" className="text-gray-300 mx-auto" />
                            <p className="text-gray-400 mt-2">Graph visualization would go here</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Most Viewed - combined Pages & Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...topPages.map(p => ({ ...p, type: 'Page' })), ...topProducts.map(p => ({ ...p, type: 'Product' }))]
                            .sort((a, b) => b.views_count - a.views_count)
                            .slice(0, 5)
                            .map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-50 rounded-lg hover:border-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 bg-gray-50 flex items-center justify-center rounded text-xs font-bold text-gray-400">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{item.title}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-600">
                                        {item.views_count} views
                                    </div>
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
