import { Label } from "@/components/ui/label";
import CombinedDetachedInput from "./CombinedDetachedInput";
import ColorPicker from "@/components/ColorPicker";

export default function Border(): React.JSX.Element {
  return (
    <div>
      <h6 className="text-sm">Border</h6>
      <div className="space-y-1">
        <Label className="text-sm">Color</Label>
        <ColorPicker />
      </div>
      <CombinedDetachedInput />
    </div>
  );
}
