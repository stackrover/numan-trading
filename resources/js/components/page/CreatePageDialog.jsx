import { useForm } from "react-hook-form";
import z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCreatePage } from "@/services/page.service";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    icon: z.string().optional(),
});

export const CreatePageDialog = ({ open, onOpenChange }) => {
    const { mutate: createPage, isPending } = useCreatePage();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            slug: "",
            icon: "",
        },
    });

    const onSubmit = (data) => {
        createPage(data);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                form.reset();
                onOpenChange(open);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                    <DialogDescription>
                        Create a new page by filling out the form below.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 pt-5"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Title </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Page title"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Identifier (Slug) </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="(Identifier) page-slug"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Icon </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Icon (Optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <Button onClick={form.handleSubmit(onSubmit)}>
                        Create Page
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
