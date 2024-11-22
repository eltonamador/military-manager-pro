import { jsPDF } from "jspdf";
import { PDF_CONFIG } from "./pdfConfig";

export const addFooter = (pdf: jsPDF, pageNumber: number, totalPages: number) => {
  const { margin, pageHeight, pageWidth, footerHeight } = PDF_CONFIG;
  
  // Position footer line higher from the bottom
  const footerLineY = pageHeight - footerHeight;
  pdf.setDrawColor(243, 113, 33);
  pdf.setLineWidth(0.3);
  pdf.line(margin, footerLineY, pageWidth - margin, footerLineY);
  
  // Position page numbers with more space from bottom
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  
  const pageText = `Página ${pageNumber} de ${totalPages}`;
  const textWidth = pdf.getStringUnitWidth(pageText) * 10 / pdf.internal.scaleFactor;
  pdf.text(
    pageText,
    (pageWidth - textWidth) / 2,
    footerLineY + 10
  );
};