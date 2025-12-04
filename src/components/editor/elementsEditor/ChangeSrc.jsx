import PropType from 'prop-types';
import { useState } from 'react';
import InputText from '../input/Text';

export default function ChangeSrc({ element, iframe }) {
  const ele = iframe.contentDocument.querySelector('.' + element);
  const [value, setValue] = useState(ele?.src);

  const updateValue = (value) => {
    setValue(value);
    iframe.contentDocument.querySelector('.' + element).src = value;
    iframe.contentWindow.update();
  };

  return (
    <div>
      <label>Src</label>
      <InputText value={value} onInput={(e) => updateValue(e.target.value)} />
    </div>
  );
}

ChangeSrc.propTypes = {
  element: PropType.string,
  iframe: PropType.any,
};
