import { useEffect, useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
    SidebarTrigger,
} from "../ui/sidebar";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { Blocks } from "./blocks";
import { Button } from "../ui/button";

export default function Components(): React.JSX.Element {
    const [blocks, setBlocks] = useState<Blocks[]>([]);

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
                        <section className="flex flex-wrap gap-1 p-2">
                            {blocks.map((block) => (
                                <Button key={block.id}>{block.name}</Button>
                            ))}
                        </section>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>
        </section>
    );
}
