/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import CheckBoxInput from '../input/Checkbox';
import NumberInput from '../input/Number';
import UnitInput from '../input/Unit';
import Wrapper from './Wrapper';

export default function Padding({ prevData, setStyle }) {
  const [data, setData] = useState({
    top: {
      value: '',
      unit: 'px',
    },
    bottom: {
      value: '',
      unit: 'px',
    },
    left: {
      value: '',
      unit: 'px',
    },
    right: {
      value: '',
      unit: 'px',
    },
    combined: {
      value: '',
      unit: 'px',
      enabled: true,
    },
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('padding')) {
      let prev = prevData.padding;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;

    if (!data.combined.enabled) {
      finalData.final = '';
      if (data.left.value != '')
        finalData.final = `padding-left: ${data.left.value}${data.left.unit};`;

      if (data.right.value != '')
        finalData.final += `padding-right: ${data.right.value}${data.right.unit};`;

      if (data.top.value != '')
        finalData.final += `padding-top: ${data.top.value}${data.top.unit};`;

      if (data.bottom.value != '')
        finalData.final += `padding-bottom: ${data.bottom.value}${data.bottom.unit};`;
    } else if (data.combined.value != '') {
      finalData.final = `padding: ${data.combined.value}${data.combined.unit};`;
    }

    setStyle((prev) => {
      return { ...prev, padding: finalData };
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
    <Wrapper title="Padding">
      <>
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
      </>
    </Wrapper>
  );
}

Padding.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
