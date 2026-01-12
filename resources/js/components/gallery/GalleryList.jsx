import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useDeleteGallery, useGallery } from "@/services/gallery.service";
import { Icon } from "@iconify-icon/react";

export const GalleryList = ({ categoryId }) => {
    const { data: gallery = [], isLoading } = useGallery();
    const { mutate: deleteImage } = useDeleteGallery();

    const filteredGallery = categoryId === "all" || !categoryId
        ? gallery 
        : gallery.filter(item => String(item.image_category_id) === String(categoryId));

    if (isLoading) {
        return <div className="p-10 text-center text-slate-500">Loading gallery...</div>;
    }

    if (filteredGallery.length === 0) {
        return <div className="p-10 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">No images found in this category.</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGallery.map((item) => (
                <div key={item.id} className="group relative rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm aspect-square">
                    <img
                        src={item.media?.url}
                        alt={item.media?.original_name}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <a 
                            href={item.media?.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                        >
                            <Icon icon="solar:eye-bold" className="text-xl" />
                        </a>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-rose-500/80 transition-colors">
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
    );
};
