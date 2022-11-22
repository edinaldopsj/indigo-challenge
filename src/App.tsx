import React, { ReactNode, useCallback, useState } from 'react';

type RootElements = 'ul' | 'p' | 'h1' | 'h2';

type Block = {
  element: RootElements | 'li';
  children: (Block | string)[];
};

interface Render {
  h1: (value: (Block | string)[]) => ReactNode;
  h2: (value: (Block | string)[]) => ReactNode;
  p: (value: (Block | string)[]) => ReactNode;
  ul: (value: (Block | string)[]) => ReactNode;
}

const renders: Render = {
  h1: (value) => <h1>{value[0] as string}</h1>,
  h2: (value) => <h2>{value[0] as string}</h2>,
  p: (value) => <p>{value[0] as string}</p>,
  ul: (value) => (
    <ul>
      {(value as Block[]).map((text, index) => (
        <li key={index}>{text.children[0] as string}</li>
      ))}
    </ul>
  ),
};

const parseMarkdown = (markdown: string): Block[] => {
  const blocks = markdown.split('\n\n');
  let parsed: Block[] = [];

  for (let index = 0; index < blocks.length; index++) {
    let block = blocks[index];
    let lines = block.split('\n');

    let ulBlock: Block = {
      element: 'ul',
      children: [],
    };

    for (let j = 0; j < lines.length; j++) {
      const element = lines[j];

      if (element === '') {
        continue;
      }

      const currentElement = parseElement(element);

      if (currentElement.element === 'li') {
        if (ulBlock.children.length === 0) {
          parsed.push(ulBlock);
        }

        ulBlock.children.push(currentElement);
      } else {
        parsed.push(currentElement);
      }
    }
  }

  return parsed;
};

const parseElement = (line: string): Block => {
  if (line.substring(0, 2) === '# ') {
    return {
      element: 'h1',
      children: [line.substring(2, line.length)],
    };
  }
  if (line.substring(0, 3) === '## ') {
    return {
      element: 'h2',
      children: [line.substring(3, line.length)],
    };
  }
  if (['*', '-'].includes(line.substring(0, 1))) {
    return {
      element: 'li',
      children: [line.substring(1, line.length)],
    };
  }
  return { element: 'p', children: [line] };
};

function App() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBlocks(parseMarkdown(e.target.value));
  };

  const renderPreview = useCallback(() => {
    return <div>{blocks.map((b) => renders[b.element as RootElements](b.children))}</div>;
  }, [blocks]);

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <div style={{ flex: 1 }}>
        <textarea
          data-testid="markdown"
          placeholder="Please type the markdown text here"
          style={{ width: '100%' }}
          onChange={handleOnChange}
          rows={5}
        />
      </div>
      <div data-testid="preview" style={{ border: '1px solid', flex: 1 }}>
        {renderPreview()}
      </div>
    </div>
  );
}

export default App;
