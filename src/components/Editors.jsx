import { useState } from 'react';
import ElementEditors from '@/components/elementEditor/ElementEditors';
import StyleEditors from '@/components/stylesEditor/StyleEditors';

export default function Editors({ ...props }) {
  const [editor, setEditor] = useState('style');
  return (
    <div>
      <header className="flex justify-evenly gap-1">
        <button
          className={`bg-white w-full ${editor === 'style' && 'outline'}`}
          onClick={() => setEditor('style')}
        >
          style
        </button>
        <button
          className={`bg-white w-full ${editor === 'element' && 'outline'}`}
          onClick={() => setEditor('element')}
        >
          element
        </button>
      </header>
      <div className={`${editor === 'element' && 'hidden'}`}>
        <StyleEditors {...props} />
      </div>
      <div className={`${editor === 'style' && 'hidden'}`}>
        <ElementEditors {...props} />
      </div>
    </div>
  );
}
