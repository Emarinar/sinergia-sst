import React from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class MyEditorDraft extends React.Component {
  constructor(props) {
    super(props);
    // Estado inicial antes de montar
    if (props.initialContent) {
      const blocksFromHTML = convertFromHTML(props.initialContent);
      const content = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      this.state = { editorState: EditorState.createWithContent(content) };
    } else {
      this.state = { editorState: EditorState.createEmpty() };
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState }, () => {
      const html = draftToHtml(
        this.state.editorState.getCurrentContent()
      );
      this.props.onContentChange(html);
    });
  };

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={this.onEditorStateChange}
      />
    );
  }
}

export default MyEditorDraft;
