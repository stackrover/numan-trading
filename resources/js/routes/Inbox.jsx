import { Icon } from "@iconify-icon/react";
import React from "react";
import { useParams, useNavigate } from "react-router";
import { useEnquiry, useReplyEnquiry } from "@/services/enquiry.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/ui/editor/Editor";
import { format } from "date-fns";
import { motion } from "motion/react";
import { PlusIcon } from "lucide-react";

export default function Inbox() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: enquiry, isLoading } = useEnquiry(id);
    const { mutate: replyToEnquiry, isPending } = useReplyEnquiry();
    const [replyMessage, setReplyMessage] = React.useState("");

    const handleReply = () => {
        if (!replyMessage || replyMessage === '<p></p>') return;
        replyToEnquiry(
            { id, data: { message: replyMessage } },
            {
                onSuccess: () => {
                    setReplyMessage("");
                },
            }
        );
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
    );

    if (!enquiry) return (
        <div className="p-20 text-center font-sans">
            <Icon icon="solar:danger-bold" className="text-5xl text-rose-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Record Not Found</h2>
            <p className="text-slate-500 mt-2 font-medium">The requested enquiry could not be located.</p>
            <Button onClick={() => navigate(-1)} className="mt-8 rounded-lg bg-slate-900 text-white font-bold h-11 px-8 shadow-sm">Return to Inbox</Button>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-5xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-sm mb-4 transition-all"
                    >
                        <Icon icon="solar:alt-arrow-left-linear" className="text-xl" />
                        Back to Enquiries
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Conversation Detail</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Official record of client communication history.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">Status: Open</span>
                </div>
            </header>

            <div className="grid gap-8">
                {/* Client Signal */}
                <Card className="border-slate-200/60 shadow-none rounded-xl overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-5">
                            <div className="size-14 bg-slate-900 text-white flex items-center justify-center rounded-lg font-bold text-xl shadow-sm">
                                {enquiry.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">{enquiry.name}</CardTitle>
                                <span className="text-xs text-slate-500 font-semibold">{enquiry.email}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Timestamp</span>
                            <span className="text-xs text-slate-800 font-bold">
                                {format(new Date(enquiry.created_at), 'MMMM dd, yyyy // HH:mm')}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <div className="p-6 rounded-lg bg-slate-50 border border-slate-100">
                                <h4 className="font-bold text-slate-900 text-base mb-3 border-b border-slate-200/60 pb-3">{enquiry.subject}</h4>
                                <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{enquiry.message}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reply Section */}
                <Card className="border-slate-200/60 shadow-none rounded-xl overflow-hidden bg-slate-50/20">
                    <CardHeader className="p-8 pb-4 border-b border-white/40">
                        <CardTitle className="text-sm font-bold flex items-center gap-3 text-slate-900 uppercase tracking-widest">
                            <Icon icon="solar:reply-2-linear" className="text-xl text-indigo-600" />
                            Compose Response
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <TiptapEditor
                            placeholder="Type your official response here..."
                            value={replyMessage}
                            onChange={setReplyMessage}
                        />
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="rounded-lg px-6 h-11 font-bold text-xs uppercase tracking-wider border-slate-200 text-slate-500 hover:text-slate-700 transition-all shadow-sm"
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={handleReply}
                                disabled={isPending || !replyMessage || replyMessage === '<p></p>'}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-8 rounded-lg transition-all flex items-center gap-2 text-xs uppercase tracking-wider shadow-sm"
                            >
                                {isPending ? "Sending..." : "Send Response"}
                                <Icon icon="solar:plain-linear" className="text-lg" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
