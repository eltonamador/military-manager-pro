import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

interface OfficerPreviewProps {
  selectedFunction: string;
  selectedOfficer: string;
  selectedDate: Date;
  selectedVTR: string;
}

const OfficerPreview = ({
  selectedFunction,
  selectedOfficer,
  selectedDate,
  selectedVTR,
}: OfficerPreviewProps) => {
  if (!selectedFunction && !selectedOfficer && !selectedVTR) return null;

  return (
    <>
      <Separator className="my-6" />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Confirmação dos Dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-500">Função</p>
            <p className="text-gray-900">{selectedFunction || "Não selecionado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Oficial</p>
            <p className="text-gray-900">{selectedOfficer || "Não selecionado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Data do Serviço</p>
            <p className="text-gray-900">
              {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Não selecionado"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">VTR</p>
            <p className="text-gray-900">{selectedVTR || "Não selecionado"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfficerPreview;