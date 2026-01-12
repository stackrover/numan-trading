import { PartnerForm } from "@/components/partner/PartnerForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeletePartner, usePartners } from "@/services/partner.service";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";

export default function Partners() {
    const { data: partners = [], isLoading } = usePartners();
    const { mutate: deletePartner } = useDeletePartner();
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleDelete = (id) => {
        deletePartner(id);
    };

    const handleEdit = (partner) => {
        setSelectedPartner(partner);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedPartner(null);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setSelectedPartner(null);
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Partners Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage partner companies and manufacturers.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleCreate}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg border border-slate-800 shadow-sm transition-all flex items-center gap-2 text-xs uppercase tracking-wider group"
                    >
                        <Icon icon="solar:add-circle-linear" className="text-lg" />
                        <span>Add New Partner</span>
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Company</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Location</TableHead>
                            <TableHead className="px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400">Established</TableHead>
                            <TableHead className="text-right px-6 h-14 text-xs font-bold uppercase tracking-wider text-slate-400 w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={4} className="h-20 animate-pulse bg-slate-50/20"></TableCell>
                                </TableRow>
                            ))
                        ) : partners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-medium">
                                    No partners found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            partners.map((partner) => (
                                <TableRow key={partner.id} className="hover:bg-slate-50/50 transition-colors h-20 border-b border-slate-50 last:border-0 bg-transparent">
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-3">
                                            {partner.logo ? (
                                                <img src={partner.logo} alt={partner.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Icon icon="solar:buildings-2-linear" />
                                                </div>
                                            )}
                                            <span className="text-sm font-bold text-slate-900">{partner.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className="text-xs font-medium text-slate-600">{partner.location || '-'}</span>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className="text-xs font-medium text-slate-600">{partner.established_at || '-'}</span>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(partner)}
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
                                                        <AlertDialogTitle>Delete Partner?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete {partner.name}.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(partner.id)}
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
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{selectedPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
                        <DialogDescription>
                            {selectedPartner ? "Update partner details below." : "Add a new partner company."}
                        </DialogDescription>
                    </DialogHeader>
                    <PartnerForm
                        partner={selectedPartner}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
