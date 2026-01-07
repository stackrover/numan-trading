import { useBrands, useDeleteBrand } from "@/services/brand.service";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BrandForm } from "@/components/brand/BrandForm";
import { format } from "date-fns";

export default function Brands() {
    const { data, isLoading } = useBrands();
    const { mutate: deleteBrand } = useDeleteBrand();
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const brands = data?.data || [];

    const handleDelete = (id) => {
        deleteBrand(id);
    };

    const handleEdit = (brand) => {
        setSelectedBrand(brand);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedBrand(null);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setSelectedBrand(null);
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Brand Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage source brands and manufacturers.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleCreate}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg border border-slate-800 shadow-sm transition-all flex items-center gap-2 text-xs uppercase tracking-wider group"
                    >
                        <Icon icon="solar:add-circle-linear" className="text-lg" />
                        <span>Add New Brand</span>
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Brand Name</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Company / Location</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Website</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Created</TableHead>
                            <TableHead className="text-right px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5} className="h-20 animate-pulse bg-slate-50/20"></TableCell>
                                </TableRow>
                            ))
                        ) : brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                                    No brands found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.map((brand) => (
                                <TableRow key={brand.id} className="hover:bg-slate-50/50 transition-colors h-20 border-b border-slate-50 last:border-0 bg-transparent">
                                    <TableCell className="px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{brand.title}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{brand.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700">{brand.company}</span>
                                            <span className="text-[10px] font-medium text-slate-400">{brand.location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        {brand.website ? (
                                            <a href={brand.website} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                                                Visit Site <Icon icon="solar:link-minimalistic-linear" />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No website</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className="text-xs font-medium text-slate-500">
                                            {format(new Date(brand.created_at), "MMM d, yyyy")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(brand)}
                                                className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                <Icon icon="solar:pen-linear" width="18" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                        <Icon icon="solar:trash-bin-trash-linear" width="18" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-xl border-slate-200 shadow-xl">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="font-bold text-slate-900">Delete Brand</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-slate-500 font-medium">
                                                            Are you sure you want to delete "{brand.title}"? This process is permanent.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="gap-2">
                                                        <AlertDialogCancel className="rounded-xl h-10 font-bold border-slate-200 text-xs uppercase tracking-wider">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(brand.id)}
                                                            className="rounded-xl h-10 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                                                        >
                                                            Delete Brand
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedBrand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
                        <DialogDescription>
                            Configure brand details and source information.
                        </DialogDescription>
                    </DialogHeader>

                    <BrandForm
                        brand={selectedBrand}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
