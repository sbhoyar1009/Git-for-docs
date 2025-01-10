import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ExportPDF = ({ htmlContent }) => {
  const handleExportPDF = async () => {
    try {
      // Create a temporary DOM element for rendering
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px"; // Hide it off-screen
      tempDiv.innerHTML = htmlContent;

      // Append to body temporarily
      document.body.appendChild(tempDiv);

      // Convert HTML to canvas using html2canvas
      const canvas = await html2canvas(tempDiv);
      const imgData = canvas.toDataURL("image/png");

      // Remove the temporary div
      document.body.removeChild(tempDiv);

      // Create jsPDF instance
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate dimensions for the PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image data to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save("document.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      {/* Generate PDF Button */}
      <button onClick={handleExportPDF}>Generate PDF</button>
    </div>
  );
};

export default ExportPDF;
