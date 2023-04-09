export default function NumberInput({ ...props }) {
  return (
    <input
      type="number"
      className="p-1 rounded-sm outline-none w-full"
      {...props}
    />
  );
}
