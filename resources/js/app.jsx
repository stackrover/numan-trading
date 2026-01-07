import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import "./bootstrap";

import { RouterProvider } from "react-router";
import { router } from "./app/router";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster richColors />
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

const container = document.getElementById("app");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
