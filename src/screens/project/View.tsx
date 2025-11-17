import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { type Project } from "src-tauri/bindings/Project";

export default function (): React.JSX.Element {
    const { id } = useParams();
    const [project, setProject] = useState<Project>();

    async function getProject() {
        try {
            const data = await invoke<Project>("get_project", {
                uuid: id,
            });

            console.log({ data });
        } catch (err) {
            toast.error(err as string);
        }
    }

    useEffect(() => {
        if (!id) {
            toast.error("Project is not valid, invalid uuid");
            return;
        }
        getProject();
    }, []);

    return <section>View</section>;
}
