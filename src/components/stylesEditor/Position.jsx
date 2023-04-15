/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import CheckBoxInput from '../input/Checkbox';
import NumberInput from '../input/Number';
import UnitInput from '../input/Unit';
import Wrapper from './Wrapper';
import PositionInput from '../input/Position';

export default function Position({ prevData, setStyle }) {
  const [data, setData] = useState({
    position: '',
    top: {
      value: 0,
      unit: 'px',
    },
    bottom: {
      value: 0,
      unit: 'px',
    },
    left: {
      value: 0,
      unit: 'px',
    },
    right: {
      value: 0,
      unit: 'px',
    },
    combined: {
      value: 0,
      unit: 'px',
      enabled: true,
    },
    zIndex: '',
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('position')) {
      let prev = prevData.position;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;

    if (data.position != '') {
      finalData.final = `position: ${data.position};`;

      if (!data.combined.enabled) {
        finalData.final += `left: ${data.left.value}${data.left.unit};`;
        finalData.final += `right: ${data.right.value}${data.right.unit};`;
        finalData.final += `top: ${data.top.value}${data.top.unit};`;
        finalData.final += `bottom: ${data.bottom.value}${data.bottom.unit};`;
      } else {
        finalData.final += `inset: ${data.combined.value}${data.combined.unit};`;
      }

      if (data.zIndex != '') {
        finalData.final += `z-index: ${data.zIndex};`;
      }

      setStyle((prev) => {
        return { ...prev, position: finalData };
      });
    }
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
    <Wrapper title="Position">
      <div className="space-y-1">
        <div>
          <label>position</label>
          <PositionInput
            value={data.position}
            onChange={(e) => updateData('position', e.target.value)}
          />
        </div>
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
        <div>
          <label>Z-Index</label>
          <NumberInput
            value={Number(data.zIndex)}
            onInput={(e) => updateData('zIndex', e.target.value)}
          />
        </div>
      </div>
    </Wrapper>
  );
}

Position.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
