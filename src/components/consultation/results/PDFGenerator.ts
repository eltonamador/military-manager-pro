import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return null;

    toast.loading("Gerando PDF...");
    
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Add header text
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("CORPO DE BOMBEIROS MILITAR DO AMAPÁ", pdfWidth/2, 20, { align: "center" });
    pdf.setFontSize(14);
    pdf.text("COMANDO OPERACIONAL", pdfWidth/2, 30, { align: "center" });
    pdf.text("MILITARES E VIATURAS NO SERVIÇO OPERACIONAL", pdfWidth/2, 40, { align: "center" });
    pdf.setFont("helvetica", "normal");
    
    // Add the table image below the header
    pdf.addImage(imgData, 'PNG', 0, 50, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    toast.dismiss();
    toast.success("PDF gerado com sucesso!");

    return pdfUrl;
  } catch (error) {
    toast.dismiss();
    toast.error("Erro ao gerar PDF");
    return null;
  }
};