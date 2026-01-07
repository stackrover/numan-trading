import { Icon } from "@iconify-icon/react";
import React from "react";
import { useParams, useNavigate } from "react-router";
import { useEnquiry, useReplyEnquiry } from "@/services/enquiry.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "motion/react";
import { PlusIcon, LogOut } from "lucide-react";

export default function Inbox() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: enquiry, isLoading } = useEnquiry(id);
    const { mutate: replyToEnquiry, isPending } = useReplyEnquiry();
    const [replyMessage, setReplyMessage] = React.useState("");

    const handleReply = () => {
        if (!replyMessage.trim()) return;
        replyToEnquiry(
            { id, data: { message: replyMessage } },
            {
                onSuccess: () => {
                    setReplyMessage("");
                },
            }
        );
    };

    if (isLoading) return <div className="p-8 text-center font-bold text-slate-400 animate-pulse">Loading conversation...</div>;
    if (!enquiry) return <div className="p-8 text-center text-rose-500 font-bold">Enquiry not found.</div>;

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-slate-500 hover:text-slate-900 transition-all font-bold text-[11px] uppercase tracking-widest"
                    >
                        <PlusIcon className="size-4 rotate-45" />
                        Back to Inbox
                    </button>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none">Conversation Detail</h1>
                    <p className="text-slate-500 font-medium mt-2">Internal record of client enquiry and response history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Open Thread</span>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-8"
            >
                {/* Original Message */}
                <Card className="border border-slate-200/60 shadow-none bg-blue-50/20 rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 bg-slate-950 text-white flex items-center justify-center rounded-2xl font-black text-xl border border-slate-800 shadow-xl shadow-slate-900/10">
                                {enquiry.name.charAt(0)}
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{enquiry.name}</CardTitle>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{enquiry.email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Received On</span>
                            <span className="text-xs text-slate-900 font-bold">
                                {format(new Date(enquiry.created_at), 'MMM dd, yyyy HH:mm')}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                            <h4 className="font-black text-slate-900 text-lg mb-4 tracking-tight border-b border-slate-50 pb-4">{enquiry.subject}</h4>
                            <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{enquiry.message}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Reply Form */}
                <Card className="border border-slate-200/60 shadow-none bg-white rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                        <CardTitle className="text-sm font-black flex items-center gap-3 text-slate-900 uppercase tracking-widest">
                            <div className="size-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                <Icon icon="solar:reply-2-bold" width="20" />
                            </div>
                            Compose Official Response
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <AutosizeTextarea
                            placeholder="Type your response here..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="min-h-[200px] bg-slate-50/30 border-slate-200/60 focus:bg-white transition-all rounded-2xl p-6 font-medium text-slate-700 placeholder:text-slate-300"
                        />
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[11px] border-slate-200 text-slate-400 hover:text-slate-600"
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={handleReply}
                                disabled={isPending || !replyMessage.trim()}
                                className="bg-slate-950 hover:bg-slate-800 text-white font-black h-12 px-10 rounded-2xl border border-slate-800 transition-all flex items-center gap-3 uppercase text-[11px] tracking-widest"
                            >
                                {isPending ? "Transmitting..." : "Send Response"}
                                <Icon icon="solar:plain-2-bold" width="20" className="text-orange-400" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
