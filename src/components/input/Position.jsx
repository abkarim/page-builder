import SelectInput from './Select';

const data = [
  { name: 'Static', value: 'static' },
  { name: 'Relative', value: 'relative' },
  { name: 'Fixed', value: 'fixed' },
  { name: 'Absolute', value: 'absolute' },
  { name: 'Sticky', value: 'sticky' },
];

export default function PositionInput({ ...props }) {
  return (
    <SelectInput className="border-x-2 w-full" {...props}>
      {data}
    </SelectInput>
  );
}
