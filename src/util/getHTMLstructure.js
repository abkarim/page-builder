export default function getHTMLstructure(headerData, body) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headerData}

    <style class="page-builder-dev-element">
    
      .siblings-of-currently-dragging-item[page-builder-element="true"]{
        outline: 2px solid red;
        outline-offset: 5px;
      }

      // [page-builder-element="true"]{
      //   outline: 2px solid red;
      //   outline-offset: 5px;
      // }

    </style>

    <script class="page-builder-dev-element">
      let target = null;
      let before = false;
      let draggingElement = null;

      function createElementFromHTML(html) {
        const element = document.createElement('div');
        element.innerHTML = html;
        return element.children[0];
      }

      window.addEventListener('drop', function (e) {
        const type = e.dataTransfer.getData('type');
      
        const data = {
          event: 'drop',
          data: '',
        };
        
        
        if( type ){
          
          let element = draggingElement;

          if(!element) {
            element = createElementFromHTML(window.parent.draggingData)
          }
          
          if(type === "copy") {
            element = element.cloneNode(true);
          }
          
          if(before === true) {
            target.parentElement.insertBefore(element, target);
          }else {
            if(target) {
              target.parentElement.insertBefore(element, target.nextSibling);
            }else {
              document.body.appendChild(element)
            }
          }

        }else {
          const droppedElement = createElementFromHTML(e.dataTransfer.getData("html"));
          document.body.appendChild(droppedElement);
        }

        data.data = document.body.innerHTML.toString().trim();
        window.parent.postMessage(data);
        target = null;
        draggingElement = null;
      });
      
      window.addEventListener('dragover', function (e) {
        e.preventDefault();
        
        if(e.target?.hasAttribute("page-builder-element")) {
          target = e.target;
          const {width, height} = target.getBoundingClientRect();
          const {clientX, clientY} = e;
          before = (width > clientX && height > clientY);
        }else {
          target = null;
        }

      });

      function dragStart(e) {
        e.dataTransfer.effectAllowed = "copyMove";
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("type", "move");
        draggingElement = e.target;
      }
    
    </script>

  </head>
    
    <body>
      ${body}
    </body>

  </html>`;
}
