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
  
  // State management for all required props
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedMilitary, setSelectedMilitary] = useState("");
  const [militaryFunction, setMilitaryFunction] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shiftDuration, setShiftDuration] = useState("24");
  const [militaryList, setMilitaryList] = useState<Military[]>([]);

  // Mock data for options (replace with actual data from your backend)
  const gbmOptions = ["1°GBM", "2°GBM", "5°GBM", "GAPH", "GMAF", "MCPB"];
  const militaryOptions = [];

  const handleAddMilitary = (alterations?: string) => {
    if (!selectedMilitary || !militaryFunction || !selectedDate || !shiftDuration) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const newMilitary: Military = {
      name: selectedMilitary,
      function: militaryFunction,
      gbm: selectedGBM,
      vtr: selectedVTR,
      date: selectedDate,
      shiftDuration: shiftDuration,
      alterations,
    };

    setMilitaryList([...militaryList, newMilitary]);
    
    // Reset form
    setSelectedMilitary("");
    setMilitaryFunction("");
  };

  const handleEdit = (index: number) => {
    const military = militaryList[index];
    setSelectedMilitary(military.name);
    setMilitaryFunction(military.function);
    setSelectedGBM(military.gbm);
    setSelectedVTR(military.vtr);
    setSelectedDate(military.date);
    setShiftDuration(military.shiftDuration);

    // Remove the edited item from the list
    const newList = [...militaryList];
    newList.splice(index, 1);
    setMilitaryList(newList);
  };

  const handleDelete = (index: number) => {
    const newList = [...militaryList];
    newList.splice(index, 1);
    setMilitaryList(newList);
  };

  const handleFinishOperation = () => {
    if (militaryList.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Adicione pelo menos um militar antes de finalizar.",
      });
      return;
    }
    // Handle finish operation logic here
    toast({
      title: "Sucesso",
      description: "Operação finalizada com sucesso!",
    });
  };

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
        <MilitaryContainer
          selectedGBM={selectedGBM}
          selectedVTR={selectedVTR}
          selectedMilitary={selectedMilitary}
          militaryFunction={militaryFunction}
          selectedDate={selectedDate}
          shiftDuration={shiftDuration}
          gbmOptions={gbmOptions}
          militaryOptions={militaryOptions}
          militaryList={militaryList}
          onGBMChange={setSelectedGBM}
          onVTRChange={setSelectedVTR}
          onMilitaryChange={setSelectedMilitary}
          onFunctionChange={setMilitaryFunction}
          onDateChange={setSelectedDate}
          onShiftDurationChange={setShiftDuration}
          onAddMilitary={handleAddMilitary}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFinishOperation={handleFinishOperation}
        />
      </div>
    </div>
  );
};

export default Index;
