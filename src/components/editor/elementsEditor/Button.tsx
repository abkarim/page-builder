import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface ButtonData {
    type: string;
}

interface Props {
    data: ButtonData;
    update: (data: Partial<ButtonData>) => void;
}

export default function ButtonEditor({
    data,
    update,
}: Props): React.JSX.Element {
    return (
        <div className="flex justify-between">
            <Label className="text-xs">Type</Label>
            <Select
                defaultValue={data.type}
                onValueChange={(val) =>
                    update({
                        type: val,
                    })
                }
            >
                <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Button type" />
                </SelectTrigger>
                <SelectContent>
                    {["button", "submit", "reset"].map((t) => (
                        <SelectItem key={t} value={t}>
                            {t}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
