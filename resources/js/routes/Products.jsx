import { ProductForm } from "@/components/product/ProductForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategories } from "@/services/category.service";
import { useDeleteProduct, useProducts } from "@/services/product.service";
import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

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

    const getCategoryName = (id) => {
        return categories.find(c => c.id === id)?.title || "Unclassified";
    };

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

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Inventory</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage and organize your global catalog of products.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleCreate}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg border border-slate-800 shadow-sm transition-all flex items-center gap-2 text-xs uppercase tracking-wider group"
                    >
                        <Icon icon="solar:add-circle-linear" className="text-lg" />
                        <span>Add New Product</span>
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <div className="relative">
                    <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 h-10 rounded-lg border-slate-200"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setPage(1); }}>
                    <SelectTrigger className="h-10 rounded-lg border-slate-200">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={featuredFilter} onValueChange={(val) => { setFeaturedFilter(val); setPage(1); }}>
                    <SelectTrigger className="h-10 rounded-lg border-slate-200">
                        <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Featured: All</SelectItem>
                        <SelectItem value="1">Featured: Yes</SelectItem>
                        <SelectItem value="0">Featured: No</SelectItem>
                    </SelectContent>
                </Select>
                <Button 
                    variant="outline" 
                    className="h-10 rounded-lg text-slate-500 font-bold text-xs uppercase tracking-wider"
                    onClick={() => {
                        setSearch("");
                        setFeaturedFilter("all");
                        setCategoryFilter("all");
                        setPage(1);
                    }}
                >
                    Reset Filters
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Product / Name</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Category</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Featured</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Created</TableHead>
                            <TableHead className="text-right px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={6} className="h-20 animate-pulse bg-slate-50/20"></TableCell>
                                </TableRow>
                            ))
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-medium">
                                    No products found in the current index.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors h-20 border-b border-slate-50 last:border-0 bg-transparent">
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/60 overflow-hidden p-1 shadow-inner">
                                                {product.thumbnail ? (
                                                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <Icon icon="solar:gallery-linear" className="text-xl text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{product.title}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.slug}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600">
                                            <Icon icon="solar:tag-linear" />
                                            {product.category?.title || "Unclassified"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center">
                                            {product.is_featured ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold uppercase tracking-wider">
                                                    <Icon icon="solar:star-bold" className="text-amber-500" />
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                                                    No
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${product.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {product.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className="text-xs font-medium text-slate-500">
                                            {format(new Date(product.created_at), "MMM d, yyyy")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(product)}
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
                                                        <AlertDialogTitle className="font-bold text-slate-900">Delete Product</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-slate-500 font-medium">
                                                            Are you sure you want to delete "{product.title}"? This process is permanent.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="gap-2">
                                                        <AlertDialogCancel className="rounded-xl h-10 font-bold border-slate-200 text-xs uppercase tracking-wider">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(product.id)}
                                                            className="rounded-xl h-10 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                                                        >
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

                <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30 border-t border-slate-100">
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        Showing {products.length} of {pagination.total} results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                            className="h-8 px-3 rounded-lg border-slate-200 bg-white text-slate-600 font-bold text-[10px] uppercase tracking-wider disabled:opacity-20 transition-all hover:bg-slate-50"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                // Simple sliding window or just first 5 for now
                                return i + 1;
                            }).map((p) => (
                                <Button
                                    key={p}
                                    variant={page === p ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPage(p)}
                                    disabled={isLoading}
                                    className={`h-8 w-8 p-0 rounded-lg text-[10px] font-bold transition-all shadow-sm ${
                                        page === p 
                                        ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800" 
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {p}
                                </Button>
                            ))}
                            {pagination.last_page > 5 && <span className="text-slate-300 px-1">...</span>}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                            disabled={page === pagination.last_page || isLoading}
                            className="h-8 px-3 rounded-lg border-slate-200 bg-white text-slate-600 font-bold text-[10px] uppercase tracking-wider disabled:opacity-20 transition-all hover:bg-slate-50"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="w-[95vw] sm:w-[600px] sm:max-w-[700px] overflow-y-auto p-0 flex flex-col">
                    <SheetHeader className="p-6 pb-2">
                        <SheetTitle className="text-xl font-bold">{selectedProduct ? "Edit Product" : "Add New Product"}</SheetTitle>
                        <SheetDescription>
                            Configure chemical properties, details, and usage.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 p-6 pt-2">
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
