import MilitaryTable from "@/components/MilitaryTable";
import { ResultsHeader } from "./results/ResultsHeader";
import { LoadingState } from "./results/LoadingState";
import { generatePDF } from "./results/PDFGenerator";
import { toast } from "sonner";

interface ConsultationResultsProps {
  isLoading: boolean;
  combinedData: any[];
  selectedDate: Date | undefined;
}

const ConsultationResults = ({ 
  isLoading, 
  combinedData,
  selectedDate 
}: ConsultationResultsProps) => {
  const handleGeneratePDF = async () => {
    try {
      const pdfUrl = await generatePDF('consultation-results');
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      } else {
        toast.error("Erro ao gerar PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleShare = async () => {
    try {
      const pdfUrl = await generatePDF('consultation-results');
      if (!pdfUrl) {
        toast.error("Erro ao gerar PDF para compartilhamento");
        return;
      }

      const message = "Relatório do Serviço Operacional - CBMAP";
      const shareData = {
        title: 'Relatório CBMAP',
        text: message,
        url: pdfUrl
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          toast.success("Compartilhado com sucesso!");
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            // Only fallback to WhatsApp if it's not a user cancellation
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + "\n" + pdfUrl)}`;
            window.open(whatsappUrl, '_blank');
          }
        }
      } else {
        // Fallback for browsers that don't support the Web Share API
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + "\n" + pdfUrl)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      toast.error("Erro ao compartilhar o relatório");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  // Ensure all data uses the selected date and includes time information
  const dataWithSelectedDate = combinedData.map(item => ({
    ...item,
    date: selectedDate || item.date,
    inclusionTime: item.time || "Não informado" // Ensure time is always present
  }));

  return (
    <div className="space-y-4">
      <ResultsHeader 
        onGeneratePDF={handleGeneratePDF}
        onShare={handleShare}
      />
      <div id="consultation-results">
        <MilitaryTable 
          militaryList={dataWithSelectedDate} 
          showInclusionTime={true}
        />
      </div>
    </div>
  );
};

export default ConsultationResults;