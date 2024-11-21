import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Vehicle } from "./vehicle/types";
import { SortButton } from "./vehicle/table/SortButton";
import { EquipmentChecklist } from "./vehicle/table/EquipmentChecklist";
import { SortField, SortOrder } from "./vehicle/table/types";

interface VehicleTableProps {
  vehicleList: Vehicle[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

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

  return (
    <div className="rounded-xl border border-military-orange/20 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-military-orange/10 to-military-red/10">
          <TableRow className="hover:bg-transparent border-b border-military-orange/20">
            <TableHead className="font-semibold w-[80px] py-2">
              <SortButton field="gbm" label="GBM" onSort={handleSort} />
            </TableHead>
            <TableHead className="font-semibold w-[100px] py-2">
              <SortButton field="vtr" label="VTR" onSort={handleSort} />
            </TableHead>
            <TableHead className="font-semibold w-[100px] py-2">
              <SortButton field="status" label="Status" onSort={handleSort} />
            </TableHead>
            <TableHead className="font-semibold w-[200px] py-2">
              <SortButton field="description" label="Descrição" onSort={handleSort} />
            </TableHead>
            <TableHead className="font-semibold w-[100px] py-2">
              <SortButton field="date" label="Data" onSort={handleSort} />
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
              {expandedRows.includes(index) && (
                <EquipmentChecklist vehicle={vehicle} index={index} />
              )}
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