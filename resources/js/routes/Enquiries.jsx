import { useEnquiries } from "@/services/enquiry.service";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router";
import { format } from "date-fns";

export default function Enquiries() {
    const { data, isLoading } = useEnquiries();
    const navigate = useNavigate();

    const enquiries = data?.data || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread': return 'bg-orange-100 text-orange-600';
            case 'read': return 'bg-blue-100 text-blue-600';
            case 'replied': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-3">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Inbox</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none">Customer Enquiries</h1>
                    <p className="text-slate-500 font-medium mt-2">Track and respond to potential business opportunities and feedback.</p>
                </div>
            </header>

            <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-none">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[200px]">From</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="w-[150px]">Status</TableHead>
                            <TableHead className="w-[150px]">Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-400">Loading enquiries...</TableCell>
                            </TableRow>
                        ) : enquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-400">No enquiries found.</TableCell>
                            </TableRow>
                        ) : (
                            enquiries.map((enquiry) => (
                                <TableRow key={enquiry.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{enquiry.name}</span>
                                            <span className="text-xs text-slate-400">{enquiry.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{enquiry.subject}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(enquiry.status)}`}>
                                            {enquiry.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {format(new Date(enquiry.created_at), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/enquiries/${enquiry.id}`)}
                                        >
                                            <Icon icon="solar:eye-linear" width="18" />
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
