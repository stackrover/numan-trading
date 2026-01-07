import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useFieldArray, useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { useCreateField, useUpdateField } from "@/services/field.service";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";

export const ConfigFieldDialog = ({
    open,
    onClose,
    editMode,
    blockId,
    fieldId,
    defaultValues,
}) => {
    const { mutate: createField, isPending: isCreating } = useCreateField();
    const { mutate: updateField, isPending: isUpdating } = useUpdateField();

    const form = useForm({
        defaultValues:
            editMode && defaultValues
                ? {
                      label: defaultValues.label || "",
                      name: defaultValues.name || "",
                      type: defaultValues.type || "text",
                      is_required: defaultValues.is_required || false,
                      has_many: defaultValues.has_many || false,
                      default_value: defaultValues.default_value || "",
                      options: defaultValues.options || [],
                      placeholder: defaultValues.placeholder || "",
                      description: defaultValues.description || "",
                      help_text: defaultValues.help_text || "",
                      relation_model: defaultValues.relation_model || "",
                      layout: defaultValues.layout || "12",
                      order: defaultValues.order || 0,
                  }
                : {
                      label: "",
                      name: "",
                      type: "text",
                      is_required: false,
                      has_many: false,
                      default_value: "",
                      options: [],
                      placeholder: "",
                      description: "",
                      help_text: "",
                      relation_model: "",
                      layout: "12",
                      order: 0,
                  },
    });

    const formData = form.watch();
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    const onSubmit = (data) => {
        const fieldData = {
            ...data,
            block_id: blockId,
        };

        if (editMode) {
            updateField(
                { fieldId, fieldData },
                {
                    onSuccess: () => {
                        form.reset();
                        onClose?.();
                    },
                },
            );
        } else {
            createField(
                {
                    ...data,
                    block_id: blockId,
                },
                {
                    onSuccess: () => {
                        form.reset();
                        onClose?.();
                    },
                },
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="min-w-[50vw]">
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? "Edit Config Field" : "Add Config Field"}
                    </DialogTitle>
                    <DialogDescription>
                        You can{" "}
                        {editMode
                            ? "edit the existing config field here."
                            : "add a new config field here."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-2 gap-x-4 gap-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Field Label"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormLabel>Field Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Field Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Field Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder="Select a field type"
                                                    {...field}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">
                                                    Text
                                                </SelectItem>
                                                <SelectItem value="data">
                                                    Data
                                                </SelectItem>
                                                <SelectItem value="boolean">
                                                    Boolean
                                                </SelectItem>
                                                <SelectItem value="textarea">
                                                    Textarea
                                                </SelectItem>
                                                <SelectItem value="select">
                                                    Select
                                                </SelectItem>
                                                <SelectItem value="radio">
                                                    Radio Group
                                                </SelectItem>
                                                <SelectItem value="checkbox">
                                                    Checkbox
                                                </SelectItem>
                                                <SelectItem value="upload">
                                                    Upload
                                                </SelectItem>
                                                <SelectItem value="richtext">
                                                    Rich Text
                                                </SelectItem>
                                                <SelectItem value="relation">
                                                    Relation
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {formData.type === "relation" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="relation_model"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>
                                                Relation Model
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder="Select a related model"
                                                            {...field}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="testimonials">
                                                            Testimonials
                                                        </SelectItem>
                                                        <SelectItem value="faqs">
                                                            FAQs
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="has_many"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-md">
                                                <div className="flex-1">
                                                    <FormLabel className="text-foreground/60">
                                                        Has Many
                                                    </FormLabel>
                                                    <p className="text-sm">
                                                        Enable if this is a
                                                        one-to-many
                                                        relationship.
                                                    </p>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <FormField
                            control={form.control}
                            name="is_required"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-md">
                                        <div className="flex-1 space-y-1">
                                            <FormLabel className="text-foreground">
                                                Required Field
                                            </FormLabel>
                                            <p className="text-xs text-text-muted">
                                                Enable if this field is
                                                mandatory.
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="default_value"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Default Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Default Value"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {["select", "checkbox", "radioGroup"].includes(
                            formData.type,
                        ) && (
                            <div className="space-y-3 col-span-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs">
                                        Field Options
                                    </FormLabel>
                                </div>
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center gap-2"
                                    >
                                        <FormField
                                            control={form.control}
                                            name={`options.${index}.label`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1 space-y-0">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Label"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`options.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1 space-y-0">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Value"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive h-9 w-9"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        append({ label: "", value: "" })
                                    }
                                    className="h-9 w-full border-dashed text-xs"
                                >
                                    <Plus className="mr-2 h-3.5 w-3.5" />
                                    Add Option
                                </Button>
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="placeholder"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormLabel>
                                        Placeholder (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Placeholder (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormLabel>
                                        Description (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Description (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="help_text"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormLabel> Help Text (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Help Text (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="layout"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormLabel> Layout </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder="Select layout"
                                                    {...field}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="12">
                                                    Full Width (12/12)
                                                </SelectItem>
                                                <SelectItem value="6">
                                                    1/2 Width (6/12)
                                                </SelectItem>
                                                <SelectItem value="4">
                                                    1/3 Width (4/12)
                                                </SelectItem>
                                                <SelectItem value="3">
                                                    1/4 Width (3/12)
                                                </SelectItem>
                                                <SelectItem value="8">
                                                    2/3 Width (8/12)
                                                </SelectItem>
                                                <SelectItem value="9">
                                                    3/4 Width (9/12)
                                                </SelectItem>
                                                <SelectItem value="1">
                                                    1/12
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    2/12
                                                </SelectItem>
                                                <SelectItem value="5">
                                                    5/12
                                                </SelectItem>
                                                <SelectItem value="7">
                                                    7/12
                                                </SelectItem>
                                                <SelectItem value="10">
                                                    10/12
                                                </SelectItem>
                                                <SelectItem value="11">
                                                    11/12
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormLabel>Order</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="col-span-2 flex items-center justify-end gap-3 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-md bg-foreground/5 text-foreground hover:bg-foreground/10 transition"
                                onClick={() => onClose()}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                                {editMode ? "Save Changes" : "Add Field"}
                            </button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
