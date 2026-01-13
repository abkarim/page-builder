import ColorPickerComponent from "@/components/ColorPicker";
import { Label } from "@/components/ui/label";

export default function Color(): React.JSX.Element {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Color</h6>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Text color</Label>
        <ColorPickerComponent />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Background Color</Label>
        <ColorPickerComponent />
      </div>
    </div>
  );
}
