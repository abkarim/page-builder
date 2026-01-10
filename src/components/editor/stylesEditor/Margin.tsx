import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Margin() {
  const [data, setData] = useState({
    top: {
      value: "",
      unit: "px",
    },
    bottom: {
      value: "",
      unit: "px",
    },
    left: {
      value: "",
      unit: "px",
    },
    right: {
      value: "",
      unit: "px",
    },
    combined: {
      value: "",
      unit: "px",
      enabled: true,
    },
  });

  const toggleCombined = () => {
    setData((prev) => {
      return {
        ...prev,
        combined: { ...prev.combined, enabled: !prev.combined.enabled },
      };
    });
  };

  return (
    <div>
      <div className="cursor-pointer">
        <span onClick={toggleCombined}>Combined&nbsp;</span>
        <Checkbox checked={data.combined.enabled} onClick={toggleCombined} />
      </div>
      {data.combined.enabled ? (
        <Input />
      ) : (
        <div>
          <label>Top</label>
          <Input />
          <label>Bottom</label>
          <Input />
          <label>Left</label>
          <Input />
          <label>Right</label>
          <Input />
        </div>
      )}
    </div>
  );
}
