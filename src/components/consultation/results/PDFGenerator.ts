import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return null;

    toast.loading("Gerando PDF...");
    
    // Improved canvas quality settings
    const canvas = await html2canvas(element, {
      scale: 2, // Increase resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
    
    // Use A4 format with better margins
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate margins (20mm on each side)
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    // Header styling
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    
    // Center-aligned header text with proper spacing
    const headerY = margin + 10;
    pdf.text("CORPO DE BOMBEIROS MILITAR DO AMAPÁ", pageWidth/2, headerY, { align: "center" });
    pdf.setFontSize(14);
    pdf.text("COMANDO OPERACIONAL", pageWidth/2, headerY + 10, { align: "center" });
    pdf.text("MILITARES E VIATURAS NO SERVIÇO OPERACIONAL", pageWidth/2, headerY + 20, { align: "center" });
    
    // Add date if available
    const currentDate = new Date().toLocaleDateString('pt-BR');
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Data: ${currentDate}`, margin, headerY + 30);
    
    // Calculate image dimensions to fit content width while maintaining aspect ratio
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the table image with proper margins and positioning
    pdf.addImage(
      imgData,
      'PNG',
      margin,
      headerY + 40, // Position below header
      imgWidth,
      imgHeight
    );
    
    // Add footer
    const footerY = pageHeight - margin;
    pdf.setFontSize(10);
    pdf.text("Documento gerado automaticamente pelo sistema", pageWidth/2, footerY, { align: "center" });
    
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    toast.dismiss();
    toast.success("PDF gerado com sucesso!");

    return pdfUrl;
  } catch (error) {
    toast.dismiss();
    toast.error("Erro ao gerar PDF");
    console.error("PDF generation error:", error);
    return null;
  }
};