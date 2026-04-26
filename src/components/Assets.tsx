import {
    BracesIcon,
    ClapperboardIcon,
    FileIcon,
    ImagesIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { invoke } from "@tauri-apps/api/core";
import { type ProjectAsset } from "src-tauri/bindings/ProjectAsset";
import { type ProjectAssetType } from "src-tauri/bindings/ProjectAssetType";
import { open } from "@tauri-apps/plugin-dialog";
import AssetPreview from "./AssetPreview";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "./ui/context-menu";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";
import { Input } from "./ui/input";
import { getProjectAssets } from "@/util/projectSpecific/projectData";

export const assetConfig =
    await invoke<Record<ProjectAssetType, string[]>>("get_asset_config");

const ASSETS_ARCHIVE: {
    name: ProjectAssetType;
    Icon: any;
    exts: string[];
}[] = [
    {
        name: "Image",
        Icon: ImagesIcon,
        exts: assetConfig.Image,
    },
    {
        name: "Video",
        Icon: ClapperboardIcon,
        exts: assetConfig.Video,
    },
    {
        name: "JS",
        Icon: FileIcon,
        exts: assetConfig.JS,
    },
    {
        name: "CSS",
        Icon: BracesIcon,
        exts: assetConfig.CSS,
    },
];

export default function Assets(): React.JSX.Element {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [assets, setAssets] = useState<ProjectAsset[]>([]);
    const [filteredAssets, setFilteredAssets] = useState<
        Partial<Record<ProjectAssetType, ProjectAsset[]>>
    >({});
    const [assetType, setAssetType] = useState<ProjectAssetType | null>(null);
    const [assetToView, setAssetToView] = useState<ProjectAsset | null>(null);
    const [assetToRename, setAssetToRename] = useState<ProjectAsset | null>(
        null,
    );
    const [assetNewName, setAssetNewName] = useState("");
    const confirmDialog = useConfirmDialog();

    async function getAssets() {
        setIsLoading(true);
        try {
            const data = await getProjectAssets(undefined, true);
            setAssets(data);
            setFilteredAssets(
                Object.groupBy(data, ({ file_type }) => file_type),
            );
        } catch (err) {
            toast.error(err as string);
        } finally {
            setIsLoading(false);
        }
    }

    let selectedAssets = (assetType && filteredAssets?.[assetType]) ?? [];

    async function addNewAsset() {
        setIsUploading(true);

        const filters: { name: string; extensions: string[] }[] = [];

        for (const asset of ASSETS_ARCHIVE) {
            if (assetType === asset.name) {
                filters.push({
                    name: `Select ${asset.name}`,
                    extensions: asset.exts,
                });
                break;
            }
        }

        const selectedFiles = await open({
            title: `Select ${assetType}`,
            multiple: true,
            directory: false,
            canCreateDirectories: false,
            filters,
        });

        if (!selectedFiles) return;

        try {
            const message = await invoke<string>(
                "upload_current_project_assets",
                {
                    assetType,
                    paths: selectedFiles,
                },
            );

            toast.success(message);

            getAssets();
        } catch (err) {
            toast.error(err as string);
        } finally {
            setIsUploading(false);
        }
    }

    async function deleteAsset(path: string) {
        const result = await confirmDialog({
            title: "Are you sure?",
            description: "This action can't be reversed!",
        });

        if (!result) return;

        try {
            const msg = await invoke<string>("delete_current_project_asset", {
                path,
            });
            toast.success(msg);

            getAssets();
        } catch (err) {
            toast.error(err as string);
        }
    }

    async function renameAsset(path: string) {
        if (assetNewName.trim().length === 0) {
            toast.error("filename can't be empty");
            return;
        }

        try {
            const msg = await invoke<string>("rename_current_project_asset", {
                path,
                name: assetNewName,
            });
            toast.success(msg);
            getAssets();
            setAssetToRename(null);
        } catch (err) {
            toast.error(err as string);
        }
    }

    useEffect(() => {
        getAssets();
    }, []);

    return (
        <section className="mt-5 space-y-2">
            <Label>Assets ({assets.length.toString() || "0"})</Label>
            <div className="flex flex-wrap gap-5">
                {ASSETS_ARCHIVE.map((asset) => (
                    <Button
                        className="[&_svg]:size-15! flex-col h-full p-5 px-20"
                        variant="secondary"
                        onClick={() => setAssetType(asset.name)}
                    >
                        <asset.Icon size={50} />
                        <Label>
                            {asset.name} (
                            {filteredAssets?.[asset.name]?.length.toString() ||
                                "0"}
                            )
                        </Label>
                    </Button>
                ))}
            </div>
            <Sheet
                open={assetType !== null && assetToView === null}
                onOpenChange={(state) =>
                    setAssetType((prev) => (!state ? null : prev))
                }
            >
                {assetType !== null && (
                    <SheetContent side="bottom" className="h-2/3">
                        <SheetHeader>
                            <div className="flex items-center justify-between">
                                <p>{assetType}</p>
                                <Button onClick={addNewAsset}>
                                    Add new asset
                                </Button>
                            </div>
                        </SheetHeader>
                        <section className="px-4 pb-10 overflow-scroll">
                            {isLoading && (
                                <section>
                                    <Spinner />
                                </section>
                            )}
                            {!isLoading && (
                                <section className="space-y-2 ">
                                    {selectedAssets.length === 0 && (
                                        <p>No assets found</p>
                                    )}
                                    <section className="flex flex-wrap gap-4">
                                        {selectedAssets.map((asset) => (
                                            <ContextMenu key={asset.filepath}>
                                                <ContextMenuTrigger
                                                    key={asset.filepath}
                                                >
                                                    <div className="h-full w-2xs">
                                                        <AssetPreview
                                                            asset={asset}
                                                        />
                                                    </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent>
                                                    <ContextMenuItem
                                                        onClick={() =>
                                                            setAssetToView(
                                                                asset,
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </ContextMenuItem>
                                                    <ContextMenuItem
                                                        onClick={() => {
                                                            setAssetToRename(
                                                                asset,
                                                            );
                                                            setAssetNewName(
                                                                asset.filename.split(
                                                                    ".",
                                                                )[0],
                                                            );
                                                        }}
                                                    >
                                                        Rename
                                                    </ContextMenuItem>
                                                    <ContextMenuSeparator />
                                                    <ContextMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            deleteAsset(
                                                                asset.filepath,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        ))}

                                        {isUploading && <div>Uploading...</div>}
                                    </section>
                                </section>
                            )}
                        </section>
                    </SheetContent>
                )}
            </Sheet>
            {assetToView !== null && (
                <Drawer
                    open={assetToView !== null}
                    onOpenChange={(state) => {
                        if (!state) setAssetToView(null);
                    }}
                >
                    <DrawerContent className="h-[60vh]! w-screen overflow-scroll">
                        <section>
                            <AssetPreview asset={assetToView} />
                        </section>
                    </DrawerContent>
                </Drawer>
            )}
            {assetToRename !== null && (
                <Drawer
                    open={assetToRename !== null}
                    onOpenChange={(state) => {
                        if (!state) setAssetToRename(null);
                    }}
                >
                    <DrawerContent className="h-[30vh]! w-screen overflow-scroll px-4 space-y-3">
                        <DrawerTitle>Rename asset</DrawerTitle>
                        <section className="space-y-1">
                            <Label>Filename</Label>
                            <Input
                                placeholder="filename"
                                value={assetNewName}
                                onInput={(e) =>
                                    setAssetNewName(e.currentTarget.value)
                                }
                            />
                        </section>
                        <section className="flex items-center justify-between gap-2">
                            <Button
                                className="ml-auto"
                                variant="secondary"
                                onClick={() => setAssetToRename(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() =>
                                    renameAsset(assetToRename.filepath)
                                }
                            >
                                Rename
                            </Button>
                        </section>
                    </DrawerContent>
                </Drawer>
            )}
        </section>
    );
}
