import MilitaryTable from "@/components/MilitaryTable";
import { ResultsHeader } from "./results/ResultsHeader";
import { LoadingState } from "./results/LoadingState";
import { generatePDF } from "./results/PDFGenerator";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMilitaryTableName } from "@/utils/tableNames";

interface ConsultationResultsProps {
  isLoading: boolean;
  combinedData: any[];
  selectedDate: Date | undefined;
  onDataChange?: () => void;
}

const ConsultationResults = ({ 
  isLoading, 
  combinedData,
  selectedDate,
  onDataChange
}: ConsultationResultsProps) => {
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
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + "\n" + pdfUrl)}`;
          window.open(whatsappUrl, '_blank');
        }
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + "\n" + pdfUrl)}`;
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  const handleEdit = () => {
    if (onDataChange) {
      onDataChange();
    }
  };

  const handleDelete = () => {
    if (onDataChange) {
      onDataChange();
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

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
          onEdit={handleEdit}
          onDelete={handleDelete}
          allowEditing={true}
        />
      </div>
    </div>
  );
};

export default ConsultationResults;