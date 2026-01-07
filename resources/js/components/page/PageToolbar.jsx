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

            <div className="z-10! relative text-slate-600 font-semibold flex items-center">
                {icon && <Icon icon={icon} className="mr-2 text-lg" />}
                {label}
            </div>
        </button>
    );
};

export const PageToolbar = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-slate-200 bg-white sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <nav
                    className="flex items-center gap-2 p-1 relative h-12"
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
        </div>
    );
};
