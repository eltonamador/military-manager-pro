import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return null;

    toast.loading("Gerando PDF...");
    
    // Create PDF with A4 dimensions (210mm x 297mm)
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Set page margins (20mm on all sides)
    const margin = 20;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header text configuration
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    const headerText = "CORPO DE BOMBEIROS MILITAR DO AMAPÁ";
    const headerWidth = pdf.getStringUnitWidth(headerText) * 14 / pdf.internal.scaleFactor;
    const headerX = (pageWidth - headerWidth) / 2;
    pdf.text(headerText, headerX, margin + 10);

    // Subheader text
    pdf.setFontSize(12);
    const subHeader1 = "COMANDO OPERACIONAL";
    const subHeader2 = "MILITARES E VIATURAS NO SERVIÇO OPERACIONAL";
    const subHeader1Width = pdf.getStringUnitWidth(subHeader1) * 12 / pdf.internal.scaleFactor;
    const subHeader2Width = pdf.getStringUnitWidth(subHeader2) * 12 / pdf.internal.scaleFactor;
    pdf.text(subHeader1, (pageWidth - subHeader1Width) / 2, margin + 20);
    pdf.text(subHeader2, (pageWidth - subHeader2Width) / 2, margin + 30);

    // Add horizontal line
    pdf.setLineWidth(0.2);
    pdf.line(margin, margin + 35, pageWidth - margin, margin + 35);

    // Convert table to canvas with higher scale for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Increase scale for better quality
      useCORS: true,
      logging: false,
      windowWidth: 1920, // Force desktop width for consistent rendering
      onclone: (clonedDoc) => {
        // Adjust the cloned element styles if needed
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = '100%';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '0';
        }
      }
    });

    // Calculate dimensions to fit content within margins
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // Add table image with proper positioning
    pdf.addImage(
      imgData, 
      'PNG', 
      margin, 
      margin + 40, // Position below header
      imgWidth,
      imgHeight
    );

    // Check if content needs multiple pages
    if (margin + 40 + imgHeight > pageHeight - margin) {
      const firstPageHeight = pageHeight - (margin + 40);
      const remainingHeight = imgHeight - firstPageHeight;
      
      // Add new pages as needed
      let currentY = 0;
      while (currentY < remainingHeight) {
        pdf.addPage();
        const heightOnThisPage = Math.min(pageHeight - (margin * 2), remainingHeight - currentY);
        
        pdf.addImage(
          imgData,
          'PNG',
          margin,
          margin - currentY,
          imgWidth,
          imgHeight
        );
        
        currentY += heightOnThisPage;
      }
    }

    // Add page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - margin - 25,
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