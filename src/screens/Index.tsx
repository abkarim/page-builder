import Navigation from "@/components/Navigation";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function (): React.JSX.Element {
    const { open } = useSidebar();

    return (
        <section className="flex min-h-screen">
            <Navigation />

            <section className="pl-2">
                <header className="flex items-center justify-start gap-2">
                    <Tooltip>
                        <TooltipTrigger>
                            <SidebarTrigger />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{open ? "Close" : "Open"} menu</p>
                        </TooltipContent>
                    </Tooltip>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/components">
                                    Components
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="mt-2">
                    <Outlet />
                </div>
            </section>
        </section>
    );
}
