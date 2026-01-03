import { useEffect, useState } from "react";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { Blocks } from "./blocks";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Component } from "./components";

interface Props {
  show: boolean;
}

export default function Components({ show }: Props): React.JSX.Element {
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

  if (!show) return <></>;

  return (
    <section className="w-md bg-accent rounded ">
      <Tabs defaultValue="blocks" className="p-2">
        <TabsList>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        <TabsContent value="components">
          <section className="flex flex-wrap gap-1">
            <>
              {components.map((component) => (
                <Button key={component.id}>{component.name}</Button>
              ))}
              {components.length === 0 && <p>No results</p>}
            </>
          </section>
        </TabsContent>
        <TabsContent value="blocks">
          <section className="flex flex-wrap gap-1">
            <>
              {blocks.map((block) => (
                <Button key={block.id}>{block.name}</Button>
              ))}
              {blocks.length === 0 && <p>No results</p>}
            </>
          </section>
        </TabsContent>
      </Tabs>
    </section>
  );
}
