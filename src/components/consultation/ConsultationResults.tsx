import MilitaryTable from "@/components/MilitaryTable";
import { ResultsHeader } from "./results/ResultsHeader";
import { LoadingState } from "./results/LoadingState";
import { generatePDF } from "./results/PDFGenerator";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    const pdfUrl = await generatePDF('consultation-results');
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const formatDataAsText = () => {
    const dateStr = selectedDate 
      ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : "Data não selecionada";

    let message = `*Relatório do Serviço Operacional - CBMAP*\n\n`;
    message += `*Data:* ${dateStr}\n\n`;
    message += `*Militares de Serviço:*\n`;

    combinedData.forEach((military, index) => {
      message += `\n${index + 1}. *${military.name}*\n`;
      message += `   GBM: ${military.gbm}\n`;
      message += `   Função: ${military.function}\n`;
      message += `   VTR: ${military.vtr}\n`;
      if (military.alterations) {
        message += `   Alterações: ${military.alterations}\n`;
      }
      if (military.time) {
        message += `   Horário de Inclusão: ${military.time}\n`;
      }
      if (military.equipmentStatus && military.equipmentStatus.length > 0) {
        message += `   *Equipamentos:*\n`;
        military.equipmentStatus.forEach(eq => {
          message += `      - ${eq.equipment}: ${eq.status}`;
          if (eq.description) {
            message += ` (${eq.description})`;
          }
          message += '\n';
        });
      }
      message += '\n';
    });

    message += `\n*Observações:*\n`;
    message += `- Relatório gerado automaticamente pelo sistema.\n`;
    message += `- Horário de geração: ${format(new Date(), 'HH:mm')}\n`;

    return message;
  };

  const handleShare = async () => {
    const message = formatDataAsText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Compartilhando via WhatsApp");
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