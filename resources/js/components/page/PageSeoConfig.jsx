"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutosizeTextarea } from "@/components/ui/textarea";
import { usePage, useUpdateSeoMutation } from "@/services/page.service";
import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const PageSeoConfig = ({ page }) => {
    const { mutate: updateSeo, isPending } = useUpdateSeoMutation();

    const [seoData, setSeoData] = useState({
        title: "",
        description: "",
        keywords: [],
        og_title: "",
        og_description: "",
        og_image: "",
        og_type: "website",
        twitter_card: "summary_large_image",
        twitter_title: "",
        twitter_description: "",
        twitter_image: "",
        canonical_url: "",
        robots: "index, follow",
    });

    const [keywords, setKeywords] = useState("");

    useEffect(() => {
        if (page?.data?.seo) {
            setSeoData((prev) => ({
                ...prev,
                ...page.data.seo,
            }));
            setKeywords(page.data.seo.keywords?.join(", ") || "");
        }
    }, [page]);

    const ogImageInputRef = useRef(null);
    const twitterImageInputRef = useRef(null);

    const handleInputChange = (field, value) => {
        setSeoData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        updateSeo({ slug: page.slug, data: seoData });
    };

    const handleKeywordsChange = (value) => {
        setKeywords(value);
        const keywordArray = value
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
        setSeoData((prev) => ({ ...prev, keywords: keywordArray }));
    };

    const handleImageUpload = (event, field) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            // Convert to base64 or upload to server
            const reader = new FileReader();
            reader.onloadend = () => {
                setSeoData((prev) => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (field) => {
        setSeoData((prev) => ({ ...prev, [field]: "" }));
        if (field === "og_image" && ogImageInputRef.current) {
            ogImageInputRef.current.value = "";
        }
        if (field === "twitter_image" && twitterImageInputRef.current) {
            twitterImageInputRef.current.value = "";
        }
    };

    const metaTitleLength = seoData.title?.length || 0;
    const metaDescLength = seoData.description?.length || 0;
    const ogDescLength = seoData.og_description?.length || 0;
    const twitterDescLength = seoData.twitter_description?.length || 0;

    return (
        <section
            data-testid="page-seo-config"
            data-slot="page-seo-config"
            className="@container/seo p-6"
        >
            <div className="container flex max-w-4xl flex-col gap-y-5">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between gap-4 py-2"
                >
                    <h1 className="text-xl">SEO Configuration</h1>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </motion.div>

                <Separator />

                <form className="grid grid-cols-1 gap-x-6 gap-y-8 @3xl/seo:grid-cols-2">
                    {/* Left side - Form Fields */}
                    <div className="space-y-6">
                        {/* Basic Meta Tags */}

                        <motion.div
                            initial={{ opacity: 0, x: -10, y: 10 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            className="squircle-sm flex flex-col gap-y-5 bg-white p-5"
                        >
                            <h5 className="font-sans font-bold tracking-wider uppercase">
                                Basic Meta Tags
                            </h5>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                <Field className="col-span-2 md:col-span-1">
                                    <FieldLabel className="text-xs font-bold">
                                        Meta Title
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="Enter meta title"
                                            value={seoData.title}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "title",
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={60}
                                        />
                                    </FieldContent>
                                    <FieldDescription>
                                        {metaTitleLength}/60 characters
                                    </FieldDescription>
                                </Field>

                                <Field className="col-span-2 md:col-span-1">
                                    <FieldLabel className="text-xs font-bold">
                                        Canonical URL
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="https://example.com/page"
                                            value={seoData.canonical_url}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "canonical_url",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FieldContent>
                                </Field>

                                <Field className="col-span-2">
                                    <FieldLabel className="text-xs font-bold">
                                        Meta Keywords
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="keyword1, keyword2, keyword3"
                                            value={keywords}
                                            onChange={(e) =>
                                                handleKeywordsChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FieldContent>
                                    <FieldDescription>
                                        Separate keywords with commas
                                    </FieldDescription>
                                </Field>

                                <Field className="col-span-2">
                                    <FieldLabel className="text-xs font-bold">
                                        Meta Description
                                    </FieldLabel>
                                    <FieldContent>
                                        <AutosizeTextarea
                                            placeholder="Transform your brand with..."
                                            value={seoData.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={160}
                                        />
                                    </FieldContent>
                                    <FieldDescription>
                                        {metaDescLength}/160 characters
                                    </FieldDescription>
                                </Field>

                                <Field className="col-span-2 md:col-span-1">
                                    <FieldLabel className="text-xs font-bold">
                                        Robots
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="index, follow"
                                            value={seoData.robots}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "robots",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            </div>
                        </motion.div>

                        {/* Open Graph (Facebook) Tags Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -10, y: 10 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            className="squircle-sm flex flex-col gap-y-5 bg-white p-5"
                        >
                            <h5 className="font-sans font-bold tracking-wider uppercase">
                                Open Graph (Facebook)
                            </h5>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                <Field className="col-span-2 md:col-span-1">
                                    <FieldLabel className="text-xs font-bold">
                                        OG Title
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="Facebook title"
                                            value={seoData.og_title}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "og_title",
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={60}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field className="col-span-2 md:col-span-1">
                                    <FieldLabel className="text-xs font-bold">
                                        OG Type
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="website, article, etc."
                                            value={seoData.og_type}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "og_type",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FieldContent>
                                </Field>

                                <Field className="col-span-2">
                                    <FieldLabel className="text-xs font-bold">
                                        OG Description
                                    </FieldLabel>
                                    <FieldContent>
                                        <AutosizeTextarea
                                            placeholder="Description for Facebook sharing"
                                            value={seoData.og_description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "og_description",
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={160}
                                        />
                                    </FieldContent>
                                    <FieldDescription>
                                        {ogDescLength}/160 characters
                                    </FieldDescription>
                                </Field>

                                <Field className="col-span-2">
                                    <FieldLabel className="text-xs font-bold">
                                        OG Image
                                    </FieldLabel>
                                    <FieldContent>
                                        <div className="space-y-3">
                                            {seoData.og_image && (
                                                <div className="squircle-md relative aspect-[1.91/1] w-full overflow-hidden border border-gray-200 bg-gray-100">
                                                    <img
                                                        src={seoData.og_image}
                                                        alt="OG Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 size-8"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                "og_image",
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            icon="lucide:x"
                                                            className="size-4"
                                                        />
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="https://example.com/image.jpg"
                                                    value={
                                                        seoData.og_image?.startsWith(
                                                            "data:",
                                                        )
                                                            ? ""
                                                            : seoData.og_image
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "og_image",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <input
                                                    ref={ogImageInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleImageUpload(
                                                            e,
                                                            "og_image",
                                                        )
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        ogImageInputRef.current?.click()
                                                    }
                                                >
                                                    <Icon
                                                        icon="lucide:upload"
                                                        className="mr-2 size-4"
                                                    />
                                                    Upload
                                                </Button>
                                            </div>
                                        </div>
                                    </FieldContent>
                                    <FieldDescription>
                                        Recommended: 1200x630px (Max 5MB)
                                    </FieldDescription>
                                </Field>
                            </div>
                        </motion.div>

                        {/* Twitter Card Tags Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -10, y: 10 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            className="squircle-sm flex flex-col gap-y-5 bg-white p-5"
                        >
                            <h5 className="font-sans font-bold tracking-wider uppercase">
                                Twitter Card
                            </h5>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                <Field className="col-span-2 md:col-span-1">
                                    <FieldLabel className="text-xs font-bold">
                                        Card Type
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="summary_large_image"
                                            value={seoData.twitter_card}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "twitter_card",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FieldContent>
                                </Field>

                                <Field className="col-span-2 md:col-span-1">
                                    <FieldLabel className="text-xs font-bold">
                                        Twitter Title
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="Twitter title"
                                            value={seoData.twitter_title}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "twitter_title",
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={60}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field className="col-span-2">
                                    <FieldLabel className="text-xs font-bold">
                                        Twitter Description
                                    </FieldLabel>
                                    <FieldContent>
                                        <AutosizeTextarea
                                            placeholder="Description for Twitter sharing"
                                            value={seoData.twitter_description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "twitter_description",
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={160}
                                        />
                                    </FieldContent>
                                    <FieldDescription>
                                        {twitterDescLength}/160 characters
                                    </FieldDescription>
                                </Field>

                                <Field className="col-span-2">
                                    <FieldLabel className="text-xs font-bold">
                                        Twitter Image
                                    </FieldLabel>
                                    <FieldContent>
                                        <div className="space-y-3">
                                            {seoData.twitter_image && (
                                                <div className="squircle-md relative aspect-[2/1] w-full overflow-hidden border border-gray-200 bg-gray-100">
                                                    <img
                                                        src={
                                                            seoData.twitter_image
                                                        }
                                                        alt="Twitter Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 size-8"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                "twitter_image",
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            icon="lucide:x"
                                                            className="size-4"
                                                        />
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="https://example.com/twitter-image.jpg"
                                                    value={
                                                        seoData.twitter_image?.startsWith(
                                                            "data:",
                                                        )
                                                            ? ""
                                                            : seoData.twitter_image
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "twitter_image",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <input
                                                    ref={twitterImageInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleImageUpload(
                                                            e,
                                                            "twitter_image",
                                                        )
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        twitterImageInputRef.current?.click()
                                                    }
                                                >
                                                    <Icon
                                                        icon="lucide:upload"
                                                        className="mr-2 size-4"
                                                    />
                                                    Upload
                                                </Button>
                                            </div>
                                        </div>
                                    </FieldContent>
                                    <FieldDescription>
                                        Recommended: 1200x600px (Max 5MB)
                                    </FieldDescription>
                                </Field>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side - Preview Section */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: 10 }}
                            whileInView={{ opacity: 1, y: 0, x: 0 }}
                            className="squircle-sm sticky top-6 flex flex-col gap-y-5 bg-white p-5"
                        >
                            <h5 className="font-sans font-bold tracking-wider uppercase">
                                SEO Preview
                            </h5>

                            <Tabs defaultValue="google" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger
                                        value="google"
                                        className="gap-2"
                                    >
                                        <Icon
                                            icon="lucide:globe"
                                            className="size-4"
                                        />
                                        Google
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="facebook"
                                        className="gap-2"
                                    >
                                        <Icon
                                            icon="lucide:facebook"
                                            className="size-4"
                                        />
                                        Facebook
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="twitter"
                                        className="gap-2"
                                    >
                                        <Icon
                                            icon="lucide:twitter"
                                            className="size-4"
                                        />
                                        Twitter
                                    </TabsTrigger>
                                </TabsList>

                                {/* Google Search Preview */}
                                <TabsContent value="google" className="mt-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex flex-col gap-y-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                                                        <Icon
                                                            icon="lucide:globe"
                                                            className="size-3 text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-600">
                                                            {seoData.canonical_url ||
                                                                "https://example.com"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="mb-1 line-clamp-1 font-sans text-lg font-semibold text-blue-800 hover:cursor-pointer hover:underline">
                                                        {seoData.title ||
                                                            "Page Title"}
                                                    </h4>
                                                    <p className="text-text-secondary line-clamp-2 font-sans text-xs">
                                                        {seoData.description ||
                                                            "This is how your page description will appear in search results."}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Facebook Preview */}
                                <TabsContent value="facebook" className="mt-4">
                                    <Card className="overflow-hidden border-0 shadow-none">
                                        <CardContent className="p-0">
                                            <div className="squircle-lg flex flex-col overflow-hidden border border-gray-200 bg-white">
                                                {/* Image */}
                                                <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50">
                                                    {seoData.og_image ? (
                                                        <img
                                                            src={
                                                                seoData.og_image
                                                            }
                                                            alt="OG Preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Icon
                                                            icon="lucide:image"
                                                            className="size-16 text-gray-400/50"
                                                        />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="bg-gray-50 p-4">
                                                    <div className="mb-1 text-xs text-gray-500 uppercase">
                                                        {seoData.canonical_url?.replace(
                                                            /^https?:\/\//,
                                                            "",
                                                        ) || "EXAMPLE.COM"}
                                                    </div>
                                                    <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
                                                        {seoData.og_title ||
                                                            seoData.title ||
                                                            "Page Title"}
                                                    </h4>
                                                    <p className="line-clamp-2 text-xs text-gray-600">
                                                        {seoData.og_description ||
                                                            seoData.description ||
                                                            "Description for Facebook sharing"}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Twitter Preview */}
                                <TabsContent value="twitter" className="mt-4">
                                    <Card className="overflow-hidden border-0 shadow-none">
                                        <CardContent className="p-0">
                                            <div className="squircle-lg flex flex-col overflow-hidden border border-gray-200 bg-white">
                                                {/* Image */}
                                                <div className="flex aspect-[2/1] w-full items-center justify-center bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100">
                                                    {seoData.twitter_image ||
                                                        seoData.og_image ? (
                                                        <img
                                                            src={
                                                                seoData.twitter_image ||
                                                                seoData.og_image
                                                            }
                                                            alt="Twitter Preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Icon
                                                            icon="lucide:image"
                                                            className="size-16 text-blue-400/50"
                                                        />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="bg-white p-4">
                                                    <h4 className="mb-1 line-clamp-1 text-sm font-semibold text-gray-900">
                                                        {seoData.twitter_title ||
                                                            seoData.og_title ||
                                                            seoData.title ||
                                                            "Page Title"}
                                                    </h4>
                                                    <p className="mb-3 line-clamp-2 text-xs text-gray-600">
                                                        {seoData.twitter_description ||
                                                            seoData.og_description ||
                                                            seoData.description ||
                                                            "Description for Twitter sharing"}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Icon
                                                            icon="lucide:globe"
                                                            className="size-3"
                                                        />
                                                        {seoData.canonical_url?.replace(
                                                            /^https?:\/\//,
                                                            "",
                                                        ) || "example.com"}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            {/* Additional Info */}
                            <div className="squircle-sm mt-4 border border-blue-200 bg-blue-50 p-3">
                                <h6 className="mb-2 text-sm font-semibold text-blue-900">
                                    SEO Tips
                                </h6>
                                <ul className="space-y-1 text-xs text-blue-800">
                                    <li>
                                        • Keep meta title under 60 characters
                                    </li>
                                    <li>
                                        • Keep meta description under 160
                                        characters
                                    </li>
                                    <li>• Use relevant keywords naturally</li>
                                    <li>• OG images should be 1200x630px</li>
                                    <li>
                                        • Twitter images should be 1200x600px
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </form>
            </div>
        </section>
    );
};
