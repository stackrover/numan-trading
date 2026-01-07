import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Suggestion, suggestionItems, renderItems } from './Suggestion'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link as LinkIcon } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../dialog";
import { Button } from "../button";
import { Input } from "../input";

const ToolbarButton = ({ onClick, isActive, icon, label }) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-1.5 rounded-md transition-all flex items-center justify-center hover:bg-slate-100 ${isActive ? 'bg-slate-100 text-indigo-600 shadow-inner' : 'text-slate-500'
            }`}
        title={label}
    >
        {/* Render the icon component directly */}
        {React.createElement(icon, { className: "size-4" })}
    </button>
)

const EditorToolbar = ({ editor }) => {
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    if (!editor) return null;

    const handleSetLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        } else {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }
        setIsLinkDialogOpen(false);
        setLinkUrl("");
    };

    const openLinkDialog = () => {
        const previousUrl = editor.getAttributes('link').href;
        setLinkUrl(previousUrl || "");
        setIsLinkDialogOpen(true);
    };

    return (
        <div className="flex items-center gap-0.5 p-1 border-b border-slate-200 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
            <ToolbarButton
                icon={Bold}
                label="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
            />
            <ToolbarButton
                icon={Italic}
                label="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
            />
            <ToolbarButton
                icon={UnderlineIcon}
                label="Underline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
            />

            <div className="w-px h-4 bg-slate-200 mx-1" />

            <ToolbarButton
                icon={List}
                label="Bullet List"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
            />
            <ToolbarButton
                icon={ListOrdered}
                label="Ordered List"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
            />

            <div className="w-px h-4 bg-slate-200 mx-1" />

            <ToolbarButton
                icon={LinkIcon}
                label="Link"
                onClick={openLinkDialog}
                isActive={editor.isActive('link')}
            />

            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent className="max-w-md rounded-xl border-slate-200 p-0 overflow-hidden shadow-xl">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-lg font-bold text-slate-900">Insert Link</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Destination URL</label>
                            <Input
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                className="h-10 rounded-lg border-slate-200 focus:ring-indigo-500/10 font-medium"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSetLink();
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter className="bg-slate-50/80 p-4 border-t border-slate-100 flex items-center justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsLinkDialogOpen(false)}
                            className="h-9 px-4 rounded-lg font-bold text-slate-500 hover:text-slate-900 text-xs uppercase tracking-wider"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSetLink}
                            className="h-9 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                        >
                            {editor.isActive('link') ? "Update Link" : "Attach Link"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const TiptapEditor = ({ value, onChange, placeholder = 'Type / for commands...' }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            Suggestion.configure({
                suggestion: {
                    items: ({ query }) => {
                        return suggestionItems.filter(item =>
                            item.title.toLowerCase().startsWith(query.toLowerCase())
                        ).slice(0, 5)
                    },
                    render: renderItems,
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4 text-slate-700 font-medium leading-relaxed',
            },
        },
    })

    // Update content when value changes from outside (e.g. initial load)
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    return (
        <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-sm">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />

            <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
             outline: none !important;
        }
      `}</style>
        </div>
    )
}
