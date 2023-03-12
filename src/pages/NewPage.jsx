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
        return <Block key={id} description={block.name} />;
      })}
    </div>
  );
};

function PageCanvas() {
  const dragOver = (e) => {
    e.preventDefault();
    console.log('over');
  };

  const drop = (e) => {
    console.log('drop');
  };

  return (
    <div onDragOver={dragOver} onDrop={drop} className="p-2">
      drag zone here
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
        <div className="border border-t-0 border-black">
          <PageCanvas />
          <AddNewBlock />
        </div>
      </section>
    </main>
  );
}
