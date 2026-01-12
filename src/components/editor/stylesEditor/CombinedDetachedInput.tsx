import { Checkbox } from "@/components/ui/checkbox";
import CSSValueInput from "@/components/ui/CSSValueInput";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";

export default function CombinedDetachedInput() {
  const [combined, setCombined] = useState(true);
  const [data, setData] = useState({
    top: "",
    bottom: "",
    left: "",
    right: "",
    combined: "",
  });
  const id = useId();

  function onValueChange(
    size: number,
    unit: string,
    position: keyof typeof data,
  ) {
    setData((prev) => {
      return { ...prev, [position]: `${size}${unit}` };
    });
  }

  return (
    <div>
      <div className="cursor-pointer flex items-center gap-2 mb-1">
        <Label className="text-sm" htmlFor={id}>
          Combined&nbsp;
        </Label>
        <Checkbox
          id={id}
          checked={combined}
          onClick={() => setCombined((prev) => !prev)}
        />
      </div>
      {combined ? (
        <CSSValueInput
          value={data.combined}
          onChange={(size, unit) => onValueChange(size, unit, "combined")}
        />
      ) : (
        <div>
          <label className="text-sm">Top</label>
          <CSSValueInput
            value={data.top}
            onChange={(size, unit) => onValueChange(size, unit, "top")}
          />
          <label className="text-sm">Bottom</label>
          <CSSValueInput
            value={data.bottom}
            onChange={(size, unit) => onValueChange(size, unit, "bottom")}
          />
          <label className="text-sm">Left</label>
          <CSSValueInput
            value={data.left}
            onChange={(size, unit) => onValueChange(size, unit, "left")}
          />
          <label className="text-sm">Right</label>
          <CSSValueInput
            value={data.right}
            onChange={(size, unit) => onValueChange(size, unit, "right")}
          />
        </div>
      )}
    </div>
  );
}
