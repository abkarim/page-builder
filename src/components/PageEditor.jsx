import { useEffect, useRef, useState } from 'react';
import PropType from 'prop-types';

import CustomCSS from './stylesEditor/CustomCSS';

export default function PageEditor({ setStyles, iframe, navigate }) {
  const [style, setStyle] = useState({});

  // Update final element
  useEffect(() => {
    // * Prepare final style for this element
    const newStyle = style;
    const keys = Object.keys(style);
    newStyle.final = '';
    keys.forEach((key) => {
      if (style[key].final) {
        newStyle.final += style[key].final;
      }
    });

    // setStyles({ ...styles, [`${elementClassName}`]: newStyle });
  }, [style]);

  return (
    <div className="space-y-3">
      <button
        className="bg-black text-white p-2"
        onClick={() => navigate('Blocks')}
      >
        Blocks
      </button>
      {/* <CustomCSS prevData={style} setStyle={setStyle} /> */}
    </div>
  );
}

PageEditor.propTypes = {
  setStyles: PropType.func,
  iframe: PropType.any,
};
