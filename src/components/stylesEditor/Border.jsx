import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import CheckBoxInput from '../input/Checkbox';
import NumberInput from '../input/Number';
import UnitInput from '../input/Unit';

export default function Border({ prevData, setStyle }) {
  const [isVisible, setIsVisible] = useState(true);
  const [data, setData] = useState({
    top: {
      value: 0,
      unit: 'vw',
    },
    bottom: {
      value: 0,
      unit: '%',
    },
    left: {
      value: 0,
      unit: 'rem',
    },
    right: {
      value: 0,
      unit: 'ch',
    },
    combined: {
      value: 0,
      unit: 'px',
      enabled: false,
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
    finalData.final = 'border: 2px solid red;';

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

  const toggleIsVisible = () => {
    setIsVisible((prev) => !prev);
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

  return (
    <>
      <div
        title="toggle visibility"
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleIsVisible}
      >
        <h2 className="text-lg">Border</h2>
        <div className="bg-white rounded-full p-1 flex justify-center items-center w-5 h-5 font-bold select-none">
          <span
            className={`inline-block ${
              isVisible ? '-rotate-90' : '!rotate-180'
            } `}
          >
            &#10094;
          </span>
        </div>
      </div>
      {isVisible && (
        <section>
          <div className="cursor-pointer">
            <span onClick={toggleCombined}>Combined</span>
            <CheckBoxInput
              defaultChecked={data.combined.enabled}
              onClick={toggleCombined}
            />
          </div>
          {data.combined.enabled && (
            <div className="flex">
              <NumberInput />
              <UnitInput />
            </div>
          )}
          {!data.combined.enabled && (
            <div>
              <label>Top</label>
              <div className="flex">
                <NumberInput
                  value={Number(data.top.value)}
                  onInput={(e) => updateValue('top', e.target.value)}
                />
                <UnitInput
                  value={data.top.unit}
                  onChange={(e) => updateUnit('top', e.target.value)}
                />
              </div>
              <label>Bottom</label>
              <div className="flex">
                <NumberInput
                  value={Number(data.bottom.value)}
                  onInput={(e) => updateValue('bottom', e.target.value)}
                />
                <UnitInput
                  value={data.bottom.unit}
                  onChange={(e) => updateUnit('bottom', e.target.value)}
                />
              </div>
              <label>Left</label>
              <div className="flex">
                <NumberInput
                  value={Number(data.left.value)}
                  onInput={(e) => updateValue('left', e.target.value)}
                />
                <UnitInput
                  value={data.left.unit}
                  onChange={(e) => updateUnit('left', e.target.value)}
                />
              </div>
              <label>Right</label>
              <div className="flex">
                <NumberInput
                  value={Number(data.right.value)}
                  onInput={(e) => updateValue('right', e.target.value)}
                />
                <UnitInput
                  value={data.right.unit}
                  onChange={(e) => updateUnit('right', e.target.value)}
                />
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}

Border.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
