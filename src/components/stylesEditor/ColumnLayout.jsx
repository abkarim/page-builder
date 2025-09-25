/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import NumberInput from '@/components/input/Number';
import UnitInput from '@/components/input/Unit';
import Wrapper from '@/components/stylesEditor/Wrapper';
import SelectInput from '@/components/input/Select';
import getUniqueClassName from '@/util/getUniqueClassName';

export default function ColumnLayout({ prevData, setStyle, iframe, element }) {
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
    if (prevData.hasOwnProperty('columnLayout')) {
      let prev = prevData.columnLayout;
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

  useEffect(() => {
    /**Remove or add element in column */
    const ele = iframe.contentDocument.querySelector('.' + element);

    if (ele && data.count != '') {
      const childrenLength = ele.children.length;
      if (childrenLength < data.count) {
        const target = data.count - childrenLength;

        const newElement = iframe.contentDocument.createElement('div');
        newElement.setAttribute('replaceable', true);
        newElement.textContent = '+';

        for (let i = 0; i < target; i++) {
          newElement.className = getUniqueClassName();
          ele.appendChild(newElement.cloneNode(true));
        }
      }

      if (childrenLength > data.count) {
        const target = childrenLength - data.count;
        for (let i = 0; i < target; i++) {
          ele.removeChild(ele.lastChild);
        }
      }
      iframe.contentWindow.update();
    }
  }, [data.count]);

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
    <Wrapper title="Column Layout">
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
        {/* <div className="flex flex-col">
          <label>Column Size</label>
          <div className="grid">
            {[...Array(data.count)].map((x, i) => (
              <span key={i} className="inline-block">
                {i + 1}
              </span>
            ))}
          </div>
        </div> */}
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

ColumnLayout.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
  iframe: PropType.any,
  element: PropType.string,
};
