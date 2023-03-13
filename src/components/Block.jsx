import PropType from 'prop-types';

export default function Block({ image, block, ...props }) {
  const dragStart = (e) => {
    e.dataTransfer.setData(
      'html',
      block.element.replace('{$TEXT$}', block.defaultText)
    );
  };

  return (
    <div
      className="bg-white p-2 rounded-sm cursor-grab select-none"
      draggable
      onDragStart={dragStart}
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
};
