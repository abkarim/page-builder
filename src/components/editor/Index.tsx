interface Props {
  show: boolean;
}

export default function ElementStylesEditor({
  show,
}: Props): React.JSX.Element {
  if (!show) return <></>;

  return (
    <section className="max-w-60 w-full bg-accent rounded p-2">
      <section>Styles Editor</section>
    </section>
  );
}
