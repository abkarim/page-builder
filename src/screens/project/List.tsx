import { invoke } from "@tauri-apps/api/core";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { type Project } from "./../../../src-tauri/bindings/Project";

export default function (): React.JSX.Element {
    const [projects, setProjects] = useState<Project[]>([]);

    async function get_projects() {
        try {
            const data = await invoke<Project[]>("get_projects");
            setProjects(data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        get_projects();
    }, []);

    return (
        <section>
            <div className="space-y-2">
                {projects.map((project) => (
                    <div key={project.id}>
                        <p>{project.name}</p>
                    </div>
                ))}
                <button className="flex flex-col gap-2 justify-center items-center p-2 rounded-sm text-[var(--color-primary-foreground)] bg-[var(--foreground)]">
                    <PlusIcon size={52} />
                    <p>Create new project</p>
                </button>
            </div>
        </section>
    );
}
