import { useEffect, useState } from 'react';

import SideBar from '../components/Sidebar';
import Block from '../components/Block';
import PageHeader from '../components/PageHeader';
import AddNewBlock from '../components/AddNewBlock';

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    setBlocks([
      {
        id: 1,
        description: 'button',
      },
      {
        id: 2,
        description: 'heading',
      },
    ]);
  }, []);

  console.log({ blocks });

  return (
    <div className="grid grid-cols-2 gap-2">
      {blocks.map((block) => {
        return <Block key={block.id} description={block.description} />;
      })}
    </div>
  );
};

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
          <AddNewBlock />
        </div>
      </section>
    </main>
  );
}
