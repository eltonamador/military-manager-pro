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
    
    // Set page margins and dimensions
    const margin = 15;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);
    
    // Add military logo/header image
    pdf.addImage("/escaladohj2.webp", "WEBP", margin, margin, 20, 20);
    
    // Header styling
    pdf.setDrawColor(243, 113, 33); // Military orange color
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 25, pageWidth - margin, margin + 25);
    
    // Header text configuration
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(35, 35, 35); // Dark gray for better readability
    const headerText = "CORPO DE BOMBEIROS MILITAR DO AMAPÁ";
    const headerWidth = pdf.getStringUnitWidth(headerText) * 16 / pdf.internal.scaleFactor;
    const headerX = (pageWidth - headerWidth) / 2;
    pdf.text(headerText, headerX, margin + 35);

    // Subheader text with different styling
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80); // Lighter gray for subheader
    const subHeader1 = "COMANDO OPERACIONAL";
    const subHeader2 = "MILITARES E VIATURAS NO SERVIÇO OPERACIONAL";
    const subHeader1Width = pdf.getStringUnitWidth(subHeader1) * 12 / pdf.internal.scaleFactor;
    const subHeader2Width = pdf.getStringUnitWidth(subHeader2) * 12 / pdf.internal.scaleFactor;
    pdf.text(subHeader1, (pageWidth - subHeader1Width) / 2, margin + 45);
    pdf.text(subHeader2, (pageWidth - subHeader2Width) / 2, margin + 55);

    // Add decorative line below headers
    pdf.setDrawColor(243, 113, 33); // Military orange
    pdf.setLineWidth(0.3);
    pdf.line(margin, margin + 60, pageWidth - margin, margin + 60);

    // Add date
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Data: ${currentDate}`, margin, margin + 70);

    // Style the table before conversion
    const tableElement = element.querySelector('table');
    if (tableElement) {
      // Add CSS classes for better table styling
      tableElement.classList.add('border-collapse', 'w-full');
      const rows = tableElement.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index === 0) {
          row.classList.add('bg-military-orange/20');
        } else {
          row.classList.add(index % 2 === 0 ? 'bg-gray-50' : 'bg-white');
        }
        row.classList.add('border-b', 'border-military-orange/20');
      });
    }

    // Convert table to canvas with higher scale for better quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1920,
      onclone: (clonedDoc) => {
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
      margin + 75, // Position below header and date
      imgWidth,
      imgHeight
    );

    // Check if content needs multiple pages
    if (margin + 75 + imgHeight > pageHeight - margin) {
      const firstPageHeight = pageHeight - (margin + 75);
      const remainingHeight = imgHeight - firstPageHeight;
      
      let currentY = 0;
      while (currentY < remainingHeight) {
        pdf.addPage();
        const heightOnThisPage = Math.min(pageHeight - (margin * 2), remainingHeight - currentY);
        
        // Add header line on each new page
        pdf.setDrawColor(243, 113, 33);
        pdf.setLineWidth(0.3);
        pdf.line(margin, margin, pageWidth - margin, margin);
        
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

    // Add page numbers with styling
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      
      // Add footer line
      pdf.setDrawColor(243, 113, 33);
      pdf.setLineWidth(0.2);
      pdf.line(margin, pageHeight - margin - 10, pageWidth - margin, pageHeight - margin - 10);
      
      // Add page number
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