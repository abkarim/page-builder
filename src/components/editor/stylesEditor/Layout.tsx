import CSSValueInput from "@/components/ui/CSSValueInput";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AlignCenterVerticalIcon,
  AlignEndHorizontalIcon,
  AlignEndVerticalIcon,
  AlignHorizontalDistributeCenterIcon,
  AlignHorizontalSpaceAroundIcon,
  AlignHorizontalSpaceBetween,
  AlignStartHorizontalIcon,
  AlignStartVerticalIcon,
  AlignVerticalSpaceAroundIcon,
  Columns3Icon,
  Columns4Icon,
  Rows3Icon,
  TextAlignJustifyIcon,
  TextWrapIcon,
} from "lucide-react";

export default function Layout(): React.JSX.Element {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Layout</h6>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Direction</Label>
        <ToggleGroup type="single" className="bg-background border">
          <ToggleGroupItem value="column">
            <Columns3Icon />
          </ToggleGroupItem>
          <ToggleGroupItem value="row">
            <Rows3Icon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Wrap</Label>
        <ToggleGroup type="single" className="bg-background border">
          <ToggleGroupItem value="wrap">
            <TextWrapIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="nowrap">
            <TextAlignJustifyIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <Label className="text-sm">Justify</Label>
        <ToggleGroup type="single" className="bg-background border">
          <ToggleGroupItem value="flex-start">
            <AlignStartVerticalIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <AlignCenterVerticalIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="flex-end">
            <AlignEndVerticalIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="space-evenly">
            <AlignHorizontalDistributeCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="space-between">
            <AlignHorizontalSpaceBetween />
          </ToggleGroupItem>
          <ToggleGroupItem value="space-around">
            <AlignHorizontalSpaceAroundIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <Label className="text-sm">Align</Label>
        <ToggleGroup type="single" className="bg-background border">
          <ToggleGroupItem value="flex-start">
            <AlignStartHorizontalIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <AlignVerticalSpaceAroundIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="flex-end">
            <AlignEndHorizontalIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="space-between">
            <AlignHorizontalSpaceBetween className="rotate-90" />
          </ToggleGroupItem>
          <ToggleGroupItem value="stretch">
            <Columns4Icon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <Label className="text-sm">Gap</Label>
        <CSSValueInput onChange={() => {}} />
      </div>
    </div>
  );
}
