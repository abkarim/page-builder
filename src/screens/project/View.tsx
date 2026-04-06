import ColorPickerComponent from "@/components/ColorPicker";
import { Button } from "@/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import { Spinner } from "@/components/ui/spinner";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { invoke } from "@tauri-apps/api/core";
import { DownloadIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { type Project } from "src-tauri/bindings/Project";
import { type ProjectData } from "src-tauri/bindings/ProjectData";

const CONFIGURATION_TOASTER_ID = "configuration-toast";

export default function (): React.JSX.Element {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const projectDataRef = useRef<ProjectData | null>(null);
    const [designs, setDesigns] = useState<string[]>([]);
    const [newDesignName, setNewDesignName] = useState("");
    const [newDesignSheetOpenState, setNewDesignSheetOpenState] =
        useState(false);
    const navigate = useNavigate();
    const [isExporting, setIsExporting] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [hasUnsavedConfiguration, setHasUnsavedConfiguration] =
        useState(false);

    async function getDesigns() {
        try {
            const data = await invoke<string[]>("get_designs", {
                uuid: project?.id,
            });
            setDesigns(data);
        } catch (e) {
            toast.error(e as string);
        }
    }

    async function getProjectData() {
        try {
            const data = await invoke<ProjectData>("get_project_configuration");
            setProjectData(data);
            projectDataRef.current = structuredClone(data);
        } catch (err) {
            toast.error(err as string);
        }
    }

    async function getProject() {
        try {
            const data = await invoke<Project>("get_project", {
                uuid: id,
                fixIfRequired: true,
            });
            setProject(data);
            getProjectData();
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

    useEffect(() => {
        if (!project?.id) return;

        getDesigns();
    }, [project]);

    useEffect(() => {
        if (projectData === null || projectDataRef.current === null) return;

        if (
            JSON.stringify(projectData) !==
            JSON.stringify(projectDataRef.current)
        ) {
            setHasUnsavedConfiguration(true);
        }
    }, [projectData]);

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
            getDesigns();
            toast.success("Design created successfully");
        } catch (err) {
            toast.error(err as string);
        }
    }

    async function exportProject() {
        setIsExporting(true);

        try {
            const res = await invoke<string>("export_project", {
                uuid: project?.id,
            });
            toast.success(res);
        } catch (err) {
            console.log(err);
            toast.error(err as string);
        } finally {
            setIsExporting(false);
        }
    }

    function updateColor(
        action: "add" | "update" | "remove",
        index?: number,
        data?: ProjectData["configuration"]["color"][number],
    ) {
        if (projectData === null) return;
        setProjectData((prev) => {
            if (!prev) return null;

            const {
                configuration: { color },
            } = prev;

            switch (action) {
                case "add":
                    color.push({
                        name: "Untitled",
                        value: "",
                    });
                    break;

                case "update":
                    if (index === undefined || data === undefined) break;
                    color[index] = data;
                    break;

                case "remove":
                    if (index === undefined) break;
                    color.splice(index, 1);
                    break;

                default:
                    action satisfies never;
            }

            return {
                ...prev,
                configuration: {
                    ...prev.configuration,
                    color: [...color],
                },
            };
        });
    }

    function cancelConfigurationEdit() {
        setProjectData(structuredClone(projectDataRef.current));

        // Unsaved configuration state has been set to false
        // in the button itself
        setIsConfigOpen(false);
    }

    async function saveConfigurationEdit() {
        if (projectData === null) return;

        try {
            const response = await invoke<string>(
                "update_current_project_configuration",
                {
                    config: projectData.configuration,
                },
            );
            toast.success(response);

            projectDataRef.current = structuredClone(projectData);
            setHasUnsavedConfiguration(false);
            setIsConfigOpen(false);
        } catch (err) {
            toast.error(err as string);
        }
    }

    if (project === null) {
        return <h4>Loading...</h4>;
    }

    return (
        <section>
            <section className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <p>Project:</p>
                    <h2>{project.name}</h2>
                </div>
                <div className="space-x-2">
                    <Button
                        onClick={exportProject}
                        disabled={isExporting}
                        className="[&_svg]:size-5!"
                    >
                        Export {isExporting ? <Spinner /> : <DownloadIcon />}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setIsConfigOpen(true)}
                    >
                        Config <SettingsIcon />
                    </Button>
                </div>
            </section>
            <div className="mt-2 flex flex-wrap gap-5">
                {designs.map((name) => (
                    <ContextMenu key={name}>
                        <ContextMenuTrigger
                            onClick={() => {
                                navigate(`/project/${project?.id}/${name}`);
                            }}
                        >
                            <button
                                key={name}
                                className="p-2 rounded-sm bg-muted h-full"
                            >
                                <p className="min-w-12">{name}</p>
                            </button>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem
                                onClick={() => {
                                    navigate(`/project/${project?.id}/${name}`);
                                }}
                            >
                                Edit
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem
                                onClick={() => {}}
                                className="text-red-600 hover:bg-red-600! hover:text-white! "
                            >
                                Delete
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
                <Sheet
                    open={newDesignSheetOpenState}
                    onOpenChange={setNewDesignSheetOpenState}
                >
                    <SheetTrigger asChild>
                        <Button
                            onClick={() => {}}
                            className="[&_svg]:size-7! h-full flex flex-col gap-2 justify-center items-center p-2 py-5 rounded-sm text-(--color-primary-foreground) bg-foreground"
                        >
                            <PlusIcon size={52} />
                            <p className="text-xs">New design</p>
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
            <div>
                <Sheet
                    open={isConfigOpen}
                    onOpenChange={(state) => {
                        if (state === false && hasUnsavedConfiguration) {
                            toast.warning("you have unsaved configuration", {
                                id: CONFIGURATION_TOASTER_ID,
                            });
                            return;
                        }
                        setIsConfigOpen(state);
                    }}
                >
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Project Configurations</SheetTitle>
                            <SheetDescription>
                                Configure your project according to your needs
                            </SheetDescription>
                        </SheetHeader>
                        <section className="px-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Label>Colors</Label>
                                    <Button
                                        onClick={() => updateColor("add")}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <PlusIcon />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-start gap-2">
                                    {projectData?.configuration.color.map(
                                        (color, index) => (
                                            <Popover key={index}>
                                                <ContextMenu>
                                                    <ContextMenuTrigger>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                style={{
                                                                    backgroundColor:
                                                                        color.value,
                                                                }}
                                                            ></Button>
                                                        </PopoverTrigger>
                                                    </ContextMenuTrigger>
                                                    <PopoverContent className="flex items-stretch justify-between gap-2">
                                                        <div className="space-y-1">
                                                            <Label>
                                                                Color Name
                                                            </Label>
                                                            <Input
                                                                defaultValue={
                                                                    color.name
                                                                }
                                                                onInput={(e) =>
                                                                    updateColor(
                                                                        "update",
                                                                        index,
                                                                        {
                                                                            value: color.value,
                                                                            name: e
                                                                                .currentTarget
                                                                                .value,
                                                                        },
                                                                    )
                                                                }
                                                                placeholder="Color name"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-nowrap">
                                                                Select Color
                                                            </Label>
                                                            <ColorPickerComponent
                                                                onValueChange={(
                                                                    c,
                                                                ) =>
                                                                    updateColor(
                                                                        "update",
                                                                        index,
                                                                        {
                                                                            name: color.name,
                                                                            value: c,
                                                                        },
                                                                    )
                                                                }
                                                                defaultValue={
                                                                    color.value
                                                                }
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                    <ContextMenuContent>
                                                        <ContextMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                updateColor(
                                                                    "remove",
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </ContextMenuItem>
                                                    </ContextMenuContent>
                                                </ContextMenu>
                                            </Popover>
                                        ),
                                    )}
                                </div>
                            </div>
                        </section>
                        <SheetFooter>
                            <Button onClick={saveConfigurationEdit}>
                                Save Changes
                            </Button>
                            <SheetClose
                                asChild
                                onClick={() => {
                                    setHasUnsavedConfiguration(false);
                                    toast.dismiss(CONFIGURATION_TOASTER_ID);
                                    cancelConfigurationEdit();
                                }}
                            >
                                <Button variant="outline">Cancel</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </section>
    );
}
