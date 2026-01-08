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
      <section>Showing {tagName}: Styles Editor</section>
    </section>
  );
}
