import Margin from "./stylesEditor/Margin";

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
      <div>
        <Margin />
      </div>
    </section>
  );
}
