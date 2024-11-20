import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface VehicleFormProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedDate: Date;
  status: string;
  description: string;
  gbmOptions: string[];
  vtrOptions: string[];
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onStatusChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAddVehicle: (time?: string) => void;
  editingIndex: number | null;
}

const VehicleForm = ({
  selectedGBM,
  selectedVTR,
  selectedDate,
  status,
  description,
  gbmOptions,
  vtrOptions,
  onGBMChange,
  onVTRChange,
  onDateChange,
  onStatusChange,
  onDescriptionChange,
  onAddVehicle,
  editingIndex,
}: VehicleFormProps) => {
  const [hasAlterations, setHasAlterations] = useState(false);
  const [selectedTime, setSelectedTime] = useState(format(new Date(), 'HH:mm'));

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <div>
        <Label htmlFor="gbm_vtr">GBM</Label>
        <Select onValueChange={onGBMChange} value={selectedGBM}>
          <SelectTrigger id="gbm_vtr">
            <SelectValue placeholder="Selecione o GBM" />
          </SelectTrigger>
          <SelectContent>
            {gbmOptions.map((gbm) => (
              <SelectItem key={gbm} value={gbm}>
                {gbm}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Data do Serviço</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              {selectedDate ? format(selectedDate, "PPP") : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="alterations"
          checked={hasAlterations}
          onCheckedChange={(checked) => {
            setHasAlterations(checked === true);
            if (!checked) onDescriptionChange("");
          }}
        />
        <Label htmlFor="alterations">Alterações</Label>
      </div>

      {hasAlterations && (
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
      )}

      <input 
        type="time" 
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="hidden"
      />

      <Button
        onClick={() => onAddVehicle(selectedTime)}
        className="w-full bg-military-orange hover:bg-military-red transition-colors"
        disabled={!selectedGBM || !selectedVTR || !status}
      >
        <Plus className="mr-2 h-4 w-4" />
        {editingIndex !== null ? "Atualizar VTR" : "Adicionar VTR"}
      </Button>
    </div>
  );
};

export default VehicleForm;