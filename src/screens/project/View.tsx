import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { invoke } from "@tauri-apps/api/core";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { type Project } from "src-tauri/bindings/Project";

export default function (): React.JSX.Element {
    const { id } = useParams();
    const [project, setProject] = useState<Project>();
    const [newDesignName, setNewDesignName] = useState("");
    const [newDesignSheetOpenState, setNewDesignSheetOpenState] =
        useState(false);

    async function getProject() {
        try {
            const data = await invoke<Project>("get_project", {
                uuid: id,
            });

            setProject(data);
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

    async function createNewDesign() {
        /**
         * Check name
         */
        if (newDesignName.trim().length === 0) {
            return toast.error("Name can't be empty");
        }

        try {
            await invoke<string>("create_new_design", {
                name: newDesignName,
                uuid: project?.id,
            });

            setNewDesignName("");
            setNewDesignSheetOpenState(false);
            toast.success("Design created successfully");
        } catch (err) {
            toast.error(err as string);
        }
    }

    return (
        <section>
            <div className="flex gap-2 items-center">
                <p>Project:</p>
                <h2>{project?.name}</h2>
            </div>
            <div className="mt-2">
                <Sheet
                    open={newDesignSheetOpenState}
                    onOpenChange={setNewDesignSheetOpenState}
                >
                    <SheetTrigger asChild>
                        <Button
                            onClick={() => {}}
                            className="h-full flex flex-col gap-2 justify-center items-center p-2 py-5 rounded-sm text-[var(--color-primary-foreground)] bg-[var(--foreground)]"
                        >
                            <PlusIcon size={52} />
                            <p>Create new design</p>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Create new design file</SheetTitle>
                            <SheetDescription>
                                Create and configure your new design
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-demo-name">
                                    Design name
                                </Label>
                                <Input
                                    id="sheet-demo-name"
                                    value={newDesignName}
                                    onInput={(e) => {
                                        setNewDesignName(e.currentTarget.value);
                                    }}
                                />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button type="submit" onClick={createNewDesign}>
                                Save changes
                            </Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </section>
    );
}
