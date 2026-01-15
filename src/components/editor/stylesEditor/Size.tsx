import { Checkbox } from "@/components/ui/checkbox";
import CSSValueInput from "@/components/ui/CSSValueInput";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Size() {
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      <div className="flex items-center gap-1 justify-start">
        <Label htmlFor="show-advanced-size" className="text-xs">
          Show advanced
        </Label>
        <Checkbox
          id="show-advanced-size"
          checked={showAdvanced}
          onCheckedChange={() => setShowAdvanced((prev) => !prev)}
        />
      </div>
      {showAdvanced && (
        <>
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
        </>
      )}
    </div>
  );
}
