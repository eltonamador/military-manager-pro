import { Separator } from "@/components/ui/separator";

interface Officer {
  function: string;
  officer: string;
  vtr: string;
}

interface SelectedOfficersListProps {
  officers: Officer[];
}

const SelectedOfficersList = ({ officers }: SelectedOfficersListProps) => {
  if (officers.length === 0) return null;

  return (
    <>
      <Separator className="my-6" />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Oficiais Selecionados</h3>
        <div className="space-y-3">
          {officers.map((officer, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{officer.function}</p>
              <p className="text-sm text-gray-600">Oficial: {officer.officer}</p>
              <p className="text-sm text-gray-600">VTR: {officer.vtr}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SelectedOfficersList;