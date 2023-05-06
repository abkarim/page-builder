import PropTypes from 'prop-types';

export default function SideBar({
  title,
  children,
  navigate = () => {},
  ...props
}) {
  return (
    <aside {...props} className={`relative`}>
      <section
        className={`bg-[#e5e5e5] overflow-y-scroll w-72 transition-width duration-500 ease h-screen`}
      >
        <div>
          <div className="border-b-2 border-black flex justify-between items-center">
            <h2 className="text-lg  font-semibold  p-1">{title}</h2>
            {title !== 'Page' && (
              <span
                className="cursor-pointer inline-block rotate-180"
                onClick={() => navigate()}
              >
                &#10140;
              </span>
            )}
          </div>
          <section className="p-1">{children}</section>
        </div>
      </section>
    </aside>
  );
}

SideBar.propTypes = {
  children: PropTypes.element,
  header: PropTypes.element,
  openSidebarForcefully: PropTypes.bool,
  navigate: PropTypes.func,
  title: PropTypes.string,
};
