/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import NumberInput from '@/components/input/Number';
import ColorInput from '@/components/input/Color';
import UnitInput from '@/components/input/Unit';
import Wrapper from '@/components/stylesEditor/Wrapper';
import CheckBoxInput from '@/components/input/Checkbox';

export default function Shadow({ prevData, setStyle }) {
  const [data, setData] = useState({
    color: '',
    offsetX: {
      value: 0,
      unit: 'px',
    },
    offsetY: {
      value: 0,
      unit: 'px',
    },
    blurRadius: {
      value: 0,
      unit: 'px',
    },
    spreadRadius: {
      value: 0,
      unit: 'px',
    },
    inset: false,
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('shadow')) {
      let prev = prevData.shadow;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;

    if (data.color != '') {
      finalData.final = `box-shadow: ${data.inset ? 'inset' : ''} ${
        data.offsetX.value
      }${data.offsetX.unit} ${data.offsetY.value}${data.offsetY.unit} ${
        data.blurRadius.value
      }${data.blurRadius.unit} ${data.spreadRadius.value}${
        data.spreadRadius.unit
      } ${data.color};`;

      setStyle((prev) => {
        return { ...prev, shadow: finalData };
      });
    }
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

  const updateData = useCallback((target, value) => {
    setData((prev) => {
      return { ...prev, [target]: value };
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
    <Wrapper title="Box Shadow">
      <div className="space-y-1">
        <div className="flex justify-between">
          <label>Color</label>
          <ColorInput
            value={data.color}
            onChange={(e) => updateData('color', e.target.value)}
          />
        </div>
        <div>
          <label>Inset</label>
          <CheckBoxInput
            checked={data.inset}
            onClick={() => updateData('inset', !data.inset)}
          />
        </div>
        <div>
          <label>Offset X</label>
          <Input target="offsetX" />
          <label>Offset Y</label>
          <Input target="offsetY" />
          <label>Blur Radius</label>
          <Input target="blurRadius" />
          <label>Spread Radius</label>
          <Input target="spreadRadius" />
        </div>
      </div>
    </Wrapper>
  );
}

Shadow.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
