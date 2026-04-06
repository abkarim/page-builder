import {
    ColorPicker,
    ColorPickerAlphaSlider,
    ColorPickerArea,
    ColorPickerContent,
    ColorPickerEyeDropper,
    ColorPickerFormatSelect,
    ColorPickerHueSlider,
    ColorPickerInput,
    ColorPickerSwatch,
    ColorPickerTrigger,
} from "@/components/ui/color-picker";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { ProjectConfiguration } from "src-tauri/bindings/ProjectConfiguration";
import { getProjectDataConfiguration } from "@/util/projectSpecific/projectData";
import { Label } from "./ui/label";

interface Props {
    defaultValue?: string;
    value?: string;
    onValueChange: (color: string) => void;
    showAvailableColors?: boolean;
}

export default function ColorPickerComponent({
    defaultValue,
    value,
    onValueChange,
    showAvailableColors = true,
}: Props): React.JSX.Element {
    const isFirstRender = useIsFirstRender();
    const [color, setColor] = useState(value || defaultValue);
    const tracker = useRef(false);
    const [availableColors, setAvailableColors] = useState<
        ProjectConfiguration["color"]
    >([]);

    async function getAvailableColors() {
        const data = await getProjectDataConfiguration();

        setAvailableColors(data.configuration.color);
    }

    useEffect(() => {
        if (!showAvailableColors) return;

        getAvailableColors();
    }, [showAvailableColors]);

    useEffect(() => {
        if (
            !onValueChange ||
            !color ||
            isFirstRender ||
            tracker.current === false
        )
            return;
        onValueChange(color);
        tracker.current = false;
    }, [color, isFirstRender]);

    return (
        <ColorPicker
            defaultFormat="rgb"
            defaultValue={color}
            onValueChange={(color) => {
                tracker.current = true;
                setColor(color);
            }}
        >
            <ColorPickerTrigger asChild>
                <ColorPickerSwatch color={color} />
            </ColorPickerTrigger>
            <ColorPickerContent>
                <ColorPickerArea />
                <div className="flex items-center gap-2">
                    <ColorPickerEyeDropper />
                    <div className="flex flex-1 flex-col gap-2">
                        <ColorPickerHueSlider />
                        <ColorPickerAlphaSlider />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ColorPickerFormatSelect />
                    <ColorPickerInput />
                </div>
                {showAvailableColors && (
                    <section className="space-y-2">
                        <Label>Project colors</Label>
                        <div className="flex items-center gap-2">
                            {availableColors.map((color, index) => (
                                <ColorPickerSwatch
                                    key={index}
                                    title={color.name}
                                    color={color.value}
                                    onClick={() => {
                                        tracker.current = true;
                                        setColor(color.value);
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </ColorPickerContent>
        </ColorPicker>
    );
}
