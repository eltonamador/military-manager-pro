import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TableActions } from "./TableActions";
import { Military } from "@/types/military";

interface TableContentProps {
  sortedList: Military[];
  allowEditing: boolean;
  onEditClick: (record: Military, index: number) => void;
  onDeleteClick: (index: number) => void;
}

export const TableContent = ({ 
  sortedList, 
  allowEditing, 
  onEditClick, 
  onDeleteClick 
}: TableContentProps) => {
  return (
    <TableBody>
      {sortedList.map((military, index) => (
        <TableRow 
          key={index} 
          className="hover:bg-military-red/5 transition-colors duration-200 even:bg-gray-100/80"
        >
          <TableCell className="font-medium py-1.5">{military.name}</TableCell>
          <TableCell className="text-center py-1.5">{military.vtr}</TableCell>
          <TableCell className="py-1.5">{military.function}</TableCell>
          <TableCell className="text-center py-1.5">{military.gbm}</TableCell>
          <TableCell className="py-1.5">
            {format(military.date, "dd/MM/yyyy", { locale: ptBR })}
          </TableCell>
          <TableCell className="text-center py-1.5">{military.shiftDuration}h</TableCell>
          {allowEditing && (
            <TableCell className="text-right py-1.5">
              <TableActions
                onEdit={() => onEditClick(military, index)}
                onDelete={() => onDeleteClick(index)}
              />
            </TableCell>
          )}
        </TableRow>
      ))}
      {sortedList.length === 0 && (
        <TableRow>
          <TableCell 
            colSpan={allowEditing ? 7 : 6} 
            className="text-center text-gray-500 py-6 bg-gray-50/50"
          >
            Nenhum registro encontrado
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};