import { AuthProvider } from "@/providers/auth.provider";
import { Outlet } from "react-router";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
}
