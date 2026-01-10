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

interface Props {
  size?: number | string;
  unit?: string;
  value?: string;
  onChange: (size: number, unit: string) => void;
}

export default function CSSValueInput({ value, unit, size, onChange }: Props) {
  let cunit = unit;
  let csize = size;
  if (value) {
    const data = getSizeUnitFromCSSValue(value);
    cunit = data.unit;
    csize = data.size;
  }

  return (
    <InputGroup>
      <InputGroupInput
        type="number"
        value={csize}
        onChange={(e) => onChange(parseFloat(e.currentTarget.value), cunit!)}
      />
      <Select
        value={cunit}
        defaultValue="px"
        onValueChange={(value) => onChange(csize as number, value)}
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
