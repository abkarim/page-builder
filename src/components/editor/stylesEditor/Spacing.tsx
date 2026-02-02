import CombinedDetachedInput from "@/components/CombinedDetachedInput";
import { Label } from "@/components/ui/label";

export interface SpacingData {
  margin: string;
  padding: string;
}

export default function Spacing() {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Spacing</h6>
      <div>
        <Label className="text-sm">Margin</Label>
        <CombinedDetachedInput />
      </div>
      <div>
        <Label className="text-sm">Padding</Label>
        <CombinedDetachedInput />
      </div>
    </div>
  );
}
