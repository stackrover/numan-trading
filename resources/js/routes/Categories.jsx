import { CategoryForm } from "@/components/category/CategoryForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateBRPDF } from "@/lib/pdf-generator";
import { CategoryApi, useCategories, useDeleteCategory } from "@/services/category.service";
import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

export default function Categories() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading } = useCategories({
        limit: 15,
        page,
        search: debouncedSearch
    });

    const { mutate: deleteCategory } = useDeleteCategory();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const categories = data?.data || [];
    const pagination = {
        total: data?.total || 0,
        last_page: data?.last_page || 1,
        current_page: data?.current_page || 1,
    };

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

    const handleExport = async (type) => {
        try {
            const allData = await CategoryApi.list({
                search: debouncedSearch,
                nopaginate: 1
            });

            const exportData = allData.data.map(item => ({
                Title: item.title,
                Slug: item.slug,
                Parent: item.parent?.title || 'Top Level',
                Created: format(new Date(item.created_at), 'MMM dd, yyyy')
            }));

            if (type === 'excel' || type === 'csv') {
                const worksheet = XLSX.utils.json_to_sheet(exportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
                if (type === 'csv') {
                    XLSX.writeFile(workbook, `categories_${format(new Date(), 'yyyyMMdd')}.csv`, { bookType: 'csv' });
                } else {
                    XLSX.writeFile(workbook, `categories_${format(new Date(), 'yyyyMMdd')}.xlsx`);
                }
            } else if (type === 'pdf') {
                const columns = ["Title", "Slug", "Parent", "Created"];
                const rows = exportData.map(item => [item.Title, item.Slug, item.Parent, item.Created]);
                await generateBRPDF("Category Management Report", columns, rows, "categories");
            }
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 w-full font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Category Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Organize your products into a hierarchical structure.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64 hidden sm:block">
                        <Input
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 h-10 bg-white border-slate-200"
                        />
                        <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                                <Icon icon="solar:filter-linear" className="text-lg" />
                                <span>Filter</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80 p-5 space-y-4">
                            <div className="sm:hidden space-y-2">
                                <label htmlFor="search-categories" className="text-xs font-bold uppercase text-slate-400">Search</label>
                                <Input
                                    id="search-categories"
                                    placeholder="Search categories..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSearch("");
                                    setPage(1);
                                }}
                            >
                                Reset
                            </Button>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                                <Icon icon="solar:file-download-linear" className="text-lg" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48 p-2 flex flex-col gap-1">
                            <button onClick={() => handleExport('excel')} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors w-full text-left">
                                <Icon icon="vscode-icons:file-type-excel" className="text-lg" />
                                Excel (.xlsx)
                            </button>
                            <button onClick={() => handleExport('csv')} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors w-full text-left">
                                <Icon icon="fluent:document-csv-16-filled" className="text-lg" />
                                CSV (.csv)
                            </button>
                            <button onClick={() => handleExport('pdf')} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors w-full text-left">
                                <Icon icon="material-icon-theme:pdf" className="text-lg" />
                                PDF (.pdf)
                            </button>
                        </PopoverContent>
                    </Popover>

                    <Button
                        onClick={handleCreate}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg border border-slate-800 shadow-sm transition-all flex items-center gap-2 text-xs uppercase tracking-wider group"
                    >
                        <Icon icon="solar:add-circle-linear" className="text-lg" />
                        <span className="hidden sm:inline">Add Category</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm overflow-x-auto">
                <Table className="min-w-[800px] sm:min-w-full">
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
                                    <TableCell colSpan={5} className="h-20 animate-pulse bg-slate-50/20 px-6"></TableCell>
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
                                    <TableCell className="px-6 border-t-0">
                                        <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/60 overflow-hidden p-1 shadow-inner">
                                            {category.thumbnail ? (
                                                <img src={category.thumbnail} alt={category.title} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <Icon icon="solar:gallery-linear" className="text-xl text-slate-300" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{category.title}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0">
                                        {category.parent ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-600">
                                                <Icon icon="solar:folder-with-files-linear" />
                                                {category.parent.title}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Top Level</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0">
                                        <span className="text-xs font-medium text-slate-500">
                                            {format(new Date(category.created_at), "MMM d, yyyy")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(category)}
                                                className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                <Icon icon="solar:pen-linear" className="text-lg" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                        <Icon icon="solar:trash-bin-minimalistic-linear" className="text-lg" />
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

            {pagination.last_page > 1 && (
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200/60 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-900">{categories.length}</span> of <span className="font-bold text-slate-900">{pagination.total}</span> categories
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 rounded-lg font-semibold"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, pagination.last_page) }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={page === i + 1 ? "default" : "ghost"}
                                    size="sm"
                                    className={`size-9 rounded-lg font-bold ${page === i + 1 ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 rounded-lg font-semibold"
                            onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                            disabled={page === pagination.last_page}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="w-[95vw] sm:w-[540px] overflow-y-auto">
                    <SheetHeader className="mb-8">
                        <SheetTitle className="text-2xl font-bold tracking-tight">
                            {selectedCategory ? "Edit Category" : "Add New Category"}
                        </SheetTitle>
                        <SheetDescription className="text-slate-500 font-medium">
                            Configure category details, hierarchy and visuals.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-4 sm:px-6 pb-6">
                        <CategoryForm
                            category={selectedCategory}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
