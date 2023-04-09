import SelectInput from './Select';
import unit from '../../util/unit';

export default function UnitInput({ ...props }) {
  return (
    <SelectInput className="border-l-2" {...props}>
      {unit()}
    </SelectInput>
  );
}
