import { Checkbox } from "@/components/ui/checkbox";
import CSSValueInput from "@/components/ui/CSSValueInput";
import { Label } from "@/components/ui/label";
import { getBoxSides, stringifyBoxSides } from "@/util/cssUnits";
import { useEffect, useId, useState } from "react";

export default function CombinedDetachedInput({
  value,
  onUpdate,
}: {
  value: string;
  onUpdate: (value: string) => void;
}) {
  const { top, bottom, left, right } = getBoxSides(value);
  const [combined, setCombined] = useState(false);
  const [data, setData] = useState({
    top: "",
    bottom: "",
    left: "",
    right: "",
    combined: "",
    init: false,
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

  useEffect(() => {
    /**
     * Ignore on first render
     */
    if (data.init === false) return;

    if (combined) {
      onUpdate(data.combined);
      return;
    }

    onUpdate(
      stringifyBoxSides({
        top: data.top,
        bottom: data.bottom,
        left: data.left,
        right: data.right,
      }),
    );
  }, [data, combined]);

  useEffect(() => {
    setCombined(value.split(" ").length === 1);
    setData({
      top,
      bottom,
      left,
      right,
      combined: value.split(" ")[0],
      init: true,
    });
  }, [top, bottom, left, right]);

  return (
    <div>
      <div className="cursor-pointer flex items-center justify-end gap-2 mb-1">
        <Label className="text-xs" htmlFor={id}>
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
