import fontWeights from '../../util/fontWeights';
import SelectInput from './Select';

const data = fontWeights();

export default function FontWeight({ ...props }) {
  return (
    <SelectInput className="border-x-2 w-full" {...props}>
      {data}
    </SelectInput>
  );
}
