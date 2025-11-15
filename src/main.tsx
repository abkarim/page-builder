import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";
import { ConfirmDialogContextProvider } from "./context/ConfirmDialogContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ConfirmDialogContextProvider>
            <BrowserRouter>
                <SidebarProvider>
                    <App />
                    <Toaster />
                </SidebarProvider>
            </BrowserRouter>
        </ConfirmDialogContextProvider>
    </React.StrictMode>
);
