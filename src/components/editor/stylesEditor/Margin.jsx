/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import CheckBoxInput from '@/components/input/Checkbox';
import NumberInput from '@/components/input/Number';
import UnitInput from '@/components/input/Unit';
import Wrapper from '@/components/stylesEditor/Wrapper';

export default function Margin({ prevData, setStyle }) {
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
    if (prevData.hasOwnProperty('margin')) {
      let prev = prevData.margin;
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
      if (data.left.value != '') {
        finalData.final = `margin-left: ${data.left.value}${data.left.unit};`;
      }
      if (data.right.value != '') {
        finalData.final += `margin-right: ${data.right.value}${data.right.unit};`;
      }
      if (data.top.value != '') {
        finalData.final += `margin-top: ${data.top.value}${data.top.unit};`;
      }
      if (data.bottom.value != '') {
        finalData.final += `margin-bottom: ${data.bottom.value}${data.bottom.unit};`;
      }
    } else if (data.combined.value != '') {
      finalData.final = `margin: ${data.combined.value}${data.combined.unit};`;
    }

    setStyle((prev) => {
      return { ...prev, margin: finalData };
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
    <Wrapper title="Margin">
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

Margin.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
