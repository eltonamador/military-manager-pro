import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MilitaryTable from "../MilitaryTable";
import VehicleTable from "../VehicleTable";
import { Military, Vehicle } from "@/types/service";

interface ReportTablesProps {
  selectedDate: Date;
  selectedGBM: string;
}

export const ReportTables = ({ selectedDate, selectedGBM }: ReportTablesProps) => {
  const [militaryList, setMilitaryList] = useState<Military[]>([]);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const { toast } = useToast();

  const handleEditMilitary = async (index: number) => {
    // Implementar lógica de edição
    toast({
      title: "Edição iniciada",
      description: `Editando militar: ${militaryList[index].name}`,
    });
  };

  const handleDeleteMilitary = async (index: number) => {
    try {
      const military = militaryList[index];
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const { error } = await supabase
        .from(`servico_militar_${selectedGBM}`)
        .delete()
        .eq("nome_de_guerra", military.name)
        .eq("data", formattedDate);

      if (error) throw error;

      setMilitaryList(militaryList.filter((_, i) => i !== index));
      toast({
        title: "Militar removido",
        description: "O militar foi removido com sucesso",
      });
    } catch (error) {
      console.error("Error deleting military:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o militar",
      });
    }
  };

  const handleEditVehicle = async (index: number) => {
    // Implementar lógica de edição
    toast({
      title: "Edição iniciada",
      description: `Editando VTR: ${vehicleList[index].vtr}`,
    });
  };

  const handleDeleteVehicle = async (index: number) => {
    try {
      const vehicle = vehicleList[index];
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const { error } = await supabase
        .from(`servico_vtrs_${selectedGBM}`)
        .delete()
        .eq("vtr", vehicle.vtr)
        .eq("data", formattedDate);

      if (error) throw error;

      setVehicleList(vehicleList.filter((_, i) => i !== index));
      toast({
        title: "VTR removida",
        description: "A VTR foi removida com sucesso",
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover a VTR",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        const [militaryResponse, vehicleResponse] = await Promise.all([
          supabase
            .from(`servico_militar_${selectedGBM}`)
            .select("*")
            .eq("data", formattedDate),
          supabase
            .from(`servico_vtrs_${selectedGBM}`)
            .select("*")
            .eq("data", formattedDate),
        ]);

        if (militaryResponse.error) throw militaryResponse.error;
        if (vehicleResponse.error) throw vehicleResponse.error;

        const formattedMilitaryData = (militaryResponse.data || []).map(
          (item) => ({
            name: item.nome_de_guerra || "",
            function: item.funcao || "",
            gbm: item.GBM || "",
            vtr: item.viatura || "",
            date: selectedDate,
            shiftDuration: "24",
          })
        );

        const formattedVehicleData = (vehicleResponse.data || []).map((item) => ({
          gbm: item.gbm || "",
          vtr: item.vtr || "",
          status: item.status || "",
          description: item.alteracao || "",
        }));

        setMilitaryList(formattedMilitaryData);
        setVehicleList(formattedVehicleData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do relatório",
        });
      }
    };

    fetchData();
  }, [selectedDate, selectedGBM, toast]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Militares</h3>
        <MilitaryTable
          militaryList={militaryList}
          onEdit={handleEditMilitary}
          onDelete={handleDeleteMilitary}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">VTRs</h3>
        <VehicleTable
          vehicleList={vehicleList}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
        />
      </div>
    </div>
  );
};