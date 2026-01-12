import { GalleryList } from "@/components/gallery/GalleryList";
import { GalleryUpload } from "@/components/gallery/GalleryUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImageCategories } from "@/services/imageCategory.service";
import { useState } from "react";

export default function Gallery() {
    const { data: categories = [] } = useImageCategories();
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gallery Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Upload and manage gallery images and categories.</p>
                </div>
            </header>

            <GalleryUpload onSuccess={() => setActiveTab(activeTab)} />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                     <h2 className="text-lg font-bold text-slate-900">Gallery Images</h2>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start h-auto flex-wrap p-1 bg-slate-100 rounded-lg mb-6">
                        <TabsTrigger value="all" className="px-4 py-2">All Images</TabsTrigger>
                        {categories.map(cat => (
                            <TabsTrigger key={cat.id} value={String(cat.id)} className="px-4 py-2">
                                {cat.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    <TabsContent value="all" className="mt-0">
                        <GalleryList categoryId="all" />
                    </TabsContent>
                    
                    {categories.map(cat => (
                        <TabsContent key={cat.id} value={String(cat.id)} className="mt-0">
                             <GalleryList categoryId={cat.id} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
