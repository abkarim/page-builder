import getResetCSS from './getResetCss';

const resetCss = getResetCSS();
const defaultStyles = '';

export default function getHTMLstructure(headerData, body) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
      ${resetCss}
    </style>

    <style>
      ${defaultStyles}
    </style>

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

      function update() {
        const data = {event: 'update'};
        data.data = document.body.innerHTML.toString().trim();
        window.parent.postMessage(data);
      }

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
        
        if(e.dataTransfer.getData("type") === "move") {    
        }

      }

      function handleStyle(e) {
        // Don't listen for event
        // Applicable for button, anchor etc
        e.preventDefault();
        
        const data = {event: 'style'};
        const [targetClass] = e.target.className.match(/page-builder-identifier-[0-9A-z]+/gm);
        const id = e.target.getAttribute('page-builder-element-id')
        data.data = {targetClass, id};
        window.parent.postMessage(data);
      }
    
    </script>

  </head>
    
    <body>
      ${body}
    </body>

  </html>`;
}
