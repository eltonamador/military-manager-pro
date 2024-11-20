import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Military } from "@/types/military";

interface MilitaryTableProps {
  militaryList: Military[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  showInclusionTime?: boolean;
}

const MilitaryTable = ({ 
  militaryList, 
  onEdit, 
  onDelete,
  showInclusionTime = false 
}: MilitaryTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>GBM</TableHead>
            <TableHead>VTR</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Alterações</TableHead>
            {showInclusionTime && <TableHead>Horário de Inclusão</TableHead>}
            {(onEdit || onDelete) && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {militaryList.map((military, index) => {
            // Check if this entry is a VTR (vehicle) by checking if the name matches a VTR pattern
            const isVehicle = /^[A-Z]+-\d+$/.test(military.name);
            
            return (
              <TableRow key={index}>
                <TableCell>{military.name}</TableCell>
                <TableCell>{military.function}</TableCell>
                <TableCell>{military.gbm}</TableCell>
                <TableCell>
                  {/* Only show VTR if it's not a vehicle entry */}
                  {!isVehicle ? military.vtr : ""}
                </TableCell>
                <TableCell>
                  {military.date
                    ? format(new Date(military.date), "dd/MM/yyyy", { locale: ptBR })
                    : ""}
                </TableCell>
                <TableCell>
                  {/* For vehicles, show VTR in alterations. For others, show alterations */}
                  {isVehicle ? military.vtr : (military.alterations || "-")}
                </TableCell>
                {showInclusionTime && (
                  <TableCell>{military.inclusionTime}</TableCell>
                )}
                {(onEdit || onDelete) && (
                  <TableCell className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Excluir
                      </button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MilitaryTable;