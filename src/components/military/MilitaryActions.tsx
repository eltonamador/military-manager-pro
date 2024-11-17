import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MilitaryActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => navigate("/officer-selection")}
          variant="outline"
          className="w-full sm:w-auto hover:bg-red-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-military-red mr-2" />
          Voltar para Seleção de Oficiais
        </Button>
      </div>
    </div>
  );
};

export default MilitaryActions;