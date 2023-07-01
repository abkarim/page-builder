import PropType from 'prop-types';
import InputText from '@/components/input/Text';

export default function PageHeader({
  pageTitle,
  setPageTitle,
  onSave,
  ...props
}) {
  return (
    <header
      className="bg-[#e5e5e5] pl-1.5 border-b-2 border-black flex justify-between items-center"
      {...props}
    >
      <InputText
        value={pageTitle}
        onInput={(e) => {
          setPageTitle(e.target.value);
        }}
      />
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
  setPageTitle: PropType.func,
  onSave: PropType.func,
};
