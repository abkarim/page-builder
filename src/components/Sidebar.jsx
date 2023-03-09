import PropTypes from 'prop-types';
import { useState } from 'react';

export default function SideBar({ title, children, ...props }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <aside {...props} className={`relative`}>
      <section
        className={`bg-[#e5e5e5] overflow-hidden ${
          isSidebarOpen ? 'w-72' : 'w-0'
        } transition-width duration-500 ease h-screen`}
      >
        <div>
          {title && (
            <h2 className="text-lg pl-5 border-b-2 font-semibold border-black p-1">
              {title}
            </h2>
          )}
          <section className="p-1">{children}</section>
        </div>
      </section>

      <button
        type="button"
        onClick={toggleSidebar}
        className={`absolute top-0 w-32 ${
          isSidebarOpen ? '-left-28' : '-right-4'
        } hover:left-0 transition-position-right delay-100 bg-[#fca311] text-black p-1.5 rounded-sm`}
      >
        {isSidebarOpen ? 'Close' : 'Open'} Sidebar
      </button>
    </aside>
  );
}

SideBar.propTypes = {
  children: PropTypes.element,
  header: PropTypes.element,
  title: PropTypes.string,
};
