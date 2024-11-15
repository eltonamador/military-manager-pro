import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [militaryData, setMilitaryData] = useState([]);
  const { toast } = useToast();
  const [selectedGBM, setSelectedGBM] = useState("1º GBM");

  useEffect(() => {
    const fetchMilitaryData = async () => {
      try {
        const tableName = `military_${selectedGBM.toLowerCase().replace(/[ºª\s]/g, '')}`;
        const { data, error } = await supabase
          .from(tableName)
          .select("*");

        if (error) throw error;
        setMilitaryData(data || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos militares",
        });
      }
    };

    fetchMilitaryData();
  }, [selectedGBM, toast]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sistema de Gestão de Militares</h1>
      
      <div className="mb-4">
        <label htmlFor="gbm" className="block text-sm font-medium text-gray-700">
          Selecione o GBM
        </label>
        <select
          id="gbm"
          value={selectedGBM}
          onChange={(e) => setSelectedGBM(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="1º GBM">1º GBM</option>
          <option value="2º GBM">2º GBM</option>
          <option value="5º GBM">5º GBM</option>
          <option value="GAPH">GAPH</option>
          <option value="GMAF">GMAF</option>
          <option value="MCPB">MCPB</option>
        </select>
      </div>

      <Button
        onClick={() => {
          window.location.href = '/vehicle-receiving';
        }}
      >
        Iniciar Operação
      </Button>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Militares em Serviço</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome de Guerra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Viatura
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {militaryData.map((military: any) => (
                <tr key={military.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{military.nome_de_guerra}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{military.funcao}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{military.viatura}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Index;
