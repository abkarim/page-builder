import { useEffect, useRef, useState } from 'react';
import PropType from 'prop-types';
import getAcceptedStyle from '@/util/getAcceptedStyle';
import Border from '@/components/stylesEditor/Border';
import Color from '@/components/stylesEditor/Color';
import Font from '@/components/stylesEditor/Font';
import Margin from '@/components/stylesEditor/Margin';
import Padding from '@/components/stylesEditor/Padding';
import Position from '@/components/stylesEditor/Position';
import Shadow from '@/components/stylesEditor/Shadow';
import Size from '@/components/stylesEditor/Size';
import Transform from '@/components/stylesEditor/Transform';
import CustomCSS from '@/components/stylesEditor/CustomCSS';
import Align from '@/components/stylesEditor/Align';
import ColumnLayout from '@/components/stylesEditor/ColumnLayout';
import Layout from '@/components/stylesEditor/Layout';

export default function StyleEditors({
  elementClassName,
  elementsBlockId,
  styles,
  setStyles,
  iframe,
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

  return (
    loaded.current === true && (
      <div className="space-y-3">
        {acceptedStyles.includes('columnLayout') && (
          <ColumnLayout
            prevData={style}
            setStyle={setStyle}
            iframe={iframe}
            element={elementClassName}
          />
        )}
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
        {acceptedStyles.includes('layout') && (
          <Layout prevData={style} setStyle={setStyle} />
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
  iframe: PropType.any,
};
