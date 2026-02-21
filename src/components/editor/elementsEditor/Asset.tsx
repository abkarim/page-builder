import { Label } from "@/components/ui/label";

export interface AssetData {
    src: string;
}

interface Props {
    data: AssetData;
    update: (data: Partial<AssetData>) => void;
}

export default function AssetEditor({ data }: Props): React.JSX.Element {
    return (
        <div>
            <Label>Asset</Label>
        </div>
    );
}
