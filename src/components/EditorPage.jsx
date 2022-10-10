import React, { useEffect, useRef, useState } from "react";
import Codemirror, { changeEnd, commands } from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/tomorrow-night-eighties.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Action";
import codemirror from "codemirror";
import axios from "axios";

const EditorPage = ({ socketRef, roomID, onCodeChange }) => {
  const [Code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
 




  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("editor"),
        {
          mode: { name: "javascript", json: true },
          theme: " tomorrow-night-eighties",
          autoCloseTags: true,
          autoCloseBrackets: true,
          autocorrect: true,
          lineNumbers: true,
          // spellcheck: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        // console.log("changes", changes);
        const { origin } = changes;
        const code = instance.getValue(); ///je kahi pn lihu aapn editor vr te get hoil ithe
        setCode(instance.getValue());
        
       
        onCodeChange(code);

        // setValue will give u default value ji lihil aahe editor vr by default;
        if (origin !== "setValue") {
          // console.log("im here", code);
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomID,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
       

      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  // ----------------------handle submit function---------------------

  

  return (
    <>
      <textarea id="editor" />
    
    </>
  );
};

export default EditorPage;
