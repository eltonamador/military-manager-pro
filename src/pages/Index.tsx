import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MilitaryContainer from "@/components/military/MilitaryContainer";
import MilitaryActions from "@/components/military/MilitaryActions";
import MilitaryHeader from "@/components/military/MilitaryHeader";
import { Military } from "@/types/military";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen military-gradient p-4">
      <div className="container mx-auto space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => navigate("/officer-selection")}
            variant="outline"
            className="bg-white hover:bg-red-50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Oficiais
          </Button>
          <Button
            onClick={() => navigate("/vehicle-receiving")}
            variant="outline"
            className="bg-white hover:bg-red-50 transition-colors"
          >
            VTRs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <MilitaryHeader />
        <MilitaryActions />
        <MilitaryContainer />
      </div>
    </div>
  );
};

export default Index;