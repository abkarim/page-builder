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
  tagName?: string;
}

export default function ElementStylesEditor({
  show,
  tagName,
}: Props): React.JSX.Element {
  if (!show) return <></>;

  return (
    <section className="max-w-60 w-full bg-accent rounded p-2 overflow-y-scroll">
      <div className="space-y-2">
        <Text />
        <Margin />
        <Padding />
        <Border />
        <Color />
        <Size />
        <Layout />
        <Position />
        <CustomCSS />
      </div>
    </section>
  );
}
