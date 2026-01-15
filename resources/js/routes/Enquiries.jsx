import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateBRPDF } from "@/lib/pdf-generator";
import { EnquiryApi, useEnquiries } from "@/services/enquiry.service";
import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import React from "react";
import { useNavigate } from "react-router";
import * as XLSX from 'xlsx';

export default function Enquiries() {
    const [params, setParams] = React.useState({
        search: "",
        status: "all",
        from_date: "",
        to_date: "",
    });

    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setParams(prev => ({ ...prev, search: search }));
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading } = useEnquiries({
        ...params,
        status: params.status === "all" ? "" : params.status
    });
    const navigate = useNavigate();

    const enquiries = data?.data || [];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'unread': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'read': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'replied': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const handleExport = async (type) => {
        try {
            const allData = await EnquiryApi.list({
                ...params,
                status: params.status === "all" ? "" : params.status,
                nopaginate: 1
            });

            const exportData = allData.data.map(item => ({
                Name: item.name,
                Email: item.email,
                Company: item.company || 'N/A',
                Subject: item.subject,
                Message: item.message,
                Product: item.product?.title || 'N/A',
                Status: item.status,
                Received: format(new Date(item.created_at), 'MMM dd, yyyy')
            }));

            if (type === 'excel' || type === 'csv') {
                const worksheet = XLSX.utils.json_to_sheet(exportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

                if (type === 'csv') {
                    XLSX.writeFile(workbook, `enquiries_${format(new Date(), 'yyyyMMdd')}.csv`, { bookType: 'csv' });
                } else {
                    XLSX.writeFile(workbook, `enquiries_${format(new Date(), 'yyyyMMdd')}.xlsx`);
                }
            } else if (type === 'pdf') {
                const columns = ["Name", "Email", "Company", "Subject", "Status", "Received"];
                const rows = exportData.map(item => [
                    item.Name,
                    item.Email,
                    item.Company,
                    item.Subject,
                    item.Status,
                    item.Received
                ]);
                await generateBRPDF("Customer Enquiries Report", columns, rows, "enquiries");
            }
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 w-full font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Inquiries</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Review and respond to incoming customer messages.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64 hidden sm:block">
                        <Input
                            placeholder="Search enquiries..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-10 bg-white border-slate-200"
                        />
                        <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                                <Icon icon="solar:filter-linear" className="text-lg" />
                                <span>Filter</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80 p-5 space-y-4">
                            <div className="sm:hidden space-y-2">
                                <label htmlFor="search-enquiries" className="text-xs font-bold uppercase text-slate-400">Search</label>
                                <Input
                                    id="search-enquiries"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="status" className="text-xs font-bold uppercase text-slate-400">Status</label>
                                <Select
                                    value={params.status}
                                    onValueChange={(val) => setParams(prev => ({ ...prev, status: val }))}
                                >
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="unread">Unread</SelectItem>
                                        <SelectItem value="read">Read</SelectItem>
                                        <SelectItem value="replied">Replied</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label htmlFor="from_date" className="text-xs font-bold uppercase text-slate-400">From Date</label>
                                    <Input
                                        id="from_date"
                                        type="date"
                                        value={params.from_date}
                                        onChange={(e) => setParams(prev => ({ ...prev, from_date: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="to_date" className="text-xs font-bold uppercase text-slate-400">To Date</label>
                                    <Input
                                        id="to_date"
                                        type="date"
                                        value={params.to_date}
                                        onChange={(e) => setParams(prev => ({ ...prev, to_date: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setParams({
                                        search: "",
                                        status: "all",
                                        from_date: "",
                                        to_date: "",
                                    });
                                    setSearch("");
                                }}
                            >
                                Reset Filters
                            </Button>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                                <Icon icon="solar:file-download-linear" className="text-lg" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48 p-2 flex flex-col gap-1">
                            <button onClick={() => handleExport('excel')} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors w-full text-left">
                                <Icon icon="vscode-icons:file-type-excel" className="text-lg" />
                                Excel (.xlsx)
                            </button>
                            <button onClick={() => handleExport('csv')} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors w-full text-left">
                                <Icon icon="fluent:document-csv-16-filled" className="text-lg" />
                                CSV (.csv)
                            </button>
                            <button onClick={() => handleExport('pdf')} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors w-full text-left">
                                <Icon icon="material-icon-theme:pdf" className="text-lg" />
                                PDF (.pdf)
                            </button>
                        </PopoverContent>
                    </Popover>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm overflow-x-auto">
                <Table className="min-w-[800px] sm:min-w-full">
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Sender Info</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Product / Subject</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 w-[180px]">Status</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 w-[150px]">Received</TableHead>
                            <TableHead className="text-right px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5} className="h-16 animate-pulse bg-slate-50/20"></TableCell>
                                </TableRow>
                            ))
                        ) : enquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                                    No enquiries found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            enquiries.map((enquiry) => (
                                <TableRow key={enquiry.id} className="hover:bg-slate-50/50 transition-colors h-16 border-b border-slate-50 last:border-0 border-t-0 bg-transparent">
                                    <TableCell className="px-6 border-t-0">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{enquiry.name}</span>
                                            <span className="text-xs text-slate-500 font-medium">{enquiry.email}</span>
                                            {enquiry.company && (
                                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">{enquiry.company}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0">
                                        <div className="flex flex-col gap-0.5">
                                            {enquiry.product && (
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mb-1">
                                                    {enquiry.product.title}
                                                </span>
                                            )}
                                            <span className="text-sm text-slate-700 font-medium line-clamp-1">{enquiry.subject}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(enquiry.status)}`}>
                                            {enquiry.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0 text-sm text-slate-500 font-medium">
                                        {format(new Date(enquiry.created_at), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg px-4 transition-all"
                                            onClick={() => navigate(`/enquiries/${enquiry.id}`)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
