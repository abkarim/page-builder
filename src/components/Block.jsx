import PropType from 'prop-types';

export default function Block({ image, block, setPageContent, ...props }) {
  const getFinalHTML = () => {
    return block.element.replace('{$TEXT$}', block.defaultText);
  };

  const dragStart = (e) => {
    e.dataTransfer.setData('html', getFinalHTML());
  };

  const addBlock = () => {
    setPageContent((prev) => prev + getFinalHTML());
  };

  return (
    <div
      className="bg-white p-2 rounded-sm cursor-pointer select-none"
      draggable
      onDragStart={dragStart}
      onClick={addBlock}
      {...props}
    >
      <img src={image} />
      <p className="font-bold text-base">{block.name}</p>
    </div>
  );
}

Block.propTypes = {
  image: PropType.string,
  block: PropType.object,
  setPageContent: PropType.func,
};
