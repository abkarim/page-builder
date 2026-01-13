import CSSValueInput from "@/components/ui/CSSValueInput";
import { Label } from "@/components/ui/label";

export default function Size() {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Size</h6>
      <div>
        <Label className="text-sm">Width</Label>
        <CSSValueInput onChange={() => {}} />
      </div>
      <div>
        <Label className="text-sm">Height</Label>
        <CSSValueInput onChange={() => {}} />
      </div>
      <div>
        <Label className="text-sm">Min Width</Label>
        <CSSValueInput onChange={() => {}} />
      </div>
      <div>
        <Label className="text-sm">Min Height</Label>
        <CSSValueInput onChange={() => {}} />
      </div>
      <div>
        <Label className="text-sm">Max Width</Label>
        <CSSValueInput onChange={() => {}} />
      </div>
      <div>
        <Label className="text-sm">Max Height</Label>
        <CSSValueInput onChange={() => {}} />
      </div>
    </div>
  );
}
