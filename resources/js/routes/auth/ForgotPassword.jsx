import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPasswordMutation } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Link } from "react-router";

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
    const { mutate: forgotPasswordMutation, isPending } = useForgotPasswordMutation();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = form.handleSubmit(async (data) => {
        forgotPasswordMutation(data);
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
                                <h1 className="text-3xl font-bold text-white tracking-tight">Forgot Password?</h1>
                                <p className="text-white/60 text-sm">
                                    Enter your email to receive a reset link
                                </p>
                            </div>

                            <div className="w-full space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Email Address"
                                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-primary/50 transition-all rounded-xl"
                                                        {...field}
                                                    />
                                                </div>
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
                                        <span>Sending link...</span>
                                    </div>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>

                            <div className="pt-4 text-center">
                                <Link
                                    to="/login"
                                    className="text-white hover:text-primary text-sm font-medium transition-colors"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
