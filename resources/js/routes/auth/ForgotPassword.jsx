import { useForgotPasswordMutation } from "@/services/auth.service";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify-icon/react";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
    const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data) => {
        forgotPassword(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
            <div className="w-full max-w-[440px] space-y-8">
                {/* Simple Logo */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="size-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
                        <span className="text-white text-3xl font-bold">N</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
                        <p className="text-slate-500 mt-2 font-medium">We'll send you a link to restore access</p>
                    </div>
                </div>

                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    {...register("email")}
                                    className={`h-12 border-slate-200 focus:ring-slate-900 focus:border-slate-900 rounded-xl transition-all ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
                            >
                                {isPending ? "Sending link..." : "Send Reset Link"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer Link */}
                <p className="text-center text-sm text-slate-500 font-medium">
                    Back to{" "}
                    <Link
                        to="/login"
                        className="font-bold text-slate-900 hover:underline underline-offset-4"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
