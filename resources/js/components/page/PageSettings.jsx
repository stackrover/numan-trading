import { Button } from "@/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdatePageMutation } from "@/services/page.service";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify-icon/react";

export const PageSettings = ({ page }) => {
    const { mutate: updatePage, isPending } = useUpdatePageMutation();
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        icon: "",
        published_at: "",
    });

    useEffect(() => {
        if (page) {
            setFormData({
                title: page.title || "",
                slug: page.slug || "",
                icon: page.icon || "",
                published_at: page.published_at ? page.published_at.split(' ')[0] : "",
            });
        }
    }, [page]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePage({ id: page.id, data: formData });
    };

    return (
        <section className="mx-auto max-w-7xl w-full px-6 sm:px-8 py-10">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white squircle-lg p-8 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Page Settings</h3>
                        <Button onClick={handleSubmit} disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>

                    <form className="space-y-6">
                        <Field>
                            <FieldLabel>Page Title</FieldLabel>
                            <FieldContent>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter page title"
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Page Slug</FieldLabel>
                            <FieldContent>
                                <Input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="enter-page-slug"
                                />
                            </FieldContent>
                            <FieldDescription>
                                The URL friendly version of the title.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>Icon (Iconify Name)</FieldLabel>
                            <FieldContent className="flex gap-3">
                                <Input
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="solar:file-text-linear"
                                />
                                <div className="flex items-center justify-center size-10 bg-gray-50 rounded-md border border-gray-100">
                                    <Icon icon={formData.icon || "solar:help-linear"} width="24" />
                                </div>
                            </FieldContent>
                            <FieldDescription>
                                Use any icon name from Iconify (e.g., solar:home-linear).
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>Publish Date</FieldLabel>
                            <FieldContent>
                                <Input
                                    type="date"
                                    name="published_at"
                                    value={formData.published_at}
                                    onChange={handleChange}
                                />
                            </FieldContent>
                            <FieldDescription>
                                Set a date to publish or leave empty for draft.
                            </FieldDescription>
                        </Field>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};
