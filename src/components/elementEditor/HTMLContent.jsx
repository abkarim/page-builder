import PropType from 'prop-types';
import { useState } from 'react';
import TextareaInput from '../input/Textarea';

export default function HTMLContent({ iframe, element }) {
  const ele = iframe.contentDocument.querySelector('.' + element);
  const [content, setContent] = useState(ele?.innerHTML);

  const updateValue = (data) => {
    setContent(data);
    ele.innerHTML = content;
    iframe.contentWindow.update();
  };

  return (
    <div>
      <label>HTML</label>
      <TextareaInput
        value={content}
        onChange={(e) => updateValue(e.target.value)}
      />
    </div>
  );
}

HTMLContent.propTypes = {
  element: PropType.string,
  iframe: PropType.any,
};
