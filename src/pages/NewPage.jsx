import { useCallback, useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { save } from '@tauri-apps/api/dialog';
import PropType from 'prop-types';

import getResetCSS from '../util/getResetCss';
import getHTMLstructure from '../util/getHTMLstructure';

import SideBar from '../components/Sidebar';
import Block from '../components/Block';
import PageHeader from '../components/PageHeader';
import AddNewBlock from '../components/AddNewBlock';
import formatHTML from '../util/formatHTML';

import Border from '../components/stylesEditor/Border';
import Color from '../components/stylesEditor/Color';
import Font from '../components/stylesEditor/Font';
import Margin from '../components/stylesEditor/Margin';
import Padding from '../components/stylesEditor/Padding';
import Position from '../components/stylesEditor/Position';
import Shadow from '../components/stylesEditor/Shadow';
import Size from '../components/stylesEditor/Size';
import Transform from '../components/stylesEditor/Transform';
import getAcceptedStyle from '../util/getAcceptedStyle';
import prepareCSS from '../util/prepareCSS';
import sleep from '../util/sleep';

const Blocks = ({ addElement }) => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    invoke('get_blocks')
      .then((res) => setBlocks(JSON.parse(res)))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {blocks.map((block, id) => {
        return <Block key={id} block={block} addElement={addElement} />;
      })}
    </div>
  );
};

const StylesEditor = ({
  elementClassName,
  elementsBlockId,
  styles,
  setStyles,
}) => {
  /**
   * TODO
   * get applicable styles by block id
   * create styles abd append to data
   * changeable tag
   */

  const acceptedStyles = getAcceptedStyle(elementsBlockId);

  const [style, setStyle] = useState({});
  const loaded = useRef(false);

  //* Prepare style on load
  useEffect(() => {
    if (styles.hasOwnProperty(elementClassName)) {
      let targetStyle = { ...style, ...styles[elementClassName] };
      setStyle({ ...targetStyle });
    }
    loaded.current = true;
  }, [elementClassName]);

  // Update final element
  useEffect(() => {
    // * Prepare final style for this element
    const newStyle = style;
    const keys = Object.keys(style);
    newStyle.final = '';
    keys.forEach((key) => {
      if (style[key].final) {
        newStyle.final += style[key].final;
      }
    });

    setStyles({ ...styles, [`${elementClassName}`]: newStyle });
  }, [style, elementClassName]);
  return (
    loaded.current === true && (
      <div>
        <Border prevData={style} setStyle={setStyle} />
        <Color prevDataObj={{}} />
        <Font prevDataObj={{}} />
        <Margin prevDataObj={{}} />
        <Padding prevDataObj={{}} />
        <Position prevDataObj={{}} />
        <Shadow prevDataObj={{}} />
        <Size prevDataObj={{}} />
        <Transform prevDataObj={{}} />
      </div>
    )
  );
};

export default function NewPage() {
  const [pageData, setPageData] = useState({
    meta: {
      title: 'New Page',
    },
    styles: {},
    sidebar: {
      title: 'Blocks',
      forcefullyOpen: false,
    },
    iframeHeight: 0,
    currentlySelectedElementClassName: '',
    currentlySelectedElementsBlockId: null,
  });
  const [pageContent, setPageContent] = useState('');
  const iframe = useRef(null);

  const addElement = (element) => {
    setPageContent((prev) => prev + element);
  };

  const updatePageTitle = useCallback((value) => {
    setPageData((prev) => {
      return { ...prev, meta: { ...prev.meta, title: value } };
    });
  });

  useEffect(() => {
    async function receiveMessage(e) {
      const { data, event } = e.data;
      if (e.source !== iframe.current.contentWindow) return;

      // Add new element
      if (event === 'drop') {
        setPageContent(data);
      }

      // Add style
      if (event === 'style') {
        //? This function is for mounting and unmounting styles component
        // ! Bug
        // Component values doesn't change on element change
        setPageData((prev) => {
          return {
            ...prev,
            sidebar: {
              ...prev.sidebar,
              /**
               * empty page title to remove previous styles component
               * re render required to change value
               */
              title: '',
            },
          };
        });

        await sleep(0.1);

        setPageData((prev) => {
          return {
            ...prev,
            currentlySelectedElementClassName: data.targetClass,
            currentlySelectedElementsBlockId: parseInt(data.id),
            sidebar: {
              ...prev.sidebar,
              /**
               * Set page title to Styles
               * to open styles editor
               */
              title: 'Styles',
              forcefullyOpen: true,
            },
          };
        });
      }
    }

    window.addEventListener('message', receiveMessage, false);

    return () => window.removeEventListener('message', receiveMessage, false);
  }, []);

  const newBlock = () => {
    setPageData((prev) => {
      return {
        ...prev,
        sidebar: {
          ...prev.sidebar,
          /**
           * Set page title to Blocks
           * to open blocks list
           */
          title: 'Blocks',
          forcefullyOpen: true,
        },
      };
    });

    setTimeout(() => {
      setPageData((prev) => {
        return { ...prev, sidebar: { ...prev.sidebar, forcefullyOpen: false } };
      });
    }, 200);
  };

  function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  function drop(e) {
    addElement(e.dataTransfer.getData('html'));
  }

  const setStyles = useCallback((styles) => {
    setPageData((prev) => {
      return { ...prev, styles };
    });
  });

  const generateHeaderData = useCallback(() => {
    let data = `<title>${pageData.meta.title}</title>`;
    data += `<style>${prepareCSS(pageData.styles)}</style>`;
    return data;
  }, [pageData.meta, pageData.styles]);

  const generateHTML = useCallback(() => {
    return `${getHTMLstructure(generateHeaderData(), pageContent)}`;
  }, [pageContent, pageData.meta, pageData.styles]);

  const saveData = async () => {
    // TODO replace with rust
    const filePath = await save({
      filters: [
        {
          name: 'html',
          extensions: ['html'],
        },
      ],
    });

    if (filePath === null) return;

    try {
      await invoke('save_page', {
        filename: filePath,
        content: formatHTML(generateHTML()),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex justify-between">
      <SideBar
        title={pageData.sidebar.title}
        openSidebarForcefully={pageData.sidebar.forcefullyOpen}
      >
        {pageData.sidebar.title === 'Blocks' ? (
          <Blocks addElement={addElement} />
        ) : (
          pageData.sidebar.title === 'Styles' && (
            <StylesEditor
              elementClassName={pageData.currentlySelectedElementClassName}
              elementsBlockId={pageData.currentlySelectedElementsBlockId}
              styles={pageData.styles}
              setStyles={setStyles}
            />
          )
        )}
      </SideBar>

      <section className="w-full ml-1">
        <PageHeader
          pageTitle={pageData.meta.title}
          setPageTitle={updatePageTitle}
          onSave={saveData}
        />
        <div
          onDragOver={dragOver}
          onDrop={drop}
          className="border border-t-0 border-black"
        >
          <iframe
            ref={iframe}
            srcDoc={generateHTML()}
            height={pageData.iframeHeight}
            onDragOver={dragOver}
            onDrop={drop}
            // eslint-disable-next-line react/no-unknown-property
            allow-scripts="true"
            className="w-full"
            onLoad={(e) =>
              setPageData((prev) => {
                return {
                  ...prev,
                  iframeHeight:
                    e.target.contentWindow.document.body.scrollHeight +
                    50 +
                    'px',
                };
              })
            }
          />
          <AddNewBlock onClick={newBlock} />
        </div>
      </section>
    </main>
  );
}

Blocks.propTypes = {
  addElement: PropType.func,
};

StylesEditor.propTypes = {
  elementClassName: PropType.string,
  elementsBlockId: PropType.number,
  styles: PropType.object,
  setStyles: PropType.func,
};
