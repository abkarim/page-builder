import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface AssetData {
    src: string;
}

interface Props {
    data: AssetData;
    update: (data: Partial<AssetData>) => void;
}

export default function AssetEditor({
    data,
    update,
}: Props): React.JSX.Element {
    return (
        <div>
            <Label className="text-sm">Asset</Label>
            <div>
                <Label className="text-xs">Src</Label>
                <Textarea
                    className="bg-background"
                    defaultValue={data.src}
                    onInput={(e) =>
                        update({
                            src: e.currentTarget.value,
                        })
                    }
                />
            </div>
        </div>
    );
}
