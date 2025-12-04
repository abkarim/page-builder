import PropType from 'prop-types';
import { useState } from 'react';
import InputText from '../input/Text';

export default function ChangeAlt({ element, iframe }) {
  const ele = iframe.contentDocument.querySelector('.' + element);
  const [value, setValue] = useState(ele?.alt);

  const updateValue = (value) => {
    setValue(value);
    iframe.contentDocument.querySelector('.' + element).alt = value;
    iframe.contentWindow.update();
  };

  return (
    <div>
      <label>Alt text</label>
      <InputText value={value} onInput={(e) => updateValue(e.target.value)} />
    </div>
  );
}

ChangeAlt.propTypes = {
  element: PropType.string,
  iframe: PropType.any,
};
