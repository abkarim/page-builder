/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import Wrapper from './Wrapper';
import TextareaInput from '../input/Textarea';

export default function CustomCSS({ prevData, setStyle }) {
  const [data, setData] = useState({
    final: '',
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('customCSS')) {
      let prev = prevData.customCSS;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;

    setStyle((prev) => {
      return { ...prev, customCSS: finalData };
    });
  }, [data]);

  const updateValue = useCallback((target, value) => {
    setData((prev) => {
      return {
        ...prev,
        [target]: value,
      };
    });
  });

  return (
    <Wrapper title="Custom CSS">
      <div>
        <TextareaInput
          value={data.final}
          placeholder="color:#000;"
          onChange={(e) => updateValue('final', e.target.value)}
        />
      </div>
    </Wrapper>
  );
}

CustomCSS.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
