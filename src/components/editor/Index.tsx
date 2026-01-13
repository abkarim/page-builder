import { isEditorAvailableForComponent } from "@/util/EditorAndComponentConnection";
import Border from "./stylesEditor/Border";
import Color from "./stylesEditor/Color";
import CustomCSS from "./stylesEditor/CustomCSS";
import Layout from "./stylesEditor/Layout";
import Margin from "./stylesEditor/Margin";
import Padding from "./stylesEditor/Padding";
import Position from "./stylesEditor/Position";
import Size from "./stylesEditor/Size";
import Text from "./stylesEditor/Text";

interface Props {
  show: boolean;
  component: string;
}

export default function ElementStylesEditor({
  show,
  component,
}: Props): React.JSX.Element {
  if (!show) return <></>;

  return (
    <section className="max-w-60 w-full bg-accent rounded p-2 overflow-y-scroll">
      <div className="space-y-2">
        {isEditorAvailableForComponent("text", component) && <Text />}
        {isEditorAvailableForComponent("margin", component) && <Margin />}
        {isEditorAvailableForComponent("padding", component) && <Padding />}
        {isEditorAvailableForComponent("border", component) && <Border />}
        {isEditorAvailableForComponent("color", component) && <Color />}
        {isEditorAvailableForComponent("size", component) && <Size />}
        {isEditorAvailableForComponent("layout", component) && <Layout />}
        {isEditorAvailableForComponent("position", component) && <Position />}
        <CustomCSS />
      </div>
    </section>
  );
}
