import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { BlockForm } from "./BlockForm";
import { Separator } from "../ui/separator";

export const ConfigBlockDialog = ({
    pageId,
    open,
    onOpenChange,
    defaultValue,
    title,
    mode,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> {title} </DialogTitle>
                    <DialogDescription>
                        Fill in the form below to{" "}
                        {mode === "edit" ? "edit" : "add"} a block.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <BlockForm
                    defaultValue={defaultValue}
                    mode={mode}
                    pageId={pageId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
};
