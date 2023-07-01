import PropType from 'prop-types';
import { useCallback } from 'react';
import getUniqueClassName from '@/util/getUniqueClassName';

export default function Block({ image, block, addElement, ...props }) {
  const getFinalHTML = useCallback(() => {
    // TODO Replace next statement with rust
    let element = block.element.replace('{$TEXT$}', block.defaultText);

    let prevClass = element.match(/class=['"](?<data>[A-z0-9-\s]+)['"]/);

    if (prevClass !== null) {
      prevClass = prevClass['groups'].data;
    } else {
      prevClass = '';
    }

    prevClass = `${prevClass} ${getUniqueClassName()}`;

    if (block.className) {
      prevClass = `${prevClass} ${block.className}`;
    }

    element = element.replace(
      // This regex selects class="" or class='anything'
      /class=['"]([A-z0-9-\s]+)?['"]/,
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
      console.log({ data });
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
