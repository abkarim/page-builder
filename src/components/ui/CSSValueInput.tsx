import {
  ABSOLUTE_UNITS,
  FONT_RELATIVE_UNITS,
  getSizeUnitFromCSSValue,
  OTHER_UNITS,
  VIEWPORT_UNITS,
} from "@/util/cssUnits";
import { InputGroup, InputGroupInput } from "./input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useEffect, useRef, useState } from "react";
import { useIsFirstRender } from "@uidotdev/usehooks";

interface Props {
  value?: string;
  onChange: (size: number, unit: string) => void;
}

export default function CSSValueInput({ value, onChange }: Props) {
  const isFirstRender = useIsFirstRender();
  const data = getSizeUnitFromCSSValue(value || "");
  const [size, setSize] = useState(value ? data.size.toString() : "");
  const [unit, setUnit] = useState(data.unit);
  const tracker = useRef(false);

  useEffect(() => {
    if (isFirstRender || tracker.current === false) return;
    const val = parseInt(size);
    /**
     * If size is empty
     * don't do anything
     */
    if (Number.isNaN(val)) return;

    onChange(val, unit);
    tracker.current = false;
  }, [size, unit, isFirstRender]);

  return (
    <InputGroup>
      <InputGroupInput
        type="number"
        value={size}
        onChange={(e) => {
          tracker.current = true;
          setSize(e.currentTarget.value);
        }}
      />
      <Select
        value={unit}
        onValueChange={(unit) => {
          tracker.current = true;
          setUnit(unit);
        }}
      >
        <SelectTrigger className="w-30 text-ellipsis">
          <SelectValue placeholder="unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Absolute Unit</SelectLabel>
            {Object.entries(ABSOLUTE_UNITS).map(([label, unit]) => (
              <SelectItem value={unit} key={unit}>
                {unit}-{label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Font Relative Unit</SelectLabel>
            {Object.entries(FONT_RELATIVE_UNITS).map(([label, unit]) => (
              <SelectItem value={unit} key={unit}>
                {unit}-{label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Viewport Unit</SelectLabel>
            {Object.entries(VIEWPORT_UNITS).map(([label, unit]) => (
              <SelectItem value={unit} key={unit}>
                {unit}-{label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Other Unit</SelectLabel>
            {Object.entries(OTHER_UNITS).map(([label, unit]) => (
              <SelectItem value={unit} key={unit}>
                {unit}-{label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </InputGroup>
  );
}
