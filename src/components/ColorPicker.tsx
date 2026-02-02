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
  return (
    <div>
      <ColorPicker
        defaultFormat="rgb"
        defaultValue={defaultValue}
        value={value || undefined}
        onValueChange={onValueChange}
      >
        <ColorPickerTrigger asChild>
          <ColorPickerSwatch />
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
