import { toPascalCase } from "@/util/strings/case";
import * as Icons from "lucide-react";

interface Props {
    name: string;
    color?: string;
    size?: number;
}

export default function DynamicIcon({
    name,
    color,
    size,
}: Props): React.JSX.Element {
    const iconName = toPascalCase(name) as keyof typeof Icons;
    console.log({ iconName });

    const IconComponent = Icons[iconName] as React.ElementType;

    if (!IconComponent) {
        return <Icons.HelpCircle color={color} size={size} />;
    }

    return <IconComponent color={color} size={size} />;
}
