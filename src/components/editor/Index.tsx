import { isEditorAvailableForComponent } from "@/util/EditorAndComponentConnection";
import Border, { BorderData } from "./stylesEditor/Border";
import Color, { ColorData } from "./stylesEditor/Color";
import CustomCSS from "./stylesEditor/CustomCSS";
import Layout from "./stylesEditor/Layout";
import Position from "./stylesEditor/Position";
import Size from "./stylesEditor/Size";
import Text, { TextData } from "./stylesEditor/Text";
import Spacing, { SpacingData } from "./stylesEditor/Spacing";

export interface ElementStylesEditorProps {
  show: boolean;
  component: string;
  data: {
    text: TextData;
    spacing: SpacingData;
    border: BorderData;
    color: ColorData;
  };
  update: (
    type: keyof ElementStylesEditorProps["data"],
    styles: Partial<
      ElementStylesEditorProps["data"][keyof ElementStylesEditorProps["data"]]
    >,
  ) => void;
}

export default function ElementStylesEditor({
  show,
  component,
  data,
  update,
}: ElementStylesEditorProps): React.JSX.Element {
  if (!show) return <></>;

  return (
    <section
      key={JSON.stringify(data)}
      className="max-w-60 w-full bg-accent rounded p-2"
    >
      <div className="space-y-2">
        {isEditorAvailableForComponent("text", component) && (
          <Text data={data.text} updateStyle={(data) => update("text", data)} />
        )}
        {isEditorAvailableForComponent("spacing", component) && (
          <Spacing
            data={data.spacing}
            updateStyle={(data) => update("spacing", data)}
          />
        )}
        {isEditorAvailableForComponent("border", component) && (
          <Border
            data={data.border}
            updateStyle={(data) => update("border", data)}
          />
        )}
        {isEditorAvailableForComponent("color", component) && (
          <Color
            data={data.color}
            updateStyle={(data) => update("color", data)}
          />
        )}
        {isEditorAvailableForComponent("size", component) && <Size />}
        {isEditorAvailableForComponent("layout", component) && <Layout />}
        {isEditorAvailableForComponent("position", component) && <Position />}
        {isEditorAvailableForComponent("customCSS", component) && <CustomCSS />}
      </div>
    </section>
  );
}
