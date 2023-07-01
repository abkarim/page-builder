/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import ColorInput from '@/components/input/Color';
import Wrapper from '@/components/stylesEditor/Wrapper';

export default function Color({ prevData, setStyle }) {
  const [data, setData] = useState({
    color: '',
    backgroundColor: '',
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('color')) {
      let prev = prevData.color;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;
    if (data.color) {
      finalData.final = `color: ${data.color};`;
    }

    if (data.backgroundColor) {
      finalData.final += `background-color: ${data.backgroundColor};`;
    }

    setStyle((prev) => {
      return { ...prev, color: finalData };
    });
  }, [data]);

  const updateColor = useCallback((target, color) => {
    setData((prev) => {
      return {
        ...prev,
        [target]: color,
      };
    });
  });

  // eslint-disable-next-line react/prop-types
  const Input = ({ title, target }) => {
    return (
      <div className="flex justify-between">
        <label>{title}</label>
        <ColorInput
          value={data[target]}
          onChange={(e) => updateColor(target, e.target.value)}
        />
      </div>
    );
  };

  return (
    <Wrapper title="Color">
      <div className="space-y-1">
        <Input target="color" title="Color" />
        <Input target="backgroundColor" title="Background Color" />
      </div>
    </Wrapper>
  );
}

Color.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
