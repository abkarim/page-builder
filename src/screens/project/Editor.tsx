import Elements from "@/components/editor/Components";
import ElementStylesEditor from "@/components/editor/Index";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { invoke } from "@tauri-apps/api/core";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBlocker, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CanvasMessageData, type EditorMessageData } from "./EditorTypes";

export default function Editor() {
  const { id, name } = useParams();
  const confirmDialog = useConfirmDialog();
  const [content, setContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showElements, setShowElemtns] = useState(true);
  const [showStylesEditor, setShowStylesEditor] = useState(true);
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
       * Handle Insert
       */
      if (type === "insert") {
        /**
         * Open elements tab if close
         */
        setShowElemtns(true);
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
    if (!hasUnsavedChanges) {
      return toast.error("nothing to save");
    }

    try {
      const msg = await invoke<string>("update_project_file_content", {
        uuid: id,
        filename: name,
        newContent: content,
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
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => setShowElemtns((prev) => !prev)}>
          {!showElements ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          Elements
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowStylesEditor((prev) => !prev)}
        >
          Style Editor
          {showStylesEditor ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
        <ElementStylesEditor show={showStylesEditor} />
      </section>
    </section>
  );
}
