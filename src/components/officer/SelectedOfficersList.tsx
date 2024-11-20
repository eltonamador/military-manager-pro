import { Separator } from "@/components/ui/separator";

interface Officer {
  function: string;
  officer: string;
  vtr?: string;
}

interface SelectedOfficersListProps {
  officers: Officer[];
}

const SelectedOfficersList = ({ officers }: SelectedOfficersListProps) => {
  if (officers.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Oficiais Selecionados</h3>
      <div className="space-y-4">
        {officers.map((officer, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Função</p>
                <p className="text-gray-900">{officer.function}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Oficial</p>
                <p className="text-gray-900">{officer.officer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">VTR</p>
                <p className="text-gray-900">{officer.vtr || "Não selecionada"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Separator className="my-6" />
    </div>
  );
};

export default SelectedOfficersList;