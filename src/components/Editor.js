import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      const editorElement = document.getElementById('realtimeEditor');
      try {
        editorRef.current = CodeMirror(editorElement, {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          lineNumbers: true,
          autoCloseTags: true,
          autoCloseBrackets: true,
        });

        editorRef.current.on('change', (instance, changes) => {
          const { origin } = changes;
          const code = instance.getValue();
          onCodeChange(code);
          if (origin !== 'setValue') {
            socketRef.current.emit(ACTIONS.CODE_CHANGE, {
              roomId,
              code,
            });
          }
        });
      } catch (error) {
        console.error('CodeMirror initialization failed:', error);
      }
    }
    init();
  }, [socketRef, roomId]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(`${code}`);
        }
      });
    }
  }, [socketRef.current]);

  return <div id="realtimeEditor"></div>;
};

export default Editor;
