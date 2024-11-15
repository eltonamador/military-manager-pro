import { LogIn, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha inválidos"
            : "Ocorreu um erro ao fazer login",
        });
      } else {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema de gestão de militares",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen military-gradient flex flex-col items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-military-red p-4 text-white text-center font-bold">
          COMANDO OPERACIONAL / CBMAP
        </div>
        
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
            alt="Imagem de Login" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Usuário (E-mail)</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-military-orange hover:bg-military-red transition-colors"
              disabled={loading}
            >
              <LogIn className="mr-2 h-4 w-4" /> 
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-2">
            <Link 
              to="/register" 
              className="text-military-orange hover:text-military-red transition-colors flex items-center justify-center gap-2"
            >
              <User className="h-4 w-4" />
              Criar nova conta
            </Link>
            <Link 
              to="/query" 
              className="text-military-orange hover:text-military-red transition-colors flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Consultar serviços
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;