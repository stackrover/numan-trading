import { useEnquiries } from "@/services/enquiry.service";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { motion } from "motion/react";

export default function Enquiries() {
    const { data, isLoading } = useEnquiries();
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

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Enquiries</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Review and respond to incoming customer messages.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Icon icon="solar:filter-linear" className="text-lg" />
                        <span>Filter Index</span>
                    </button>
                    <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Icon icon="solar:file-download-linear" className="text-lg" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Sender Info</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Subject Message</TableHead>
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
                                    No enquiries indexed at this time.
                                </TableCell>
                            </TableRow>
                        ) : (
                            enquiries.map((enquiry) => (
                                <TableRow key={enquiry.id} className="hover:bg-slate-50/50 transition-colors h-16 border-b border-slate-50 last:border-0 border-t-0 bg-transparent">
                                    <TableCell className="px-6 border-t-0">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{enquiry.name}</span>
                                            <span className="text-xs text-slate-500 font-medium">{enquiry.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0">
                                        <span className="text-sm text-slate-700 font-medium line-clamp-1">{enquiry.subject}</span>
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
