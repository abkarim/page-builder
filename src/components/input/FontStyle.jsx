import SelectInput from './Select';

const styles = [
  { name: 'Normal', value: 'normal' },
  { name: 'Italic', value: 'italic' },
  { name: 'Oblique', value: 'oblique' },
  { name: 'Initial', value: 'initial' },
  { name: 'Inherit', value: 'inherit	' },
];

export default function FontStyle({ ...props }) {
  return (
    <SelectInput className="border-x-2 w-full" {...props}>
      {styles}
    </SelectInput>
  );
}
