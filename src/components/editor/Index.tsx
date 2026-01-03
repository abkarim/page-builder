interface Props {
  show: boolean;
}

export default function ElementStylesEditor({
  show,
}: Props): React.JSX.Element {
  if (!show) return <></>;

  return (
    <section className="w-md">
      <section>Styles Editor</section>
    </section>
  );
}
