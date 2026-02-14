import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password, role);
    if (success) {
      navigate(`/dashboard/${role}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-2xl text-primary-foreground">MediZen</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Bienvenue sur votre plateforme de gestion des urgences
          </h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Connectez-vous pour accéder à votre espace personnel et gérer les patients en toute efficacité.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-1">Connexion</h1>
          <p className="text-muted-foreground mb-8">Entrez vos identifiants pour accéder au système</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="urgentiste">Urgentiste</SelectItem>
                  <SelectItem value="medecin">Médecin</SelectItem>
                  <SelectItem value="receptionniste">Réceptionniste</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@hopital-teboulba.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Se connecter
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Prototype MediZen — Données simulées
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
