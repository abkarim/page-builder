import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { HTML_HEADERS_LIST, isHeaderElement } from "@/util/HTMLElements";

export interface TagData {
    tagName: string;
}

interface Props {
    data: TagData;
    update: (data: Partial<TagData>) => void;
}

export default function TagEditor({ data, update }: Props): React.JSX.Element {
    return (
        <div className="flex justify-between">
            <Label className="text-sm">Tag</Label>
            <Select
                defaultValue={data.tagName}
                onValueChange={(val) =>
                    update({
                        tagName: val,
                    })
                }
            >
                <SelectTrigger className="bg-background">
                    <SelectValue placeholder="select tag" />
                </SelectTrigger>
                <SelectContent>
                    {isHeaderElement(data.tagName)
                        ? HTML_HEADERS_LIST.map((val) => (
                              <SelectItem value={val}>{val}</SelectItem>
                          ))
                        : ["section", "div"].map((val) => (
                              <SelectItem value={val}>{val}</SelectItem>
                          ))}
                </SelectContent>
            </Select>
        </div>
    );
}
