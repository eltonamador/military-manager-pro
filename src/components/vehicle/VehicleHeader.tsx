import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VehicleHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="bg-white rounded-lg shadow-md p-2 flex-1 max-w-[120px]">
        <Button
          variant="ghost"
          onClick={() => navigate("/index")}
          className="w-full hover:bg-red-50 flex items-center justify-start px-2"
        >
          <ArrowLeft className="h-4 w-4 text-military-red mr-1" />
          <span className="text-sm font-medium text-black">
            Militares
          </span>
        </Button>
      </div>
    </div>
  );
};

export default VehicleHeader;