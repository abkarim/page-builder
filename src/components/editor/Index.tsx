import Align from "./stylesEditor/Align";
import Border from "./stylesEditor/Border";
import Margin from "./stylesEditor/Margin";
import Padding from "./stylesEditor/Padding";

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
    <section className="max-w-60 w-full bg-accent rounded p-2">
      <div className="space-y-2">
        <Align />
        <Margin />
        <Padding />
        <Border />
      </div>
    </section>
  );
}
