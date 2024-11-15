import { Button } from "@/components/ui/button";
import { Send, FileDown } from "lucide-react";

interface ReportActionsProps {
  selectedDate: Date;
  selectedGBM: string;
}

export const ReportActions = ({
  selectedDate,
  selectedGBM,
}: ReportActionsProps) => {
  const handleSendWhatsApp = () => {
    // Implementar lógica de envio por WhatsApp
  };

  const handleDownloadPDF = () => {
    // Implementar lógica de download do PDF
  };

  return (
    <div className="flex justify-end space-x-4">
      <Button
        onClick={handleSendWhatsApp}
        className="bg-green-600 hover:bg-green-700"
      >
        <Send className="mr-2 h-4 w-4" /> Enviar via WhatsApp
      </Button>
      <Button onClick={handleDownloadPDF} variant="outline">
        <FileDown className="mr-2 h-4 w-4" /> Baixar PDF
      </Button>
    </div>
  );
};