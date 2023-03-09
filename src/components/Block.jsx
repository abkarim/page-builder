import PropType from 'prop-types';

export default function Block({ image, description, ...props }) {
  return (
    <div
      className="bg-white p-2 rounded-sm cursor-grab select-none"
      draggable={true}
      {...props}
    >
      <img src={image} />
      <p className="font-bold text-base">{description}</p>
    </div>
  );
}

Block.propTypes = {
  image: PropType.string,
  description: PropType.string,
};
