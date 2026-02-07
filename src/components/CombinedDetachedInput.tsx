import { Checkbox } from "@/components/ui/checkbox";
import CSSValueInput from "@/components/ui/CSSValueInput";
import { Label } from "@/components/ui/label";
import { getBoxSides, stringifyBoxSides } from "@/util/cssUnits";
import { useEffect, useId, useState } from "react";
import { useIsFirstRender } from "@uidotdev/usehooks";

export default function CombinedDetachedInput({
  value,
  onUpdate,
}: {
  value: string;
  onUpdate: (value: string) => void;
}) {
  const isFirstRender = useIsFirstRender();
  const { top, bottom, left, right } = getBoxSides(value);
  const [combined, setCombined] = useState(value.split(" ").length === 1);
  const [data, setData] = useState({
    top,
    bottom,
    left,
    right,
    combined: value.split(" ")[0],
    changes: false,
  });
  const id = useId();

  function onValueChange(
    size: number,
    unit: string,
    position: keyof typeof data,
  ) {
    setData((prev) => {
      return { ...prev, changes: true, [position]: `${size}${unit}` };
    });
  }

  useEffect(() => {
    /**
     * Ignore on first render
     */
    if (isFirstRender || data.changes === false) return;

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
  }, [data, combined, isFirstRender]);

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
