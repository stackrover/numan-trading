import { useForgotPasswordMutation } from "@/services/auth.service";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6 font-sans">
            <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
                <CardHeader className="p-10 pb-2 text-center">
                    <div className="size-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <Icon icon="solar:shield-keyhole-bold" className="text-3xl text-slate-400" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
                        <p className="text-slate-500 mt-2 font-medium">We'll send you a link to your email</p>
                    </div>
                </CardHeader>

                <CardContent className="p-10 pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-slate-700 uppercase tracking-widest">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                {...register("email")}
                                className={`h-12 border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-lg transition-all font-medium ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && (
                                <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-lg transition-all shadow-md shadow-slate-200 text-xs uppercase tracking-widest"
                        >
                            {isPending ? "Sending link..." : "Send Reset Link"}
                        </Button>

                        <p className="text-center text-sm text-slate-500 font-medium pt-4">
                            Back to{" "}
                            <Link
                                to="/login"
                                className="font-bold text-slate-900 hover:underline underline-offset-4"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
