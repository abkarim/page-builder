import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import { Spinner } from "../ui/spinner";
import { type PageSettings } from "src-tauri/bindings/PageSettings";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "../ui/button";

interface Props {
    onOpenStateChange: (state: boolean) => void;
}

export default function PageSettingsEditor({
    onOpenStateChange,
}: Props): React.JSX.Element {
    const [pageSettings, setPageSettings] = useState<PageSettings | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function getPageSettings() {
        try {
            const data = await invoke<PageSettings>(
                "get_current_page_settings",
            );
            setPageSettings(data);
        } catch (err) {
            toast.error(err as string);
        }
    }

    function updateCSS(val: string, index: number) {
        if (pageSettings === null) return;

        const data = structuredClone(pageSettings);

        // If index not found add a new link
        if (data.css_links.length < index) {
            data.css_links.push(val);
        } else {
            data.css_links[index] = val;
        }

        setPageSettings(data);
    }

    function updateJS(val: string, index: number) {
        if (pageSettings === null) return;

        const data = structuredClone(pageSettings);

        // If index not found add a new link
        if (data.js_links.length < index) {
            data.js_links.push(val);
        } else {
            data.js_links[index] = val;
        }

        setPageSettings(data);
    }

    async function savePageSettings() {
        setIsLoading(true);
        try {
            const data = await invoke<string>("save_current_page_settings", {
                settings: pageSettings,
            });
            toast.success(data);
            onOpenStateChange(false);
        } catch (err) {
            toast.error(err as string);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getPageSettings();
    }, []);

    return (
        <section>
            <Sheet open={true} onOpenChange={onOpenStateChange}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Page Settings</SheetTitle>
                    </SheetHeader>

                    <section className="px-4 space-y-2">
                        {pageSettings === null && <Spinner />}
                        {pageSettings !== null && (
                            <section className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Title</Label>
                                    <Input value={pageSettings.title} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">CSS</Label>
                                    <div className="flex flex-col gap-2">
                                        {pageSettings.css_links.map(
                                            (css, index) => (
                                                <Input
                                                    key={index}
                                                    value={css}
                                                    onInput={(e) =>
                                                        updateCSS(
                                                            e.currentTarget
                                                                .value,
                                                            index,
                                                        )
                                                    }
                                                />
                                            ),
                                        )}
                                        <Button
                                            onClick={() => {
                                                updateCSS(
                                                    "",
                                                    pageSettings.css_links
                                                        .length + 1,
                                                );
                                            }}
                                            className="ml-auto"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">JS</Label>
                                    <div className="flex flex-col gap-2">
                                        {pageSettings.js_links.map(
                                            (js, index) => (
                                                <Input
                                                    key={index}
                                                    value={js}
                                                    onInput={(e) =>
                                                        updateJS(
                                                            e.currentTarget
                                                                .value,
                                                            index,
                                                        )
                                                    }
                                                />
                                            ),
                                        )}
                                        <Button
                                            className="ml-auto"
                                            onClick={() => {
                                                updateJS(
                                                    "",
                                                    pageSettings.js_links
                                                        .length + 1,
                                                );
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </section>

                    <SheetFooter>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="destructive"
                                onClick={() => onOpenStateChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isLoading}
                                onClick={savePageSettings}
                            >
                                {isLoading && <Spinner />} Save
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </section>
    );
}
