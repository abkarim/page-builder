import fonts from '../../util/fonts';
import SelectInput from './Select';

export default function FontFamily({ ...props }) {
  return (
    <SelectInput className="border-x-2 w-full" {...props}>
      {fonts()}
    </SelectInput>
  );
}
