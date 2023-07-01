import getDefaultStyles from '@/util/getDefaultStyles';
import getResetCSS from '@/util/getResetCSS';

const resetCss = getResetCSS();
const defaultStyles = getDefaultStyles();

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

    <style class="page-builder-dev-element">
      [page-builder-element="true"]:hover{
        border: 2px solid blue;
      }

      [replaceable="true"] {
        padding: 10px;
        background: yellow;
        color:black;
        cursor:pointer;
        margin: 5px;
      }

    </style>

    ${headerData}

    <script class="page-builder-dev-element">
      let target = null;
      let before = false;
      let draggingElement = null;

      function update() {
        const data = {event: 'update'};
        const copyDoc = document.body.cloneNode(true);
        const script = copyDoc.querySelectorAll('script');
        if(script) script.forEach(e => e.remove())
        data.data = copyDoc.innerHTML.toString().trim();
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
        e.stopPropagation();
        
        const data = {event: 'style'};
        const [targetClass] = e.currentTarget.className.match(/page-builder-identifier-[0-9A-z]+/);
        const id = e.currentTarget.getAttribute('page-builder-element-id')
        data.data = {targetClass, id};
        window.parent.postMessage(data);
      }
      
      function replacePlaceHolderElement(e) {
        e.stopPropagation();
        const data = {event: 'replacePlaceholderElement'};
        data.data = e.target.className;
        window.parent.postMessage(data);
      }

      function addEvent() {
        const elements = [...document.querySelectorAll("[replaceable='true']")];
        elements.forEach(el => el.addEventListener('click', replacePlaceHolderElement))
      }

      function getFinalData() {
        const docCopy = document.cloneNode(true);
        const devElements = [...docCopy.querySelectorAll(".page-builder-dev-element, [replaceable='true']")];
        devElements.forEach(el => el.remove());

        const elements = [...docCopy.querySelectorAll("[page-builder-element='true']")];
        
        const attributesToRemove = ['page-builder-element', 'onclick', 'draggable', 'ondragstart', 'page-builder-element-id'];

        elements.forEach(el => {
          attributesToRemove.forEach(attribute => {
            el.removeAttribute(attribute);
          });
        })
        return docCopy.documentElement.outerHTML.toString()
      }
    
      </script>
      
      
      </head>
      
   
      <body>
      ${body}
      <script class="page-builder-dev-element">addEvent()</script>
    </body>

  </html>`;
}
