import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { save } from '@tauri-apps/api/dialog';
import PropType from 'prop-types';

import getResetCSS from '../util/getResetCss';
import getHTMLstructure from '../util/getHTMLstructure';

import SideBar from '../components/Sidebar';
import Block from '../components/Block';
import PageHeader from '../components/PageHeader';
import AddNewBlock from '../components/AddNewBlock';

const Blocks = ({ setPageContent }) => {
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
        return <Block key={id} block={block} setPageContent={setPageContent} />;
      })}
    </div>
  );
};

export default function NewPage() {
  const [pageData, setPageData] = useState({
    meta: {
      title: 'New Page',
    },
    styles: getResetCSS(),
    sidebar: {
      title: 'Blocks',
      forcefullyOpen: false,
    },
    iframeHeight: 0,
  });
  const [pageContent, setPageContent] = useState('');

  const newBlock = (e) => {
    setPageData((prev) => {
      return { ...prev, sidebar: { ...prev.sidebar, forcefullyOpen: true } };
    });

    setTimeout(() => {
      setPageData((prev) => {
        return { ...prev, sidebar: { ...prev.sidebar, forcefullyOpen: false } };
      });
    }, 200);
  };

  const dragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const drop = (e) => {
    setPageContent((prev) => prev + e.dataTransfer.getData('html'));
  };

  const generateHeaderData = useCallback(() => {
    let data = `<title>${pageData.meta.title}</title>`;
    data += `<style>${pageData.styles}</style>`;
    return data;
  }, [pageData.meta, pageData.styles]);

  const generateHTML = useCallback(() => {
    return `${getHTMLstructure(generateHeaderData(), pageContent)}`;
  }, [pageContent]);

  const saveData = async () => {
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
        content: generateHTML(),
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
        <Blocks setPageContent={setPageContent} />
      </SideBar>

      <section className="w-full ml-1">
        <PageHeader pageTitle={pageData.meta.title} onSave={saveData} />
        <div
          onDragOver={dragOver}
          onDrop={drop}
          className="border border-t-0 border-black h-full"
        >
          <iframe
            srcDoc={generateHTML()}
            height={pageData.iframeHeight}
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
  setPageContent: PropType.func,
};
