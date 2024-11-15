import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportTables } from "@/components/report/ReportTables";
import { ReportActions } from "@/components/report/ReportActions";

const GBM_OPTIONS = [
  { value: "1gbm", label: "1º GBM" },
  { value: "2gbm", label: "2º GBM" },
  { value: "5gbm", label: "5º GBM" },
  { value: "gaph", label: "GAPH" },
  { value: "gmaf", label: "GMAF" },
  { value: "mcpb", label: "MCPB" },
];

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedGBM, setSelectedGBM] = useState<string>("1gbm");

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
              <Select
                value={selectedGBM}
                onValueChange={setSelectedGBM}
                options={GBM_OPTIONS}
              />
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