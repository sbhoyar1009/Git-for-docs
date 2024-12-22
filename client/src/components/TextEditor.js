import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor({ text, onChange }) {
  const [quill, setQuill] = useState();

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: {
          container: TOOLBAR_OPTIONS,
        },
      },
    });

    // q.disable()
    // q.setText("Loading...")
    setQuill(q);
  }, []);

  useEffect(() => {
    if (quill) {
      // Set the default content if text is provided
      if (text) {
        quill.root.innerHTML = text;
      }

      // Optionally, you can listen for changes and pass them to the parent component
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
        // Pass the HTML content to the parent
      });
    }
  }, [quill, text, onChange]);

  return <div className="container" ref={wrapperRef}></div>;
}
