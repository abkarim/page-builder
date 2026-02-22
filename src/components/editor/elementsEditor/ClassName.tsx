import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface ClassNameData {
    className: string[];
}

interface Props {
    data: ClassNameData;
    update: (data: Partial<ClassNameData>) => void;
}

export default function ClassNameEditor({
    data,
    update,
}: Props): React.JSX.Element {
    const isFirstRender = useIsFirstRender();
    const [classNames, setClassNames] = useState(data.className);
    const [className, setClassName] = useState("");

    function removeClassName(index: number) {
        setClassNames((prev) => {
            prev.splice(index, 1);
            return [...prev];
        });
    }

    function addClassName() {
        if (className.trim().length === 0) {
            toast.error("class name can't be empty");
            return;
        }

        setClassNames((prev) => [className, ...prev]);
        setClassName("");
    }

    useEffect(() => {
        if (isFirstRender) return;

        update({
            className: classNames,
        });
    }, [classNames, isFirstRender]);

    return (
        <div className="space-y-1">
            <Label className="text-sm">Class Name</Label>
            <div className="flex gap-2 flex-wrap">
                {classNames.map((cl, i) => (
                    <Badge variant="outline" className="bg-background text-sm">
                        {cl}
                        <Button
                            variant="destructive"
                            className="m-1"
                            onClick={() => removeClassName(i)}
                        >
                            <TrashIcon />
                        </Button>
                    </Badge>
                ))}
            </div>
            <div className="flex justify-between gap-1">
                <Input
                    value={className}
                    onInput={(e) => setClassName(e.currentTarget.value)}
                    placeholder="input class"
                />
                <Button className="text-xs" onClick={addClassName}>
                    Add
                </Button>
            </div>
        </div>
    );
}
