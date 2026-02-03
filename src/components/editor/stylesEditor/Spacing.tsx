import CombinedDetachedInput from "@/components/CombinedDetachedInput";
import { Label } from "@/components/ui/label";

export interface SpacingData {
  margin: string;
  padding: string;
}

export default function Spacing({
  data,
  updateStyle,
}: {
  data: SpacingData;
  updateStyle: (data: Partial<SpacingData>) => void;
}) {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Spacing</h6>
      <div>
        <Label className="text-sm">Margin</Label>
        <CombinedDetachedInput
          value={data.margin}
          onUpdate={(value) =>
            updateStyle({
              margin: value,
            })
          }
        />
      </div>
      <div>
        <Label className="text-sm">Padding</Label>
        <CombinedDetachedInput
          value={data.padding}
          onUpdate={(value) =>
            updateStyle({
              padding: value,
            })
          }
        />
      </div>
    </div>
  );
}
