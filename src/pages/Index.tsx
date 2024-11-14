import { useState } from "react";
import { ChevronDown, LogIn, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Military {
  name: string;
  function: string;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedMilitary, setSelectedMilitary] = useState("");
  const [militaryFunction, setMilitaryFunction] = useState("");
  const [militaryList, setMilitaryList] = useState<Military[]>([]);
  const { toast } = useToast();

  const gbmOptions = ["1º GBM", "2º GBM", "GAPH", "GMAF", "5º GBM", "MCPB"];
  const vtrOptions: Record<string, string[]> = {
    "1º GBM": ["VTR-01", "VTR-02"],
    "2º GBM": ["VTR-03", "VTR-04"],
    "GAPH": ["VTR-05", "VTR-06"],
    "GMAF": ["VTR-07", "VTR-08"],
    "5º GBM": ["VTR-09", "VTR-10"],
    "MCPB": ["VTR-11", "VTR-12"],
  };
  const militaryOptions: Record<string, string[]> = {
    "1º GBM": ["João Silva", "Maria Oliveira"],
    "2º GBM": ["Pedro Santos", "Ana Rodrigues"],
    "GAPH": ["Carlos Ferreira", "Juliana Costa"],
    "GMAF": ["Marcos Souza", "Beatriz Lima"],
    "5º GBM": ["Ricardo Alves", "Fernanda Pereira"],
    "MCPB": ["Gabriel Martins", "Camila Rocha"],
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    toast({
      title: "Login realizado com sucesso",
      description: "Bem-vindo ao sistema de gestão de militares",
    });
  };

  const handleAddMilitary = () => {
    if (selectedMilitary && militaryFunction) {
      setMilitaryList([
        ...militaryList,
        { name: selectedMilitary, function: militaryFunction },
      ]);
      setSelectedMilitary("");
      setMilitaryFunction("");
      toast({
        title: "Militar adicionado",
        description: "O militar foi adicionado com sucesso à lista",
      });
    }
  };

  const handleFinishOperation = () => {
    toast({
      title: "Operação finalizada",
      description: "Todos os dados foram salvos com sucesso",
    });
    setMilitaryList([]);
    setSelectedGBM("");
    setSelectedVTR("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen military-gradient flex flex-col items-center justify-center p-4 animate-fadeIn">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-military-red p-4 text-white text-center font-bold">
            COMANDO OPERACIONAL / CBMAP
          </div>
          <div className="p-6">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-military-orange flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-military-orange hover:bg-military-red transition-colors"
              >
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen military-gradient flex flex-col p-4 animate-fadeIn">
      <header className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-military-red">
          Gestão de Militares
        </h1>
      </header>
      <main className="flex-grow bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="gbm">GBM</Label>
            <Select onValueChange={setSelectedGBM} value={selectedGBM}>
              <SelectTrigger id="gbm">
                <SelectValue placeholder="Selecione o GBM" />
              </SelectTrigger>
              <SelectContent>
                {gbmOptions.map((gbm) => (
                  <SelectItem key={gbm} value={gbm}>
                    {gbm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="vtr">VTR</Label>
            <Select
              onValueChange={setSelectedVTR}
              value={selectedVTR}
              disabled={!selectedGBM}
            >
              <SelectTrigger id="vtr">
                <SelectValue placeholder="Selecione a VTR" />
              </SelectTrigger>
              <SelectContent>
                {selectedGBM &&
                  vtrOptions[selectedGBM].map((vtr) => (
                    <SelectItem key={vtr} value={vtr}>
                      {vtr}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="military">Nome do Militar</Label>
            <Select
              onValueChange={setSelectedMilitary}
              value={selectedMilitary}
              disabled={!selectedGBM}
            >
              <SelectTrigger id="military">
                <SelectValue placeholder="Selecione o Militar" />
              </SelectTrigger>
              <SelectContent>
                {selectedGBM &&
                  militaryOptions[selectedGBM].map((military) => (
                    <SelectItem key={military} value={military}>
                      {military}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="function">Função</Label>
            <Input
              id="function"
              value={militaryFunction}
              onChange={(e) => setMilitaryFunction(e.target.value)}
              placeholder="Digite a função"
            />
          </div>
        </div>
        <Button
          onClick={handleAddMilitary}
          className="mb-6 bg-military-orange hover:bg-military-red transition-colors"
          disabled={!selectedMilitary || !militaryFunction}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Militar
        </Button>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Função</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {militaryList.map((military, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{military.name}</TableCell>
                  <TableCell>{military.function}</TableCell>
                </TableRow>
              ))}
              {militaryList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Nenhum militar adicionado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      <footer className="mt-6">
        <Button
          onClick={handleFinishOperation}
          className="w-full bg-military-red hover:bg-military-orange transition-colors"
          disabled={militaryList.length === 0}
        >
          Finalizar Operação
        </Button>
      </footer>
    </div>
  );
};

export default Index;