'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useImperativeHandle } from 'react';



export const useAutosizeTextArea = ({
    textAreaRef,
    triggerAutoSize,
    maxHeight = Number.MAX_SAFE_INTEGER,
    minHeight = 0,
}) => {
    const [init, setInit] = React.useState(true);
    React.useEffect(() => {
        // We need to reset the height momentarily to get the correct scrollHeight for the textarea
        const offsetBorder = 6;
        const textAreaElement = textAreaRef.current;
        if (textAreaElement) {
            if (init) {
                textAreaElement.style.minHeight = `${minHeight + offsetBorder}px`;
                if (maxHeight > minHeight) {
                    textAreaElement.style.maxHeight = `${maxHeight}px`;
                }
                setInit(false);
            }
            textAreaElement.style.height = `${minHeight + offsetBorder}px`;
            const scrollHeight = textAreaElement.scrollHeight;
            // We then set the height directly, outside of the render loop
            // Trying to set this with state or a ref will product an incorrect value.
            if (scrollHeight > maxHeight) {
                textAreaElement.style.height = `${maxHeight}px`;
            } else {
                textAreaElement.style.height = `${scrollHeight + offsetBorder}px`;
            }
        }
    }, [triggerAutoSize, minHeight, maxHeight, init, textAreaRef]);
};





export const AutosizeTextarea = React.forwardRef(
    (
        {
            maxHeight = Number.MAX_SAFE_INTEGER,
            minHeight = 52,
            className,
            onChange,
            value,
            ...props
        },
        ref
    ) => {
        const textAreaRef = React.useRef(null);
        const [triggerAutoSize, setTriggerAutoSize] = React.useState('');

        useAutosizeTextArea({
            textAreaRef,
            triggerAutoSize: triggerAutoSize,
            maxHeight,
            minHeight,
        });

        useImperativeHandle(ref, () => textAreaRef.current);

        React.useEffect(() => {
            setTriggerAutoSize(value);
        }, [props?.defaultValue, value]);

        return (
            <textarea
                {...props}
                value={value}
                ref={textAreaRef}
                className={cn(
                    'flex w-full rounded-md border border-foreground/10 bg-transparent px-3 py-2 text-sm font-medium placeholder:text-neutral-400 focus-visible:ring-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-[color,box-shadow]',
                    className
                )}
                onChange={e => {
                    setTriggerAutoSize(e.target.value);
                    onChange?.(e);
                }}
            />
        );
    }
);
AutosizeTextarea.displayName = 'AutosizeTextarea';