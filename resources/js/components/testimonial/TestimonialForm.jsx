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
import { Switch } from "@/components/ui/switch";
import { AutosizeTextarea } from "@/components/ui/textarea";
import { UploadOrSelectMedia } from "@/components/uploadOrSelectMedia";
import { useMedia } from "@/services/media.service";
import { useCreateTestimonial, useUpdateTestimonial } from "@/services/testimonial.service";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const TestimonialForm = ({ testimonial, onSuccess, onCancel }) => {
    const isEdit = !!testimonial;
    const { mutate: createTestimonial, isPending: isCreating } = useCreateTestimonial();
    const { mutate: updateTestimonial, isPending: isUpdating } = useUpdateTestimonial();

    // Fetch media to resolve image ID to URL
    const { data: mediaList } = useMedia();

    const form = useForm({
        defaultValues: {
            name: testimonial?.name || "",
            company: testimonial?.company || "",
            review: testimonial?.review || "",
            image: testimonial?.image || "",
            rating: testimonial?.rating || 5,
            is_active: testimonial?.is_active ?? true,
            is_featured: testimonial?.is_featured ?? false,
        },
    });

    // Resolve URL to Media ID for preview when editing
    useEffect(() => {
        if (isEdit && testimonial?.image && mediaList) {
            const media = mediaList.find(m => m.url === testimonial.image);
            if (media) {
                form.setValue("image", media.id);
            }
        }
    }, [testimonial, mediaList, isEdit, form]);

    const onSubmit = (data) => {
        let image = data.image;

        // Resolve image object (or ID) to URL string if needed
        if (image && mediaList) {
            if (typeof image === "object" && image.id) {
                const media = mediaList.find(m => m.id === image.id);
                if (media) image = media.url;
            } else if (typeof image === "number") {
                const media = mediaList.find(m => m.id === image);
                if (media) image = media.url;
            }
        }

        const payload = { ...data, image };

        const action = isEdit ? updateTestimonial : createTestimonial;
        const options = {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        };

        if (isEdit) {
            action({ id: testimonial.id, data: payload }, options);
        } else {
            action(payload, options);
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company / Position</FormLabel>
                                <FormControl>
                                    <Input placeholder="CEO, Acme Inc" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rating (1-5)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" max="5" placeholder="5" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm pt-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Active</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="review"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Review</FormLabel>
                            <FormControl>
                                <AutosizeTextarea placeholder="Write the testimonial content..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Author Image</FormLabel>
                            <FormControl>
                                <UploadOrSelectMedia
                                    value={field.value}
                                    onChange={field.onChange}
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
                        {isPending ? "Saving..." : isEdit ? "Update Testimonial" : "Create Testimonial"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
