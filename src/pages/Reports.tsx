import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportTables } from "@/components/report/ReportTables";
import { ReportActions } from "@/components/report/ReportActions";
import { GBMOption } from "@/types/supabase";

const GBM_OPTIONS = [
  { value: "1gbm", label: "1º GBM" },
  { value: "2gbm", label: "2º GBM" },
  { value: "5gbm", label: "5º GBM" },
  { value: "gaph", label: "GAPH" },
  { value: "gmaf", label: "GMAF" },
  { value: "mcpb", label: "MCPB" },
] as const;

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedGBM, setSelectedGBM] = useState<GBMOption>("1gbm");

  const handleGBMChange = (value: string) => {
    setSelectedGBM(value as GBMOption);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios de Serviço</CardTitle>
          <CardDescription>
            Visualize e gerencie os relatórios de serviço por GBM e data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">GBM</label>
              <Select value={selectedGBM} onValueChange={handleGBMChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o GBM" />
                </SelectTrigger>
                <SelectContent>
                  {GBM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>
          </div>

          <ReportTables
            selectedDate={selectedDate}
            selectedGBM={selectedGBM}
          />

          <ReportActions
            selectedDate={selectedDate}
            selectedGBM={selectedGBM}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;