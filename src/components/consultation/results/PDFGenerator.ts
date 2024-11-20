import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (elementId: string) => {
  const loadingToast = toast.loading("Gerando PDF...");
  
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    // Create PDF with A4 dimensions (210mm x 297mm)
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Set page margins and dimensions
    const margin = 15;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);
    
    // Add military logo/header image
    const logoImg = new Image();
    logoImg.src = "/escaladohj2.webp";
    
    // Wait for image to load before proceeding
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = () => reject(new Error("Failed to load logo"));
    });
    
    pdf.addImage(logoImg, "WEBP", margin, margin, 20, 20);
    
    // Header styling
    pdf.setDrawColor(243, 113, 33); // Military orange color
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 25, pageWidth - margin, margin + 25);
    
    // Header text configuration
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(35, 35, 35);
    const headerText = "CORPO DE BOMBEIROS MILITAR DO AMAPÁ";
    const headerWidth = pdf.getStringUnitWidth(headerText) * 16 / pdf.internal.scaleFactor;
    const headerX = (pageWidth - headerWidth) / 2;
    pdf.text(headerText, headerX, margin + 35);

    // Subheader text
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    const subHeader1 = "COMANDO OPERACIONAL";
    const subHeader2 = "MILITARES E VIATURAS NO SERVIÇO OPERACIONAL";
    const subHeader1Width = pdf.getStringUnitWidth(subHeader1) * 12 / pdf.internal.scaleFactor;
    const subHeader2Width = pdf.getStringUnitWidth(subHeader2) * 12 / pdf.internal.scaleFactor;
    pdf.text(subHeader1, (pageWidth - subHeader1Width) / 2, margin + 45);
    pdf.text(subHeader2, (pageWidth - subHeader2Width) / 2, margin + 55);

    // Add decorative line
    pdf.setDrawColor(243, 113, 33);
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

    // Prepare table for conversion
    const tableElement = element.querySelector('table');
    if (tableElement) {
      // Add table styling classes
      tableElement.classList.add(
        'border-collapse',
        'w-full',
        'bg-white',
        'shadow-sm'
      );
      
      // Style table rows
      const rows = tableElement.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index === 0) {
          row.classList.add(
            'bg-military-orange/20',
            'text-gray-800',
            'font-semibold'
          );
        } else {
          row.classList.add(
            index % 2 === 0 ? 'bg-gray-50' : 'bg-white',
            'border-b',
            'border-military-orange/20'
          );
        }
      });

      // Style table cells
      const cells = tableElement.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.classList.add(
          'px-4',
          'py-2',
          'text-sm',
          'border-military-orange/10'
        );
      });
    }

    // Convert table to canvas with improved quality
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

    // Calculate dimensions
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // Add table image
    pdf.addImage(
      imgData, 
      'PNG', 
      margin, 
      margin + 75,
      imgWidth,
      imgHeight
    );

    // Handle multiple pages if needed
    if (margin + 75 + imgHeight > pageHeight - margin) {
      const firstPageHeight = pageHeight - (margin + 75);
      const remainingHeight = imgHeight - firstPageHeight;
      
      let currentY = 0;
      while (currentY < remainingHeight) {
        pdf.addPage();
        const heightOnThisPage = Math.min(pageHeight - (margin * 2), remainingHeight - currentY);
        
        // Add header line on new pages
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

    // Add page numbers
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

    toast.dismiss(loadingToast);
    toast.success("PDF gerado com sucesso!");

    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.dismiss(loadingToast);
    toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    return null;
  }
};