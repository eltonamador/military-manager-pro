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
    pdf.addImage(leftLogoImg, "PNG", margin, currentY, 25, 25);

    // Right logo
    const rightLogoImg = new Image();
    rightLogoImg.src = logos.right;
    await new Promise((resolve, reject) => {
      rightLogoImg.onload = resolve;
      rightLogoImg.onerror = reject;
    });
    pdf.addImage(rightLogoImg, "PNG", PDF_CONFIG.pageWidth - margin - 25, currentY, 25, 25);
  } catch (error) {
    console.error("Failed to load logos:", error);
  }

  // Header text
  currentY += 10;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);

  const headers = [
    "ESTADO DO AMAPÁ",
    "CORPO DE BOMBEIROS MILITAR",
    "DIRETORIA DE INTELIGÊNCIA E OPERAÇÕES"
  ];

  headers.forEach(text => {
    const textWidth = pdf.getStringUnitWidth(text) * 14 / pdf.internal.scaleFactor;
    const textX = (PDF_CONFIG.pageWidth - textWidth) / 2;
    currentY += 8;
    pdf.text(text, textX, currentY);
  });

  // Add line under header
  currentY += 10;
  pdf.setLineWidth(0.5);
  pdf.line(margin, currentY, PDF_CONFIG.pageWidth - margin, currentY);

  // Add report title
  currentY += 10;
  const reportDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  pdf.setFontSize(12);
  const reportTitle = "RELATÓRIO DO SERVIÇO OPERACIONAL";
  const titleWidth = pdf.getStringUnitWidth(reportTitle) * 12 / pdf.internal.scaleFactor;
  pdf.text(reportTitle, (PDF_CONFIG.pageWidth - titleWidth) / 2, currentY);

  currentY += 8;
  pdf.setFontSize(10);
  const dateText = `Macapá-AP, ${reportDate}`;
  const dateWidth = pdf.getStringUnitWidth(dateText) * 10 / pdf.internal.scaleFactor;
  pdf.text(dateText, (PDF_CONFIG.pageWidth - dateWidth) / 2, currentY);

  return currentY + 15;
};