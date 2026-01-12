import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea as Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/ui/editor/Editor";
import { UploadOrSelectMedia } from "@/components/uploadOrSelectMedia";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/services/category.service";
import { useBrands } from "@/services/brand.service";
import { useCreateProduct, useUpdateProduct } from "@/services/product.service";
import { useMedia } from "@/services/media.service";
import { Check, ChevronsUpDown, Loader2, Plus, PlusCircle, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/category/CategoryForm";
import { BrandForm } from "@/components/brand/BrandForm";

export const ProductForm = ({ product, onSuccess, onCancel }) => {
    const isEdit = !!product;
    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    // Category fetch
    const { data: categoriesData, refetch: refetchCategories } = useCategories({ limit: 100 });
    const categories = categoriesData?.data || [];

    // Media fetch for thumbnail resolution
    const { data: mediaList } = useMedia();

    // Brand fetch
    const { data: brandsData, refetch: refetchBrands } = useBrands({ limit: 100 });
    const brands = brandsData?.data || [];

    // Local state for dialogs
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
    const [isBrandDialogOpen, setIsBrandDialogOpen] = React.useState(false);
    const [brandOpen, setBrandOpen] = React.useState(false); // Popover state

    const form = useForm({
        defaultValues: {
            title: product?.title || "",
            slug: product?.slug || "",
            thumbnail: product?.thumbnail || "",
            short_description: product?.short_description || "",
            description: product?.description || "",
            category_id: product?.category_id ? String(product.category_id) : "null",
            status: product?.status || "draft",

            origin: product?.origin || "",
            origin_details: product?.origin_details || "",
            brand: product?.brand || "",
            brand_details: product?.brand_details || "",

            physical_form: product?.physical_form || "",
            stability: product?.stability || "",
            storage_conditions: product?.storage_conditions || "",
            solubility: product?.solubility || "",
            specific_gravity: product?.specific_gravity || "",
            flash_point: product?.flash_point || "",
            arsenic_content: product?.arsenic_content || "",
            heavy_metals: product?.heavy_metals || "",
            usage_rate: product?.usage_rate || "",

            usages: product?.usages || [],
        },
    });

    const { fields: usageFields, append: appendUsage, remove: removeUsage } = useFieldArray({
        control: form.control,
        name: "usages",
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
        let thumbnail = data.thumbnail;
        // Resolve thumbnail object (or ID) to URL string if needed
        if (thumbnail && mediaList) {
            if (typeof thumbnail === "object") {
                if (thumbnail.url) {
                    thumbnail = thumbnail.url;
                } else if (thumbnail.id) {
                    const media = mediaList.find(m => m.id === thumbnail.id);
                    if (media) thumbnail = media.url;
                }
            } else if (typeof thumbnail === "number") {
                const media = mediaList.find(m => m.id === thumbnail);
                if (media) thumbnail = media.url;
            }
        }

        const payload = {
            ...data,
            thumbnail,
            category_id: data.category_id === "null" ? null : data.category_id,
        };

        const action = isEdit ? updateProduct : createProduct;
        const options = {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        };

        if (isEdit) {
            action({ id: product.id, data: payload }, options);
        } else {
            action(payload, options);
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 h-full flex flex-col">
                <Tabs defaultValue="general" className="flex-1 overflow-hidden flex flex-col">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="sourcing">Sourcing</TabsTrigger>
                        <TabsTrigger value="specs">Specs</TabsTrigger>
                        <TabsTrigger value="usage">Usage</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4">
                        <TabsContent value="general" className="space-y-4 m-0">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Product Name" {...field} />
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
                                                <Input placeholder="product-slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <div className="flex gap-2">
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="null">Uncategorized</SelectItem>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                                {cat.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setIsCategoryDialogOpen(true)}
                                                    title="Create New Category"
                                                >
                                                    <PlusCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Image</FormLabel>
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
                                name="short_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Brief summary for cards" rows={3} {...field} />
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
                                        <FormLabel>Detailed Description</FormLabel>
                                        <FormControl>
                                            <TiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Full product details..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>

                        <TabsContent value="sourcing" className="space-y-4 m-0">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="origin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Origin Country/Region</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Singapore" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Brand Name</FormLabel>
                                            <div className="flex gap-2">
                                                <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "flex-1 justify-between",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? brands.find((b) => b.title === field.value)?.title || field.value
                                                                    : "Select brand..."}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search brand..." />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    <div className="p-2 text-sm text-center">
                                                                        No brand found.
                                                                        <Button
                                                                            variant="link"
                                                                            className="h-auto p-0 text-xs"
                                                                            onClick={() => {
                                                                                setBrandOpen(false);
                                                                                // Allow setting custom value if not found in list?
                                                                                // Or just offer create dialog
                                                                                setIsBrandDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            Create New?
                                                                        </Button>
                                                                    </div>
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {brands.map((b) => (
                                                                        <CommandItem
                                                                            value={b.title}
                                                                            key={b.id}
                                                                            onSelect={() => {
                                                                                form.setValue("brand", b.title);
                                                                                setBrandOpen(false);
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    b.title === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {b.title}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setIsBrandDialogOpen(true)}
                                                    title="Create New Brand"
                                                >
                                                    <PlusCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="origin_details"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Origin Details (Rich Text)</FormLabel>
                                        <FormControl>
                                            <TiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Details about sourcing..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="brand_details"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand Details (Rich Text)</FormLabel>
                                        <FormControl>
                                            <TiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Details about the brand..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>

                        <TabsContent value="specs" className="space-y-4 m-0">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="physical_form"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Physical Form</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Concentrated Emulsion" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stability"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stability</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. High Heat Resistant" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="storage_conditions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Storage & Shelf Life</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. 24 month life" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="solubility"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Solubility</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Water & Oil Miscible" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="specific_gravity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specific Gravity</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. 1.045 - 1.055 @ 25°C" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="flash_point"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Flash Point</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. > 93°C (200°F)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="arsenic_content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Arsenic Content</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. < 3.0 ppm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="heavy_metals"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Heavy Metals</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. < 10.0 ppm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="usage" className="space-y-4 m-0">
                            <FormField
                                control={form.control}
                                name="usage_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>General Usage Rate Rule</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 0.1% - 0.4% w/w" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-base font-medium">Application Specific Usages</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendUsage({ title: "", rate: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Application
                                    </Button>
                                </div>

                                {usageFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg bg-slate-50/50">
                                        <div className="col-span-6">
                                            <FormField
                                                control={form.control}
                                                name={`usages.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Application</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. Hard Boiled Candy" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`usages.${index}.rate`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Recommended Dosage</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. 1.5g - 2.5g per kg" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-1 pb-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-rose-100 hover:text-rose-600"
                                                onClick={() => removeUsage(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {usageFields.length === 0 && (
                                    <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed rounded-lg">
                                        No specific application usages added yet.
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? "Update Product" : "Create Product"}
                    </Button>
                </div>

                {/* Create Category Dialog */}
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            onCancel={() => setIsCategoryDialogOpen(false)}
                            onSuccess={async () => {
                                setIsCategoryDialogOpen(false);
                                await refetchCategories();
                                // Note: Auto-selecting would require knowing the created ID.
                                // For now, user can select it from the list which is refreshed.
                            }}
                        />
                    </DialogContent>
                </Dialog>

                {/* Create Brand Dialog */}
                <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Brand</DialogTitle>
                        </DialogHeader>
                        <BrandForm
                            onCancel={() => setIsBrandDialogOpen(false)}
                            onSuccess={async () => {
                                setIsBrandDialogOpen(false);
                                await refetchBrands();
                                // We can't auto-fill without the new brand name/ID, but it will be in the list.
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </form>
        </Form>
    );
};
