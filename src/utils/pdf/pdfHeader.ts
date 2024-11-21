import { jsPDF } from "jspdf";
import { PDF_CONFIG, getContentWidth } from "./pdfConfig";

export const addHeader = async (pdf: jsPDF): Promise<number> => {
  const { margin, headerHeight, logos } = PDF_CONFIG;
  let currentY = margin;

  // Add logos
  try {
    // Left logo
    const leftLogoImg = new Image();
    leftLogoImg.src = logos.left;
    await new Promise((resolve, reject) => {
      leftLogoImg.onload = resolve;
      leftLogoImg.onerror = reject;
    });
    pdf.addImage(leftLogoImg, "PNG", margin, currentY, 30, 30);

    // Right logo
    const rightLogoImg = new Image();
    rightLogoImg.src = logos.right;
    await new Promise((resolve, reject) => {
      rightLogoImg.onload = resolve;
      rightLogoImg.onerror = reject;
    });
    pdf.addImage(rightLogoImg, "PNG", PDF_CONFIG.pageWidth - margin - 30, currentY, 30, 30);
  } catch (error) {
    console.error("Failed to load logos:", error);
  }

  // Header text
  currentY += 15;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(PDF_CONFIG.textColors.primary);
  
  const headers = [
    "ESTADO DO AMAPÁ",
    "CORPO DE BOMBEIROS MILITAR",
    "DIRETORIA DE INTELIGÊNCIA E OPERAÇÕES"
  ];

  headers.forEach((text) => {
    const textWidth = pdf.getStringUnitWidth(text) * 14 / pdf.internal.scaleFactor;
    const textX = (PDF_CONFIG.pageWidth - textWidth) / 2;
    pdf.text(text, textX, currentY);
    currentY += 8;
  });

  // Add separator line
  currentY += 5;
  pdf.setLineWidth(0.5);
  pdf.line(margin, currentY, PDF_CONFIG.pageWidth - margin, currentY);

  // Add report title
  currentY += 10;
  pdf.setFontSize(12);
  pdf.setTextColor(PDF_CONFIG.textColors.secondary);
  const reportTitle = "RELATÓRIO DO SERVIÇO OPERACIONAL";
  const titleWidth = pdf.getStringUnitWidth(reportTitle) * 12 / pdf.internal.scaleFactor;
  pdf.text(reportTitle, (PDF_CONFIG.pageWidth - titleWidth) / 2, currentY);

  return currentY + 15;
};