import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js'
import { Type, Heading1, Heading2, List, ListOrdered } from 'lucide-react'

export const Suggestion = Extension.create({
    name: 'suggestion',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }) => {
                    props.command({ editor, range })
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})

export const suggestionItems = [
    {
        title: 'Text',
        description: 'Just start typing with plain text.',
        icon: Type,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode('paragraph')
                .run()
        },
    },
    {
        title: 'Heading 1',
        description: 'Large section heading.',
        icon: Heading1,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode('heading', { level: 1 })
                .run()
        },
    },
    {
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: Heading2,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode('heading', { level: 2 })
                .run()
        },
    },
    {
        title: 'Bullet List',
        description: 'Create a simple bulleted list.',
        icon: List,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBulletList()
                .run()
        },
    },
    {
        title: 'Numbered List',
        description: 'Create a list with numbering.',
        icon: ListOrdered,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleOrderedList()
                .run()
        },
    }
]

export const renderItems = () => {
    let component
    let popup

    return {
        onStart: (props) => {
            component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
            })

            if (!props.clientRect) {
                return
            }

            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
            })
        },

        onUpdate(props) {
            component.updateProps(props)

            if (!props.clientRect) {
                return
            }

            popup[0].setProps({
                getReferenceClientRect: props.clientRect,
            })
        },

        onKeyDown(props) {
            if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
            }
            return component.ref?.onKeyDown(props)
        },

        onExit() {
            popup[0].destroy()
            component.destroy()
        },
    }
}

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const SlashMenu = forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index) => {
        const item = props.items[index]
        if (item) {
            props.command(item)
        }
    }

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }
            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }
            if (event.key === 'Enter') {
                enterHandler()
                return true
            }
            return false
        },
    }))

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden min-w-[280px] p-1 flex flex-col gap-0.5 z-50">
            {props.items.length ? (
                props.items.map((item, index) => (
                    <button
                        className={`flex items-center gap-3 px-3 py-2 text-left rounded-md transition-all ${index === selectedIndex ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        <div className={`size-8 rounded-lg flex items-center justify-center ${index === selectedIndex ? 'bg-white shadow-sm' : 'bg-slate-50 text-slate-400'}`}>
                            {<item.icon className="size-4" />}
                        </div>
                        <div>
                            <div className="text-sm font-bold leading-tight">{item.title}</div>
                            <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{item.description}</div>
                        </div>
                    </button>
                ))
            ) : (
                <div className="px-3 py-2 text-sm text-slate-400 font-medium italic">No commands found</div>
            )}
        </div>
    )
})

SlashMenu.displayName = 'SlashMenu'
