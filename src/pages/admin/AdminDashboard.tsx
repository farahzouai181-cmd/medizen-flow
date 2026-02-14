import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { mockUsers, mockPatients, type User, type UserRole } from '@/data/mockData';
import { Users, Activity, Clock, TrendingUp, Search, UserPlus, Shield } from 'lucide-react';

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrateur',
  medecin: 'Médecin',
  urgentiste: 'Urgentiste',
  receptionniste: 'Réceptionniste',
};

const roleBadgeVariant: Record<UserRole, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  admin: 'default',
  medecin: 'secondary',
  urgentiste: 'outline',
  receptionniste: 'outline',
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '', role: 'medecin' as UserRole });

  const filteredUsers = users.filter(u =>
    `${u.nom} ${u.prenom} ${u.email} ${u.role}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patients = mockPatients;
  const avgWait = '42 min';

  const stats = [
    { label: 'Patients aujourd\'hui', value: patients.length, icon: <Users size={20} />, color: 'text-primary' },
    { label: 'Temps moyen d\'attente', value: avgWait, icon: <Clock size={20} />, color: 'text-warning' },
    { label: 'Utilisateurs actifs', value: users.filter(u => u.actif).length, icon: <Activity size={20} />, color: 'text-success' },
    { label: 'Taux priorisation', value: '94%', icon: <TrendingUp size={20} />, color: 'text-primary' },
  ];

  const toggleUserActive = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, actif: !u.actif } : u));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Tableau de bord — Administrateur</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={s.color}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{typeof s.value === 'number' ? s.value : s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Gestion utilisateurs</TabsTrigger>
            <TabsTrigger value="create">Créer un compte</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="settings">Paramètres scoring</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                className="pl-10"
                placeholder="Rechercher par nom, email ou rôle..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Utilisateur</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Rôle</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Statut</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-border/50">
                          <td className="py-3 px-4 font-medium text-foreground">{u.prenom} {u.nom}</td>
                          <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-4"><Badge variant={roleBadgeVariant[u.role]}>{roleLabels[u.role]}</Badge></td>
                          <td className="py-3 px-4">
                            <Badge variant={u.actif ? 'default' : 'secondary'} className={u.actif ? 'urgency-low' : ''}>
                              {u.actif ? 'Actif' : 'Inactif'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Switch checked={u.actif} onCheckedChange={() => toggleUserActive(u.id)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserPlus size={20} /> Créer un nouveau compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nom</Label><Input className="mt-1" value={newUser.nom} onChange={e => setNewUser({...newUser, nom: e.target.value})} /></div>
                  <div><Label>Prénom</Label><Input className="mt-1" value={newUser.prenom} onChange={e => setNewUser({...newUser, prenom: e.target.value})} /></div>
                </div>
                <div><Label>Email</Label><Input className="mt-1" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} /></div>
                <div>
                  <Label>Rôle</Label>
                  <Select value={newUser.role} onValueChange={v => setNewUser({...newUser, role: v as UserRole})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="medecin">Médecin</SelectItem>
                      <SelectItem value="urgentiste">Urgentiste</SelectItem>
                      <SelectItem value="receptionniste">Réceptionniste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Créer le compte</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Répartition par urgence</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Critique (9-10)', count: patients.filter(p => p.scoreUrgence >= 9).length, cls: 'bg-destructive' },
                      { label: 'Élevé (7-8)', count: patients.filter(p => p.scoreUrgence >= 7 && p.scoreUrgence < 9).length, cls: 'bg-warning' },
                      { label: 'Modéré (4-6)', count: patients.filter(p => p.scoreUrgence >= 4 && p.scoreUrgence < 7).length, cls: 'bg-warning/60' },
                      { label: 'Faible (1-3)', count: patients.filter(p => p.scoreUrgence < 4).length, cls: 'bg-success' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.cls}`} />
                        <span className="flex-1 text-sm text-foreground">{item.label}</span>
                        <span className="font-bold text-foreground">{item.count}</span>
                        <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full ${item.cls}`} style={{ width: `${(item.count / patients.length) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Performance du service</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm text-muted-foreground">Patients traités aujourd'hui</span>
                    <span className="font-bold text-foreground">{patients.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm text-muted-foreground">Temps moyen d'attente</span>
                    <span className="font-bold text-foreground">42 min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm text-muted-foreground">Taux de priorisation correcte</span>
                    <span className="font-bold text-success">94%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm text-muted-foreground">Médecins en service</span>
                    <span className="font-bold text-foreground">3</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield size={20} /> Seuils de scoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div>
                    <p className="font-medium text-foreground">Critique</p>
                    <p className="text-xs text-muted-foreground">Transfert immédiat</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-16 text-center" defaultValue="9" type="number" />
                    <span className="text-muted-foreground">- 10</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div>
                    <p className="font-medium text-foreground">Élevé</p>
                    <p className="text-xs text-muted-foreground">Priorité haute</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-16 text-center" defaultValue="7" type="number" />
                    <span className="text-muted-foreground">- 8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                  <div>
                    <p className="font-medium text-foreground">Modéré / Faible</p>
                    <p className="text-xs text-muted-foreground">Circuit normal</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-16 text-center" defaultValue="1" type="number" />
                    <span className="text-muted-foreground">- 6</span>
                  </div>
                </div>
                <Button className="w-full">Enregistrer les seuils</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
