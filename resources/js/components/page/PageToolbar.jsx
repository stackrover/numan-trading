import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";

export const TabButton = ({ isActive, icon, label, ...props }) => {
    return (
        <button
            className="px-4 py-2 text-sm text-foreground hover:bg-foreground/5 rounded-md relative outline-none"
            {...props}
        >
            {isActive && (
                <motion.div
                    layoutId="underline"
                    className="absolute left-0 top-0 inset-0 bg-foreground/8 rounded-md z-0"
                />
            )}

            <div className="z-10! relative">
                {icon && <Icon icon={icon} className="mr-2" />}
                {label}
            </div>
        </button>
    );
};

export const PageToolbar = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-border bg-accent flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <nav
                className="flex items-center mx-auto bg-accent p-1 rounded-md relative"
                aria-label="Tabs"
            >
                {tabs.map((tab) => (
                    <TabButton
                        key={tab.id}
                        isActive={activeTab === tab.id}
                        icon={tab.icon}
                        label={tab.label}
                        onClick={() => setActiveTab(tab.id)}
                    />
                ))}
            </nav>
        </div>
    );
};
