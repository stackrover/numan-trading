import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/textarea";
import { useCreateBrand, useUpdateBrand } from "@/services/brand.service";
import { Loader2 } from "lucide-react";

export const BrandForm = ({ brand, onSuccess, onCancel }) => {
    const isEdit = !!brand;
    const { mutate: createBrand, isPending: isCreating } = useCreateBrand();
    const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand();

    const form = useForm({
        defaultValues: {
            title: brand?.title || "",
            slug: brand?.slug || "",
            company: brand?.company || "",
            location: brand?.location || "",
            short_description: brand?.short_description || "",
            website: brand?.website || "",
        },
    });

    const watchTitle = form.watch("title");

    useEffect(() => {
        if (!isEdit && watchTitle) {
            const slug = watchTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            form.setValue("slug", slug);
        }
    }, [watchTitle, isEdit, form]);

    const onSubmit = (data) => {
        const action = isEdit ? updateBrand : createBrand;
        const options = {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        };

        if (isEdit) {
            action({ id: brand.id, data }, options);
        } else {
            action(data, options);
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Acme Corp" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="acme-corp" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Full Legal Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="City, Country" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                                <AutosizeTextarea
                                    placeholder="Brief overview of the brand..."
                                    minHeight={100}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? "Update Brand" : "Create Brand"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
