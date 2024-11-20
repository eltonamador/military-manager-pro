import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MilitaryContainer from "@/components/military/MilitaryContainer";
import MilitaryActions from "@/components/military/MilitaryActions";
import MilitaryHeader from "@/components/military/MilitaryHeader";
import { Military } from "@/types/military";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { checkExistingMilitary } from "@/utils/militaryChecks";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedMilitary, setSelectedMilitary] = useState("");
  const [militaryFunction, setMilitaryFunction] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shiftDuration, setShiftDuration] = useState("24");
  const [militaryList, setMilitaryList] = useState<Military[]>([]);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [pendingMilitary, setPendingMilitary] = useState<Military | null>(null);

  const gbmOptions = ["1°GBM", "2°GBM", "5°GBM", "GAPH", "GMAF", "MCPB"];
  const militaryOptions = [];

  const handleAddMilitary = async (alterations?: string) => {
    if (!selectedMilitary || !militaryFunction || !selectedDate) {
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
      alterations,
    };

    try {
      const exists = await checkExistingMilitary(newMilitary);
      
      if (exists) {
        setPendingMilitary(newMilitary);
        setShowUpdateDialog(true);
        return;
      }

      setMilitaryList([...militaryList, newMilitary]);
      setSelectedMilitary("");
      setMilitaryFunction("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao verificar registros existentes.",
      });
    }
  };

  const handleUpdateConfirm = () => {
    if (pendingMilitary) {
      setMilitaryList([...militaryList, pendingMilitary]);
      setSelectedMilitary("");
      setMilitaryFunction("");
      setPendingMilitary(null);
    }
    setShowUpdateDialog(false);
  };

  const handleEdit = (index: number) => {
    const military = militaryList[index];
    setSelectedMilitary(military.name);
    setMilitaryFunction(military.function);
    setSelectedGBM(military.gbm);
    setSelectedVTR(military.vtr);
    setSelectedDate(military.date);

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

        <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Militar já cadastrado</AlertDialogTitle>
              <AlertDialogDescription>
                Já existe um registro para este militar na data selecionada. Deseja atualizar os dados?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowUpdateDialog(false);
                setPendingMilitary(null);
              }}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdateConfirm}>
                Atualizar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;