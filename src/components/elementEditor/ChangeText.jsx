import { useState } from 'react';
import InputText from '../input/Text';

export default function ChangeText({ element, iframe }) {
  const ele = iframe.contentDocument.querySelector('.' + element);
  const [value, setValue] = useState(ele?.textContent);

  const updateValue = (value) => {
    setValue(value);
    iframe.contentDocument.querySelector('.' + element).textContent = value;
    iframe.contentWindow.update();
  };

  return (
    <div>
      <label>Text</label>
      <InputText value={value} onInput={(e) => updateValue(e.target.value)} />
    </div>
  );
}
