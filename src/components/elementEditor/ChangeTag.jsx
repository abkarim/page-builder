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
    // TODO change tag name in DOM
    // iframe.contentDocument.querySelector('.' + element).textContent = value;
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

ChangeTag.propsType = {
  element: PropType.object,
  elementBlockId: PropType.number,
  iframe: PropType.any,
};
