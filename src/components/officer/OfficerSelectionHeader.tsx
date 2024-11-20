import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OfficerSelectionHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">Seleção de Oficiais</h1>
      <Button
        onClick={() => navigate("/index")}
        variant="outline"
        className="bg-white hover:bg-red-50 transition-colors"
      >
        Militares
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default OfficerSelectionHeader;