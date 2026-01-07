import { useResetPasswordMutation } from "@/services/auth.service";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify-icon/react";

const resetPasswordSchema = z.object({
    token: z.string(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const { mutate: resetPassword, isPending } = useResetPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: token || "",
            email: email || "",
        },
    });

    const onSubmit = (data) => {
        resetPassword(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
            <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
                <CardHeader className="p-10 pb-2 text-center">
                    <div className="size-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <Icon icon="solar:key-minimalistic-bold-duotone" className="text-3xl text-slate-400" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Set Password</h1>
                        <p className="text-slate-500 mt-2 font-medium">Create a new secure credential</p>
                    </div>
                </CardHeader>

                <CardContent className="p-10 pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <input type="hidden" {...register("token")} />

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[11px]">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                {...register("email")}
                                className={`h-11 border-slate-200 rounded-lg focus:ring-indigo-500/10 focus:border-indigo-500 font-medium ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-xs font-bold text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[11px]">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={`h-11 border-slate-200 rounded-lg focus:ring-indigo-500/10 focus:border-indigo-500 font-medium ${errors.password ? 'border-red-500' : ''}`}
                            />
                            {errors.password && <p className="text-xs font-bold text-red-500">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[11px]">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                placeholder="••••••••"
                                {...register("password_confirmation")}
                                className={`h-11 border-slate-200 rounded-lg focus:ring-indigo-500/10 focus:border-indigo-500 font-medium ${errors.password_confirmation ? 'border-red-500' : ''}`}
                            />
                            {errors.password_confirmation && <p className="text-xs font-bold text-red-500">{errors.password_confirmation.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-lg transition-all shadow-md shadow-slate-200 text-xs uppercase tracking-widest mt-4"
                        >
                            {isPending ? "Validating..." : "Change Password"}
                        </Button>

                        <p className="text-center text-sm text-slate-500 font-medium pt-4">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-slate-900 hover:underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
