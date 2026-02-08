import { Checkbox } from "@/components/ui/checkbox";
import CSSValueInput from "@/components/ui/CSSValueInput";
import { Label } from "@/components/ui/label";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export interface SizeData {
  width: string;
  minWidth: string;
  maxWidth: string;
  height: string;
  minHeight: string;
  maxHeight: string;
}

interface Props {
  data: SizeData;
  updateStyle: (data: Partial<SizeData>) => void;
}

export default function Size({ data, updateStyle }: Props) {
  const isFirstRender = useIsFirstRender();
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!isFirstRender) return;

    const advancedOpts = Array.from([
      data.maxHeight,
      data.maxWidth,
      data.minWidth,
      data.minHeight,
    ]);
    const foundAdvancedOpt = advancedOpts.some((v) => v.length !== 0);
    if (foundAdvancedOpt) setShowAdvanced(true);
  }, [data, isFirstRender]);

  return (
    <div className="space-y-1">
      <h6 className="text-sm">Size</h6>
      <div>
        <Label className="text-sm">Width</Label>
        <CSSValueInput
          value={data.width}
          onChange={(size, unit) => updateStyle({ width: `${size}${unit}` })}
        />
      </div>
      <div>
        <Label className="text-sm">Height</Label>
        <CSSValueInput
          value={data.height}
          onChange={(size, unit) => updateStyle({ height: `${size}${unit}` })}
        />
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
            <CSSValueInput
              value={data.minWidth}
              onChange={(size, unit) =>
                updateStyle({ minWidth: `${size}${unit}` })
              }
            />
          </div>
          <div>
            <Label className="text-sm">Min Height</Label>
            <CSSValueInput
              value={data.minHeight}
              onChange={(size, unit) =>
                updateStyle({ minHeight: `${size}${unit}` })
              }
            />
          </div>
          <div>
            <Label className="text-sm">Max Width</Label>
            <CSSValueInput
              value={data.maxWidth}
              onChange={(size, unit) =>
                updateStyle({ maxWidth: `${size}${unit}` })
              }
            />
          </div>
          <div>
            <Label className="text-sm">Max Height</Label>
            <CSSValueInput
              value={data.maxHeight}
              onChange={(size, unit) =>
                updateStyle({ maxHeight: `${size}${unit}` })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
