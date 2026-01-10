import { Checkbox } from "@/components/ui/checkbox";
import CSSValueInput from "@/components/ui/CSSValueInput";
import { useState } from "react";

export default function Margin() {
  const [combined, setCombined] = useState(true);
  const [data, setData] = useState({
    top: "",
    bottom: "",
    left: "",
    right: "",
    combined: "",
  });

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
      <div className="cursor-pointer">
        <span>Combined&nbsp;</span>
        <Checkbox
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
          <label>Top</label>
          <CSSValueInput
            value={data.top}
            onChange={(size, unit) => onValueChange(size, unit, "top")}
          />
          <label>Bottom</label>
          <CSSValueInput
            value={data.bottom}
            onChange={(size, unit) => onValueChange(size, unit, "bottom")}
          />
          <label>Left</label>
          <CSSValueInput
            value={data.left}
            onChange={(size, unit) => onValueChange(size, unit, "left")}
          />
          <label>Right</label>
          <CSSValueInput
            value={data.right}
            onChange={(size, unit) => onValueChange(size, unit, "right")}
          />
        </div>
      )}
    </div>
  );
}
