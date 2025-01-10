import React from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Button } from "antd";

const ExportToDocx = ({ htmlContent }) => {
  const handleExportDocx = () => {
    // Parse the HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Extract text content from HTML and build paragraphs
    const paragraphs = Array.from(tempDiv.children).map((child) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: child.textContent,
            bold: child.tagName === "H1" || child.tagName === "H2", // Bold for headers
            break: 1,
          }),
        ],
      });
    });

    // Create a new Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Generate and download the Word document
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "document.docx");
    });
  };

  return (
    <>
      <Button onClick={handleExportDocx} style={{ marginLeft: "10px" }}>
        Export to Docx
      </Button>
    </>
  );
};

export default ExportToDocx;
