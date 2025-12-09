import Elements from "@/components/editor/Components";
import ElementStylesEditor from "@/components/editor/Index";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useBlocker, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Editor() {
    const { id, name } = useParams();
    const [content, setContent] = useState("");

    async function getContent() {
        if (!id || !name) {
            return toast.error("invalid project file");
        }

        try {
            const content = await invoke<string>("get_project_file_content", {
                uuid: id,
                name,
            });

            setContent(content);
        } catch (err) {
            toast.error(err as string);
        }
    }

    const blocker = useBlocker(
        ({ currentLocation, nextLocation, historyAction }) => {
            console.log({ currentLocation, historyAction, nextLocation });
            return true;
        }
    );

    useEffect(() => {
        getContent();
    }, []);

    useEffect(() => {
        console.log({ blocker });
    }, []);

    return (
        <section>
            <div className="flex justify-between items-center">
                <p>Editing: {name}</p>
                <Button>Save</Button>
            </div>
            <section className="flex items-start justify-between">
                <Elements />
                <iframe content={content} className="w-full h-full" />
                <ElementStylesEditor />
            </section>
        </section>
    );
}
