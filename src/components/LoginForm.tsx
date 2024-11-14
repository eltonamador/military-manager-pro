import { LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
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
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="********" required />
            </div>
            <Button type="submit" className="w-full bg-military-orange hover:bg-military-red transition-colors">
              <LogIn className="mr-2 h-4 w-4" /> Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;