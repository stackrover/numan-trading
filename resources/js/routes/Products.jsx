import { ProductForm } from "@/components/product/ProductForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateBRPDF } from "@/lib/pdf-generator";
import { useCategories } from "@/services/category.service";
import { ProductApi, useDeleteProduct, useProducts } from "@/services/product.service";
import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

export default function Products() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [featuredFilter, setFeaturedFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading } = useProducts({
        limit: 15,
        page,
        search: debouncedSearch,
        is_featured: featuredFilter === "all" ? "" : featuredFilter,
        category_id: categoryFilter === "all" ? "" : categoryFilter
    });

    const { mutate: deleteProduct } = useDeleteProduct();
    const { data: categoriesData } = useCategories({ limit: 100 });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const products = data?.data || [];
    const pagination = {
        total: data?.total || 0,
        last_page: data?.last_page || 1,
        current_page: data?.current_page || 1,
    };
    const categories = categoriesData?.data || [];

    const handleDelete = (id) => {
        deleteProduct(id);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setSelectedProduct(null);
    };

    const handleExport = async (type) => {
        try {
            const allData = await ProductApi.list({
                search: debouncedSearch,
                is_featured: featuredFilter === "all" ? "" : featuredFilter,
                category_id: categoryFilter === "all" ? "" : categoryFilter,
                nopaginate: 1
            });

            const exportData = allData.data.map(item => ({
                Title: item.title,
                Brand: item.brand || 'N/A',
                Category: item.category?.title || 'N/A',
                Featured: item.is_featured ? 'Yes' : 'No',
                Status: item.status,
                Created: format(new Date(item.created_at), 'MMM dd, yyyy')
            }));

            if (type === 'excel' || type === 'csv') {
                const worksheet = XLSX.utils.json_to_sheet(exportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

                if (type === 'csv') {
                    XLSX.writeFile(workbook, `products_${format(new Date(), 'yyyyMMdd')}.csv`, { bookType: 'csv' });
                } else {
                    XLSX.writeFile(workbook, `products_${format(new Date(), 'yyyyMMdd')}.xlsx`);
                }
            } else if (type === 'pdf') {
                const columns = ["Title", "Brand", "Category", "Featured", "Status", "Created"];
                const rows = exportData.map(item => [
                    item.Title,
                    item.Brand,
                    item.Category,
                    item.Featured,
                    item.Status,
                    item.Created
                ]);
                await generateBRPDF("Product Inventory Report", columns, rows, "products");
            }
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 w-full font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Inventory</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage and organize your global catalog of products.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64 hidden sm:block">
                        <Input
                            placeholder="Search products..."
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
                                <label htmlFor="search-products" className="text-xs font-bold uppercase text-slate-400">Search</label>
                                <Input
                                    id="search-products"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="category-filter" className="text-xs font-bold uppercase text-slate-400">Category</label>
                                <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setPage(1); }}>
                                    <SelectTrigger id="category-filter" className="w-full">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="featured-filter" className="text-xs font-bold uppercase text-slate-400">Featured Status</label>
                                <Select value={featuredFilter} onValueChange={(val) => { setFeaturedFilter(val); setPage(1); }}>
                                    <SelectTrigger id="featured-filter" className="w-full">
                                        <SelectValue placeholder="All Products" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="true">Featured Only</SelectItem>
                                        <SelectItem value="false">Standard Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSearch("");
                                    setCategoryFilter("all");
                                    setFeaturedFilter("all");
                                    setPage(1);
                                }}
                            >
                                Reset Filters
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
                        <span className="hidden sm:inline">Add Product</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm overflow-x-auto">
                <Table className="min-w-[800px] sm:min-w-full">
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Product Info</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Category & Brand</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Featured</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                            <TableHead className="text-right px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5} className="h-16 animate-pulse bg-slate-50/20"></TableCell>
                                </TableRow>
                            ))
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                                    No products found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors h-16 border-b border-slate-50 last:border-0 border-t-0 bg-transparent">
                                    <TableCell className="px-6 border-t-0">
                                        <div className="flex items-center gap-3">
                                            {product.thumbnail ? (
                                                <img src={product.thumbnail} alt={product.title} className="size-10 rounded-lg object-cover border border-slate-100" />
                                            ) : (
                                                <div className="size-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                    <Icon icon="solar:box-linear" className="text-xl" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{product.title}</span>
                                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Slug: {product.slug}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit">
                                                {product.category?.title || "Uncategorized"}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">{product.brand || "Private Label"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0 text-center">
                                        {product.is_featured ? (
                                            <div className="flex justify-center">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                                                    Featured
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 text-xs">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${product.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : 'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 border-t-0 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Icon icon="solar:pen-linear" className="text-lg" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    >
                                                        <Icon icon="solar:trash-bin-minimalistic-linear" className="text-lg" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete <strong>{product.title}</strong> from the inventory.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-rose-600 hover:bg-rose-700">
                                                            Delete Product
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
                        Showing <span className="font-bold text-slate-900">{products.length}</span> of <span className="font-bold text-slate-900">{pagination.total}</span> products
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
                <SheetContent side="right" className="w-[95vw] sm:w-[600px] sm:max-w-[700px] overflow-y-auto">
                    <SheetHeader className="mb-8">
                        <SheetTitle className="text-2xl font-bold tracking-tight">
                            {selectedProduct ? "Edit Product" : "Add New Product"}
                        </SheetTitle>
                        <SheetDescription className="text-slate-500 font-medium">
                            {selectedProduct ? "Modify the details of your existing product." : "Enter the specifications for the new product catalog entry."}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-4 sm:px-6 pb-6">
                        <ProductForm
                            product={selectedProduct}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
