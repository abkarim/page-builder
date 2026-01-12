import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  TextAlignCenterIcon,
  TextAlignEndIcon,
  TextAlignJustifyIcon,
  TextAlignStartIcon,
} from "lucide-react";

export default function Align() {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Align</h6>
      <ToggleGroup type="single" className="bg-background border">
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
  );
}
