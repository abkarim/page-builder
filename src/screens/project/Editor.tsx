import Elements from "@/components/editor/Components";
import ElementStylesEditor, {
    ElementStylesEditorProps,
} from "@/components/editor/Index";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { invoke } from "@tauri-apps/api/core";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    RedoIcon,
    SettingsIcon,
    UndoIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBlocker, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CanvasMessageData, type EditorMessageData } from "./EditorTypes";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ElementEditor, {
    ElementEditorProps,
} from "@/components/editor/elementsEditor/Index";
import {
    getActiveScreenSize,
    ScreenSizeName,
    ScreenSizeSwitcher,
} from "@/components/editor/ScreenSizeSwitcher";
import PageSettingsEditor from "@/components/editor/PageSettingsEditor";

export default function Editor() {
    const { id, name } = useParams();
    const confirmDialog = useConfirmDialog();
    const [showPageSettings, setShowPageSettings] = useState(false);
    const [content, setContent] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [availableUndo, setAvailableUndo] = useState(0);
    const [availableRedo, setAvailableRedo] = useState(0);
    const [showElements, setShowElements] = useState(true);
    const [showStylesEditor, setShowStylesEditor] = useState(true);
    const [selectedElementInfo, setSelectedElementInfo] = useState<{
        tagName: string;
        componentName: string;
        stylesData: ElementStylesEditorProps["data"];
        elementData: ElementEditorProps["data"];
        xPath: string;
    } | null>(null);
    const editorRef = useRef<HTMLIFrameElement>(null);
    const [activeSizeName, setActiveSizeName] =
        useState<ScreenSizeName>("Large");
    const [zoom, setZoom] = useState("");

    const activeConfig = getActiveScreenSize(activeSizeName);

    async function getContent() {
        if (!id || !name) {
            return toast.error("invalid project file");
        }

        try {
            const content = await invoke<string>("get_project_file_content", {
                uuid: id,
                name,
            });

            setContent(content);
        } catch (err) {
            toast.error(err as string);
        }
    }

    useEffect(() => {
        getContent();
    }, []);

    /**
     * Block navigation if unsaved changes is detected
     */
    const blocker = useBlocker(() => {
        return hasUnsavedChanges;
    });

    useEffect(() => {
        if (blocker.state === "blocked") {
            (async () => {
                const result = await confirmDialog({
                    title: "You have unsaved changes",
                    description: "Are you sure to discard these changes?",
                });

                if (result) {
                    blocker.proceed();
                } else {
                    blocker.reset();
                }
            })();
        }
    }, [blocker]);

    /**
     * Get messages from editor iframe
     */
    useEffect(() => {
        const handleMessage = (event: MessageEvent<EditorMessageData>) => {
            const { type, payload } = event.data;

            /**
             * Handle style editor
             */
            if (type === "styleEditor") {
                /**
                 * Show styleEditor
                 */
                setShowStylesEditor(true);

                if (payload?.tagName !== undefined) {
                    setSelectedElementInfo({
                        tagName: payload.tagName as string,
                        componentName: payload.componentName as string,
                        stylesData:
                            payload.stylesData as ElementStylesEditorProps["data"],
                        elementData:
                            payload.elementData as ElementEditorProps["data"],
                        xPath: payload.xpath as string,
                    });
                }
                return;
            }

            /**
             * Handle Insert
             */
            if (type === "insert") {
                /**
                 * Open elements tab if close
                 */
                setShowElements(true);
                return;
            }

            /**
             * Update edit count
             */
            if (type === "historySync") {
                setHasUnsavedChanges(true);
                if (
                    payload?.availableUndo !== undefined &&
                    payload?.availableRedo !== undefined
                ) {
                    setAvailableUndo(payload.availableUndo as number);
                    setAvailableRedo(payload.availableRedo as number);
                }

                return;
            }
        };

        window.addEventListener("message", handleMessage);

        return () => window.removeEventListener("message", handleMessage);
    }, []);

    function calculateZoom() {
        const width = editorRef.current!.getBoundingClientRect().width;

        const targetWidth = parseInt(activeConfig.size);

        if (targetWidth > 0) {
            const zoomPercentage = Math.round((width / targetWidth) * 100);
            setZoom(`${zoomPercentage}%`);
        }
    }

    /**
     * Calculate zoom
     */
    useEffect(() => {
        const element = editorRef.current;
        if (!element) return;

        const observer = new ResizeObserver(calculateZoom);

        observer.observe(element);

        return () => observer.disconnect();
    }, [editorRef, activeSizeName]);

    /**
     * Send message to Editor Iframe
     */
    function sendMessageToCanvas(data: CanvasMessageData) {
        if (!editorRef?.current || !editorRef?.current?.contentWindow) return;

        const { postMessage } = editorRef.current.contentWindow;

        postMessage(data, "*");
    }

    /**
     * Save changes
     */
    async function saveChanges() {
        /**
         * Only allow to save if we have unsaved changes
         */
        if (!hasUnsavedChanges || availableUndo === 0) {
            return toast.error("nothing to save");
        }

        try {
            const iframeDoc = (
                editorRef.current?.contentDocument ||
                editorRef.current?.contentWindow?.document
            )?.documentElement.outerHTML;

            const msg = await invoke<string>("update_project_file_content", {
                uuid: id,
                filename: name,
                newContent: iframeDoc,
            });
            setHasUnsavedChanges(false);
            toast.success(msg);
        } catch (err) {
            toast.error(err as string);
        }
    }

    return (
        <section className="h-full">
            <div className="flex justify-between items-center gap-2">
                <p>Editing: {name}</p>
                <Button className="ml-auto" onClick={saveChanges}>
                    Save
                </Button>
                <Button
                    onClick={() => setShowPageSettings(true)}
                    variant="secondary"
                >
                    <SettingsIcon /> Settings
                </Button>
            </div>

            <section className="h-screen pt-2.5 sticky top-0 pb-15">
                <div className="flex justify-between items-center">
                    <Button
                        variant="secondary"
                        onClick={() => setShowElements((prev) => !prev)}
                    >
                        {!showElements ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                        Elements
                    </Button>
                    <div className="flex items-center gap-2 ml-auto">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={"secondary"}
                                    onClick={() =>
                                        sendMessageToCanvas({ type: "undo" })
                                    }
                                    disabled={availableUndo === 0}
                                    className="border"
                                >
                                    <UndoIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Undo</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={"secondary"}
                                    disabled={availableRedo === 0}
                                    onClick={() =>
                                        sendMessageToCanvas({ type: "redo" })
                                    }
                                    className="border"
                                >
                                    <RedoIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Redo</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="mr-auto ml-10">
                        <ScreenSizeSwitcher
                            activeSize={activeSizeName}
                            setActiveSize={setActiveSizeName}
                            zoom={zoom}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => setShowStylesEditor((prev) => !prev)}
                    >
                        Editor
                        {showStylesEditor ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </Button>
                </div>
                <section className="flex gap-2 my-1 h-full w-full @container">
                    <Elements
                        show={showElements}
                        onElementClick={(elementType, data) => {
                            sendMessageToCanvas({
                                type: elementType,
                                payload: {
                                    type: "insert",
                                    data,
                                },
                            });
                        }}
                    />
                    <div
                        className="w-full ml-auto mr-auto"
                        style={{
                            width: activeConfig.size,
                            height: "100%",
                            // If parent is smaller than 767px, scale it down to fit
                            transform: `scale(min(1, calc(100cqw / ${parseInt(activeConfig.size)})))`,
                        }}
                    >
                        <iframe
                            ref={editorRef}
                            srcDoc={content}
                            className="w-full h-full outline"
                        />
                    </div>
                    {selectedElementInfo && showStylesEditor && (
                        <Tabs
                            defaultValue="styles"
                            key={selectedElementInfo.xPath}
                            className="max-w-60 w-full bg-accent rounded p-2 overflow-scroll"
                        >
                            <TabsList className="border bg-background">
                                <TabsTrigger value="styles">Styles</TabsTrigger>
                                <TabsTrigger value="element">
                                    Element
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="styles">
                                <ElementStylesEditor
                                    component={selectedElementInfo.tagName.toLowerCase()}
                                    data={selectedElementInfo.stylesData}
                                    update={(type, styles) =>
                                        sendMessageToCanvas({
                                            type: "style",
                                            styleData: {
                                                type,
                                                data: styles,
                                            },
                                        })
                                    }
                                />
                            </TabsContent>
                            <TabsContent value="element">
                                <ElementEditor
                                    component={
                                        selectedElementInfo.componentName
                                    }
                                    tagName={selectedElementInfo.tagName.toLowerCase()}
                                    data={selectedElementInfo.elementData}
                                    update={(type, edits) =>
                                        sendMessageToCanvas({
                                            type: "element_edits",
                                            elementEditsData: {
                                                type,
                                                data: edits,
                                            },
                                        })
                                    }
                                />
                            </TabsContent>
                        </Tabs>
                    )}
                </section>
                {showPageSettings && (
                    <PageSettingsEditor
                        onOpenStateChange={setShowPageSettings}
                    />
                )}
            </section>
        </section>
    );
}
