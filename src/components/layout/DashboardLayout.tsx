import { ReactNode, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/data/mockData';
import {
  LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X,
  Stethoscope, ClipboardList, UserPlus, ShieldCheck, Activity, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  urgentiste: [
    { label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/dashboard/urgentiste' },
    { label: 'Pré-triage', icon: <ClipboardList size={20} />, path: '/dashboard/urgentiste/triage' },
    { label: 'File d\'attente', icon: <Users size={20} />, path: '/dashboard/urgentiste/queue' },
  ],
  receptionniste: [
    { label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/dashboard/receptionniste' },
    { label: 'Enregistrement', icon: <UserPlus size={20} />, path: '/dashboard/receptionniste/register' },
    { label: 'Salle d\'attente', icon: <Users size={20} />, path: '/dashboard/receptionniste/waiting' },
  ],
  medecin: [
    { label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/dashboard/medecin' },
    { label: 'Mes patients', icon: <Stethoscope size={20} />, path: '/dashboard/medecin/patients' },
    { label: 'Consultations', icon: <FileText size={20} />, path: '/dashboard/medecin/consultations' },
  ],
  admin: [
    { label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/dashboard/admin' },
    { label: 'Gestion utilisateurs', icon: <Users size={20} />, path: '/dashboard/admin/users' },
    { label: 'Rôles & accès', icon: <ShieldCheck size={20} />, path: '/dashboard/admin/roles' },
    { label: 'Statistiques', icon: <Activity size={20} />, path: '/dashboard/admin/stats' },
    { label: 'Paramètres', icon: <Settings size={20} />, path: '/dashboard/admin/settings' },
  ],
};

const roleLabels: Record<UserRole, string> = {
  urgentiste: 'Urgentiste',
  medecin: 'Médecin',
  receptionniste: 'Réceptionniste',
  admin: 'Administrateur',
};

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const navItems = roleNavItems[user.role];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
              <span className="text-sidebar-primary-foreground font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="font-bold text-base text-sidebar-primary-foreground">MediZen</h1>
              <p className="text-xs text-sidebar-foreground/60">{roleLabels[user.role]}</p>
            </div>
            <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </button>
              );
            })}
          </nav>

          {/* User */}
          <div className="px-3 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-bold">
                {user.prenom[0]}{user.nom[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-primary-foreground truncate">{user.prenom} {user.nom}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10"
              onClick={() => { logout(); navigate('/'); }}
            >
              <LogOut size={18} />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6 shrink-0">
          <button className="lg:hidden mr-3" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Hôpital de Teboulba</span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs">En ligne</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
