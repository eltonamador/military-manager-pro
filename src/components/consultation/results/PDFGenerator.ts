import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return null;

    toast.loading("Gerando PDF...");
    
    // Create PDF with custom settings
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'cm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    // Add fonts
    pdf.addFont("helvetica", "Arial");
    pdf.addFont("times", "Times New Roman");

    // Set margins (2cm on all sides)
    const margin = 2;
    const pageWidth = 21; // A4 width in cm
    const pageHeight = 29.7; // A4 height in cm
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);

    // Header
    pdf.setFont("Arial", "bold");
    pdf.setFontSize(14);
    const headerText = "CORPO DE BOMBEIROS MILITAR DO AMAPÁ";
    const headerWidth = pdf.getStringUnitWidth(headerText) * 14 / pdf.internal.scaleFactor;
    const headerX = (pageWidth - headerWidth) / 2;
    pdf.text(headerText, headerX, margin + 1);

    // Subheader
    pdf.setFontSize(12);
    const subHeader1 = "COMANDO OPERACIONAL";
    const subHeader2 = "MILITARES E VIATURAS NO SERVIÇO OPERACIONAL";
    const subHeader1Width = pdf.getStringUnitWidth(subHeader1) * 12 / pdf.internal.scaleFactor;
    const subHeader2Width = pdf.getStringUnitWidth(subHeader2) * 12 / pdf.internal.scaleFactor;
    pdf.text(subHeader1, (pageWidth - subHeader1Width) / 2, margin + 2);
    pdf.text(subHeader2, (pageWidth - subHeader2Width) / 2, margin + 3);

    // Add horizontal line after header
    pdf.setLineWidth(0.02);
    pdf.line(margin, margin + 3.5, pageWidth - margin, margin + 3.5);

    // Convert table content
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    const imgData = canvas.toDataURL('image/png');

    // Calculate image dimensions to fit within margins
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the table image below the header
    pdf.addImage(imgData, 'PNG', margin, margin + 4, imgWidth, imgHeight);

    // Add page numbers
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("Times New Roman", "normal");
      pdf.setFontSize(10);
      pdf.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - margin - 3,
        pageHeight - margin
      );
    }

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    toast.dismiss();
    toast.success("PDF gerado com sucesso!");

    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.dismiss();
    toast.error("Erro ao gerar PDF");
    return null;
  }
};