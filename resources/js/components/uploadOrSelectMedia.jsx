import { cn } from "@/lib/utils";
import { useMedia, useUploadMedia } from "@/services/media.service";
import { Icon } from "@iconify-icon/react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const UploadOrSelectMedia = ({ value, onChange, accept = { "image/*": [], "video/*": [] } }) => {
    const [open, setOpen] = React.useState(false);
    const [selectedMedia, setSelectedMedia] = React.useState(null);

    const { data: mediaList, isLoading } = useMedia();
    const { mutate: uploadMedia, isPending: isUploading } = useUploadMedia();



    // Handle file drop
    const onDrop = React.useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const formData = new FormData();
            formData.append("file", file);

            uploadMedia(formData, {
                onSuccess: (data) => {
                    onChange?.({ type: "media", id: data.id, url: data.url });
                    setOpen(false);
                },
            });
        }
    }, [uploadMedia, onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: typeof accept === "string" ? { [accept]: [] } : accept,
        multiple: false,
    });

    // Handle media selection
    const handleSelectMedia = () => {
        if (selectedMedia) {
            onChange?.({ type: "media", id: selectedMedia.id, url: selectedMedia.url });
            setOpen(false);
        }
    };

    // Get current media
    const currentMedia = React.useMemo(() => {
        if (!value || !mediaList) return null;
        const mediaId = typeof value === "object" ? value.id : value;
        return mediaList.find((m) => m.id === mediaId);
    }, [value, mediaList]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer">
                    {currentMedia ? (
                        <div className="relative group rounded-lg overflow-hidden border border-border">
                            {currentMedia.mime_type?.startsWith("video") ? (
                                <video
                                    src={currentMedia.url}
                                    className="w-full h-48 object-cover"
                                    controls
                                    muted // Added muted property
                                >
                                    {/* Still recommended to add the track to be safe */}
                                    <track kind="captions" />
                                </video>
                            ) : (
                                <img
                                    src={currentMedia.url}
                                    alt={currentMedia.original_name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button type="button" size="sm">
                                    <Icon icon="solar:pen-linear" width="16" className="mr-2" />
                                    Change Media
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/20 transition-colors">
                            <Icon
                                icon="solar:gallery-add-linear"
                                width="48"
                                className="mx-auto mb-3 text-muted-foreground"
                            />
                            <p className="text-sm text-muted-foreground">
                                Click to upload or select media
                            </p>
                        </div>
                    )}
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Upload or Select Media</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="upload" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload New</TabsTrigger>
                        <TabsTrigger value="library">Media Library</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="flex-1 mt-4">
                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                                isDragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-foreground/20"
                            )}
                        >
                            <input {...getInputProps()} />
                            {isUploading ? (
                                <div className="space-y-3">
                                    <Icon
                                        icon="solar:upload-minimalistic-linear"
                                        width="64"
                                        className="mx-auto text-primary animate-pulse"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Uploading...
                                    </p>
                                </div>
                            ) : isDragActive ? (
                                <div className="space-y-3">
                                    <Icon
                                        icon="solar:upload-minimalistic-linear"
                                        width="64"
                                        className="mx-auto text-primary"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Drop the file here
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Icon
                                        icon="solar:gallery-add-linear"
                                        width="64"
                                        className="mx-auto text-muted-foreground"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Drag & drop your file here
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            or click to browse
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="library" className="flex-1 overflow-auto mt-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Icon
                                    icon="solar:refresh-linear"
                                    width="32"
                                    className="animate-spin text-muted-foreground"
                                />
                            </div>
                        ) : mediaList && mediaList.length > 0 ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-4">
                                    {mediaList.map((media) => (
                                        <button
                                            key={media.id}
                                            onClick={() => setSelectedMedia(media)}
                                            className={cn(
                                                "relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                                                selectedMedia?.id === media.id
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "border-transparent hover:border-border"
                                            )}
                                        >
                                            <div className="absolute top-2 left-2 z-10 bg-black/50 rounded p-1 text-white">
                                                {media.mime_type?.startsWith("video") ? (
                                                    <Icon icon="solar:videocamera-linear" width="16" />
                                                ) : (
                                                <Icon icon="solar:gallery-linear" width="16" />
                                                )}
                                            </div>
                                            {media.mime_type?.startsWith("video") ? (
                                                <video
                                                    src={media.url}
                                                    className="w-full h-32 object-cover"
                                                    muted
                                                    playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={media.url}
                                                    alt={media.original_name}
                                                    className="w-full h-32 object-cover"
                                                />
                                            )}
                                            {selectedMedia?.id === media.id && (
                                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                                    <Icon icon="solar:check-circle-bold" width="20" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {selectedMedia && (
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="text-sm">
                                            <p className="font-medium">
                                                {selectedMedia.original_name}
                                            </p>
                                            <p className="text-muted-foreground">
                                                {selectedMedia.width} × {selectedMedia.height} •{" "}
                                                {(selectedMedia.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                        <Button onClick={handleSelectMedia}>
                                            Select Media
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <Icon
                                    icon="solar:gallery-linear"
                                    width="64"
                                    className="text-muted-foreground mb-3"
                                />
                                <p className="text-sm text-muted-foreground">
                                    No media files yet
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
