import PropType from 'prop-types';
import { useState } from 'react';
import SelectInput from '../input/Select';
import getChangeableTagList from '../../util/getChangeableTag';

export default function ChangeTag({ element, elementBlockId, iframe }) {
  const ele = iframe.contentDocument.querySelector('.' + element);
  const [value, setValue] = useState(ele?.tagName.toLowerCase());
  const tagArray = getChangeableTagList(elementBlockId).map((el) => {
    return { name: el, value: el };
  });

  const updateValue = (value) => {
    setValue(value);
    const newElement = iframe.contentDocument.createElement(value);
    // Copy over any attributes from the original element to the new element
    for (const attr of ele.attributes) {
      newElement.setAttribute(attr.name, attr.value);
    }
    newElement.textContent = ele.textContent;
    ele.replaceWith(newElement);
    iframe.contentWindow.update();
  };

  return (
    <div className="flex flex-col">
      <label>Tag</label>
      <SelectInput value={value} onChange={(e) => updateValue(e.target.value)}>
        {tagArray}
      </SelectInput>
    </div>
  );
}

ChangeTag.propTypes = {
  element: PropType.string,
  elementBlockId: PropType.number,
  iframe: PropType.any,
};
