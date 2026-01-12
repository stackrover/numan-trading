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
import { UploadOrSelectMedia } from "@/components/uploadOrSelectMedia";
import { useMedia } from "@/services/media.service";
import { useCreatePartner, useUpdatePartner } from "@/services/partner.service";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const PartnerForm = ({ partner, onSuccess, onCancel }) => {
    const isEdit = !!partner;
    const { mutate: createPartner, isPending: isCreating } = useCreatePartner();
    const { mutate: updatePartner, isPending: isUpdating } = useUpdatePartner();

    // Fetch media to resolve logo ID to URL
    const { data: mediaList } = useMedia();

    const form = useForm({
        defaultValues: {
            name: partner?.name || "",
            location: partner?.location || "",
            established_at: partner?.established_at || new Date().getFullYear(),
            logo: partner?.logo || "",
        },
    });

    // Resolve URL to Media ID for preview when editing
    useEffect(() => {
        if (isEdit && partner?.logo && mediaList) {
            const media = mediaList.find(m => m.url === partner.logo);
            if (media) {
                form.setValue("logo", media.id);
            }
        }
    }, [partner, mediaList, isEdit, form]);

    const onSubmit = (data) => {
        let logo = data.logo;
        
        // Resolve logo object (or ID) to URL string if needed
        if (logo && mediaList) {
            if (typeof logo === "object" && logo.id) {
                const media = mediaList.find(m => m.id === logo.id);
                if (media) logo = media.url;
            } else if (typeof logo === "number") {
                const media = mediaList.find(m => m.id === logo);
                if (media) logo = media.url;
            }
        }

        const payload = { ...data, logo };

        const action = isEdit ? updatePartner : createPartner;
        const options = {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        };

        if (isEdit) {
            action({ id: partner.id, data: payload }, options);
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
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Acme Inc." {...field} />
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

                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="established_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Established Year</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1800" max={new Date().getFullYear() + 1} placeholder="2020" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Logo</FormLabel>
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
                        {isPending ? "Saving..." : isEdit ? "Update Partner" : "Create Partner"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
