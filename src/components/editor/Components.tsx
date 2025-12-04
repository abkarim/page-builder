import { useEffect, useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
    SidebarTrigger,
} from "../ui/sidebar";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";

export default function Components(): React.JSX.Element {
    const [blocks, setBlocks] = useState([]);

    async function get_blocks() {
        try {
            const data = await invoke<string>("get_blocks");
            setBlocks(JSON.parse(data));
        } catch (err) {
            toast.error(err as string);
        }
    }

    useEffect(() => {
        get_blocks();
    }, []);

    console.log({ blocks });

    return (
        <section>
            <SidebarProvider defaultOpen={true} className="flex flex-col">
                <div className="flex items-center gap-1">
                    <SidebarTrigger className="z-10" />
                    <h4>Components</h4>
                </div>
                <Sidebar
                    variant="sidebar"
                    collapsible="offcanvas"
                    className="relative z-0"
                >
                    <SidebarContent>
                        <section>components</section>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>
        </section>
    );
}
