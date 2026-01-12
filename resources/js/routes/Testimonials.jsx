import { TestimonialForm } from "@/components/testimonial/TestimonialForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteTestimonial, useTestimonials } from "@/services/testimonial.service";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";

export default function Testimonials() {
    const { data: testimonials = [], isLoading } = useTestimonials();
    const { mutate: deleteTestimonial } = useDeleteTestimonial();
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleDelete = (id) => {
        deleteTestimonial(id);
    };

    const handleEdit = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedTestimonial(null);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setSelectedTestimonial(null);
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Testimonials Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage customer reviews and testimonials.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleCreate}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg border border-slate-800 shadow-sm transition-all flex items-center gap-2 text-xs uppercase tracking-wider group"
                    >
                        <Icon icon="solar:add-circle-linear" className="text-lg" />
                        <span>Add New Testimonial</span>
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Author</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Content</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Rating</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
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
                        ) : testimonials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                                    No testimonials found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            testimonials.map((testimonial) => (
                                <TableRow key={testimonial.id} className="hover:bg-slate-50/50 transition-colors h-20 border-b border-slate-50 last:border-0 bg-transparent">
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-3">
                                            {testimonial.image ? (
                                                <img src={testimonial.image} alt={testimonial.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Icon icon="solar:user-linear" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{testimonial.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{testimonial.company}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <p className="text-xs text-slate-600 line-clamp-2 max-w-sm">{testimonial.review}</p>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <span className="text-sm font-bold text-slate-700 mr-2">{testimonial.rating}</span>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Icon 
                                                    key={i} 
                                                    icon={i < testimonial.rating ? "solar:star-bold" : "solar:star-linear"} 
                                                    className={i < testimonial.rating ? "text-amber-400" : "text-slate-300"}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${testimonial.is_active ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'}`}>
                                            {testimonial.is_active ? 'Active' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(testimonial)}
                                                className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                            >
                                                <Icon icon="solar:pen-linear" className="text-lg" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <Icon icon="solar:trash-bin-trash-linear" className="text-lg" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the testimonial from {testimonial.name}.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(testimonial.id)}
                                                            className="bg-rose-600 hover:bg-rose-700 text-white"
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

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                        <DialogDescription>
                            {selectedTestimonial ? "Update testimonial details below." : "Add a new testimonial to your site."}
                        </DialogDescription>
                    </DialogHeader>
                    <TestimonialForm
                        testimonial={selectedTestimonial}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
