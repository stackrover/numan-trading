import { useResetPasswordMutation } from "@/services/auth.service";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            <div className="w-full max-w-[480px] space-y-8">
                {/* Simple Logo */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="size-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
                        <span className="text-white text-3xl font-bold">N</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Create new password</h1>
                        <p className="text-slate-500 mt-2 font-medium">Please enter your new security credentials</p>
                    </div>
                </div>

                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <input type="hidden" {...register("token")} />

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    {...register("email")}
                                    className={`h-12 border-slate-200 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`h-12 border-slate-200 rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-700">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password_confirmation")}
                                    className={`h-12 border-slate-200 rounded-xl ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                />
                                {errors.password_confirmation && <p className="text-xs font-medium text-red-500">{errors.password_confirmation.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all mt-4"
                            >
                                {isPending ? "Validating..." : "Reset Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-slate-500 font-medium">
                    Remember your password?{" "}
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
