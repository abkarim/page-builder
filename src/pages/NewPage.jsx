import { useCallback, useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { save } from '@tauri-apps/api/dialog';
import PropType from 'prop-types';

import PageEditor from '../components/PageEditor';

import SideBar from '../components/Sidebar';
import Block from '../components/Block';
import PageHeader from '../components/PageHeader';
import AddNewBlock from '../components/AddNewBlock';

import getHTMLstructure from '../util/getHTMLstructure';
import formatHTML from '../util/formatHTML';
import prepareCSS from '../util/prepareCSS';
import sleep from '../util/sleep';
import Editors from '../components/Editors';

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

export default function NewPage() {
  const [pageData, setPageData] = useState({
    meta: {
      title: 'New Page',
    },
    styles: {},
    sidebar: {
      title: 'Page',
      forcefullyOpen: false,
    },
    iframeHeight: 0,
    currentlySelectedElementClassName: '',
    currentlySelectedElementsBlockId: null,
    replaceableElement: null,
  });
  const [pageContent, setPageContent] = useState('');
  const iframe = useRef(null);

  const addElement = (element) => {
    if (pageData.replaceableElement !== null) {
      const newElement =
        iframe.current.contentWindow.createElementFromHTML(element);
      const oldElement = iframe.current.contentDocument.querySelector(`
      .${pageData.replaceableElement}:not([page-builder-element="true"])
      `);
      oldElement.replaceWith(newElement);
      iframe.current.contentWindow.update();
      setPageData((prev) => {
        return { ...prev, replaceableElement: null };
      });
    } else {
      setPageContent((prev) => prev + element);
    }
  };

  const updatePageTitle = useCallback((value) => {
    setPageData((prev) => {
      return { ...prev, meta: { ...prev.meta, title: value } };
    });
  });

  const navigate = (title = 'Page') => {
    setPageData((prev) => {
      return { ...prev, sidebar: { ...prev.sidebar, title } };
    });
  };

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
              title: 'Editor',
              forcefullyOpen: true,
            },
          };
        });
      }

      if (event === 'update') {
        setPageContent(data);
      }

      if (event === 'replacePlaceholderElement') {
        // ! Bug
        setPageData((prev) => {
          return {
            ...prev,
            sidebar: {
              ...prev.sidebar,
              title: '',
            },
          };
        });

        await sleep(0.1);

        /**
         * Get placeholder identifier
         * Opens Block section
         * Get block
         * Replace the element in iframe with the element
         * clear identifier
         */
        setPageData((prev) => {
          return {
            ...prev,
            sidebar: {
              ...prev.sidebar,
              /**
               * Set page title to Styles
               * to open styles editor
               */
              title: 'Blocks',
              forcefullyOpen: true,
            },
            replaceableElement: data,
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
    return `<title>${pageData.meta.title}</title>
    <style>${prepareCSS(pageData.styles)}</style>`;
  }, [pageData.meta, pageData.styles]);

  const generateHTML = useCallback(() => {
    return `${getHTMLstructure(generateHeaderData(), pageContent)}`;
  }, [pageContent, pageData.meta, pageData.styles]);

  const saveData = async () => {
    let data = iframe.current.contentWindow.getFinalData();

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
        content: formatHTML(`<!DOCTYPE html>\n${data}`),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex justify-between h-screen overflow-hidden">
      <SideBar title={pageData.sidebar.title} navigate={navigate}>
        <div>
          {pageData.sidebar.title === 'Blocks' && (
            <Blocks addElement={addElement} />
          )}
          {pageData.sidebar.title === 'Page' && (
            <PageEditor
              iframe={iframe.current}
              styles={pageData.styles}
              navigate={navigate}
            />
          )}
          {pageData.sidebar.title === 'Editor' && (
            <Editors
              elementClassName={pageData.currentlySelectedElementClassName}
              elementsBlockId={pageData.currentlySelectedElementsBlockId}
              styles={pageData.styles}
              setStyles={setStyles}
              iframe={iframe.current}
            />
          )}
        </div>
      </SideBar>

      <section className="w-full ">
        <PageHeader
          pageTitle={pageData.meta.title}
          setPageTitle={updatePageTitle}
          onSave={saveData}
        />
        <div
          onDragOver={dragOver}
          onDrop={drop}
          className="h-full overflow-y-scroll px-2"
        >
          <iframe
            ref={iframe}
            srcDoc={generateHTML()}
            height={pageData.iframeHeight}
            onDragOver={dragOver}
            onDrop={drop}
            // eslint-disable-next-line react/no-unknown-property
            allow-scripts="true"
            className="w-full h-full"
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
