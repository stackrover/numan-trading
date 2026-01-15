import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isDevCustomization = () => {
    const mode = import.meta.env.VITE_PAGE_CUSTOMIZATION_MODE || import.meta.env.VITE_PAGE_CUSTOMIZATION_MOOD;
    return mode !== "production";
};
