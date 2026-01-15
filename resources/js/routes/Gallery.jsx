import { GalleryUpload } from "@/components/gallery/GalleryUpload";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateBRPDF } from "@/lib/pdf-generator";
import { GalleryApi, useDeleteGallery, useGallery, useUpdateGallery } from "@/services/gallery.service";
import { useImageCategories } from "@/services/imageCategory.service";
import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

export default function Gallery() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [isFeatured, setIsFeatured] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useGallery({
    limit: 15,
    page,
    search: debouncedSearch,
    category_id: categoryId !== "all" ? categoryId : undefined,
    is_featured: isFeatured !== "all" ? isFeatured : undefined
  });

  const { mutate: deleteGallery } = useDeleteGallery();
  const { mutate: updateGallery } = useUpdateGallery();
  const { data: categories = [] } = useImageCategories();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewImage, setViewImage] = useState(null);

  const images = data?.data || [];
  const pagination = {
    total: data?.total || 0,
    last_page: data?.last_page || 1,
    current_page: data?.current_page || 1,
  };

  const handleDelete = (id) => {
    deleteGallery(id);
  };

  const toggleFeatured = (item) => {
    updateGallery({
      id: item.id,
      data: { is_featured: !item.is_featured }
    });
  };

  const handleExport = async (type) => {
    try {
      const allData = await GalleryApi.list({
        search: debouncedSearch,
        category_id: categoryId !== "all" ? categoryId : undefined,
        is_featured: isFeatured !== "all" ? isFeatured : undefined,
        nopaginate: 1
      });

      const exportData = allData.data.map(item => ({
        Title: item.title || 'Untitled',
        Category: item.category?.title || 'Uncategorized',
        Featured: item.is_featured ? 'Yes' : 'No',
        URL: item.media?.url || '',
        Created: format(new Date(item.created_at), 'MMM dd, yyyy')
      }));

      if (type === 'excel' || type === 'csv') {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Gallery");
        if (type === 'csv') {
          XLSX.writeFile(workbook, `gallery_${format(new Date(), 'yyyyMMdd')}.csv`, { bookType: 'csv' });
        } else {
          XLSX.writeFile(workbook, `gallery_${format(new Date(), 'yyyyMMdd')}.xlsx`);
        }
      } else if (type === 'pdf') {
        const columns = ["Title", "Category", "Featured", "Created"];
        const rows = exportData.map(item => [item.Title, item.Category, item.Featured, item.Created]);
        await generateBRPDF("Media Gallery Report", columns, rows, "gallery");
      }
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 w-full font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gallery Management</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">Organize and manage site media assets.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <Input
              placeholder="Search images..."
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
                <label htmlFor="search-gallery" className="text-xs font-bold uppercase text-slate-400">Search</label>
                <Input
                  id="search-gallery"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category-filter" className="text-xs font-bold uppercase text-slate-400">Category</label>
                <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setPage(1); }}>
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
                <label htmlFor="featured-filter" className="text-xs font-bold uppercase text-slate-400">Featured status</label>
                <Select value={isFeatured} onValueChange={(val) => { setIsFeatured(val); setPage(1); }}>
                  <SelectTrigger id="featured-filter" className="w-full">
                    <SelectValue placeholder="Show All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Show All</SelectItem>
                    <SelectItem value="true">Featured Only</SelectItem>
                    <SelectItem value="false">Regular Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearch("");
                  setCategoryId("all");
                  setIsFeatured("all");
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
            onClick={() => setIsUploadOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg border border-slate-800 shadow-sm transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
          >
            <Icon icon="solar:upload-minimalistic-linear" className="text-lg" />
            <span className="hidden sm:inline">Upload Media</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm overflow-x-auto">
        <Table className="min-w-[800px] sm:min-w-full">
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Image</TableHead>
              <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Category</TableHead>
              <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Featured</TableHead>
              <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Uploaded</TableHead>
              <TableHead className="text-right px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="h-24 animate-pulse bg-slate-50/20 px-6"></TableCell>
                </TableRow>
              ))
            ) : images.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                  No media files found.
                </TableCell>
              </TableRow>
            ) : (
              images.map((img) => (
                <TableRow key={img.id} className="hover:bg-slate-50/50 transition-colors h-24 border-b border-slate-50 last:border-0 bg-transparent">
                  <TableCell className="px-6 border-t-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50 shrink-0">
                        <img
                          src={img.media?.url}
                          alt={img.title || "Gallery"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{img.title || "Untitled Image"}</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{img.media?.original_name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 border-t-0">
                    {img.category ? (
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none font-bold text-[10px] px-2">
                        {img.category.title}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">Uncategorized</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 border-t-0 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={!!img.is_featured}
                        onCheckedChange={() => toggleFeatured(img)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-6 border-t-0">
                    <span className="text-xs font-medium text-slate-600">
                      {format(new Date(img.created_at), "MMM dd, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 border-t-0 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewImage(img)}
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Icon icon="solar:eye-linear" className="text-lg" />
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
                            <AlertDialogTitle>Delete Media?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this image? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(img.id)}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider"
                            >
                              Delete
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
            Showing <span className="font-bold text-slate-900">{images.length}</span> of <span className="font-bold text-slate-900">{pagination.total}</span> files
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

      <Sheet open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <SheetContent side="right" className="w-[95vw] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold tracking-tight">Upload Media</SheetTitle>
            <SheetDescription className="text-slate-500 font-medium">
              Select images to add to the gallery. You can optionally assign them to a category.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 sm:px-6 pb-6">
            <GalleryUpload onSuccess={() => {
              setIsUploadOpen(false);
            }} />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-[90vw] md:max-w-4xl p-0 overflow-hidden rounded border-none shadow-none md:flex md:items-center md:justify-center">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={viewImage?.media?.url}
              alt={viewImage?.title || "Gallery"}
              className="max-w-full max-h-[85vh] w-full object-contain bg-white/5 backdrop-blur-sm"
            />
            {viewImage?.title && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-slate-900/80 backdrop-blur-md rounded-full text-white text-sm font-bold shadow-xl border border-white/10">
                {viewImage.title}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
