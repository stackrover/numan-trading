import AuthRoutesLayout from "@/components/layouts/AuthRoutesLayout";
import ProtectedRoutesLayout from "@/components/layouts/ProtectedRoutesLayout";
import RootLayout from "@/components/layouts/RootLayout";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        hydrateFallbackElement: <div>Loading...</div>,
        children: [
            // Protected Routes
            {
                Component: ProtectedRoutesLayout,
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            const module = await import("@/routes/Dashboard");
                            return { Component: module.default };
                        },
                    },

                    {
                        path: "/pages/:slug",
                        lazy: async () => {
                            const module = await import("@/routes/Page");
                            return { Component: module.default };
                        },
                    },

                    {
                        path: "/enquiries",
                        lazy: async () => {
                            const module = await import("@/routes/Enquiries");
                            return { Component: module.default };
                        },
                    },

                    {
                        path: "/enquiries/:id",
                        lazy: async () => {
                            const module = await import("@/routes/Inbox");
                            return { Component: module.default };
                        },
                    },

                    {
                        path: "/products",
                        lazy: async () => {
                            const module = await import("@/routes/Products");
                            return { Component: module.default };
                        },
                    },
                    {
                        path: "/testimonials",
                        lazy: async () => {
                            const module = await import("@/routes/Testimonials");
                            return { Component: module.default };
                        },
                    },

                    {
                        path: "/partners",
                        lazy: async () => {
                            const module = await import("@/routes/Partners");
                            return { Component: module.default };
                        },
                    },

                    {
                        path: "/gallery",
                        lazy: async () => {
                            const module = await import("@/routes/Gallery");
                            return { Component: module.default };
                        },
                    },

                    {
                        path: "/categories",
                        lazy: async () => {
                            const module = await import("@/routes/Categories");
                            return { Component: module.default };
                        },
                    },

                    {
                        path: "/brands",
                        lazy: async () => {
                            const module = await import("@/routes/Brands");
                            return { Component: module.default };
                        },
                    },
                ],
            },

            // Auth Routes
            {
                Component: AuthRoutesLayout,
                children: [
                    {
                        path: "/login",
                        lazy: async () => {
                            const module = await import("@/routes/auth/Login");
                            return { Component: module.default };
                        },
                    },
                    {
                        path: "/register",
                        lazy: async () => {
                            const module = await import("@/routes/auth/Register");
                            return { Component: module.default };
                        },
                    },
                    {
                        path: "/forgot-password",
                        lazy: async () => {
                            const module = await import("@/routes/auth/ForgotPassword");
                            return { Component: module.default };
                        },
                    },
                    {
                        path: "/reset-password/:token",
                        lazy: async () => {
                            const module = await import("@/routes/auth/ResetPassword");
                            return { Component: module.default };
                        },
                    },
                ],
            },
        ],
    },
]);
