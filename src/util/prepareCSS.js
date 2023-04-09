export default function prepareCSS(obj) {
  let content = '';
  for (const [key, value] of Object.entries(obj)) {
    content = `${content} 
      .${key} {
        ${value.final}
      }
    `;
  }
  return content;
}
