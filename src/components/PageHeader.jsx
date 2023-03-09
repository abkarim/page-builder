import PropType from 'prop-types';

export default function PageHeader({ pageTitle, ...props }) {
  return (
    <header {...props} className="bg-[#e5e5e5] p-1.5 border-b-2 border-black">
      <h6 title="page title">{pageTitle}</h6>
    </header>
  );
}

PageHeader.propTypes = {
  pageTitle: PropType.string,
};
