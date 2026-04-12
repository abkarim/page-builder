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

const ASSETS_ARCHIVE: {
    name: ProjectAssetType;
    Icon: any;
}[] = [
    {
        name: "Image",
        Icon: ImagesIcon,
    },
    {
        name: "Video",
        Icon: ClapperboardIcon,
    },
    {
        name: "JS",
        Icon: FileIcon,
    },
    {
        name: "CSS",
        Icon: BracesIcon,
    },
];

export default function Assets(): React.JSX.Element {
    const [isLoading, setIsLoading] = useState(false);
    const [assets, setAssets] = useState<ProjectAsset[]>([]);
    const [filteredAssets, setFilteredAssets] = useState<
        Partial<Record<ProjectAssetType, ProjectAsset[]>>
    >({});
    const [assetType, setAssetType] = useState<ProjectAssetType | null>(null);

    async function getAssets() {
        setIsLoading(true);
        try {
            const data = await invoke<ProjectAsset[]>("get_project_assets");
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
        const filters: { name: string; extensions: string[] }[] = [];

        if (assetType === "Image") {
            filters.push({
                name: "Images",
                extensions: ["jpg", "jpeg", "webp", "gif"],
            });
        }

        const selectedFiles = await open({
            multiple: true,
            directory: false,
            filters,
        });

        console.log(selectedFiles);
    }

    useEffect(() => {
        getAssets();
    }, []);

    return (
        <section className="mt-5 space-y-2">
            <Label>Assets ({assets.length.toString() || "0"})</Label>
            <div className=" flex flex-wrap gap-5">
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
                open={assetType !== null}
                onOpenChange={(state) =>
                    setAssetType((prev) => (!state ? null : prev))
                }
            >
                {assetType !== null && (
                    <SheetContent side="bottom">
                        <SheetHeader>{assetType}</SheetHeader>
                        <section className="px-4 pb-4">
                            {isLoading && (
                                <section>
                                    <Spinner />
                                </section>
                            )}
                            {!isLoading && (
                                <section className="space-y-2">
                                    <div>
                                        <Button onClick={addNewAsset}>
                                            Add new asset
                                        </Button>
                                    </div>

                                    {selectedAssets.length === 0 && (
                                        <p>No assets found</p>
                                    )}
                                    {selectedAssets.map((asset) => (
                                        <div>{asset.filename}</div>
                                    ))}
                                </section>
                            )}
                        </section>
                    </SheetContent>
                )}
            </Sheet>
        </section>
    );
}
