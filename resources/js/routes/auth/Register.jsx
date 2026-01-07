import { useRegisterMutation } from "@/services/auth.service";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify-icon/react";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export default function Register() {
    const { mutate: registerUser, isPending } = useRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data) => {
        registerUser(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
            <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
                <CardHeader className="p-10 pb-2 text-center">
                    <div className="size-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <Icon icon="solar:user-plus-bold" className="text-3xl text-slate-400" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                        <p className="text-slate-500 mt-2 font-medium">Join Numan platform today</p>
                    </div>
                </CardHeader>

                <CardContent className="p-10 pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold text-slate-700 uppercase tracking-widest">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                {...register("name")}
                                className={`h-11 border-slate-200 rounded-lg focus:ring-indigo-500/10 focus:border-indigo-500 font-medium ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-xs font-bold text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-slate-700 uppercase tracking-widest">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                {...register("email")}
                                className={`h-11 border-slate-200 rounded-lg focus:ring-indigo-500/10 focus:border-indigo-500 font-medium ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-xs font-bold text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[10px]">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="•••••"
                                    {...register("password")}
                                    className={`h-11 border-slate-200 rounded-lg focus:ring-indigo-500/10 focus:border-indigo-500 font-medium ${errors.password ? 'border-red-500' : ''}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[10px]">Confirm</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="•••••"
                                    {...register("password_confirmation")}
                                    className={`h-11 border-slate-200 rounded-lg focus:ring-indigo-500/10 focus:border-indigo-500 font-medium ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                />
                            </div>
                        </div>
                        {(errors.password || errors.password_confirmation) && (
                            <p className="text-xs font-bold text-red-500">
                                {errors.password?.message || errors.password_confirmation?.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-lg transition-all shadow-md shadow-slate-200 text-xs uppercase tracking-widest mt-4"
                        >
                            {isPending ? "Creating account..." : "Register Now"}
                        </Button>

                        <p className="text-center text-sm text-slate-500 font-medium pt-4">
                            Already have an account?{" "}
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
