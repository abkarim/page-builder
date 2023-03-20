export default function getUniqueClassName() {
  return `page-builder-identifier-${Math.random().toString(36).substr(2, 9)}`;
}
