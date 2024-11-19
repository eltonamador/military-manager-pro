import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { EditRecordDialog } from "./consultation/results/EditRecordDialog";
import { TableActions } from "./consultation/results/TableActions";
import { SortableHeader } from "./consultation/results/TableHeader";
import { TableContent } from "./consultation/results/TableContent";
import { DeleteConfirmDialog } from "./consultation/results/DeleteConfirmDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getMilitaryTableName } from "@/utils/tableNames";
import { Military } from "@/types/military";

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
          data: format(updatedRecord.date, 'yyyy-MM-dd'),
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
        .eq('nome_de_guerra', record.name)
        .eq('data', format(record.date, 'yyyy-MM-dd'));

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
          <TableHead className="bg-gradient-to-r from-military-red/10 to-military-orange/10">
            <TableRow className="hover:bg-transparent border-b border-military-red/20">
              <SortableHeader field="name" label="Nome" onSort={handleSort} />
              <SortableHeader field="vtr" label="VTR" onSort={handleSort} />
              <SortableHeader field="function" label="Função" onSort={handleSort} />
              <SortableHeader field="gbm" label="GBM" onSort={handleSort} />
              <SortableHeader field="date" label="Data" onSort={handleSort} />
              <SortableHeader field="shiftDuration" label="Jornada" onSort={handleSort} />
              {allowEditing && (
                <TableHead className="text-right font-semibold w-[100px] py-2">
                  Ações
                </TableHead>
              )}
            </TableRow>
          </TableHead>
          <TableContent 
            sortedList={sortedList}
            allowEditing={allowEditing}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
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

      <DeleteConfirmDialog 
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default MilitaryTable;