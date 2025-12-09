import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";
import { ConfirmDialogContextProvider } from "./context/ConfirmDialogContext";
import { router } from "./screens/router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ConfirmDialogContextProvider>
            <SidebarProvider>
                <RouterProvider router={router} />
                <Toaster />
            </SidebarProvider>
        </ConfirmDialogContextProvider>
    </React.StrictMode>
);
