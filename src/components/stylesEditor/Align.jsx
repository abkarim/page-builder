/* eslint-disable no-prototype-builtins */
import { useCallback, useEffect, useState } from 'react';
import PropType from 'prop-types';

import Wrapper from './Wrapper';

import leftImg from '../../assets/img/align/left.png';
import rightImg from '../../assets/img/align/right.png';
import centeredImg from '../../assets/img/align/centered.png';
import justifiedImg from '../../assets/img/align/justified.png';

export default function Align({ prevData, setStyle }) {
  const [data, setData] = useState({
    align: '',
  });

  // * Prepare data from prevData
  useEffect(() => {
    //! prevData contains full style objects like color, outline, border
    // extract only required info
    if (prevData.hasOwnProperty('align')) {
      let prev = prevData.align;
      setData((pre) => {
        return { ...pre, ...prev };
      });
    }
  }, []);

  // * Updates value in main data
  useEffect(() => {
    // Prepare final value
    const finalData = data;

    if (data.align != '') finalData.final = `text-align: ${data.align};`;

    setStyle((prev) => {
      return { ...prev, align: finalData };
    });
  }, [data]);

  const updateData = useCallback((target) => {
    setData((prev) => {
      return { ...prev, align: target };
    });
  });

  // eslint-disable-next-line react/prop-types
  const Input = ({ target, img }) => {
    return (
      <button
        className="p-1 px-5 bg-white rounded-sm w-full"
        onClick={() => updateData(target)}
        title={target}
      >
        <img src={img} alt={target} className="h-4" />
      </button>
    );
  };

  return (
    <Wrapper title="Align">
      <div className="flex justify-evenly gap-1">
        <Input target="left" img={leftImg} />
        <Input target="center" img={centeredImg} />
        <Input target="right" img={rightImg} />
        <Input target="justify" img={justifiedImg} />
      </div>
    </Wrapper>
  );
}

Align.propTypes = {
  prevData: PropType.object,
  setStyle: PropType.func,
};
