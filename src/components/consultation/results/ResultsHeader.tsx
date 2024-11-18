import { Button } from "@/components/ui/button";
import { FileDown, Share2 } from "lucide-react";

interface ResultsHeaderProps {
  onGeneratePDF: () => void;
  onShare: () => void;
}

export const ResultsHeader = ({ onGeneratePDF, onShare }: ResultsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Resultados da Consulta
      </h2>
      <div className="flex gap-2">
        <Button
          onClick={onGeneratePDF}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Gerar PDF
        </Button>
        <Button
          onClick={onShare}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};