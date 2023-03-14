import PropType from 'prop-types';

export default function PageHeader({ pageTitle, onSave, ...props }) {
  return (
    <header
      className="bg-[#e5e5e5] pl-1.5 border-b-2 border-black flex justify-between items-center"
      {...props}
    >
      <h6 title="page title">{pageTitle}</h6>
      <button
        type="button"
        onClick={onSave}
        className="bg-blue-500 p-1.5 outline-none text-white"
      >
        Save
      </button>
    </header>
  );
}

PageHeader.propTypes = {
  pageTitle: PropType.string,
  onSave: PropType.func,
};
