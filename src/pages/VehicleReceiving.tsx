import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import VehicleTable from "@/components/VehicleTable";
import FinalReport from "@/components/FinalReport";
import { supabase } from "@/integrations/supabase/client";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
}

const VehicleReceiving = () => {
  const [selectedVTR, setSelectedVTR] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [vtrOptions, setVtrOptions] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch VTR prefixes from Supabase
  useEffect(() => {
    const fetchVTRs = async () => {
      try {
        const { data, error } = await supabase
          .from('viaturas')
          .select('prefixo')
          .not('prefixo', 'is', null);

        if (error) throw error;

        const prefixes = data.map(item => item.prefixo as string);
        setVtrOptions(prefixes);
      } catch (error) {
        console.error('Error fetching VTRs:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar VTRs",
          description: "Não foi possível carregar a lista de VTRs",
        });
      }
    };

    fetchVTRs();
  }, [toast]);

  const handleAddVehicle = () => {
    if (!selectedVTR || !status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const gbm = selectedVTR.split('-')[0]; // Extract GBM from VTR prefix

    const newVehicle = {
      gbm,
      vtr: selectedVTR,
      status,
      description,
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

  const handleSendReport = async () => {
    try {
      // Save each vehicle service record to Supabase
      for (const vehicle of vehicles) {
        const { error } = await supabase
          .from('servico_vtrs')
          .insert({
            gbm: vehicle.gbm,
            vtr: vehicle.vtr,
            status: vehicle.status,
            alteracao: vehicle.description,
          });

        if (error) throw error;
      }

      toast({
        title: "Relatório enviado",
        description: "Os dados foram salvos com sucesso",
      });
      
      // Format the report text for WhatsApp
      const reportText = `*Relatório de VTRs*\n\n${vehicles
        .map(
          (v) =>
            `*GBM:* ${v.gbm}\n*VTR:* ${v.vtr}\n*Status:* ${v.status}\n*Descrição:* ${v.description}\n`
        )
        .join("\n")}`;

      // Encode the text for WhatsApp URL
      const encodedText = encodeURIComponent(reportText);
      window.open(`https://wa.me/?text=${encodedText}`, "_blank");
      
      // Reset form
      setVehicles([]);
      setSelectedVTR("");
      setStatus("");
      setDescription("");
      setShowFinalReport(false);
    } catch (error) {
      console.error('Error saving vehicle service:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do serviço",
      });
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
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <Label htmlFor="vtr">VTR</Label>
            <Select onValueChange={setSelectedVTR} value={selectedVTR}>
              <SelectTrigger id="vtr">
                <SelectValue placeholder="Selecione a VTR" />
              </SelectTrigger>
              <SelectContent>
                {vtrOptions.map((vtr) => (
                  <SelectItem key={vtr} value={vtr}>
                    {vtr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operante">Operante</SelectItem>
                <SelectItem value="parcialmente">
                  Parcialmente Operante
                </SelectItem>
                <SelectItem value="inoperante">Inoperante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição das Alterações</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as alterações ou observações sobre a VTR"
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleAddVehicle}
            className="w-full bg-military-orange hover:bg-military-red transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            {editingIndex !== null ? "Atualizar VTR" : "Adicionar VTR"}
          </Button>
        </div>

        <VehicleTable
          vehicleList={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Button
          onClick={() => setShowFinalReport(true)}
          className="w-full mt-6 bg-military-red hover:bg-military-orange transition-colors"
          disabled={vehicles.length === 0}
        >
          Finalizar VTRs
        </Button>
      </main>

      <FinalReport
        open={showFinalReport}
        onOpenChange={setShowFinalReport}
        militaryList={[]}
        vehicleList={vehicles}
        onEdit={() => setShowFinalReport(false)}
        onSend={handleSendReport}
      />
    </div>
  );
};

export default VehicleReceiving;
