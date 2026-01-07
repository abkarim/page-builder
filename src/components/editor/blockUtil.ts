import { Block } from "./block";

export function isBlock(obj: any): obj is Block {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.tag === "string"
  );
}
