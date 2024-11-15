import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ReportTablesProps {
  selectedGBM: string;
  selectedDate: Date | undefined;
  onEdit: (type: 'military' | 'vehicle', index: number) => void;
}

const getServiceTableName = (gbm: string) => {
  const normalizedGbm = gbm.toLowerCase().replace(/[º°]/g, '');
  return `servico_militar_${normalizedGbm}`;
};

const getVehicleTableName = (gbm: string) => {
  const normalizedGbm = gbm.toLowerCase().replace(/[º°]/g, '');
  return `servico_vtrs_${normalizedGbm}`;
};

const ReportTables = ({ selectedGBM, selectedDate, onEdit }: ReportTablesProps) => {
  const [militaryData, setMilitaryData] = useState<any[]>([]);
  const [vehicleData, setVehicleData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const militaryTableName = getServiceTableName(selectedGBM);
      const vehicleTableName = getVehicleTableName(selectedGBM);
      
      try {
        const { data: militaryResponse, error: militaryError } = await supabase.from(militaryTableName).select();
        if (militaryError) throw militaryError;

        const { data: vehicleResponse, error: vehicleError } = await supabase.from(vehicleTableName).select();
        if (vehicleError) throw vehicleError;

        setMilitaryData(militaryResponse);
        setVehicleData(vehicleResponse);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Erro ao carregar dados de militares ou VTRs.",
        });
      }
    };

    fetchData();
  }, [selectedGBM, selectedDate]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome de Guerra</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {militaryData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.nome_de_guerra}</TableCell>
              <TableCell>{row.funcao}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit('military', index)}>Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>VTR</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicleData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.vtr}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.alteracao}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit('vehicle', index)}>Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportTables;
