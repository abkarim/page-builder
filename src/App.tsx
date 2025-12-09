import "./App.css";

import Navigation from "@/components/Navigation";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";

type Breadcrumb = {
    location: string;
    name: string;
};

export default function App(): React.JSX.Element {
    const { open } = useSidebar();
    const navigate = useNavigate();
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const location = useLocation();

    useEffect(() => {
        const data = new Set(location.pathname.split("/"));

        setBreadcrumbs(() => {
            const bc: Breadcrumb[] = [];
            let index = 0;
            data.forEach((path) => {
                const prevLoc = bc[index - 1]?.location;
                switch (path) {
                    case "":
                        bc.push({
                            name: "Home",
                            location: "/",
                        });
                        break;

                    default:
                        bc.push({
                            name: path.charAt(0).toUpperCase() + path.slice(1),
                            location: `${prevLoc}${
                                prevLoc !== "/" ? "/" : ""
                            }${path}`,
                        });
                }
                index++;
            });
            return bc;
        });
    }, [location]);

    return (
        <section className="flex min-h-screen w-full">
            <Navigation />

            <section className="px-2 w-full">
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
                            {breadcrumbs.map((bc, index) => (
                                <>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink
                                            className="cursor-pointer"
                                            onClick={() =>
                                                navigate(bc.location)
                                            }
                                        >
                                            {bc.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {breadcrumbs.length - 1 > index && (
                                        <BreadcrumbSeparator />
                                    )}
                                </>
                            ))}
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
