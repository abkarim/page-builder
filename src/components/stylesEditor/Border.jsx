/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import CheckBoxInput from '@/components/input/Checkbox';
import NumberInput from '@/components/input/Number';
import UnitInput from '@/components/input/Unit';
import ColorInput from '@/components/input/Color';
import Wrapper from '@/components/stylesEditor/Wrapper';

export default function Border({ prevData, setStyle }) {
  const [data, setData] = useState({
    top: {
      value: '',
      unit: 'px',
      color: '#000000',
    },
    bottom: {
      value: '',
      unit: 'px',
      color: '#000000',
    },
    left: {
      value: '',
      unit: 'px',
      color: '#000000',
    },
    right: {
      value: '',
      unit: 'px',
      color: '#000000',
    },
    combined: {
      value: '',
      unit: 'px',
      color: '#000000',
      enabled: true,
    },
    radius: {
      value: '',
      unit: 'px',
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

    if (!data.combined.enabled) {
      finalData.final = '';
      if (data.left.value !== '') {
        finalData.final = `border-left: ${data.left.value}${data.left.unit} solid ${data.left.color};`;
      }

      if (data.right.value !== '') {
        finalData.final += `border-right: ${data.right.value}${data.right.unit} solid ${data.right.color};`;
      }

      if (data.top.value !== '') {
        finalData.final += `border-top: ${data.top.value}${data.top.unit} solid ${data.top.color};`;
      }

      if (data.bottom.value !== '') {
        finalData.final += `border-bottom: ${data.bottom.value}${data.bottom.unit} solid ${data.bottom.color};`;
      }
    } else if (data.combined.value !== '') {
      finalData.final = `border: ${data.combined.value}${data.combined.unit} solid ${data.combined.color};`;
    }

    if (data.radius.value !== '')
      finalData.final += `border-radius: ${data.radius.value}${data.radius.unit};`;

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
        <label>Radius</label>
        <div className="flex mt-1">
          <NumberInput
            value={Number(data.radius.value)}
            onInput={(e) => updateValue('radius', e.target.value)}
          />
          <UnitInput
            value={data.radius.unit}
            onChange={(e) => updateUnit('radius', e.target.value)}
          />
        </div>
      </>
    </Wrapper>
  );
}

Border.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
