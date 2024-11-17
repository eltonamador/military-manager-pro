import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MilitaryActionsProps {
  onFinish: () => void;
  disabled: boolean;
}

const MilitaryActions = ({ onFinish, disabled }: MilitaryActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Button
        onClick={onFinish}
        className="w-full bg-military-red hover:bg-military-orange transition-colors text-white font-bold text-lg py-6"
        disabled={disabled}
      >
        Finalizar Militares
      </Button>
      <Button
        onClick={() => navigate("/vehicle-receiving")}
        variant="outline"
        className="w-full sm:w-auto hover:bg-red-50 transition-colors"
      >
        <span className="mr-2">Recebimento VTRs</span>
        <ArrowRight className="h-5 w-5 text-military-red" />
      </Button>
    </div>
  );
};

export default MilitaryActions;