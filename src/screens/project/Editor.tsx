import Elements from "@/components/editor/Components";
import ElementStylesEditor from "@/components/editor/Index";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useBlocker, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Editor() {
    const { id, name } = useParams();
    const confirmDialog = useConfirmDialog();
    const [content, setContent] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

    /**
     * Block navigation if unsaved changes is detected
     */
    const blocker = useBlocker(() => {
        return hasUnsavedChanges;
    });
    useEffect(() => {
        if (blocker.state === "blocked") {
            (async () => {
                const result = await confirmDialog({
                    title: "You have unsaved changes",
                    description: "Are you sure to discard these changes?",
                });

                if (result) {
                    blocker.proceed();
                } else {
                    blocker.reset();
                }
            })();
        }
    }, [blocker]);

    /**
     * Save changes
     */
    async function saveChanges() {
        setHasUnsavedChanges(false);
    }

    return (
        <section>
            <div className="flex justify-between items-center">
                <p>Editing: {name}</p>
                <Button onClick={saveChanges}>Save</Button>
            </div>
            <section className="flex items-start justify-between">
                <Elements />
                <iframe content={content} className="w-full h-full" />
                <ElementStylesEditor />
            </section>
        </section>
    );
}
