import ColorPickerComponent from "@/components/ColorPicker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  TextAlignCenterIcon,
  TextAlignEndIcon,
  TextAlignJustifyIcon,
  TextAlignStartIcon,
} from "lucide-react";
import {
  AArrowDownIcon,
  CaseLowerIcon,
  CaseSensitiveIcon,
  CaseUpperIcon,
  TextInitialIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export interface TextData {
  textAlign: string;
  textTransform: string;
  color: string;
  fontFamily: string;
}

export default function Text({
  data,
  updateStyle,
}: {
  data: TextData;
  updateStyle: (data: TextData) => void;
}): React.JSX.Element {
  const {
    textAlign,
    textTransform,
    color: textColor,
    fontFamily: family,
  } = data;

  const [align, setAlign] = useState(textAlign);
  const [transform, setTransform] = useState(textTransform);
  const [color, setColor] = useState(textColor);
  const [fontFamily, setFontFamily] = useState(family);

  useEffect(() => {
    updateStyle({
      textAlign: align,
      color: color,
      fontFamily,
      textTransform: transform,
    });
  }, [align, transform, color, fontFamily]);

  return (
    <div className="space-y-1">
      <h6 className="text-sm">Text</h6>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Align</Label>
        <ToggleGroup
          type="single"
          className="bg-background border"
          defaultValue={align}
          onValueChange={(value) => setAlign(value)}
        >
          <ToggleGroupItem value="left">
            <TextAlignStartIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <TextAlignCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <TextAlignEndIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="justify">
            <TextAlignJustifyIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Color</Label>
        <ColorPickerComponent
          defaultValue={color}
          onValueChange={(value) => setColor(value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-sm">Transform</Label>
        <ToggleGroup
          type="single"
          className="bg-background border"
          value={transform}
          onValueChange={(value) => setTransform(value)}
        >
          <ToggleGroupItem value="none">
            <XIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="capitalize">
            <CaseSensitiveIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="uppercase">
            <CaseUpperIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="lowercase">
            <CaseLowerIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="initial">
            <TextInitialIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="inherit">
            <AArrowDownIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Font Family</Label>
        <Select
          value={fontFamily}
          onValueChange={(value) => setFontFamily(value)}
        >
          <SelectTrigger className="bg-background w-30">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="demo">Demo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
