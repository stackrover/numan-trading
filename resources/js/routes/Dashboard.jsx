import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateBRPDF } from "@/lib/pdf-generator";
import { useDashboardStats } from "@/services/dashboard.service";
import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as XLSX from 'xlsx';

export default function Dashboard() {
    const navigate = useNavigate();
    const [localParams, setLocalParams] = useState({
        start_date: "",
        end_date: ""
    });
    const [appliedParams, setAppliedParams] = useState({
        start_date: "",
        end_date: ""
    });

    const { data, isLoading } = useDashboardStats(appliedParams);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
    );

    const stats = data?.stats || {};
    const gallery = data?.gallery_stats || {};
    const recentProducts = data?.recent_products || [];
    const featuredProducts = data?.featured_products || [];

    const summaryCards = [
        { title: "Products", value: stats.total_products, icon: "solar:box-bold", color: "text-indigo-600", bg: "bg-indigo-50", description: "In active catalog", path: "/products" },
        { title: "Categories", value: stats.total_categories, icon: "solar:folder-2-bold", color: "text-emerald-600", bg: "bg-emerald-50", description: "Defined segments", path: "/categories" },
        { title: "Brands", value: stats.total_brands, icon: "solar:stars-minimalistic-bold", color: "text-amber-600", bg: "bg-amber-50", description: "Partner brands", path: "/brands" },
        { title: "Enquiries", value: stats.total_enquiries, icon: "solar:chat-round-line-bold", color: "text-rose-600", bg: "bg-rose-50", description: `${stats.unread_enquiries} unread messages`, path: "/enquiries" },
    ];

    const visitorStats = [
        { title: "Total Visits", value: stats.total_visitors, icon: "solar:users-group-rounded-bold", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Unique Visitors", value: stats.unique_visitors, icon: "solar:user-bold", color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const handleExport = async (type) => {
        try {
            const reportData = [
                { Section: "Summary", Metric: "Total Products", Value: stats.total_products },
                { Section: "Summary", Metric: "Categories", Value: stats.total_categories },
                { Section: "Summary", Metric: "Brands", Value: stats.total_brands },
                { Section: "Summary", Metric: "Enquiries", Value: stats.total_enquiries },
                { Section: "Visitors", Metric: "Total Visitors", Value: stats.total_visitors },
                { Section: "Visitors", Metric: "Unique Visitors", Value: stats.unique_visitors },
                { Section: "Gallery", Metric: "Total Items", Value: gallery.total_items },
                { Section: "Gallery", Metric: "Storage Used", Value: `${gallery.total_size} MB` },
            ];

            if (type === 'excel') {
                const worksheet = XLSX.utils.json_to_sheet(reportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Stats");
                XLSX.writeFile(workbook, `dashboard_report_${format(new Date(), 'yyyyMMdd')}.xlsx`);
            } else {
                const columns = ["Section", "Metric", "Value"];
                const rows = reportData.map(item => [item.Section, item.Metric, item.Value]);
                await generateBRPDF("System Performance Overview", columns, rows, "dashboard_report");
            }
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Numan Trading operational health and visibility.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-10 px-4 rounded-xl flex items-center gap-2 border-slate-200">
                                <Icon icon="solar:calendar-minimalistic-linear" className="text-lg" />
                                <span className="hidden sm:inline">
                                    {appliedParams.start_date && appliedParams.end_date
                                        ? `${format(new Date(appliedParams.start_date), 'MMM dd')} - ${format(new Date(appliedParams.end_date), 'MMM dd')}`
                                        : "Lifetime Stats"
                                    }
                                </span>
                                <span className="sm:hidden">Filter</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-72 p-4 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-400">Start Date</Label>
                                <Input
                                    type="date"
                                    value={localParams.start_date}
                                    onChange={(e) => setLocalParams(prev => ({ ...prev, start_date: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-400">End Date</Label>
                                <Input
                                    type="date"
                                    value={localParams.end_date}
                                    onChange={(e) => setLocalParams(prev => ({ ...prev, end_date: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        const reset = { start_date: "", end_date: "" };
                                        setLocalParams(reset);
                                        setAppliedParams(reset);
                                    }}
                                >
                                    Clear
                                </Button>
                                <Button className="w-full bg-slate-900" onClick={() => setAppliedParams(localParams)}>
                                    Apply
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2">
                                <Icon icon="solar:download-linear" className="text-lg" />
                                <span className="hidden sm:inline">Export Report</span>
                                <span className="sm:hidden">Export</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48 p-2 flex flex-col gap-1">
                            <button onClick={() => handleExport('excel')} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors w-full text-left">
                                <Icon icon="vscode-icons:file-type-excel" className="text-lg" />
                                Excel Report
                            </button>
                            <button onClick={() => handleExport('pdf')} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors w-full text-left">
                                <Icon icon="material-icon-theme:pdf" className="text-lg" />
                                Branded PDF
                            </button>
                        </PopoverContent>
                    </Popover>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((card) => (
                    <Card key={card.title} className="border-slate-200/60 p-0 shadow-none hover:shadow-md transition-all rounded-2xl overflow-hidden group">
                        <CardContent className="p-6 cursor-pointer" onClick={() => navigate(card.path || '/')}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`size-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}>
                                    <Icon icon={card.icon} className="text-2xl" />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{card.description}</p>
                                </div>
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Visitors & Gallery */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Visitor Stats */}
                    <Card className="border-slate-200/60 shadow-none rounded-2xl overflow-hidden p-0">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Traffic Analytics</CardTitle>
                                    <CardDescription>Estimated visibility based on tracked sessions.</CardDescription>
                                </div>
                                <Icon icon="solar:graph-up-bold-duotone" className="text-4xl text-blue-500/20" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                {visitorStats.map(v => (
                                    <div key={v.title} className={`${v.bg} rounded-2xl p-6 flex flex-col gap-2`}>
                                        <div className="flex items-center gap-2">
                                            <Icon icon={v.icon} className={`${v.color} text-xl`} />
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{v.title}</span>
                                        </div>
                                        <div className="text-3xl font-black text-slate-900">{v.value}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recently Added Table */}
                    <Card className="border-slate-200/60 shadow-none rounded-2xl overflow-hidden p-0">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Recently Added Products</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50 border-t">
                                    <TableRow>
                                        <TableHead className="pl-8">Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right pr-8">Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentProducts.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-10 text-slate-400">No products found</TableCell></TableRow>
                                    ) : (
                                        recentProducts.map(product => (
                                            <TableRow key={product.id} className="hover:bg-slate-50 group transition-colors">
                                                <TableCell className="pl-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                                            {product.thumbnail ? (
                                                                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Icon icon="solar:box-linear" className="m-auto mt-2.5 text-slate-300" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-medium text-slate-500">{product.category?.title || 'General'}</TableCell>
                                                <TableCell className="text-right pr-8 text-xs font-bold text-slate-400">{format(new Date(product.created_at), 'MMM dd')}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Gallery & Featured */}
                <div className="space-y-8">
                    {/* Media Snapshot */}
                    <Card className="border-slate-200/60 shadow-none rounded-2xl overflow-hidden bg-slate-900 p-0 text-white">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-xl font-bold tracking-tight flex items-center justify-between w-full">
                                <span>Media Repository</span>
                                {/* go to link icon  */}
                                <button type="button" className="p-0 m-0 cursor-pointer" onClick={() => navigate('/gallery')}>
                                    <Icon icon="solar:square-arrow-right-up-bold" height={36} width={36} className="text-2xl text-white/20 inline-block" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Assets</p>
                                    <h4 className="text-4xl font-black">{gallery.total_items}</h4>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage Size</p>
                                    <h4 className="text-xl font-bold bg-white/10 px-3 py-1 rounded-lg border border-white/5">{gallery.total_size} <span className="text-xs opacity-60">MB</span></h4>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2"><Icon icon="solar:gallery-bold" className="text-emerald-400" /> Images</span>
                                    <span className="font-bold">{gallery.images}</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(gallery.images / gallery.total_items) * 100}%` }}></div>
                                </div>
                                <div className="flex items-center justify-between text-xs pt-1">
                                    <span className="flex items-center gap-2"><Icon icon="solar:videocamera-record-bold" className="text-amber-400" /> Videos</span>
                                    <span className="font-bold">{gallery.videos}</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(gallery.videos / gallery.total_items) * 100}%` }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Featured Section */}
                    <Card className="border-slate-200/60 p-0 shadow-none rounded-2xl overflow-hidden gap-0">
                        <CardHeader className="p-8 pb-0 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-slate-900">Featured Items</CardTitle>
                                <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px]">HIGHLIGHED</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {featuredProducts.length === 0 ? (
                                <div className="p-10  text-center text-slate-400 text-sm">No featured products</div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {featuredProducts.map(product => (
                                        <div key={product.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                            <div className="size-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden shadow-sm">
                                                {product.thumbnail ? (
                                                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Icon icon="solar:box-linear" className="m-auto mt-3 text-slate-200" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-slate-900 truncate">{product.title}</span>
                                                <span className="text-[10px] font-bold text-indigo-500 uppercase">{product.category?.title || 'Catalog'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
