import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
  equipmentStatuses?: Array<{
    equipamento: string;
    status: string;
    description: string | null;
  }>;
}

interface VehicleTableProps {
  vehicleList: Vehicle[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

type SortField = 'gbm' | 'vtr' | 'status' | 'description' | 'date';
type SortOrder = 'asc' | 'desc';

const VehicleTable = ({ vehicleList, onEdit, onDelete }: VehicleTableProps) => {
  const [sortField, setSortField] = useState<SortField>('gbm');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleRow = (index: number) => {
    setExpandedRows(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const sortedList = [...vehicleList].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
      default:
        return multiplier * (a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0);
    }
  });

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="hover:bg-military-orange/10 text-gray-700 font-medium w-full justify-start p-1"
    >
      {label}
      <ArrowUpDown className="ml-1 h-4 w-4" />
    </Button>
  );

  const renderEquipmentChecklist = (vehicle: Vehicle, index: number) => {
    if (!vehicle.equipmentStatuses?.length) return null;

    const vehicleType = vehicle.vtr.startsWith('ABS') ? 'ABS' : 'ABT';

    return (
      <TableRow className="bg-gray-50/50">
        <TableCell colSpan={6} className="py-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">
              Checklist de Equipamentos - {vehicleType}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicle.equipmentStatuses.map((equipment, idx) => (
                <div key={idx} className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                  <p className="font-medium text-gray-700">{equipment.equipamento}</p>
                  {equipment.equipamento.includes('Mangueiras') ? (
                    <p className="text-gray-600 mt-1">{equipment.description}</p>
                  ) : (
                    <p className="text-gray-600 mt-1">Status: {equipment.status}</p>
                  )}
                  {equipment.description && !equipment.equipamento.includes('Mangueiras') && (
                    <p className="text-gray-500 text-sm mt-1">{equipment.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="rounded-xl border border-military-orange/20 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-military-orange/10 to-military-red/10">
          <TableRow className="hover:bg-transparent border-b border-military-orange/20">
            <TableHead className="font-semibold w-[80px] py-2">
              <SortButton field="gbm" label="GBM" />
            </TableHead>
            <TableHead className="font-semibold w-[100px] py-2">
              <SortButton field="vtr" label="VTR" />
            </TableHead>
            <TableHead className="font-semibold w-[100px] py-2">
              <SortButton field="status" label="Status" />
            </TableHead>
            <TableHead className="font-semibold w-[200px] py-2">
              <SortButton field="description" label="Descrição" />
            </TableHead>
            <TableHead className="font-semibold w-[100px] py-2">
              <SortButton field="date" label="Data" />
            </TableHead>
            <TableHead className="text-right font-semibold w-[80px] py-2">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedList.map((vehicle, index) => (
            <>
              <TableRow 
                key={`row-${index}`}
                className="hover:bg-military-orange/5 transition-colors duration-200 even:bg-gray-100/80 cursor-pointer"
                onClick={() => toggleRow(index)}
              >
                <TableCell className="font-medium text-center py-1.5">{vehicle.gbm}</TableCell>
                <TableCell className="text-center py-1.5">{vehicle.vtr}</TableCell>
                <TableCell className="py-1.5">{vehicle.status}</TableCell>
                <TableCell className="py-1.5">{vehicle.description}</TableCell>
                <TableCell className="py-1.5">
                  {vehicle.date ? format(vehicle.date, "dd/MM/yyyy", { locale: ptBR }) : ""}
                </TableCell>
                <TableCell className="text-right space-x-1 py-1.5">
                  {vehicle.equipmentStatuses?.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-military-orange/10 h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(index);
                      }}
                    >
                      {expandedRows.includes(index) ? (
                        <ChevronUp className="h-4 w-4 text-military-orange" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-military-orange" />
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(index);
                    }}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-military-orange/10 h-7 w-7"
                  >
                    <Pencil className="h-4 w-4 text-military-orange" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(index);
                    }}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-military-orange/10 h-7 w-7"
                  >
                    <Trash2 className="h-4 w-4 text-military-orange" />
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows.includes(index) && renderEquipmentChecklist(vehicle, index)}
            </>
          ))}
          {sortedList.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="text-center text-gray-500 py-6 bg-gray-50/50"
              >
                Nenhuma VTR adicionada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable;