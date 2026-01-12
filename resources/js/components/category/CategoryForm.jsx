import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/ui/editor/Editor";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UploadOrSelectMedia } from "@/components/uploadOrSelectMedia";
import { useCategories, useCreateCategory, useUpdateCategory } from "@/services/category.service";
import { useMedia } from "@/services/media.service";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const CategoryForm = ({ category, onSuccess, onCancel }) => {
    const isEdit = !!category;
    const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

    // Fetch categories for parent selection
    const { data: categoriesData } = useCategories({ limit: 100 });
    const parentOptions = categoriesData?.data?.filter(c => c.id !== category?.id) || [];

    // Fetch media to resolve thumbnail ID to URL
    const { data: mediaList } = useMedia();

    const form = useForm({
        defaultValues: {
            title: category?.title || "",
            slug: category?.slug || "",
            thumbnail: category?.thumbnail || "",
            description: category?.description || "",
            parent_id: category?.parent_id ? String(category.parent_id) : "null",
        },
    });

    console.log(form.getValues(), category)

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

    // Resolve URL to Media ID for preview when editing
    useEffect(() => {
        if (isEdit && category?.thumbnail && mediaList) {
            const media = mediaList.find(m => m.url === category.thumbnail);
            if (media) {
                form.setValue("thumbnail", media.id);
            }
        }
    }, [category, mediaList, isEdit, form]);

    const onSubmit = (data) => {
        let thumbnail = data.thumbnail;
        // Resolve thumbnail object (or ID) to URL string if needed
        if (thumbnail && mediaList) {
            if (typeof thumbnail === "object" && thumbnail.id) {
                const media = mediaList.find(m => m.id === thumbnail.id);
                if (media) thumbnail = media.url;
            } else if (typeof thumbnail === "number") {
                const media = mediaList.find(m => m.id === thumbnail);
                if (media) thumbnail = media.url;
            }
        }

        const payload = {
            ...data,
            thumbnail,
            parent_id: data.parent_id === "null" ? null : data.parent_id,
        };

        const action = isEdit ? updateCategory : createCategory;
        const options = {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        };

        if (isEdit) {
            action({ id: category.id, data: payload }, options);
        } else {
            action(payload, options);
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Category Title" {...field} />
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
                                <Input placeholder="category-slug" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parent Category</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a parent (optional)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="null">None (Top Level)</SelectItem>
                                    {parentOptions.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thumbnail</FormLabel>
                            <FormControl>
                                <UploadOrSelectMedia
                                    value={field.value}
                                    onChange={field.onChange}
                                    accept="image/*"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <TiptapEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Category description..."
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
                        {isEdit ? "Update Category" : "Create Category"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
