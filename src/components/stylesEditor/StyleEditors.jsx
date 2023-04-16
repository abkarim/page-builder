import { useEffect, useRef, useState } from 'react';
import PropType from 'prop-types';
import getAcceptedStyle from '../../util/getAcceptedStyle';
import Border from './Border';
import Color from './Color';
import Font from './Font';
import Margin from './Margin';
import Padding from './Padding';
import Position from './Position';
import Shadow from './Shadow';
import Size from './Size';
import Transform from './Transform';
import CustomCSS from './CustomCSS';
import Align from './Align';

export default function StyleEditors({
  elementClassName,
  elementsBlockId,
  styles,
  setStyles,
}) {
  const acceptedStyles = getAcceptedStyle(elementsBlockId);

  const [style, setStyle] = useState({});
  const loaded = useRef(false);

  //* Prepare style on load
  useEffect(() => {
    if (styles.hasOwnProperty(elementClassName)) {
      let targetStyle = { ...style, ...styles[elementClassName] };
      setStyle({ ...targetStyle });
    }
    loaded.current = true;
  }, [elementClassName]);

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

    setStyles({ ...styles, [`${elementClassName}`]: newStyle });
  }, [style, elementClassName]);

  console.log({ acceptedStyles });

  return (
    loaded.current === true && (
      <div className="space-y-3">
        {(acceptedStyles.includes('*') || acceptedStyles.includes('text')) && (
          <Align prevData={style} setStyle={setStyle} />
        )}
        {(acceptedStyles.includes('*') ||
          acceptedStyles.includes('border')) && (
          <Border prevData={style} setStyle={setStyle} />
        )}
        {(acceptedStyles.includes('*') || acceptedStyles.includes('color')) && (
          <Color prevData={style} setStyle={setStyle} />
        )}
        {(acceptedStyles.includes('*') || acceptedStyles.includes('font')) && (
          <Font prevData={style} setStyle={setStyle} />
        )}
        {(acceptedStyles.includes('*') ||
          acceptedStyles.includes('spacing')) && (
          <>
            <Margin prevData={style} setStyle={setStyle} />
            <Padding prevData={style} setStyle={setStyle} />
          </>
        )}
        {(acceptedStyles.includes('*') ||
          acceptedStyles.includes('position')) && (
          <Position prevData={style} setStyle={setStyle} />
        )}
        {(acceptedStyles.includes('*') ||
          acceptedStyles.includes('shadow')) && (
          <Shadow prevData={style} setStyle={setStyle} />
        )}
        {(acceptedStyles.includes('*') || acceptedStyles.includes('size')) && (
          <Size prevData={style} setStyle={setStyle} />
        )}
        {(acceptedStyles.includes('*') ||
          acceptedStyles.includes('transform')) && (
          <Transform prevData={style} setStyle={setStyle} />
        )}
        <CustomCSS prevData={style} setStyle={setStyle} />
      </div>
    )
  );
}

StyleEditors.propTypes = {
  elementClassName: PropType.string,
  elementsBlockId: PropType.number,
  styles: PropType.object,
  setStyles: PropType.func,
};
