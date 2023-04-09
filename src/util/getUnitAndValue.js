export default function getUnitAndValue(string) {
  const groups = string.match(/(?<value>-?[0-9.]+)(?<unit>[%A-z]+)?/).groups;
  return groups;
}
