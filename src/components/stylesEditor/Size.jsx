/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import NumberInput from '../input/Number';
import UnitInput from '../input/Unit';
import Wrapper from './Wrapper';

export default function Size({ prevData, setStyle }) {
  const [data, setData] = useState({
    minWidth: {
      value: '',
      unit: 'px',
    },
    minHeight: {
      value: '',
      unit: 'px',
    },
    height: {
      value: '',
      unit: 'px',
    },
    width: {
      value: '',
      unit: 'px',
    },
    maxWidth: {
      value: '',
      unit: 'px',
    },
    maxHeight: {
      value: '',
      unit: 'px',
    },
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('size')) {
      let prev = prevData.size;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;
    if (data.width.value != '')
      finalData.final = `width: ${data.width.value}${data.width.unit};`;

    if (data.minWidth.value != '')
      finalData.final += `min-width: ${data.minWidth.value}${data.minWidth.unit};`;

    if (data.maxWidth.value != '') {
      finalData.final += `max-width: ${data.maxWidth.value}${data.maxWidth.unit};`;
    }

    if (data.height.value != '')
      finalData.final += `height: ${data.height.value}${data.height.unit};`;

    if (data.minHeight.value != '')
      finalData.final += `min-height: ${data.minHeight.value}${data.minHeight.unit};`;

    if (data.maxHeight.value != '') {
      finalData.final += `max-height: ${data.maxHeight.value}${data.maxHeight.unit};`;
    }

    setStyle((prev) => {
      return { ...prev, size: finalData };
    });
  }, [data]);

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

  // eslint-disable-next-line react/prop-types
  const Input = ({ target }) => {
    return (
      <div className="flex">
        <NumberInput
          value={Number(data[target].value)}
          onInput={(e) => updateValue(target, e.target.value)}
        />
        <UnitInput
          value={data[target].unit}
          onChange={(e) => updateUnit(target, e.target.value)}
        />
      </div>
    );
  };

  return (
    <Wrapper title="Size">
      <>
        <div>
          <label>Width</label>
          <Input target="width" />
          <label>Height</label>
          <Input target="height" />
          <label>Min Width</label>
          <Input target="minWidth" />
          <label>Min Height</label>
          <Input target="minHeight" />
          <label>Max Width</label>
          <Input target="maxWidth" />
          <label>Max Height</label>
          <Input target="maxHeight" />
        </div>
      </>
    </Wrapper>
  );
}

Size.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
