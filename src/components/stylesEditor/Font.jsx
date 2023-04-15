/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import Wrapper from './Wrapper';
import NumberInput from '../input/Number';
import UnitInput from '../input/Unit';
import FontFamily from '../input/FontFamily';
import FontStyle from '../input/FontStyle';
import FontWeight from '../input/FontWeight';

export default function Font({ prevData, setStyle }) {
  const [data, setData] = useState({
    style: '',
    size: {
      value: '',
      unit: 'rem',
    },
    weight: '',
    family: '',
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('font')) {
      let prev = prevData.font;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;
    if (data.size.value != '') {
      finalData.final = `font-size: ${data.size.value}${data.size.unit};`;
    }

    if (data.family != '') {
      finalData.final += `font-family: ${data.family};`;
    }

    if (data.style != '') {
      finalData.final += `font-style: ${data.style};`;
    }

    if (data.weight != '') {
      finalData.final += `font-weight: ${data.weight};`;
    }

    setStyle((prev) => {
      return { ...prev, font: finalData };
    });
  }, [data]);

  const updateData = useCallback((target, value) => {
    setData((prev) => {
      return {
        ...prev,
        [target]: value,
      };
    });
  });

  const updateValue = useCallback((target, value) => {
    setData((prev) => {
      return {
        ...prev,
        [target]: { ...prev[target], value },
      };
    });
  });

  const updateUnit = useCallback((target, unit) => {
    setData((prev) => {
      return {
        ...prev,
        [target]: { ...prev[target], unit },
      };
    });
  });

  return (
    <Wrapper title="Font">
      <div className="space-y-1">
        <div>
          <label>Size</label>
          <div className="flex">
            <NumberInput
              value={Number(data.size.value)}
              onInput={(e) => updateValue('size', e.target.value)}
            />
            <UnitInput
              value={data.size.unit}
              onChange={(e) => updateUnit('size', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label>Family</label>
          <FontFamily
            value={data.family}
            onChange={(e) => updateData('family', e.target.value)}
          />
        </div>
        <div>
          <label>Style</label>
          <FontStyle
            value={data.style}
            onChange={(e) => updateData('style', e.target.value)}
          />
        </div>
        <div>
          <label>Weight</label>
          <FontWeight
            value={Number(data.weight)}
            onChange={(e) => updateData('weight', e.target.value)}
          />
        </div>
      </div>
    </Wrapper>
  );
}

Font.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
