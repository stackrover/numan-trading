import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateImageCategory } from "@/services/imageCategory.service";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

export const CreateImageCategoryDialog = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const { mutate: createCategory, isPending } = useCreateImageCategory();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        createCategory(
            { title },
            {
                onSuccess: () => {
                    setOpen(false);
                    setTitle("");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline" type="button" className="h-10 w-10 shrink-0">
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g. Events, Products"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
