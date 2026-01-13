import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useDeleteGallery, useGallery, useUpdateGallery } from "@/services/gallery.service";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";

export const GalleryList = ({ categoryId }) => {
    const { data: gallery = [], isLoading } = useGallery();
    const { mutate: deleteImage } = useDeleteGallery();
    const { mutate: updateGallery } = useUpdateGallery();
    const [selectedImage, setSelectedImage] = useState(null);

    const filteredGallery = categoryId === "all" || !categoryId
        ? gallery 
        : gallery.filter(item => String(item.image_category_id) === String(categoryId));

    const toggleFeatured = (item) => {
        updateGallery({
            id: item.id,
            data: { is_featured: !item.is_featured }
        });
    };

    if (isLoading) {
        return <div className="p-10 text-center text-slate-500">Loading gallery...</div>;
    }

    if (filteredGallery.length === 0) {
        return <div className="p-10 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">No images found in this category.</div>;
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredGallery.map((item) => (
                    <div key={item.id} className="group relative rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm aspect-square">
                         {!!item?.is_featured && (
                             <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-white rounded-full h-8 w-8 flex justify-center items-center shadow-md">
                                 <Icon icon="solar:star-bold" height={20} width={20} className="text-sm" />
                             </div>
                         )}
                        <img
                            src={item.media?.url}
                            alt={item.media?.original_name}
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <button 
                                onClick={() => setSelectedImage(item)}
                                className="h-9 w-9 flex justify-center items-center cursor-pointer bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                            >
                                <Icon icon="solar:eye-bold" className="text-xl" />
                            </button>

                            <button 
                                onClick={() => toggleFeatured(item)}
                                className={`h-9 w-9 flex justify-center items-center cursor-pointer backdrop-blur-sm rounded-full transition-colors ${item.is_featured ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-white/20 text-white hover:bg-white/40'}`}
                                title={item.is_featured ? "Remove from featured" : "Add to featured"}
                            >
                                <Icon icon={item.is_featured ? "solar:star-bold" : "solar:star-linear"} className="text-xl" />
                            </button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className="h-9 w-9 flex justify-center items-center cursor-pointer bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-rose-500/80 transition-colors">
                                        <Icon icon="solar:trash-bin-trash-bold" className="text-xl" />
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Image?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the image from the gallery and storage.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => deleteImage(item.id)}
                                        className="bg-rose-600 hover:bg-rose-700 text-white"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {item.category && (
                        <div className="absolute bottom-2 left-2 right-2">
                             <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white rounded">
                                {item.category.title}
                             </span>
                        </div>
                    )}
                </div>
            ))}
            </div>

            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-1 border-none bg-transparent shadow-none" closeClassName="text-white hover:bg-white/20 top-4 right-4">
                    <DialogTitle className="sr-only">Image Preview</DialogTitle>
                    
                    {selectedImage && (
                        <div className="rounded-lg overflow-hidden flex items-center justify-center">
                            <img 
                                src={selectedImage.media?.url} 
                                alt={selectedImage.media?.original_name} 
                                className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
