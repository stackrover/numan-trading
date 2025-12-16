import { createBrowserRouter } from "react-router";
import RootLayout from "@/components/layouts/RootLayout";
import ProtectedRoutesLayout from "@/components/layouts/ProtectedRoutesLayout";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        hydrateFallbackElement: <div>Loading...</div>,
        children: [
            // Protected Routes
            {
                Component: ProtectedRoutesLayout,
                children: [

                ],
            },

            // Auth Routes
            {
                path: "/login",
                lazy: async () => {
                    const module = await import("@/routes/auth/Login");
                    return { Component: module.default };
                }
            },
        ],
    },
]);
