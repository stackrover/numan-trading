import { Icon } from "@iconify-icon/react";
import { Link } from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";
import { PlusIcon } from "lucide-react";
import React from "react";
import { CreatePageDialog } from "../page/CreatePageDialog";
import { usePages } from "@/services/page.service";

export const AppSidebar = () => {
    const [isOpenPageDialog, setIsOpenPageDialog] = React.useState(false);

    const { data: pages, isLoading } = usePages();

    const sidebarMenuItems = [
        {
            id: "dashboard",
            name: "Dashboard",
            link: "/",
            icon: "solar:widget-bold",
        },
        {
            id: "pages",
            name: "Pages",
            link: "/pages",
            icon: "solar:file-text-linear",
            children: pages?.data?.map((page) => ({
                id: page.id,
                name: page.title,
                link: `/pages/${page.slug}`,
                icon: "solar:file-text-linear",
            })),
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
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a href="/dashboard">Numan Trading</a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Sidebar content */}
            <SidebarContent>
                <SidebarMenu>
                    {sidebarMenuItems.map((item) =>
                        item.children ? (
                            <SidebarGroup key={item.id}>
                                <SidebarGroupLabel>
                                    {item.name}
                                </SidebarGroupLabel>

                                {item.id === "pages" && (
                                    <SidebarGroupAction
                                        title="Add Page"
                                        onClick={() =>
                                            setIsOpenPageDialog(true)
                                        }
                                        className="hover:cursor-pointer"
                                    >
                                        <PlusIcon />
                                        <span className="sr-only">
                                            Add Page
                                        </span>
                                    </SidebarGroupAction>
                                )}

                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {item.children.map((subItem) => (
                                            <SidebarMenuItem key={subItem.id}>
                                                <SidebarMenuButton asChild>
                                                    <Link to={subItem.link}>
                                                        <Icon
                                                            icon={subItem.icon}
                                                            className="mr-2"
                                                        />
                                                        {subItem.name}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ) : (
                            <div className="px-2" key={item.id}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.link}>
                                            <Icon
                                                icon={item.icon}
                                                className="mr-2"
                                            />
                                            {item.name}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </div>
                        ),
                    )}
                </SidebarMenu>
            </SidebarContent>

            <CreatePageDialog
                open={isOpenPageDialog}
                onOpenChange={setIsOpenPageDialog}
            />
        </Sidebar>
    );
};
