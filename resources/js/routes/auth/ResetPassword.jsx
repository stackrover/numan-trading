import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useResetPasswordMutation } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useSearchParams, useParams } from "react-router";

const schema = z.object({
    token: z.string().min(1, "Token is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(6, "Password confirmation must be at least 6 characters"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export default function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const { mutate: resetPasswordMutation, isPending } = useResetPasswordMutation();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            token: token || "",
            email: searchParams.get("email") || "",
            password: "",
            password_confirmation: "",
        },
    });

    const onSubmit = form.handleSubmit(async (data) => {
        resetPasswordMutation(data);
    });

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: 'url("/images/login-bg.png")' }}>
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            <div className="relative z-10 w-full max-w-md p-2 px-4 sm:px-6">
                <div
                    className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                    <Form {...form}>
                        <form
                            onSubmit={onSubmit}
                            className="p-8 flex flex-col items-center space-y-6"
                        >
                            <div className="text-center w-full space-y-2">
                                <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-2xl rotate-12 flex items-center justify-center shadow-lg mb-6">
                                    <span className="text-white text-3xl font-bold -rotate-12">N</span>
                                </div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">Set New Password</h1>
                                <p className="text-white/60 text-sm">
                                    Create a secure password for your account
                                </p>
                            </div>

                            <div className="w-full space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input
                                                    readOnly
                                                    placeholder="Email Address"
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-primary/50 transition-all rounded-xl opacity-70 cursor-not-allowed"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="New Password"
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-primary/50 transition-all rounded-xl"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password_confirmation"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Confirm New Password"
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-primary/50 transition-all rounded-xl"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner className="w-4 h-4 text-white" />
                                        <span>Resetting...</span>
                                    </div>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
