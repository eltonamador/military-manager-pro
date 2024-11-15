import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cadastro realizado com sucesso",
      description: "Você será redirecionado para a tela de login",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen military-gradient flex flex-col items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-military-red p-4 text-white text-center font-bold">
          CADASTRO DE USUÁRIO / CBMAP
        </div>
        <div className="p-6">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-military-orange flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="warName">Nome de Guerra</Label>
              <Input id="warName" type="text" required />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" type="tel" required />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-military-orange hover:bg-military-red transition-colors">
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;