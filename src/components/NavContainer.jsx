import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function NavContainer({
  text,
  icon,
  navigateTo = '#',
  ...props
}) {
  return (
    <Link to={navigateTo}>
      <section className="bg-[#e5e5e5] rounded-sm p-2 text-center" {...props}>
        <figure>
          <span className="font-bold text-3xl inline-block my-4">{icon}</span>
        </figure>
        <footer className="font-sans">{text}</footer>
      </section>
    </Link>
  );
}

NavContainer.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  navigateTo: PropTypes.string,
};
