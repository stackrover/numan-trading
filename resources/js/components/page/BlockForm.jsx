import React from "react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCreateBlock, useUpdateBlock } from "@/services/block.service";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    icon: z.string().optional(),
});

export const BlockForm = ({ defaultValue, mode, pageId, onSuccess }) => {
    const { mutate: createBlock, isPending: isCreating } = useCreateBlock();
    const { mutate: updateBlock, isPending: isUpdating } = useUpdateBlock();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            slug: "",
            icon: "",
            ...defaultValue,
        },
    });

    const onSubmit = (data) => {
        if (mode === "add") {
            createBlock(
                {
                    ...data,
                    page_id: pageId,
                },
                {
                    onSuccess: () => {
                        form.reset();
                        onSuccess?.();
                    },
                },
            );
        } else if (mode === "edit") {
            updateBlock(
                {
                    blockId: defaultValue?.id,
                    blockData: data,
                },
                {
                    onSuccess: () => {
                        onSuccess?.();
                    },
                },
            );
        }
    };

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col space-y-5 py-4"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Title </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Block Title"
                                        {...field}
                                    />
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
                                <FormLabel> Slug </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Block Slug"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
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
                                        placeholder="Block Icon"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit" disabled={isCreating || isUpdating}>
                        {mode === "edit" ? "Update Block" : "Add Block"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
