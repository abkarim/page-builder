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
import { v4 } from "uuid";
import { Editor } from "@monaco-editor/react";

interface Props {
    onOpenStateChange: (state: boolean) => void;
    onUpdate: () => void;
}

export default function PageSettingsEditor({
    onOpenStateChange,
    onUpdate,
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

    function updateValue(
        val: string,
        hook: keyof Omit<
            PageSettings,
            "css_links" | "js_links" | "custom_css" | "custom_js"
        >,
    ) {
        if (!pageSettings) return;
        const data = structuredClone(pageSettings);
        data[hook] = val;

        setPageSettings(data);
    }

    function updateCustomStyleScript(
        val: string,
        name: "custom_css" | "custom_js",
    ) {
        if (!pageSettings) return;
        const data = structuredClone(pageSettings);
        data[name].value = val;

        data[name].identifier = data[name].identifier || v4();

        setPageSettings(data);
    }

    function updateCSS(val: string, index: number) {
        if (pageSettings === null) return;

        const data = structuredClone(pageSettings);

        // If index not found add a new link
        if (data.css_links.length < index) {
            data.css_links.push({
                link: val,
                identifier: v4(),
                scope: "Page",
            });
        } else {
            data.css_links[index] = {
                ...data.css_links[index],
                link: val,
            };
        }

        setPageSettings(data);
    }

    function updateJS(val: string, index: number) {
        if (pageSettings === null) return;

        const data = structuredClone(pageSettings);

        // If index not found add a new link
        if (data.js_links.length < index) {
            data.js_links.push({
                link: val,
                identifier: v4(),
                scope: "Page",
            });
        } else {
            data.js_links[index] = {
                ...data.js_links[index],
                link: val,
            };
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
            onUpdate();
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

                    <section className="px-4 space-y-2 overflow-scroll">
                        {pageSettings === null && <Spinner />}
                        {pageSettings !== null && (
                            <section className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                        value={pageSettings.title}
                                        onInput={(e) =>
                                            updateValue(
                                                e.currentTarget.value,
                                                "title",
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">CSS</Label>
                                    <div className="flex flex-col gap-2">
                                        {pageSettings.css_links.map(
                                            (css, index) => (
                                                <Input
                                                    key={index}
                                                    value={css.link}
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
                                                    value={js.link}
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
                                <div className="space-y-1">
                                    <Label className="text-xs">
                                        Custom CSS
                                    </Label>
                                    <Editor
                                        height="200px"
                                        language="css"
                                        value={pageSettings.custom_css.value}
                                        onChange={(val) =>
                                            updateCustomStyleScript(
                                                val || "",
                                                "custom_css",
                                            )
                                        }
                                        className="border rounded-sm py-1"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">
                                        Custom JavaScript
                                    </Label>
                                    <Editor
                                        height="200px"
                                        language="javascript"
                                        value={pageSettings.custom_js.value}
                                        onChange={(val) =>
                                            updateCustomStyleScript(
                                                val || "",
                                                "custom_js",
                                            )
                                        }
                                        className="border rounded-sm py-1"
                                    />
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
