import { useCreateField, useUpdateField } from "@/services/field.service";
import { Icon } from "@iconify-icon/react";
import { Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { TiptapEditor } from "../ui/editor/Editor";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
                    is_required: true,
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

    useEffect(() => {
        if(editMode && defaultValues){
            form.reset({
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
            });
        } else {
            form.reset({
                label: "",
                name: "",
                type: "text",
                is_required: true,
                has_many: false,
                default_value: "",
                options: [],
                placeholder: "",
                description: "",
                help_text: "",
                relation_model: "",
                layout: "12",
                order: 0,
            });
        }
    }, [editMode, defaultValues]);

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

        console.log({editMode, fieldData})

        const action = editMode ? updateField : createField;
        const payload = editMode ? { fieldId, fieldData } : fieldData;

        action(payload, {
            onSuccess: () => {
                form.reset();
                onClose?.();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-slate-200 rounded-xl shadow-xl">
                <DialogHeader className="p-8 pb-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Icon icon={editMode ? "solar:pen-bold" : "solar:add-circle-bold"} className="text-2xl" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                                {editMode ? "Edit Field Configuration" : "New Field Configuration"}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                Configure how this field behaves and looks in the editor.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="px-8 py-6">
                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 p-1 rounded-xl mb-8">
                                    <TabsTrigger value="general" className="rounded-lg font-bold text-[11px] uppercase tracking-wider gap-2">
                                        <Icon icon="solar:settings-linear" className="text-base" />
                                        General
                                    </TabsTrigger>
                                    <TabsTrigger value="validation" className="rounded-lg font-bold text-[11px] uppercase tracking-wider gap-2">
                                        <Icon icon="solar:shield-check-linear" className="text-base" />
                                        Rules
                                    </TabsTrigger>
                                    <TabsTrigger value="appearance" className="rounded-lg font-bold text-[11px] uppercase tracking-wider gap-2">
                                        <Icon icon="solar:palette-linear" className="text-base" />
                                        Display
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="options"
                                        disabled={!["select", "checkbox", "radio"].includes(formData.type)}
                                        className="rounded-lg font-bold text-[11px] uppercase tracking-wider gap-2"
                                    >
                                        <Icon icon="solar:list-ul-linear" className="text-base" />
                                        Items
                                    </TabsTrigger>
                                </TabsList>

                                <div className="min-h-[300px]">
                                    <TabsContent value="general" className="mt-0 space-y-5 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="label"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Field Label</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. Hero Title" {...field} className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 placeholder:text-slate-300 font-medium" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Data Key (Slug)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. hero_title" {...field} className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 placeholder:text-slate-300 font-mono text-[13px]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Field Component</FormLabel>
                                                    <FormControl>
                                                        <Select value={field.value} onValueChange={field.onChange}>
                                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 font-medium">
                                                                <SelectValue placeholder="Identify field type" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl border-slate-200">
                                                                <SelectItem value="text">Input Text</SelectItem>
                                                                <SelectItem value="textarea">Long Passage (Textarea)</SelectItem>
                                                                <SelectItem value="richtext">Visual Editor (Rich Text)</SelectItem>
                                                                <SelectItem value="select">Dropdown Menu</SelectItem>
                                                                <SelectItem value="boolean">Toggle Switch</SelectItem>
                                                                <SelectItem value="upload">Media Upload</SelectItem>
                                                                <SelectItem value="relation">Data Relation</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="default_value"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Initial Value</FormLabel>
                                                    <FormControl>
                                                        {formData.type === "richtext" ? (
                                                            <TiptapEditor
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder="Set default rich text..."
                                                            />
                                                        ) : (
                                                            <Input placeholder="Set default if any..." {...field} className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 placeholder:text-slate-300 font-medium" />
                                                        )}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>

                                    <TabsContent value="validation" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="is_required"
                                                render={({ field }) => (
                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-slate-900 font-bold text-[13px]">Strict Integrity</FormLabel>
                                                            <p className="text-[11px] text-slate-500 font-medium">Require a value before saving record.</p>
                                                        </div>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        {formData.type === "relation" && (
                                            <div className="p-5 rounded-xl bg-indigo-50/30 border border-indigo-100 space-y-5">
                                                <FormField
                                                    control={form.control}
                                                    name="relation_model"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-indigo-900 font-bold text-xs uppercase tracking-widest">Target Database Model</FormLabel>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger className="h-11 bg-white rounded-xl border-indigo-200 focus:ring-indigo-500/10 font-medium">
                                                                        <SelectValue placeholder="Select model..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-xl border-indigo-200">
                                                                        <SelectItem value="testimonials">Testimonials</SelectItem>
                                                                        <SelectItem value="faqs">FAQs</SelectItem>
                                                                        <SelectItem value="partners">Partners</SelectItem>
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
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-indigo-900 font-bold text-[13px]">Support Collection</FormLabel>
                                                                <p className="text-[11px] text-indigo-500/70 font-medium">Enable for selecting multiple related records.</p>
                                                            </div>
                                                            <FormControl>
                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="appearance" className="mt-0 space-y-5 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="placeholder"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Input Hint</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Hint for user..." {...field} className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 font-medium" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="order"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Position Index</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 font-mono" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="layout"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Spatial Width (12-Col Grid)</FormLabel>
                                                    <FormControl>
                                                        <Select value={field.value} onValueChange={field.onChange}>
                                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 font-medium">
                                                                <SelectValue placeholder="Select grid span" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl border-slate-200">
                                                                <SelectItem value="12">Full Canvas (12/12)</SelectItem>
                                                                <SelectItem value="6">Half Split (6/12)</SelectItem>
                                                                <SelectItem value="4">One-Third (4/12)</SelectItem>
                                                                <SelectItem value="8">Two-Thirds (8/12)</SelectItem>
                                                                <SelectItem value="3">Quarter (3/12)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Internal Description</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Short context for admins..." {...field} className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 font-medium" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>

                                    <TabsContent value="options" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Available Choices</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => append({ label: "", value: "" })}
                                                className="h-8 rounded-lg border-indigo-100 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 font-bold text-[10px] uppercase tracking-wider"
                                            >
                                                <Plus className="mr-1 h-3 w-3" />
                                                New Choice
                                            </Button>
                                        </div>

                                        <div className="max-h-[220px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl relative group">
                                                    <div className="flex-1 space-y-3">
                                                        <FormField
                                                            control={form.control}
                                                            name={`options.${index}.label`}
                                                            render={({ field }) => (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-slate-400 w-12 shrink-0">LABEL</span>
                                                                    <Input {...field} placeholder="Display text" className="h-8 text-sm rounded-lg border-slate-200 bg-white" />
                                                                </div>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`options.${index}.value`}
                                                            render={({ field }) => (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-slate-400 w-12 shrink-0">VALUE</span>
                                                                    <Input {...field} placeholder="Database key" className="h-8 text-sm rounded-lg border-slate-200 bg-white font-mono" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {fields.length === 0 && (
                                                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl text-slate-300 gap-2">
                                                    <Icon icon="solar:list-cross-linear" className="text-3xl" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">No choices defined</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>

                        <DialogFooter className="bg-slate-50/80 backdrop-blur-sm p-6 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onClose()}
                                className="h-11 px-6 rounded-xl font-bold text-slate-500 hover:text-slate-900 transition-all"
                            >
                                Discard
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="h-11 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-md shadow-slate-200"
                            >
                                {isCreating || isUpdating ? (
                                    <div className="flex items-center gap-2">
                                        <Icon icon="solar:spinner-bold" className="animate-spin text-lg" />
                                        <span>Indexing...</span>
                                    </div>
                                ) : (
                                    editMode ? "Sync Changes" : "Create Configuration"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
