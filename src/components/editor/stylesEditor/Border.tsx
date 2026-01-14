import { Label } from "@/components/ui/label";
import CombinedDetachedInput from "../../CombinedDetachedInput";
import ColorPicker from "@/components/ColorPicker";

export default function Border(): React.JSX.Element {
  return (
    <div>
      <h6 className="text-sm">Border</h6>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Color</Label>
        <ColorPicker />
      </div>
      <div>
        <Label className="text-sm">Size</Label>
        <CombinedDetachedInput />
      </div>
      <div>
        <Label className="text-sm">Radius</Label>
        <CombinedDetachedInput />
      </div>
    </div>
  );
}
