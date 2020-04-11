import React from 'react';
// eslint-disable-next-line
import {Editor, EditorState, convertToRaw, ContentBlock, genKey, ContentState, BlockMap, AtomicBlockUtils} from 'draft-js';
import './App.css';
import MapComponent from './components/MapComponent';

const App = () => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty(),
  );

  function add(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    const contentState: ContentState = editorState.getCurrentContent();
    const blockMap: BlockMap = contentState.getBlockMap();
    const newBlock = new ContentBlock({
      key: genKey(),
      text: " ",
      type: "atomic",
      data: {
        test: "wert",
      }
    });
    const newBlockMap = blockMap
      .toSeq()
      .concat([[newBlock.getKey(), newBlock]])
      .toOrderedMap();

    const newContentState: ContentState = contentState.set("blockMap", newBlockMap) as ContentState;
    setEditorState(EditorState.push(editorState, newContentState, "change-block-type"));
  }
  
  function save(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    const save = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    console.log(save);
  }

  return (
    <div className="App">
      <header className="App-header">
        Draft.js
      </header>
      <Editor editorState={editorState} onChange={setEditorState} blockRendererFn={customRenderer} />
      <button onClick={add}>Add</button>
      <button onClick={save}>Save</button>
    </div>
  );
}

function customRenderer(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'atomic') {
    return {
      component: MapComponent,
      editable: false,
      props: {
        foo: 'bar',
      },
    };
  }
}

export default App;
