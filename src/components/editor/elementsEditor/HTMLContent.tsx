import { Label } from "@/components/ui/label";
import { Editor } from "@monaco-editor/react";

export interface HTMLContentData {
    content: string;
}

interface Props {
    data: HTMLContentData;
    update: (data: Partial<HTMLContentData>) => void;
}

export default function HTMLContent({ data }: Props) {
    return (
        <div className="space-y-2">
            <h4>HTML</h4>
            <div className="space-y-1">
                <Label className="text-sm">Content</Label>
                <Editor
                    height="200px"
                    language="html"
                    defaultValue={data.content}
                />
            </div>
        </div>
    );
}
