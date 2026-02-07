import ColorPickerComponent from "@/components/ColorPicker";
import { Label } from "@/components/ui/label";

export interface ColorData {
  background: string;
}

interface Props {
  data: ColorData;
  updateStyle: (data: Partial<ColorData>) => void;
}

export default function Color({ data, updateStyle }: Props): React.JSX.Element {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Color</h6>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Background Color</Label>
        <ColorPickerComponent
          defaultValue={data.background}
          onValueChange={(color) =>
            updateStyle({
              background: color,
            })
          }
        />
      </div>
    </div>
  );
}
