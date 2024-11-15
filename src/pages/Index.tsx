import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import MilitaryForm from "@/components/MilitaryForm";
import MilitaryTable from "@/components/MilitaryTable";

interface Military {
  name: string;
  function: string;
  gbm: string;
  vtr: string;
  date: Date;
  shiftDuration: string;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedMilitary, setSelectedMilitary] = useState("");
  const [militaryFunction, setMilitaryFunction] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [shiftDuration, setShiftDuration] = useState("");
  const [militaryList, setMilitaryList] = useState<Military[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const gbmOptions = ["1º GBM", "2º GBM", "GAPH", "GMAF", "5º GBM", "MCPB"];
  const vtrOptions: Record<string, string[]> = {
    "1º GBM": ["VTR-01", "VTR-02"],
    "2º GBM": ["VTR-03", "VTR-04"],
    "GAPH": ["VTR-05", "VTR-06"],
    "GMAF": ["VTR-07", "VTR-08"],
    "5º GBM": ["VTR-09", "VTR-10"],
    "MCPB": ["VTR-11", "VTR-12"],
  };
  const militaryOptions: Record<string, string[]> = {
    "1º GBM": ["João Silva", "Maria Oliveira"],
    "2º GBM": ["Pedro Santos", "Ana Rodrigues"],
    "GAPH": ["Carlos Ferreira", "Juliana Costa"],
    "GMAF": ["Marcos Souza", "Beatriz Lima"],
    "5º GBM": ["Ricardo Alves", "Fernanda Pereira"],
    "MCPB": ["Gabriel Martins", "Camila Rocha"],
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    toast({
      title: "Login realizado com sucesso",
      description: "Bem-vindo ao sistema de gestão de militares",
    });
  };

  const handleAddMilitary = () => {
    if (selectedMilitary && militaryFunction && selectedDate && shiftDuration) {
      if (editingIndex !== null) {
        const updatedList = [...militaryList];
        updatedList[editingIndex] = {
          name: selectedMilitary,
          function: militaryFunction,
          gbm: selectedGBM,
          vtr: selectedVTR,
          date: selectedDate,
          shiftDuration: shiftDuration,
        };
        setMilitaryList(updatedList);
        setEditingIndex(null);
        toast({
          title: "Militar atualizado",
          description: "As informações do militar foram atualizadas com sucesso",
        });
      } else {
        setMilitaryList([
          ...militaryList,
          {
            name: selectedMilitary,
            function: militaryFunction,
            gbm: selectedGBM,
            vtr: selectedVTR,
            date: selectedDate,
            shiftDuration: shiftDuration,
          },
        ]);
        toast({
          title: "Militar adicionado",
          description: "O militar foi adicionado com sucesso à lista",
        });
      }
      setSelectedMilitary("");
      setMilitaryFunction("");
      setShiftDuration("");
    }
  };

  const handleEdit = (index: number) => {
    const military = militaryList[index];
    setSelectedGBM(military.gbm);
    setSelectedVTR(military.vtr);
    setSelectedMilitary(military.name);
    setMilitaryFunction(military.function);
    setSelectedDate(military.date);
    setShiftDuration(military.shiftDuration);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedList = militaryList.filter((_, i) => i !== index);
    setMilitaryList(updatedList);
    toast({
      title: "Militar removido",
      description: "O militar foi removido com sucesso da lista",
    });
  };

  const handleFinishOperation = () => {
    toast({
      title: "Operação finalizada",
      description: "Todos os dados foram salvos com sucesso",
    });
    setMilitaryList([]);
    setSelectedGBM("");
    setSelectedVTR("");
    navigate("/vehicle-receiving");
  };

  if (!isLoggedIn) {
    return <LoginForm onSubmit={handleLogin} />;
  }

  return (
    <div className="min-h-screen military-gradient flex flex-col p-4 animate-fadeIn">
      <header className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-military-red">
          Gestão de Militares
        </h1>
      </header>
      <main className="flex-grow bg-white rounded-lg shadow-md p-6">
        <MilitaryForm
          selectedGBM={selectedGBM}
          selectedVTR={selectedVTR}
          selectedMilitary={selectedMilitary}
          militaryFunction={militaryFunction}
          selectedDate={selectedDate}
          shiftDuration={shiftDuration}
          gbmOptions={gbmOptions}
          vtrOptions={vtrOptions}
          militaryOptions={militaryOptions}
          onGBMChange={setSelectedGBM}
          onVTRChange={setSelectedVTR}
          onMilitaryChange={setSelectedMilitary}
          onFunctionChange={setMilitaryFunction}
          onDateChange={setSelectedDate}
          onShiftDurationChange={setShiftDuration}
          onAddMilitary={handleAddMilitary}
        />
        <MilitaryTable 
          militaryList={militaryList} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
        />
      </main>
      <footer className="mt-6">
        <Button
          onClick={handleFinishOperation}
          className="w-full bg-military-red hover:bg-military-orange transition-colors"
          disabled={militaryList.length === 0}
        >
          Finalizar Operação
        </Button>
      </footer>
    </div>
  );
};

export default Index;