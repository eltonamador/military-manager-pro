import { LogIn } from "lucide-react";
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Erro ao fazer login";
        
        if (error.message === "Invalid login credentials") {
          errorMessage = "Email ou senha inválidos";
        }

        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: errorMessage,
        });
      } else if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profileData) {
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                nome_guerra: data.user.user_metadata.nome_guerra || email.split('@')[0],
                matricula: email,
                telefone: data.user.user_metadata.telefone,
              }
            ]);

          if (createProfileError) {
            console.error('Error creating profile:', createProfileError);
          }
        }

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema de gestão de militares",
        });
        navigate("/officer-selection");
      }
    } catch (error) {
      console.error('Login error:', error);
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
    <div className="min-h-screen military-gradient flex flex-col items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-military-red p-3 sm:p-4 text-white text-center font-bold">
          COMANDO OPERACIONAL / CBMAP
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
              <img 
                src="/src/escaladohj2.webp" 
                alt="Logo CBMAP" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
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
              className="w-full bg-military-orange hover:bg-military-red transition-colors text-lg font-semibold"
              disabled={loading}
            >
              <LogIn className="mr-2 h-5 w-5" /> 
              {loading ? "Entrando..." : "Avance Guerreiro"}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-3">
            <Link to="/register" className="text-military-orange hover:text-military-red transition-colors block text-sm sm:text-base">
              Não tem uma conta? Cadastre-se
            </Link>
            <Link 
              to="/consultation" 
              className="text-military-orange hover:text-military-red transition-colors block text-base sm:text-lg font-semibold underline decoration-2 hover:decoration-[3px]"
            >
              Consultar Equipe Operacional
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
