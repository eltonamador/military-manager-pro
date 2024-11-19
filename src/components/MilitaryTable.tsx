import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { EditRecordDialog } from "./consultation/results/EditRecordDialog";
import { TableActions } from "./consultation/results/TableActions";
import { TableHeader } from "./consultation/results/TableHeader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getMilitaryTableName } from "@/utils/tableNames";

interface Military {
  name: string;
  function: string;
  gbm: string;
  vtr: string;
  date: Date;
  shiftDuration: string;
}

interface MilitaryTableProps {
  militaryList: Military[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  allowEditing?: boolean;
}

type SortField = 'name' | 'vtr' | 'function' | 'gbm' | 'date' | 'shiftDuration';
type SortOrder = 'asc' | 'desc';

const MilitaryTable = ({ 
  militaryList, 
  onEdit, 
  onDelete,
  allowEditing = false 
}: MilitaryTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [editingRecord, setEditingRecord] = useState<Military | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEditClick = (record: Military, index: number) => {
    setEditingRecord(record);
    setSelectedIndex(index);
  };

  const handleDeleteClick = (index: number) => {
    setSelectedIndex(index);
    setDeleteConfirmOpen(true);
  };

  const handleSaveEdit = async (updatedRecord: Military) => {
    try {
      if (!editingRecord) return;
      
      const tableName = getMilitaryTableName(editingRecord.gbm);
      const { error } = await supabase
        .from(tableName)
        .update({
          nome_de_guerra: updatedRecord.name,
          funcao: updatedRecord.function,
          GBM: updatedRecord.gbm,
          viatura: updatedRecord.vtr,
        })
        .eq('nome_de_guerra', editingRecord.name);

      if (error) throw error;

      toast.success("Registro atualizado com sucesso!");
      if (onEdit && selectedIndex !== null) {
        onEdit(selectedIndex);
      }
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Erro ao atualizar registro");
    }
    setEditingRecord(null);
    setSelectedIndex(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedIndex === null) return;
      
      const record = militaryList[selectedIndex];
      const tableName = getMilitaryTableName(record.gbm);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('nome_de_guerra', record.name);

      if (error) throw error;

      toast.success("Registro excluído com sucesso!");
      if (onDelete) {
        onDelete(selectedIndex);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Erro ao excluir registro");
    }
    setDeleteConfirmOpen(false);
    setSelectedIndex(null);
  };

  const sortedList = [...militaryList].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
      default:
        return multiplier * (a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0);
    }
  });

  return (
    <>
      <div className="rounded-xl border border-military-red/20 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gradient-to-r from-military-red/10 to-military-orange/10">
            <TableRow className="hover:bg-transparent border-b border-military-red/20">
              <TableHeader field="name" label="Nome" onSort={handleSort} />
              <TableHeader field="vtr" label="VTR" onSort={handleSort} />
              <TableHeader field="function" label="Função" onSort={handleSort} />
              <TableHeader field="gbm" label="GBM" onSort={handleSort} />
              <TableHeader field="date" label="Data" onSort={handleSort} />
              <TableHeader field="shiftDuration" label="Jornada" onSort={handleSort} />
              {allowEditing && (
                <TableHead className="text-right font-semibold w-[100px] py-2">
                  Ações
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
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
                      onEdit={() => handleEditClick(military, index)}
                      onDelete={() => handleDeleteClick(index)}
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
        </Table>
      </div>

      {editingRecord && (
        <EditRecordDialog
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={handleSaveEdit}
          record={editingRecord}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MilitaryTable;