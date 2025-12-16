import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

export default function Login() {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = form.handleSubmit((data) => {
        console.log({ data });
    });

    return (
        <div className="h-lvh w-screen flex items-center justify-center">
            <Form {...form}>
                <form
                    onSubmit={onSubmit}
                    className="space-y-4 w-[min(300px,100%)] p-6 flex flex-col items-center shadow-sm"
                >
                    <div className="text-sm text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-accent rounded-md mb-2.5">
                            {/* Logo here... */}
                        </div>
                        <h3 className="text-lg font-medium mb-1"> Login </h3>
                        <p className="text-sm text-text-secondary">
                            Welcome Back! Please Login
                        </p>
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className="w-full"> Login </Button>

                    <div className="text-sm text-center text-muted-foreground">
                        <span> Don't have an account? </span>
                        <a
                            href="/register"
                            className="text-primary hover:underline ml-1"
                        >
                            Sign Up
                        </a>
                    </div>
                </form>
            </Form>
        </div>
    );
}
