import { Button } from "@/components/ui/button";
import MilitaryTable from "@/components/MilitaryTable";
import { FileDown, Loader2, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface ConsultationResultsProps {
  isLoading: boolean;
  combinedData: any[];
}

const ConsultationResults = ({ isLoading, combinedData }: ConsultationResultsProps) => {
  const generateAndSharePDF = async () => {
    try {
      const element = document.getElementById('consultation-results');
      if (!element) return;

      toast.loading("Gerando PDF...");
      
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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

  const handleGeneratePDF = async () => {
    const pdfUrl = await generateAndSharePDF();
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleShare = async () => {
    const pdfUrl = await generateAndSharePDF();
    if (pdfUrl) {
      const whatsappUrl = `https://wa.me/?text=Consulta%20de%20Serviço%20${encodeURIComponent(pdfUrl)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="space-y-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Resultados da Consulta
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={handleGeneratePDF}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Gerar PDF
          </Button>
          <Button
            onClick={handleShare}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </div>
      <div id="consultation-results">
        <MilitaryTable militaryList={combinedData} />
      </div>
    </div>
  );
};

export default ConsultationResults;