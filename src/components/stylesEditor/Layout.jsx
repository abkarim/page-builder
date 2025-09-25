/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import NumberInput from '@/components/input/Number';
import UnitInput from '@/components/input/Unit';
import Wrapper from '@/components/stylesEditor/Wrapper';
import SelectInput from '@/components/input/Select';
import getUniqueClassName from '@/util/getUniqueClassName';

export default function Layout({ prevData, setStyle, iframe, element }) {
  const [data, setData] = useState({
    count: '',
    gap: {
      value: '',
      unit: 'px',
    },
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('layout')) {
      let prev = prevData.layout;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;

    finalData.final = `grid-template-columns: ${100 / data.count}%;`;

    if (data.gap.value != '')
      finalData.final += `grid-column-gap: ${data.gap.value}${data.gap.unit};`;

    setStyle((prev) => {
      return { ...prev, columnLayout: finalData };
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

  const updateData = useCallback((target, value) => {
    setData((prev) => {
      return {
        ...prev,
        [target]: value,
      };
    });
  });

  return (
    <Wrapper title="Layout">
      <section className="space-y-1">
        <div className="flex flex-col">
          <label>Column Count</label>
          <SelectInput
            value={data.count}
            onChange={(e) => updateData('count', e.target.value)}
          >
            {[...Array(12)].map((x, i) => {
              return { name: i + 1, value: i + 1 };
            })}
          </SelectInput>
        </div>
        <div>
          <label>Gap</label>
          <div className="flex">
            <NumberInput
              value={Number(data.gap.value)}
              onInput={(e) => updateValue('gap', e.target.value)}
            />
            <UnitInput
              value={data.gap.unit}
              onChange={(e) => updateUnit('gap', e.target.value)}
            />
          </div>
        </div>
      </section>
    </Wrapper>
  );
}

Layout.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
  iframe: PropType.any,
  element: PropType.string,
};
