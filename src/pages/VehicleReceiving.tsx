import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import VehicleTable from "@/components/VehicleTable";
import VehicleForm from "@/components/vehicle/VehicleForm";
import FinalReport from "@/components/FinalReport";
import { supabase } from "@/integrations/supabase/client";
import { useVehicleService } from "@/hooks/useVehicleService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
}

const fetchVTRs = async () => {
  const { data, error } = await supabase
    .from('viaturas')
    .select('prefixo')
    .not('prefixo', 'is', null);

  if (error) throw error;
  return data.map(item => item.prefixo as string);
};

const VehicleReceiving = () => {
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedGBM, setSelectedGBM] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const { saveVehicleService } = useVehicleService();
  const navigate = useNavigate();

  const { data: vtrOptions = [] } = useQuery({
    queryKey: ['vtrOptions'],
    queryFn: fetchVTRs,
  });

  const gbmOptions = ["1º GBM", "2º GBM", "GAPH", "GMAF", "5º GBM", "MCPB"];

  const handleAddVehicle = () => {
    const newVehicle = {
      gbm: selectedGBM,
      vtr: selectedVTR,
      status,
      description,
      date: selectedDate,
    };

    if (editingIndex !== null) {
      const updatedVehicles = [...vehicles];
      updatedVehicles[editingIndex] = newVehicle;
      setVehicles(updatedVehicles);
      setEditingIndex(null);
      toast({
        title: "VTR atualizada",
        description: "As informações da VTR foram atualizadas com sucesso",
      });
    } else {
      setVehicles([...vehicles, newVehicle]);
      toast({
        title: "VTR adicionada",
        description: "A VTR foi adicionada com sucesso à lista",
      });
    }

    setSelectedVTR("");
    setStatus("");
    setDescription("");
  };

  const handleEdit = (index: number) => {
    const vehicle = vehicles[index];
    setSelectedGBM(vehicle.gbm);
    setSelectedVTR(vehicle.vtr);
    setStatus(vehicle.status);
    setDescription(vehicle.description);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(updatedVehicles);
    toast({
      title: "VTR removida",
      description: "A VTR foi removida com sucesso da lista",
    });
  };

  const handleFinishOperation = async () => {
    const success = await saveVehicleService(vehicles, selectedDate);
    
    if (success) {
      setVehicles([]);
      setSelectedGBM("");
      setSelectedVTR("");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen military-gradient flex flex-col p-4 animate-fadeIn">
      <header className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-military-red">
          Recebimento de VTRs
        </h1>
      </header>

      <main className="flex-grow bg-white rounded-lg shadow-md p-6">
        <VehicleForm
          selectedVTR={selectedVTR}
          selectedGBM={selectedGBM}
          selectedDate={selectedDate}
          status={status}
          description={description}
          vtrOptions={vtrOptions}
          gbmOptions={gbmOptions}
          onGBMChange={setSelectedGBM}
          onVTRChange={setSelectedVTR}
          onDateChange={setSelectedDate}
          onStatusChange={setStatus}
          onDescriptionChange={setDescription}
          onAddVehicle={handleAddVehicle}
          editingIndex={editingIndex}
        />

        <VehicleTable
          vehicleList={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <footer className="mt-6">
        <Button
          onClick={handleFinishOperation}
          className="w-full bg-military-red hover:bg-military-orange transition-colors"
          disabled={vehicles.length === 0}
        >
          Finalizar VTRs
        </Button>
      </footer>

      <FinalReport
        open={showFinalReport}
        onOpenChange={setShowFinalReport}
        militaryList={[]}
        vehicleList={vehicles}
        onEdit={() => setShowFinalReport(false)}
        onSend={handleFinishOperation}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default VehicleReceiving;
