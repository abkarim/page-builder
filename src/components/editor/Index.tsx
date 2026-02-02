import { isEditorAvailableForComponent } from "@/util/EditorAndComponentConnection";
import Border from "./stylesEditor/Border";
import Color from "./stylesEditor/Color";
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
  };
}

export default function ElementStylesEditor({
  show,
  component,
  data,
}: ElementStylesEditorProps): React.JSX.Element {
  if (!show) return <></>;

  return (
    <section className="max-w-60 w-full bg-accent rounded p-2">
      <div className="space-y-2">
        {isEditorAvailableForComponent("text", component) && (
          <Text data={data.text} />
        )}
        {isEditorAvailableForComponent("spacing", component) && <Spacing />}
        {isEditorAvailableForComponent("border", component) && <Border />}
        {isEditorAvailableForComponent("color", component) && <Color />}
        {isEditorAvailableForComponent("size", component) && <Size />}
        {isEditorAvailableForComponent("layout", component) && <Layout />}
        {isEditorAvailableForComponent("position", component) && <Position />}
        {isEditorAvailableForComponent("customCSS", component) && <CustomCSS />}
      </div>
    </section>
  );
}
