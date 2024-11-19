import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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
      className="hover:bg-military-orange/10 text-gray-700 font-medium w-full justify-start px-2"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-xl border border-military-orange/20 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-military-orange/10 to-military-red/10">
          <TableRow className="hover:bg-transparent border-b border-military-orange/20">
            <TableHead className="font-semibold w-[100px]">
              <SortButton field="gbm" label="GBM" />
            </TableHead>
            <TableHead className="font-semibold w-[120px]">
              <SortButton field="vtr" label="VTR" />
            </TableHead>
            <TableHead className="font-semibold w-[120px]">
              <SortButton field="status" label="Status" />
            </TableHead>
            <TableHead className="font-semibold w-[250px]">
              <SortButton field="description" label="Descrição" />
            </TableHead>
            <TableHead className="font-semibold w-[120px]">
              <SortButton field="date" label="Data" />
            </TableHead>
            <TableHead className="text-right font-semibold w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedList.map((vehicle, index) => (
            <TableRow 
              key={index}
              className="hover:bg-military-orange/5 transition-colors duration-200 even:bg-gray-100/80"
            >
              <TableCell className="font-medium text-center">{vehicle.gbm}</TableCell>
              <TableCell className="text-center">{vehicle.vtr}</TableCell>
              <TableCell>{vehicle.status}</TableCell>
              <TableCell>{vehicle.description}</TableCell>
              <TableCell>{vehicle.date ? format(vehicle.date, "dd/MM/yyyy", { locale: ptBR }) : ""}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  onClick={() => onEdit(index)}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-military-orange/10"
                >
                  <Pencil className="h-4 w-4 text-military-orange" />
                </Button>
                <Button
                  onClick={() => onDelete(index)}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-military-orange/10"
                >
                  <Trash2 className="h-4 w-4 text-military-orange" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {sortedList.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="text-center text-gray-500 py-8 bg-gray-50/50"
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