import { useCategories, useDeleteCategory } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/category/CategoryForm";
import { format } from "date-fns";

export default function Categories() {
    const { data, isLoading } = useCategories();
    const { mutate: deleteCategory } = useDeleteCategory();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const categories = data?.data || [];

    const handleDelete = (id) => {
        deleteCategory(id);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setSelectedCategory(null);
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Category Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Organize your products into a hierarchical structure.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleCreate}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg border border-slate-800 shadow-sm transition-all flex items-center gap-2 text-xs uppercase tracking-wider group"
                    >
                        <Icon icon="solar:add-circle-linear" className="text-lg" />
                        <span>Add New Category</span>
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Thumbnail</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Name / Slug</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Parent Category</TableHead>
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
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id} className="hover:bg-slate-50/50 transition-colors h-20 border-b border-slate-50 last:border-0 bg-transparent">
                                    <TableCell className="px-6">
                                        <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/60 overflow-hidden p-1 shadow-inner">
                                            {category.thumbnail ? (
                                                <img src={category.thumbnail} alt={category.title} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <Icon icon="solar:gallery-linear" className="text-xl text-slate-300" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{category.title}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        {category.parent ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-600">
                                                <Icon icon="solar:folder-with-files-linear" />
                                                {category.parent.title}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Top Level</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className="text-xs font-medium text-slate-500">
                                            {format(new Date(category.created_at), "MMM d, yyyy")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(category)}
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
                                                        <AlertDialogTitle className="font-bold text-slate-900">Delete Category</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-slate-500 font-medium">
                                                            Are you sure you want to delete "{category.title}"? This process is permanent.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="gap-2">
                                                        <AlertDialogCancel className="rounded-xl h-10 font-bold border-slate-200 text-xs uppercase tracking-wider">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(category.id)}
                                                            className="rounded-xl h-10 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                                                        >
                                                            Delete Category
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
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                            Configure category details, hierarchy and visuals.
                        </DialogDescription>
                    </DialogHeader>

                    <CategoryForm
                        category={selectedCategory}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
