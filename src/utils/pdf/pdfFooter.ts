import { jsPDF } from "jspdf";
import { PDF_CONFIG } from "./pdfConfig";

export const addFooter = (pdf: jsPDF, pageNumber: number, totalPages: number) => {
  const { margin, pageHeight, pageWidth } = PDF_CONFIG;
  
  // Add footer line
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.line(margin, pageHeight - margin - 10, pageWidth - margin, pageHeight - margin - 10);
  
  // Add page number
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(
    `Página ${pageNumber} de ${totalPages}`,
    pageWidth - margin - 25,
    pageHeight - margin
  );
};