import { useEnquiry, useReplyEnquiry } from "@/services/enquiry.service";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutosizeTextarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { motion } from "motion/react";

export default function Inbox() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: enquiry, isLoading } = useEnquiry(id);
    const { mutate: replyEnquiry, isPending } = useReplyEnquiry();
    const [replyMessage, setReplyMessage] = useState("");

    const handleReply = () => {
        if (!replyMessage.trim()) return;
        replyEnquiry({ id, data: { message: replyMessage } }, {
            onSuccess: () => {
                setReplyMessage("");
                navigate("/enquiries");
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center">Loading enquiry...</div>;
    if (!enquiry) return <div className="p-8 text-center text-red-500">Enquiry not found.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <Icon icon="solar:alt-arrow-left-linear" width="24" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Enquiry Detail</h1>
                    <p className="text-gray-500 text-sm">Conversation with {enquiry.name}</p>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Original Message */}
                <Card className="border-none shadow-sm bg-blue-50/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                                {enquiry.name.charAt(0)}
                            </div>
                            <div>
                                <CardTitle className="text-lg">{enquiry.name}</CardTitle>
                                <p className="text-xs text-gray-400">{enquiry.email}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">
                            {format(new Date(enquiry.created_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                            <h4 className="font-bold text-gray-900 mb-2">{enquiry.subject}</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{enquiry.message}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Reply Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2">
                            <Icon icon="solar:reply-2-linear" width="20" />
                            Write a Reply
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <AutosizeTextarea
                            placeholder="Type your response here..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="min-h-[200px] bg-gray-50/50"
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button
                                onClick={handleReply}
                                disabled={isPending || !replyMessage.trim()}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {isPending ? "Sending..." : "Send Reply"}
                                <Icon icon="solar:plain-2-linear" width="20" className="ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
