import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router";
import mammoth from "mammoth"; // Import mammoth for docx parsing

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

    // Set placeholder when editor is empty
    editor.setAttribute("data-placeholder", "Start typing here...");
    setQuill(q);
  }, []);

  useEffect(() => {
    if (quill) {
      // Set the default content if text is provided
      if (text) {
        const currentContent = quill.root.innerHTML;

        if (currentContent !== text) {
          const range = quill.getSelection(); // Get the current selection range
          quill.root.innerHTML = text; // Update the content in the editor

          // Restore the selection if it was present
          if (range) {
            quill.setSelection(range.index, range.length);
          }
        }
      }

      // Listen for changes and pass them to the parent component
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML); // Pass the HTML content to the parent
      });

      // Handle placeholder visibility based on editor focus and content
      const editor = quill.root;

      // Focus event - hide placeholder
      editor.addEventListener("focus", () => {
        if (editor.innerHTML.trim() === "") {
          editor.classList.add("focused");
        }
      });

      // Blur event - show placeholder if content is empty
      editor.addEventListener("blur", () => {
        if (editor.innerHTML.trim() === "") {
          editor.classList.remove("focused");
        }
      });
    }
  }, [quill, text, onChange]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;

        // Convert the arrayBuffer to HTML using mammoth
        mammoth.convertToHtml({ arrayBuffer })
          .then((result) => {
            // Set the converted HTML into the Quill editor
            quill.root.innerHTML = result.value;
          })
          .catch((err) => {
            console.error("Error converting file:", err);
          });
      };
      reader.readAsArrayBuffer(file); // Read the file as an arrayBuffer
    } else {
      alert("Please upload a valid .docx file");
    }
  };

  return (
    <div className="container">
      <input
        type="file"
        accept=".docx"
        onChange={handleFileUpload}
        style={{ marginBottom: "10px" }}
      />
      <div ref={wrapperRef}></div>
    </div>
  );
}
