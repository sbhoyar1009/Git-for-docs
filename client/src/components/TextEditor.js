import React, { useState, useCallback, useEffect } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import mammoth from "mammoth";

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

const TextEditor = ({ text, onChange }) => {
  const [quill, setQuill] = useState(null);

  // Initialize Quill editor
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);
  }, []);

  // Handle file upload and populate Quill editor
  
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

      // Optionally, you can listen for changes and pass them to the parent component
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
  
  
  const handleFileUpload = async (file) => {
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      message.error("You can only upload .docx files!");
      return false;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = await mammoth.convertToHtml({
          arrayBuffer: e.target.result,
        });
        const htmlContent = result.value;

        if (quill) {
          quill.root.innerHTML = htmlContent; // Populate Quill editor
        }
        message.success("File uploaded successfully!");
      } catch (error) {
        message.error("Failed to process the document!");
      }
    };
    reader.readAsArrayBuffer(file);

    return false;
  };

  // Upload component props
  const uploadProps = {
    name: "file",
    accept: ".docx",
    multiple: false,
    beforeUpload: handleFileUpload, // Use file handler function
    showUploadList: false, // Hide default file list
  };

  return (
    <div>
      <div style={{margin:'10px'}}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Click to Import</Button>
        </Upload>
      </div>
      <div
        className="container"
        ref={wrapperRef}
        style={{ marginTop: "20px", height: "400px" }}
      ></div>
    </div>
  );
};

export default TextEditor;
