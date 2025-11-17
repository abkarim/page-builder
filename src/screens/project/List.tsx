import { invoke } from "@tauri-apps/api/core";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { type Project } from "src-tauri/bindings/Project";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useNavigate } from "react-router-dom";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { toast } from "sonner";

export default function (): React.JSX.Element {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const getConfirmation = useConfirmDialog();

    async function removeProject(uuid: Project["id"]) {
        const ok = await getConfirmation({});
        if (!ok) return;
        try {
            const msg = await invoke<string>("remove_project", {
                uuid,
            });

            /**
             * Remove the project
             */
            setProjects((prev) => prev.filter((p) => p.id !== uuid));

            toast.success(msg);
        } catch (err) {
            toast.error(err as string);
        }
    }

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
            <div className="flex items-stretch gap-4">
                {projects.map((project) => (
                    <ContextMenu>
                        <ContextMenuTrigger
                            onClick={() => navigate(`/project/${project.id}`)}
                        >
                            <button
                                key={project.id}
                                className="p-2 rounded-sm bg-muted h-full"
                            >
                                <p className="min-w-12">{project.name}</p>
                            </button>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem
                                onClick={() =>
                                    navigate(`/project/${project.id}`)
                                }
                            >
                                Edit
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem
                                onClick={() => removeProject(project.id)}
                                className="text-red-600 hover:bg-red-600! hover:text-white! "
                            >
                                Delete
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
                <button
                    onClick={() => navigate("/project/add")}
                    className="flex flex-col gap-2 justify-center items-center p-2 rounded-sm text-[var(--color-primary-foreground)] bg-[var(--foreground)]"
                >
                    <PlusIcon size={52} />
                    <p>Create new project</p>
                </button>
            </div>
        </section>
    );
}
