import { Label } from "@/components/ui/label";
import Editor from "@monaco-editor/react";

export default function CustomCSS(): React.JSX.Element {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Custom CSS</h6>
      <Editor height="200px" language="css" defaultValue="" />
    </div>
  );
}
