import PropType from 'prop-types';

export default function SelectInput({ children = [], ...props }) {
  return (
    <select {...props}>
      {children.map((item, i) => {
        return (
          <option key={i} value={item.value}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
}

SelectInput.propTypes = {
  children: PropType.array,
};
