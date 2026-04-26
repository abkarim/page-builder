import { AssetsPreviewArchive } from "@/components/AssetPreview";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getProjectAssets } from "@/util/projectSpecific/projectData";
import { isUsingLocalAsset } from "@/util/URL";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProjectAsset } from "src-tauri/bindings/ProjectAsset";

export interface AssetData {
    src: string;
}

interface Props {
    data: AssetData;
    update: (data: Partial<AssetData>) => void;
}

export default function AssetEditor({
    data,
    update,
}: Props): React.JSX.Element {
    const [usingAsset, setUsingAsset] = useState(false);
    const [assets, setAssets] = useState<ProjectAsset[] | null>(null);
    const [openAssetsArchive, setOpenAssetsArchive] = useState(false);

    function onAssetSelect(asset: ProjectAsset) {
        update({
            src: `/${asset.filepath}`,
        });
        setOpenAssetsArchive(false);
    }

    async function getAssets() {
        try {
            const data = await getProjectAssets("Image");
            setAssets(data);
        } catch (err) {
            toast.error(err as string);
        }
    }

    useEffect(() => {
        getAssets();
    }, []);

    useEffect(() => {
        setUsingAsset(isUsingLocalAsset(data.src));
    }, [data.src]);

    return (
        <div>
            <Tabs
                onValueChange={(value) => setUsingAsset(value === "asset")}
                value={usingAsset ? "asset" : "url"}
            >
                <div className="flex items-center justify-between gap-2">
                    <Label className="text-sm">Asset</Label>
                    <TabsList className="border bg-background">
                        <TabsTrigger value="asset">Asset</TabsTrigger>
                        <TabsTrigger value="url">URL</TabsTrigger>
                    </TabsList>
                </div>
                <div>
                    <TabsContent value="url">
                        <Textarea
                            className="bg-background"
                            defaultValue={data.src}
                            onInput={(e) =>
                                update({
                                    src: e.currentTarget.value,
                                })
                            }
                        />
                    </TabsContent>
                    <TabsContent value="asset">
                        <Button
                            variant="outline"
                            onClick={() => setOpenAssetsArchive(true)}
                        >
                            Change
                        </Button>
                    </TabsContent>
                </div>
            </Tabs>
            <Drawer
                open={openAssetsArchive}
                onOpenChange={setOpenAssetsArchive}
            >
                <DrawerContent className="h-[80vw]! overflow-scroll">
                    {assets === null && <Spinner />}
                    {assets !== null && (
                        <AssetsPreviewArchive
                            onClick={onAssetSelect}
                            data={assets}
                        />
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
