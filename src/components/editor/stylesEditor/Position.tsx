import { Label } from "@/components/ui/label";
import CombinedDetachedInput from "../../CombinedDetachedInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface PositionData {
  position: string;
  inset: string;
  zIndex: string;
}

interface Props {
  data: PositionData;
  updateStyle: (data: Partial<PositionData>) => void;
}

export default function Position({
  data,
  updateStyle,
}: Props): React.JSX.Element {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Position</h6>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Type</Label>
        <Select
          defaultValue={data.position}
          onValueChange={(value) =>
            updateStyle({
              position: value,
            })
          }
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="static">Default</SelectItem>
            <SelectItem value="relative">Relative</SelectItem>
            <SelectItem value="absolute">Absolute</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="sticky">Sticky</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-sm">Value</Label>
        <CombinedDetachedInput
          value={data.inset}
          onUpdate={(value) =>
            updateStyle({
              inset: value,
            })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Z-Index</Label>
        <Input
          type="number"
          defaultValue={data.zIndex}
          onChange={(e) =>
            updateStyle({
              zIndex: e.currentTarget.value,
            })
          }
          className="w-30"
        />
      </div>
    </div>
  );
}
