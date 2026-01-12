import { useDeleteBlock } from "@/services/block.service";
import { Icon } from "@iconify-icon/react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { FieldRenderer } from "./FieldRenderer";

export const Block = ({
    block,
    onEditBlock,
    setIsOpenFieldConfigDialogFor,
    setEditField,
    onOpenBlockEditDialog,
    onFieldChange,
    fieldValues = {},
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const { mutate: deleteBlock, isPending: isDeleting } = useDeleteBlock();

    console.log(block)

    if (!block) return null;

    const handleDeleteBlock = () => {
        deleteBlock(block.id, {
            onSuccess: () => {
                setShowDeleteDialog(false);
            },
        });
    };

    return (
        <div className="bg-background group/block rounded-lg border hover:border-foreground/10 transition-border duration-200 w-full">
            <div
                role="button"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={() => setIsOpen(!isOpen)}
                tabIndex={0}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-white w-full text-left focus-visible:ring-2 ring-foreground/10 cursor-pointer"
            >
                <div className="w-14 h-14 flex items-center bg-foreground/5 rounded-md justify-center text-foreground/40">
                    <Icon
                        icon={block.icon || "solar:layers-minimalistic-bold"}
                        width="24"
                    />
                </div>
                <div className="flex-1">
                    <h6 className="text-sm tracking-wider">{block.title}</h6>
                    <span className="text-xs text-foreground/60">
                        {block.slug}
                    </span>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover/block:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center gap-1 border-r border-border pr-2">
                        <Button
                            aria-label="Edit Block"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-foreground/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenBlockEditDialog?.(block);
                            }}
                        >
                            <Icon icon="solar:pen-linear" width="16" />
                        </Button>
                        <Button
                            aria-label="Delete Block"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteDialog(true);
                            }}
                        >
                            <Icon
                                icon="solar:trash-bin-minimalistic-linear"
                                width="16"
                            />
                        </Button>
                    </div>
                    <Button
                        aria-label="Add Field"
                        variant="secondary"
                        size="sm"
                        className="text-xs h-8 px-3"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpenFieldConfigDialogFor(block.id);
                            setEditField(null);
                        }}
                    >
                        <Icon
                            icon="solar:add-circle-linear"
                            width="16"
                            className="mr-1.5"
                        />
                        Add Field
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        whileInView={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="border-t border-border"
                    >
                        <div className="p-5 grid grid-cols-12 gap-y-5 gap-x-4">
                            {block?.fields &&
                                Array.isArray(block.fields) &&
                                block.fields.length > 0 ? (
                                [...block.fields]
                                    .sort(
                                        (a, b) =>
                                            (a.order || 0) - (b.order || 0),
                                    )
                                    .map((field) => (
                                        <FieldRenderer
                                            key={field.id}
                                            field={field}
                                            value={fieldValues[field.name]}
                                            onChange={(value) =>
                                                onFieldChange?.(field.name, value)
                                            }
                                            onEdit={() => {
                                                setEditField(field);
                                                setIsOpenFieldConfigDialogFor(
                                                    block.id,
                                                );
                                            }}
                                        />
                                    ))
                            ) : (
                                <p className="text-sm text-foreground/50 col-span-full">
                                    No fields added yet.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Block</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the block "
                            {block.title}"? This action cannot be undone and
                            will also delete all fields associated with this
                            block.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteBlock}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
