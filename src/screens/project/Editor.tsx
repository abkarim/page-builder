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

export default function Editor() {
    const { id, name } = useParams();
    const confirmDialog = useConfirmDialog();
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
            <div className="flex justify-between items-center">
                <p>Editing: {name}</p>
                <Button onClick={saveChanges}>Save</Button>
            </div>
            <div className="flex justify-between items-center mt-1">
                <Button
                    variant="secondary"
                    onClick={() => setShowElements((prev) => !prev)}
                >
                    {!showElements ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    Elements
                </Button>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={"secondary"}
                                onClick={() =>
                                    sendMessageToCanvas({ type: "undo" })
                                }
                                disabled={availableUndo === 0}
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
                            >
                                <RedoIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Redo</p>
                        </TooltipContent>
                    </Tooltip>
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

            <section className="flex items-stretch gap-2 my-1 h-full">
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
                <div className="w-full">
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
                        className="max-w-60 w-full bg-accent rounded p-2"
                    >
                        <TabsList className="border bg-background">
                            <TabsTrigger value="styles">Styles</TabsTrigger>
                            <TabsTrigger value="element">Element</TabsTrigger>
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
                                component={selectedElementInfo.componentName}
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
        </section>
    );
}
