export default function ColorInput({ ...props }) {
  return (
    <input
      type="color"
      className="bg-white rounded-sm border-none h-auto"
      {...props}
    />
  );
}
