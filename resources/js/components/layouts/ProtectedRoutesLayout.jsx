import { useAuth } from "@/providers/auth.provider";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar, NavbarProvider } from "./AppNavbar";

export default function ProtectedRoutesLayout() {
    const navigate = useNavigate();
    const { auth, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;
        if (!auth) {
            navigate("/login");
        }
    }, [auth, isLoading, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-svh flex flex-col overflow-auto">
                <NavbarProvider>
                    <Navbar />
                    <section className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
                        <Outlet />
                    </section>
                </NavbarProvider>
            </main>
        </SidebarProvider>
    );
}
