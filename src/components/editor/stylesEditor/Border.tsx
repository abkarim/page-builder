import { Label } from "@/components/ui/label";
import CombinedDetachedInput from "../../CombinedDetachedInput";
import ColorPicker from "@/components/ColorPicker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface BorderData {
  borderColor: string;
  borderWidth: string;
  borderStyle: string;
  borderRadius: string;
}

export default function Border({
  data,
  updateStyle,
}: {
  data: BorderData;
  updateStyle: (data: Partial<BorderData>) => void;
}): React.JSX.Element {
  return (
    <div>
      <h6 className="text-sm">Border</h6>
      <div>
        <Label className="text-sm">Style</Label>
        <ToggleGroup
          type="single"
          className="bg-background border"
          defaultValue={data.borderStyle}
          onValueChange={(value) =>
            updateStyle({
              borderStyle: value,
            })
          }
        >
          <ToggleGroupItem value="">None</ToggleGroupItem>
          <ToggleGroupItem value="dotted">Dotted</ToggleGroupItem>
          <ToggleGroupItem value="dashed">Dashed</ToggleGroupItem>
          <ToggleGroupItem value="solid">Solid</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Color</Label>
        <ColorPicker
          defaultValue={data.borderColor}
          onValueChange={(color) =>
            updateStyle({
              borderColor: color,
            })
          }
        />
      </div>
      <div>
        <Label className="text-sm">Size</Label>
        <CombinedDetachedInput
          value={data.borderWidth}
          onUpdate={(val) =>
            updateStyle({
              borderWidth: val,
            })
          }
        />
      </div>
      <div>
        <Label className="text-sm">Radius</Label>
        <CombinedDetachedInput
          value={data.borderRadius}
          onUpdate={(val) =>
            updateStyle({
              borderRadius: val,
            })
          }
        />
      </div>
    </div>
  );
}
