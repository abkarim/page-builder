/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import CheckBoxInput from '../input/Checkbox';
import NumberInput from '../input/Number';
import UnitInput from '../input/Unit';
import ColorInput from '../input/Color';
import Wrapper from './Wrapper';

export default function Border({ prevData, setStyle }) {
  const [data, setData] = useState({
    top: {
      value: 0,
      unit: 'px',
      color: '#bbbbbb',
    },
    bottom: {
      value: 0,
      unit: 'px',
      color: '#bbbbbb',
    },
    left: {
      value: 0,
      unit: 'px',
      color: '#bbbbbb',
    },
    right: {
      value: 0,
      unit: 'px',
      color: '#bbbbbb',
    },
    combined: {
      value: 0,
      unit: 'px',
      color: '#bbbbbb',
      enabled: true,
    },
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('border')) {
      let prev = prevData.border;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;
    finalData.final = `border: ${data.combined.value}${data.combined.unit} solid ${data.combined.color};`;

    if (!data.combined.enabled) {
      finalData.final = `border-left: ${data.left.value}${data.left.unit} solid ${data.left.color};`;
      finalData.final += `border-right: ${data.right.value}${data.right.unit} solid ${data.right.color};`;
      finalData.final += `border-top: ${data.top.value}${data.top.unit} solid ${data.top.color};`;
      finalData.final += `border-bottom: ${data.bottom.value}${data.bottom.unit} solid ${data.bottom.color};`;
    }

    setStyle((prev) => {
      return { ...prev, border: finalData };
    });
  }, [data]);

  const toggleCombined = () => {
    setData((prev) => {
      return {
        ...prev,
        combined: { ...prev.combined, enabled: !prev.combined.enabled },
      };
    });
  };
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

  const updateColor = useCallback((target, color) => {
    setData((prev) => {
      return {
        ...prev,
        [target]: { ...prev[target], color },
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
        <ColorInput
          value={data[target].color}
          onChange={(e) => updateColor(target, e.target.value)}
        />
      </div>
    );
  };

  return (
    <Wrapper title="Border">
      <div className="cursor-pointer">
        <span onClick={toggleCombined}>Combined</span>
        <CheckBoxInput
          checked={data.combined.enabled}
          onClick={toggleCombined}
        />
      </div>
      {data.combined.enabled ? (
        <Input target="combined" />
      ) : (
        <div>
          <label>Top</label>
          <Input target="top" />
          <label>Bottom</label>
          <Input target="bottom" />
          <label>Left</label>
          <Input target="left" />
          <label>Right</label>
          <Input target="right" />
        </div>
      )}
    </Wrapper>
  );
}

Border.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
