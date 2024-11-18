import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VehicleHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="bg-white rounded-lg shadow-md p-3 flex-1 max-w-[300px]">
        <h1 className="text-lg sm:text-xl font-bold text-military-red">
          Recebimento de VTRs
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-3 flex-1 max-w-[300px]">
        <Button
          variant="ghost"
          onClick={() => navigate("/index")}
          className="w-full hover:bg-red-50 flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 text-military-red mr-2" />
          <span className="text-lg sm:text-xl font-bold text-black">
            Militares
          </span>
        </Button>
      </div>
    </div>
  );
};

export default VehicleHeader;