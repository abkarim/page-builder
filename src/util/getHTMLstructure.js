export default function getHTMLstructure(headerData, body) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headerData}
  </head>
    
    <body>
      ${body}
    </body>

  </html>`;
}
