import html2canvas from "html2canvas";
import { toast } from "sonner";
import { setupPDFDocument, PDF_CONFIG, getContentWidth } from "@/utils/pdf/pdfConfig";
import { addHeader } from "@/utils/pdf/pdfHeader";
import { addFooter } from "@/utils/pdf/pdfFooter";
import { applyTableStyles } from "@/utils/pdf/tableStyles";

export const generatePDF = async (elementId: string) => {
  const loadingToast = toast.loading("Gerando PDF...");
  
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Elemento não encontrado");
    }

    const pdf = setupPDFDocument();
    const { margin, pageHeight } = PDF_CONFIG;
    
    // Add header and get the Y position where content should start
    const contentStartY = await addHeader(pdf);
    
    // Style the table
    const tableElement = element.querySelector('table');
    applyTableStyles(tableElement);

    // Convert content to canvas
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
    const contentWidth = getContentWidth();
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // Calculate the available space on the first page
    const availableHeight = pageHeight - contentStartY - (margin * 2);
    
    // Add content to first page
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      margin,
      contentStartY,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );

    // If content exceeds first page, create additional pages
    if (imgHeight > availableHeight) {
      let remainingHeight = imgHeight - availableHeight;
      let currentPage = 1;
      
      while (remainingHeight > 0) {
        // Add new page
        pdf.addPage();
        currentPage++;
        
        // Calculate dimensions for this page
        const pageContentHeight = Math.min(remainingHeight, pageHeight - (margin * 3));
        
        // Add portion of content to new page
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          margin,
          imgWidth,
          imgHeight,
          undefined,
          'FAST',
          -currentPage * (pageHeight - (margin * 3))
        );
        
        remainingHeight -= pageContentHeight;
      }
    }

    // Add page numbers to all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addFooter(pdf, i, totalPages);
    }

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    toast.dismiss(loadingToast);
    toast.success("PDF gerado com sucesso!");

    return pdfUrl;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    toast.dismiss(loadingToast);
    toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    return null;
  }
};