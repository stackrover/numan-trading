import { cn } from "@/lib/utils";
import { useDeleteField } from "@/services/field.service";
import { Icon } from "@iconify-icon/react";
import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { TiptapEditor } from "../ui/editor/Editor";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { AutosizeTextarea } from "../ui/textarea";
import { UploadOrSelectMedia } from "../uploadOrSelectMedia";

const gridCol = {
    12: "col-span-12",
    11: "col-span-11",
    10: "col-span-10",
    9: "col-span-9",
    8: "col-span-8",
    7: "col-span-7",
    6: "col-span-6",
    5: "col-span-5",
    4: "col-span-4",
    3: "col-span-3",
    2: "col-span-2",
    1: "col-span-1",
};

const renderFieldInput = (field, value, onChange) => {
    const commonProps = {
        id: field.name,
        name: field.name,
        placeholder: field.placeholder || "",
        required: field.is_required,
        defaultValue: value ?? field.default_value ?? "",
    };

    switch (field.type) {
        case "text":
            return (
                <Input
                    type="text"
                    {...commonProps}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            );

        case "date":
            return (
                <Input
                    type="date"
                    {...commonProps}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            );

        case "boolean":
            return (
                <Switch
                    id={field.name}
                    name={field.name}
                    defaultChecked={value ?? field.default_value ?? false}
                    onCheckedChange={(checked) => onChange?.(checked)}
                />
            );

        case "textarea":
            return (
                <AutosizeTextarea
                    {...commonProps}
                    rows={4}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            );

        case "select":
            return (
                <Select
                    name={field.name}
                    defaultValue={value ?? field.default_value ?? ""}
                    onValueChange={(val) => onChange?.(val)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue
                            placeholder={
                                field.placeholder || "Select an option"
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {(field.options || []).map((option) => (
                            <SelectItem
                                key={option.value ?? option}
                                value={option.value ?? option}
                            >
                                {option.label ?? option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        case "radio":
            return (
                <RadioGroup
                    name={field.name}
                    defaultValue={value ?? field.default_value ?? ""}
                    onValueChange={(val) => onChange?.(val)}
                    className="flex flex-col gap-2"
                >
                    {(field.options || []).map((option) => (
                        <div
                            key={option.value ?? option}
                            className="flex items-center gap-2"
                        >
                            <RadioGroupItem
                                value={option.value ?? option}
                                id={`${field.name}-${option.value ?? option}`}
                            />
                            <label
                                htmlFor={`${field.name}-${option.value ?? option}`}
                                className="text-sm cursor-pointer"
                            >
                                {option.label ?? option}
                            </label>
                        </div>
                    ))}
                </RadioGroup>
            );

        case "checkbox":
            // For multiple checkboxes (has_many) or single checkbox
            if (field.has_many && field.options?.length) {
                return (
                    <div className="flex flex-col gap-2">
                        {(field.options || []).map((option) => (
                            <div
                                key={option.value ?? option}
                                className="flex items-center gap-2"
                            >
                                <Checkbox
                                    id={`${field.name}-${option.value ?? option}`}
                                    name={`${field.name}[]`}
                                    value={option.value ?? option}
                                    defaultChecked={
                                        Array.isArray(value)
                                            ? value.includes(
                                                option.value ?? option,
                                            )
                                            : false
                                    }
                                    onCheckedChange={(checked) => {
                                        // Handle checkbox array change
                                        onChange?.({
                                            value: option.value ?? option,
                                            checked,
                                        });
                                    }}
                                />
                                <label
                                    htmlFor={`${field.name}-${option.value ?? option}`}
                                    className="text-sm cursor-pointer"
                                >
                                    {option.label ?? option}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            }
            // Single checkbox
            return (
                <div className="flex items-center gap-2">
                    <Checkbox
                        id={field.name}
                        name={field.name}
                        defaultChecked={value ?? field.default_value ?? false}
                        onCheckedChange={(checked) => onChange?.(checked)}
                    />
                    {field.placeholder && (
                        <label
                            htmlFor={field.name}
                            className="text-sm cursor-pointer"
                        >
                            {field.placeholder}
                        </label>
                    )}
                </div>
            );

        case "upload":
            return (
                <UploadOrSelectMedia
                    value={value ?? field.default_value}
                    onChange={onChange}
                    accept={{ "image/*": [], "video/*": [] }}
                />
            );

        case "richtext":
            return (
                <TiptapEditor
                    placeholder={field.placeholder || "Type / for commands..."}
                    value={value ?? field.default_value ?? ""}
                    onChange={(val) => onChange?.(val)}
                />
            );

        case "relation":
            // For relation fields, typically render as a select with related model options
            return (
                <Select
                    name={field.name}
                    defaultValue={value ?? field.default_value ?? ""}
                    onValueChange={(val) => onChange?.(val)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue
                            placeholder={
                                field.placeholder || `Select ${field.label}`
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {(field.options || []).map((option) => (
                            <SelectItem
                                key={option.value ?? option.id ?? option}
                                value={String(
                                    option.value ?? option.id ?? option,
                                )}
                            >
                                {option.label ?? option.name ?? option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        default:
            return (
                <Input
                    type="text"
                    {...commonProps}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            );
    }
};

export const FieldRenderer = ({ field, value, onChange, onEdit }) => {
    const [showActions, setShowActions] = React.useState(false);
    const { mutate: deleteField } = useDeleteField();

    if (!field) return null;

    const isBooleanType = field.type === "boolean";

    const handleDeleteField = () => {
        if (
            window.confirm(
                `Are you sure you want to delete the field "${field.label}"?`,
            )
        ) {
            deleteField(field.id);
        }
    };

    return (
        <Field
            className={cn("group/field", gridCol[field.layout])}
            orientation={isBooleanType ? "horizontal" : "vertical"}
        >
            <FieldContent className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <FieldLabel className="font-medium flex-1">
                        {field.label}
                        {field.is_required && (
                            <span className="text-destructive ml-1">*</span>
                        )}
                    </FieldLabel>
                    <div className="flex items-center gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-foreground/10"
                            onClick={onEdit}
                        >
                            <Icon icon="solar:pen-linear" width="12" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={handleDeleteField}
                        >
                            <Icon
                                icon="solar:trash-bin-minimalistic-linear"
                                width="12"
                            />
                        </Button>
                    </div>
                </div>
                {field.help_text && (
                    <FieldDescription>{field.help_text}</FieldDescription>
                )}
                {renderFieldInput(field, value, onChange)}
                {field.description && (
                    <FieldDescription className="text-xs text-muted-foreground mt-1">
                        {field.description}
                    </FieldDescription>
                )}
            </FieldContent>
        </Field>
    );
};
