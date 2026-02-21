import { Label } from "@/components/ui/label";

export interface ButtonData {
    type: string;
}

interface Props {
    data: ButtonData;
    update: (data: Partial<ButtonData>) => void;
}

export default function ButtonEditor({ data }: Props): React.JSX.Element {
    return (
        <div>
            <Label>Button</Label>
        </div>
    );
}
