import { TableCell, TableRow } from "@/components/ui/table";
import { Vehicle } from "@/components/vehicle/types";

interface EquipmentChecklistProps {
  vehicle: Vehicle;
  index: number;
}

export const EquipmentChecklist = ({ vehicle }: EquipmentChecklistProps) => {
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