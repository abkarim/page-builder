import Navigation from "@/components/Navigation";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Outlet } from "react-router";

export default function (): React.JSX.Element {
    const { open } = useSidebar();
    return (
        <section className="flex min-h-screen">
            <Navigation />

            <section className="pl-2">
                <header>
                    <Tooltip>
                        <TooltipTrigger>
                            <SidebarTrigger />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{open ? "Close" : "Open"} menu</p>
                        </TooltipContent>
                    </Tooltip>
                </header>
                <div className="mt-2">
                    <Outlet />
                </div>
            </section>
        </section>
    );
}
