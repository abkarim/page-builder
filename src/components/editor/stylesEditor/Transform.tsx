import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AArrowDownIcon,
  CaseLowerIcon,
  CaseSensitiveIcon,
  CaseUpperIcon,
  TextInitialIcon,
  XIcon,
} from "lucide-react";

export default function Transform(): React.JSX.Element {
  return (
    <div className="space-y-1">
      <h6 className="text-sm">Transform</h6>
      <ToggleGroup type="single" className="bg-background border">
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
  );
}
