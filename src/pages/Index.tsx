import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Stethoscope, ShieldCheck, UserPlus, LayoutDashboard, Phone, MapPin, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-medical.jpg';

const roles = [
  {
    title: 'Urgentiste',
    description: 'Pré-triage des patients, évaluation du score d\'urgence et orientation vers le circuit adapté.',
    icon: <ShieldCheck className="w-8 h-8" />,
  },
  {
    title: 'Médecin',
    description: 'Consultation des patients assignés, diagnostic, notes médicales et suivi du parcours.',
    icon: <Stethoscope className="w-8 h-8" />,
  },
  {
    title: 'Réceptionniste',
    description: 'Enregistrement des patients, gestion de la salle d\'attente et suivi des admissions.',
    icon: <UserPlus className="w-8 h-8" />,
  },
  {
    title: 'Administrateur',
    description: 'Gestion des comptes, statistiques globales, paramétrage du système et rapports.',
    icon: <LayoutDashboard className="w-8 h-8" />,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-foreground">MediZen</span>
          </div>
          <Link to="/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              Gestion intelligente des urgences hospitalières
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              MediZen optimise le parcours patient aux urgences de l'Hôpital de Teboulba grâce au pré-triage automatisé, la gestion des files d'attente et le suivi en temps réel.
            </p>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="hero" size="lg">
                  Accéder au système
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roles */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">Un espace dédié à chaque rôle</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Chaque professionnel accède à un tableau de bord personnalisé selon ses responsabilités.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-medical transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                {role.icon}
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{role.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{role.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Hôpital d'Urgence Teboulba</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Service d'urgences médicales offrant une prise en charge rapide et professionnelle pour tous les patients de la région de Monastir.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  <span>73 256 145</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>Teboulba, Monastir</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Horaires</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} className="text-primary" />
                <span>24h/24 – 7j/7</span>
              </div>
              <p className="text-muted-foreground text-sm mt-3">
                Service d'urgences disponible en permanence, y compris les jours fériés.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 Hôpital d'Urgence Teboulba - Monastir. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
