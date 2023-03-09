export default function AddNewBlock({ ...props }) {
  return (
    <div
      className="text-center font-bold text-2xl cursor-pointer border-2 border-cyan-300 m-2 p-1 text-cyan-500"
      title="Add new block"
      {...props}
    >
      &#43;
    </div>
  );
}
