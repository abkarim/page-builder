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

interface Props {
  defaultValue?: string;
  value?: string;
  onValueChange: (color: string) => void;
}

export default function ColorPickerComponent({
  defaultValue,
  value,
  onValueChange,
}: Props): React.JSX.Element {
  const isFirstRender = useIsFirstRender();
  const [color, setColor] = useState(value || defaultValue);
  const tracker = useRef(false);

  useEffect(() => {
    if (!onValueChange || !color || isFirstRender || tracker.current === false)
      return;
    onValueChange(color);
    tracker.current = false;
  }, [color, isFirstRender]);

  return (
    <div>
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
        </ColorPickerContent>
      </ColorPicker>
    </div>
  );
}
