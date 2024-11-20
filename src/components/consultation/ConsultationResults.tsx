import MilitaryTable from "@/components/MilitaryTable";
import { ResultsHeader } from "./results/ResultsHeader";
import { LoadingState } from "./results/LoadingState";
import { generatePDF } from "./results/PDFGenerator";
import { toast } from "sonner";
import { useVTRs } from "@/hooks/useVTRs";

const gbmOptions = ["1º GBM", "2º GBM", "MCPB", "5º GBM", "GAPH", "GMAF"];

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
  const { data: vtrOptions } = useVTRs();

  const handleGeneratePDF = async () => {
    const pdfUrl = await generatePDF('consultation-results');
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleShare = async () => {
    const pdfUrl = await generatePDF('consultation-results');
    if (pdfUrl) {
      const message = "Relatório do Serviço Operacional - CBMAP";
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Relatório CBMAP',
            text: message,
            url: pdfUrl
          });
          toast.success("Compartilhado com sucesso!");
        } catch (error) {
          // Fallback to WhatsApp if share API fails or is cancelled
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + "\n" + pdfUrl)}`;
          window.open(whatsappUrl, '_blank');
        }
      } else {
        // Fallback for browsers that don't support the Web Share API
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + "\n" + pdfUrl)}`;
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  // Ensure all data uses the selected date
  const dataWithSelectedDate = combinedData.map(item => ({
    ...item,
    date: selectedDate || item.date
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
          gbmOptions={gbmOptions}
          vtrOptions={vtrOptions || []}
        />
      </div>
    </div>
  );
};

export default ConsultationResults;