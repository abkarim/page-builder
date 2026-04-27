import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import DynamicIcon from "../DynamicIcon";

const AvailableScreenSize = [
    {
        name: "Mobile",
        size: "390px",
        icon: "smartphone",
    },
    {
        name: "Tablet",
        size: "768px",
        icon: "tablet",
    },
    {
        name: "Desktop",
        size: "1366px",
        icon: "monitor",
    },
] as const;

export type ScreenSizeName = (typeof AvailableScreenSize)[number]["name"];

export function getActiveScreenSize(
    name: ScreenSizeName,
): (typeof AvailableScreenSize)[number] {
    return AvailableScreenSize.find((s) => s.name === name)!;
}

export function ScreenSizeSwitcher({
    activeSize,
    setActiveSize,
    zoom,
}: {
    activeSize: ScreenSizeName;
    setActiveSize: (val: ScreenSizeName) => void;
    zoom: string;
}) {
    return (
        <div className="flex items-center gap-1 bg-background border rounded-lg p-1">
            <TooltipProvider>
                {AvailableScreenSize.map((screen) => (
                    <Tooltip key={screen.name}>
                        <TooltipTrigger asChild>
                            <Button
                                variant={
                                    activeSize === screen.name
                                        ? "secondary"
                                        : "ghost"
                                }
                                size="icon"
                                className={"h-8 w-8"}
                                onClick={() => setActiveSize(screen.name)}
                            >
                                <DynamicIcon name={screen.icon} size={16} />
                                <span className="sr-only">{screen.name}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {screen.name} ({screen.size})
                            </p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                <Tooltip>
                    <TooltipTrigger className="text-xs">{zoom}</TooltipTrigger>
                    <TooltipContent>
                        <p>Viewing at {zoom}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
