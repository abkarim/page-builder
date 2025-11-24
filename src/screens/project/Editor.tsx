import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

    useEffect(() => {
        getContent();
    }, []);

    console.log({ content });

    return (
        <section>
            Editor {id} {name}
        </section>
    );
}
