import { useState } from 'react';
import PropType from 'prop-types';

export default function Wrapper({ title, children, ...props }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleIsVisible = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div {...props}>
      <div
        title="toggle visibility"
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleIsVisible}
      >
        <h2 className="text-lg">{title}</h2>
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
      <section>{isVisible && children}</section>
    </div>
  );
}

Wrapper.propTypes = {
  title: PropType.string,
  children: PropType.element,
};
