import PropType from 'prop-types';
import { useCallback } from 'react';
import getUniqueClassName from '../util/getUniqueClassName';

export default function Block({ image, block, addElement, ...props }) {
  const getFinalHTML = useCallback(() => {
    let element = block.element.replace('{$TEXT$}', block.defaultText);
    let prevClass = element.match(/class=['"](?<data>[A-z0-9-\s]+)['"]/)[
      'groups'
    ].data;
    prevClass = `${prevClass} ${getUniqueClassName()}`;
    element = element.replace(
      /class=['"][A-z0-9-\s]+['"]/,
      `class="${prevClass}"`
    );
    return element;
  }, [block]);

  const dragStart = useCallback(
    (e) => {
      const data = getFinalHTML();
      e.dataTransfer.setData('html', data);
      e.dataTransfer.setData('type', 'copy');
      window.draggingData = data;
    },
    [getFinalHTML]
  );

  const addBlock = useCallback(() => {
    addElement(getFinalHTML());
  }, [getFinalHTML]);

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
  addElement: PropType.func,
};
