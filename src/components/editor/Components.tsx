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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Component } from "./components";

export default function Components(): React.JSX.Element {
    const [blocks, setBlocks] = useState<Blocks[]>([]);
    const [components, setComponents] = useState<Component[]>([]);

    async function get_blocks() {
        try {
            const data = await invoke<string>("get_blocks");
            setBlocks(JSON.parse(data));
        } catch (err) {
            toast.error(err as string);
        }
    }

    async function get_components() {
        try {
            const data = await invoke<string>("get_components");
            setComponents(JSON.parse(data));
        } catch (err) {
            toast.error(err as string);
        }
    }

    useEffect(() => {
        get_blocks();
        get_components();
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
                        <Tabs defaultValue="blocks" className="p-2">
                            <TabsList>
                                <TabsTrigger value="blocks">Blocks</TabsTrigger>
                                <TabsTrigger value="components">
                                    Components
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="components">
                                <section className="flex flex-wrap gap-1">
                                    <>
                                        {components.map((component) => (
                                            <Button key={component.id}>
                                                {component.name}
                                            </Button>
                                        ))}
                                        {components.length === 0 && (
                                            <p>No results</p>
                                        )}
                                    </>
                                </section>
                            </TabsContent>
                            <TabsContent value="blocks">
                                <section className="flex flex-wrap gap-1">
                                    <>
                                        {blocks.map((block) => (
                                            <Button key={block.id}>
                                                {block.name}
                                            </Button>
                                        ))}
                                        {blocks.length === 0 && (
                                            <p>No results</p>
                                        )}
                                    </>
                                </section>
                            </TabsContent>
                        </Tabs>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>
        </section>
    );
}
