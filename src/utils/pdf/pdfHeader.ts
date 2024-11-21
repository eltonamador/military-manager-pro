import { jsPDF } from "jspdf";
import { PDF_CONFIG, getContentWidth } from "./pdfConfig";

export const addHeader = async (pdf: jsPDF): Promise<number> => {
  const { margin, headerHeight } = PDF_CONFIG;
  let currentY = margin;

  // Add logo
  try {
    const logoImg = new Image();
    logoImg.src = "/escaladohj2.webp";
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });
    pdf.addImage(logoImg, "WEBP", margin, currentY, 20, 20);
  } catch (error) {
    console.error("Failed to load logo:", error);
  }

  currentY += 25;
  pdf.setLineWidth(0.5);
  pdf.line(margin, currentY, PDF_CONFIG.pageWidth - margin, currentY);

  // Header text
  currentY += 10;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(PDF_CONFIG.textColors.primary);
  
  const headerText = "CORPO DE BOMBEIROS MILITAR DO AMAPÁ";
  const headerWidth = pdf.getStringUnitWidth(headerText) * 16 / pdf.internal.scaleFactor;
  const headerX = (PDF_CONFIG.pageWidth - headerWidth) / 2;
  pdf.text(headerText, headerX, currentY);

  // Subheaders
  pdf.setFontSize(12);
  pdf.setTextColor(PDF_CONFIG.textColors.secondary);
  
  currentY += 10;
  const subHeaders = [
    "COMANDO OPERACIONAL",
    "MILITARES E VIATURAS NO SERVIÇO OPERACIONAL"
  ];

  for (const text of subHeaders) {
    const width = pdf.getStringUnitWidth(text) * 12 / pdf.internal.scaleFactor;
    pdf.text(text, (PDF_CONFIG.pageWidth - width) / 2, currentY);
    currentY += 10;
  }

  // Date
  currentY += 5;
  pdf.setFontSize(10);
  pdf.setTextColor(PDF_CONFIG.textColors.tertiary);
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  pdf.text(`Data: ${currentDate}`, margin, currentY);

  return currentY + 10;
};