import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ContentData {
    content: string;
}

interface Props {
    data: ContentData;
    update: (data: Partial<ContentData>) => void;
}

export default function ContentEditor({
    data,
    update,
}: Props): React.JSX.Element {
    return (
        <div className="space-y-1">
            <Label className="text-sm">Content</Label>
            <Textarea
                className="bg-background"
                defaultValue={data.content}
                onInput={(e) =>
                    update({
                        content: e.currentTarget.value,
                    })
                }
            />
        </div>
    );
}
