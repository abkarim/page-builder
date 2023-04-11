import { useEffect, useRef, useState } from 'react';
import PropType from 'prop-types';
import getAcceptedStyle from '../util/getAcceptedStyle';
import Border from './stylesEditor/Border';
import Color from './stylesEditor/Color';
import Font from './stylesEditor/Font';
import Margin from './stylesEditor/Margin';
import Padding from './stylesEditor/Padding';
import Position from './stylesEditor/Position';
import Shadow from './stylesEditor/Shadow';
import Size from './stylesEditor/Size';
import Transform from './stylesEditor/Transform';

export default function StylesEditor({
  elementClassName,
  elementsBlockId,
  styles,
  setStyles,
}) {
  /**
   * TODO
   * get applicable styles by block id
   * create styles abd append to data
   * changeable tag
   */

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
  return (
    loaded.current === true && (
      <div className="space-y-3">
        <Border prevData={style} setStyle={setStyle} />
        <Color prevData={style} setStyle={setStyle} />
        <Font prevData={style} setStyle={setStyle} />
        <Margin prevData={style} setStyle={setStyle} />
        <Padding prevData={style} setStyle={setStyle} />
        <Position prevData={style} setStyle={setStyle} />
        <Shadow prevData={style} setStyle={setStyle} />
        <Size prevData={style} setStyle={setStyle} />
        <Transform prevData={style} setStyle={setStyle} />
      </div>
    )
  );
}

StylesEditor.propTypes = {
  elementClassName: PropType.string,
  elementsBlockId: PropType.number,
  styles: PropType.object,
  setStyles: PropType.func,
};
