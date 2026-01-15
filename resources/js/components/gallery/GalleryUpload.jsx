import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateGallery } from "@/services/gallery.service";
import { useImageCategories } from "@/services/imageCategory.service";
import { Icon } from "@iconify-icon/react";
import { Loader2, UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "../ui/label";
import { CreateImageCategoryDialog } from "./CreateImageCategoryDialog";

export const GalleryUpload = ({ onSuccess }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const { mutate: uploadGallery, isPending } = useCreateGallery();
    const { data: categories = [] } = useImageCategories();
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
    });

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files[]", file);
        });

        if (selectedCategory && selectedCategory !== "all") {
            formData.append("category_id", selectedCategory);
        }

        uploadGallery(formData, {
            onSuccess: () => {
                setFiles([]);
                onSuccess?.();
            },
        });
    };

    return (
        <div className="bg-white border-slate-200/60 space-y-6">
            <div className="flex items-end gap-3">
                <div className="w-full space-y-2">
                    <Label htmlFor="category-select" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</Label>
                    <div className="flex gap-2">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger id="category-select" className="data-[size=default]:h-10 w-full data-[size=sm]:h-10">
                                <SelectValue placeholder="Select upload category (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Uncategorized</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateImageCategoryDialog />
                    </div>
                </div>
            </div>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-slate-500">
                    <div className="p-3 bg-slate-100 rounded-full">
                        <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                    <p className="text-xs">SVG, PNG, JPG or GIF</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {files.map((file, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-600"
                                >
                                    <Icon icon="solar:trash-bin-trash-bold" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleUpload} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upload {files.length} Images
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
