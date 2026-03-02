import { useEffect, useState } from "react";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { Block } from "./block";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Component } from "./components";
import DynamicIcon from "../DynamicIcon";

interface Props {
    show: boolean;
    onElementClick: (elementType: "block" | "component", block: Block) => void;
}

export default function Components({
    show,
    onElementClick,
}: Props): React.JSX.Element {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [components, setComponents] = useState<Component[]>([]);

    async function get_blocks() {
        try {
            const data: Block[] = JSON.parse(
                await invoke<string>("get_blocks"),
            );

            for (const block of data) {
                if (block.include) {
                    const includedBlocks: Block[] = [];
                    block.include.forEach((n: number) => {
                        const target = data.find((d: Block) => d.id === n);
                        if (target) includedBlocks.push(target);
                    });

                    block.included = includedBlocks;
                }
            }

            setBlocks(data);
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

    if (!show) return <></>;

    return (
        <section className="w-full max-w-60 bg-accent rounded ">
            <Tabs defaultValue="blocks" className="p-2">
                <TabsList className="border bg-background">
                    <TabsTrigger value="blocks">Blocks</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
                <TabsContent value="components">
                    <section className="flex flex-wrap gap-1">
                        <>
                            {components.map((component) => (
                                <Button key={component.id}>
                                    {component.name}
                                </Button>
                            ))}
                            {components.length === 0 && <p>No results</p>}
                        </>
                    </section>
                </TabsContent>
                <TabsContent value="blocks">
                    <section className="flex flex-wrap gap-1">
                        <>
                            {blocks.map((block) => (
                                <Button
                                    onClick={() =>
                                        onElementClick("block", block)
                                    }
                                    key={block.id}
                                    draggable={true}
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData(
                                            "text/plain",
                                            JSON.stringify(block),
                                        );
                                    }}
                                    className="h-auto [&_svg]:size-5!"
                                    variant="outline"
                                >
                                    <div className="flex flex-col items-center p-1">
                                        <div>
                                            <DynamicIcon name={block.icon} />
                                        </div>
                                        <p className="text-xs mt-2">
                                            {block.name}
                                        </p>
                                    </div>
                                </Button>
                            ))}
                            {blocks.length === 0 && <p>No results</p>}
                        </>
                    </section>
                </TabsContent>
            </Tabs>
        </section>
    );
}
