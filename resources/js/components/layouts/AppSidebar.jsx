import { Icon } from "@iconify-icon/react";
import { Link, useLocation } from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarGroupLabel,
} from "../ui/sidebar";
import { PlusIcon, LogOut } from "lucide-react";
import React from "react";
import { CreatePageDialog } from "../page/CreatePageDialog";
import { usePages } from "@/services/page.service";
import { useLogoutMutation } from "@/services/auth.service";

export const AppSidebar = () => {
    const [isOpenPageDialog, setIsOpenPageDialog] = React.useState(false);
    const { data: pages, isLoading } = usePages();
    const { mutate: logout } = useLogoutMutation();
    const location = useLocation();

    const sidebarMenuItems = [
        {
            id: "dashboard",
            name: "Dashboard",
            link: "/",
            icon: "solar:widget-2-bold",
        },
        {
            id: "Enquiries",
            name: "Enquiries",
            link: "/enquiries",
            icon: "solar:chat-round-line-bold",
        },
        {
            id: "Products",
            name: "Products",
            link: "/products",
            icon: "solar:box-bold",
        },
        {
            id: "pages",
            name: "Pages",
            link: "/pages",
            icon: "solar:document-text-bold",
            children: pages?.data?.map((page) => ({
                id: page.id,
                name: page.title,
                link: `/pages/${page.slug}`,
                icon: "solar:document-linear",
            })),
        },
    ];

    return (
        <Sidebar variant="inset" className="border-r border-slate-100 bg-white">
            <SidebarHeader className="h-16 flex items-center px-6 border-b border-slate-50">
                <Link to="/" className="flex items-center gap-3">
                    <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-white text-xl font-bold">N</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 leading-none">Numan Trading</h2>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1">Admin Panel</p>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-3 pt-6">
                <SidebarMenu className="gap-1">
                    {sidebarMenuItems.map((item) =>
                        item.children ? (
                            <div key={item.id} className="mb-6">
                                <div className="flex items-center justify-between px-3 mb-2">
                                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 p-0 h-auto">
                                        {item.name}
                                    </SidebarGroupLabel>
                                    {item.id === "pages" && (
                                        <button
                                            onClick={() => setIsOpenPageDialog(true)}
                                            className="size-5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all"
                                        >
                                            <PlusIcon className="size-3" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-0.5">
                                    {item.children.map((subItem) => {
                                        const isActive = location.pathname === subItem.link;
                                        return (
                                            <SidebarMenuItem key={subItem.id}>
                                                <Link
                                                    to={subItem.link}
                                                    className={`
                                                        flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-all
                                                        ${isActive
                                                            ? "bg-indigo-50 text-indigo-700"
                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                        }
                                                    `}
                                                >
                                                    <Icon
                                                        icon={subItem.icon}
                                                        className={`text-lg opacity-60 ${isActive ? "text-indigo-600 opacity-100" : ""}`}
                                                    />
                                                    <span className="truncate">{subItem.name}</span>
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
                                                flex items-center gap-3 px-3 h-11 rounded-xl text-sm font-semibold transition-all
                                                ${isActive
                                                    ? "bg-slate-900 text-white shadow-sm"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                }
                                            `}
                                        >
                                            <div className={`
                                                size-8 rounded-lg flex items-center justify-center transition-all
                                                ${isActive ? "bg-indigo-500 text-white" : "bg-slate-50 text-slate-400"}
                                            `}>
                                                <Icon icon={item.icon} className="text-xl" />
                                            </div>
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })()}
                            </SidebarMenuItem>
                        ),
                    )}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-slate-50">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 w-full h-10 px-3 rounded-xl text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all group"
                >
                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-600 transition-all">
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
