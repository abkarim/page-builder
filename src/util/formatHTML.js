import pretty from 'pretty';

export default function formatHTML(html) {
  return pretty(html, { ocd: false });
}
