import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EquipmentStatus {
  equipment: string;
  status: string;
  description: string;
}

interface MilitaryTableProps {
  militaryList: Array<{
    name: string;
    function: string;
    gbm: string;
    vtr: string;
    date: Date;
    alterations: string;
    time?: string;
    equipmentStatus: EquipmentStatus[];
  }>;
  showInclusionTime?: boolean;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

const MilitaryTable = ({ militaryList, showInclusionTime = false, onEdit, onDelete }: MilitaryTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome/VTR</TableHead>
          <TableHead>Função/Status</TableHead>
          <TableHead>GBM</TableHead>
          <TableHead>Alterações</TableHead>
          {showInclusionTime && <TableHead>Horário</TableHead>}
          <TableHead>Equipamentos</TableHead>
          {(onEdit || onDelete) && <TableHead>Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {militaryList.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.function}</TableCell>
            <TableCell>{item.gbm}</TableCell>
            <TableCell>{item.alterations}</TableCell>
            {showInclusionTime && <TableCell>{item.time}</TableCell>}
            <TableCell>
              {item.equipmentStatus && item.equipmentStatus.length > 0 ? (
                <div className="space-y-2">
                  {item.equipmentStatus.map((eq, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-semibold">{eq.equipment}</span>: {eq.status}
                      {eq.description && (
                        <span className="text-gray-500 ml-1">({eq.description})</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                "-"
              )}
            </TableCell>
            {(onEdit || onDelete) && (
              <TableCell className="space-x-2">
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
        ))}
      </TableBody>
    </Table>
  );
};

export default MilitaryTable;