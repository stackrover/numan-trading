import { Icon } from "@iconify-icon/react";
import { Link, useLocation } from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";
import { PlusIcon, LogOut } from "lucide-react";
import React from "react";
import { CreatePageDialog } from "../page/CreatePageDialog";
import { usePages } from "@/services/page.service";
import { useLogoutMutation } from "@/services/auth.service";
import { motion } from "motion/react";

export const AppSidebar = () => {
    const [isOpenPageDialog, setIsOpenPageDialog] = React.useState(false);
    const { data: pages, isLoading } = usePages();
    const { mutate: logout } = useLogoutMutation();
    const location = useLocation();

    const sidebarMenuItems = [
        {
            id: "dashboard",
            name: "Overview",
            link: "/",
            icon: "solar:widget-bold",
        },
        {
            id: "Enquiries",
            name: "Enquiries",
            link: "/enquiries",
            icon: "solar:chat-round-dots-bold",
        },
        {
            id: "Products",
            name: "Products",
            link: "/products",
            icon: "solar:box-bold",
        },
        {
            id: "pages",
            name: "Website Pages",
            link: "/pages",
            icon: "solar:file-text-bold",
            children: pages?.data?.map((page) => ({
                id: page.id,
                name: page.title,
                link: `/pages/${page.slug}`,
                icon: "solar:document-text-linear",
            })),
        },
    ];

    return (
        <Sidebar variant="inset" className="border-r-0 bg-white/50 backdrop-blur-xl">
            <SidebarHeader className="h-24 flex items-center px-8">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="size-12 bg-slate-950 rounded-2xl flex items-center justify-center border-2 border-slate-800 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-orange-500/10">
                        <span className="text-white text-2xl font-black">N</span>
                    </div>
                    <div>
                        <h2 className="text-base font-black text-slate-950 leading-none tracking-tight">Numan</h2>
                        <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1.5 opacity-80">Colors & Flavors</p>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-4 pt-4">
                <SidebarMenu className="gap-1.5">
                    {sidebarMenuItems.map((item) =>
                        item.children ? (
                            <div key={item.id} className="mb-6">
                                <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                                    {item.name}
                                </SidebarGroupLabel>

                                <div className="space-y-1 relative">
                                    {item.id === "pages" && (
                                        <button
                                            onClick={() => setIsOpenPageDialog(true)}
                                            className="absolute right-2 top-[-34px] size-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:border-orange-100 transition-all"
                                        >
                                            <PlusIcon className="size-3.5" />
                                        </button>
                                    )}

                                    {item.children.map((subItem) => {
                                        const isActive = location.pathname === subItem.link;
                                        return (
                                            <SidebarMenuItem key={subItem.id}>
                                                <Link
                                                    to={subItem.link}
                                                    className={`
                                                        flex items-center gap-3 px-4 h-10 rounded-2xl text-sm font-bold transition-all duration-200
                                                        ${isActive
                                                            ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                        }
                                                    `}
                                                >
                                                    <Icon
                                                        icon={subItem.icon}
                                                        className={`text-lg ${isActive ? "text-orange-400" : "opacity-40"}`}
                                                    />
                                                    <span>{subItem.name}</span>
                                                </Link>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <SidebarMenuItem key={item.id}>
                                {(() => {
                                    const isActive = location.pathname === item.link;
                                    return (
                                        <Link
                                            to={item.link}
                                            className={`
                                                flex items-center gap-4 px-4 h-12 rounded-2xl text-[13px] font-black transition-all duration-300
                                                ${isActive
                                                    ? "bg-slate-950 text-white shadow-xl shadow-slate-900/10 translate-x-1"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                }
                                            `}
                                        >
                                            <div className={`
                                                size-8 rounded-xl flex items-center justify-center transition-all duration-300
                                                ${isActive ? "bg-orange-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-white"}
                                            `}>
                                                <Icon icon={item.icon} className="text-lg" />
                                            </div>
                                            <span className="uppercase tracking-wider">{item.name}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="ml-auto size-1.5 rounded-full bg-orange-400"
                                                />
                                            )}
                                        </Link>
                                    );
                                })()}
                            </SidebarMenuItem>
                        ),
                    )}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-6 border-t border-slate-50/50">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-4 w-full h-12 px-4 rounded-2xl text-xs font-black text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all uppercase tracking-widest"
                >
                    <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                        <LogOut className="size-4" />
                    </div>
                    <span>Sign Out</span>
                </button>
            </SidebarFooter>

            <CreatePageDialog
                open={isOpenPageDialog}
                onOpenChange={setIsOpenPageDialog}
            />
        </Sidebar>
    );
};
