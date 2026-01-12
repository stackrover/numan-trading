import { useDocuments, useSavePageDocument } from "@/services/document.service";
import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";
import React from "react";
import { Button } from "../ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Block } from "./Block";
import { ConfigBlockDialog } from "./ConfigBlockDialog";
import { ConfigFieldDialog } from "./ConfigFieldDialog";

export const PageContent = ({ page, isLoading }) => {
    const [editBlock, setEditBlock] = React.useState(null);
    const [isConfigDialogOpen, setIsConfigDialogOpen] = React.useState(false);
    const [openConfigFieldDialogFor, setOpenConfigFieldDialogFor] =
        React.useState(null);
    const [editField, setEditField] = React.useState(null);
    const [fieldValues, setFieldValues] = React.useState({});

    const { mutate: saveDocument, isPending: isSaving } = useSavePageDocument();

    // Fetch existing document data
    const { data: documents } = useDocuments({ page_id: page?.id });

    // Load existing document data into fieldValues
    React.useEffect(() => {
        if (documents && documents.length > 0) {
            const document = documents[0];
            if (document.data) {
                setFieldValues(document.data);
            }
        }
    }, [documents]);

    // Handle field value changes
    const handleFieldChange = (blockSlug, fieldName, value) => {
        setFieldValues((prev) => ({
            ...prev,
            [blockSlug]: {
                ...prev[blockSlug],
                [fieldName]: value,
            },
        }));
    };

    // Save page content
    const handleSave = () => {
        if (!page?.id) return;

        // Merge field values with default values from all fields
        const completeData = {};

        page.blocks?.forEach((block) => {
            completeData[block.slug] = {};

            block.fields?.forEach((field) => {
                // Use user-entered value if exists, otherwise use default_value
                const userValue = fieldValues[block.slug]?.[field.name];
                const defaultValue = field.default_value;

                completeData[block.slug][field.name] = userValue !== undefined ? userValue : defaultValue;
            });
        });

        saveDocument({
            page_id: page.id,
            slug: page.slug,
            data: completeData,
        });
    };

    if (!page) return <div> Page data not found. </div>;

    return (
        <section className="mx-auto max-w-7xl w-full space-y-8 px-6 sm:px-8 py-10">
            <div className="flex items-center justify-between gap-5">
                <h4 className="font-semibold"> Page Content </h4>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="space-y-6 py-2.5">
                {!isLoading &&
                    page.blocks &&
                    Array(page.blocks) &&
                    page.blocks.length > 0 ? (
                    page.blocks.map((block) => (
                        <Block
                            key={block.id}
                            block={block}
                            onEditBlock={setEditBlock}
                            setIsOpenFieldConfigDialogFor={
                                setOpenConfigFieldDialogFor
                            }
                            setEditField={setEditField}
                            onOpenBlockEditDialog={(block) => {
                                setEditBlock(block);
                                setIsConfigDialogOpen(true);
                            }}
                            onFieldChange={(fieldName, value) =>
                                handleFieldChange(block.slug, fieldName, value)
                            }
                            fieldValues={fieldValues[block.slug] || {}}
                        />
                    ))
                ) : (
                    <Empty>
                        <EmptyHeader className="text-foreground/50">
                            <EmptyMedia>
                                <Icon
                                    icon="solar:question-circle-linear"
                                    width="64"
                                />
                            </EmptyMedia>
                            <EmptyTitle>No blocks added yet.</EmptyTitle>
                        </EmptyHeader>
                    </Empty>
                )}
            </div>

            <div className="flex items-center justify-center">
                <Button asChild className="mx-auto">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        viewport={{ once: true }}
                        onClick={() => {
                            setIsConfigDialogOpen(true);
                            setEditBlock(null);
                        }}
                    >
                        <Icon icon="solar:add-circle-linear" width="20" />
                        Add Block
                    </motion.button>
                </Button>
            </div>

            <ConfigBlockDialog
                pageId={page.id}
                open={isConfigDialogOpen}
                onOpenChange={setIsConfigDialogOpen}
                title={editBlock ? "Edit Block" : "Add Block"}
                mode={editBlock ? "edit" : "add"}
                defaultValue={editBlock}
            />

            <ConfigFieldDialog
                open={openConfigFieldDialogFor !== null}
                onClose={() => {
                    setOpenConfigFieldDialogFor(null);
                    setEditField(null);
                }}
                editMode={!!editField}
                blockId={openConfigFieldDialogFor}
                fieldId={editField?.id}
                defaultValues={editField}
            />
        </section>
    );
};
