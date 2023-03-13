import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

import SideBar from '../components/Sidebar';
import Block from '../components/Block';
import PageHeader from '../components/PageHeader';
import AddNewBlock from '../components/AddNewBlock';

const Blocks = () => {
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
        return <Block key={id} block={block} />;
      })}
    </div>
  );
};

function PageCanvas() {
  const [pageData, setPageData] = useState('');

  const dragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const drop = (e) => {
    setPageData((prev) => prev + e.dataTransfer.getData('html'));
  };

  return (
    <div
      onDragOver={dragOver}
      onDrop={drop}
      className="border border-t-0 border-black"
    >
      <div dangerouslySetInnerHTML={{ __html: pageData }} />
      <AddNewBlock />
    </div>
  );
}

export default function NewPage() {
  const [pageData, setPageData] = useState({
    meta: {
      title: 'New Page',
    },
    sidebar: {
      title: 'Blocks',
    },
  });

  return (
    <main className="flex justify-between">
      <SideBar title={pageData.sidebar.title}>
        <Blocks />
      </SideBar>

      <section className="w-full ml-1">
        <PageHeader pageTitle={pageData.meta.title} />
        <PageCanvas />
      </section>
    </main>
  );
}
