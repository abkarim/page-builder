export default function getHTMLstructure(headerData, body) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headerData}

    <script id="dev-element">
    
      function allowDrop(e) {
        e.preventDefault();
      }
      function drop(e) {
        e.preventDefault();
      }
      
      window.addEventListener('drop', function (e) {
        window.parent.postMessage({
          event: 'drop',
          data: e.dataTransfer.getData('html'),
        });
      });
      
      window.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      });
    
    </script>

  </head>
    
    <body>
      ${body}
    </body>

  </html>`;
}
