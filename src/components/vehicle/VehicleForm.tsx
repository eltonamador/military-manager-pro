import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VehicleFormProps {
  selectedVTR: string;
  status: string;
  description: string;
  vtrOptions: string[];
  onVTRChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAddVehicle: () => void;
  editingIndex: number | null;
}

const VehicleForm = ({
  selectedVTR,
  status,
  description,
  vtrOptions,
  onVTRChange,
  onStatusChange,
  onDescriptionChange,
  onAddVehicle,
  editingIndex,
}: VehicleFormProps) => {
  const { toast } = useToast();

  const handleAddVehicle = () => {
    if (!selectedVTR || !status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    onAddVehicle();
  };

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <div>
        <Label htmlFor="vtr">VTR</Label>
        <Select onValueChange={onVTRChange} value={selectedVTR}>
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
        <Select onValueChange={onStatusChange} value={status}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operante">Operante</SelectItem>
            <SelectItem value="parcialmente">Parcialmente Operante</SelectItem>
            <SelectItem value="inoperante">Inoperante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Descrição das Alterações</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
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
  );
};

export default VehicleForm;