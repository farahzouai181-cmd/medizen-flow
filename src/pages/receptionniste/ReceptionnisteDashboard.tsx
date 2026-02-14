import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPatients, statusLabels, urgencyLabels, type Patient, type UrgencyLevel, type PatientStatus } from '@/data/mockData';
import { Users, UserPlus, AlertTriangle, Clock } from 'lucide-react';

const urgencyBadgeClass: Record<UrgencyLevel, string> = {
  critical: 'urgency-critical',
  high: 'urgency-high',
  moderate: 'urgency-moderate',
  low: 'urgency-low',
};

const statusBadgeVariant: Record<PatientStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  en_attente: 'outline',
  en_consultation: 'default',
  sorti: 'secondary',
  transfere: 'destructive',
};

const ReceptionnisteDashboard = () => {
  const [patients] = useState<Patient[]>(mockPatients);
  const [newPatient, setNewPatient] = useState({ nom: '', prenom: '', age: '', motif: '', contact: '' });

  const enAttente = patients.filter(p => p.status === 'en_attente');
  const enConsultation = patients.filter(p => p.status === 'en_consultation');
  const urgentsTransferes = patients.filter(p => p.scoreUrgence >= 7 && p.status === 'en_attente');

  const stats = [
    { label: 'Total patients', value: patients.length, icon: <Users size={20} />, color: 'text-primary' },
    { label: 'En attente', value: enAttente.length, icon: <Clock size={20} />, color: 'text-warning' },
    { label: 'En consultation', value: enConsultation.length, icon: <UserPlus size={20} />, color: 'text-success' },
    { label: 'Urgences', value: urgentsTransferes.length, icon: <AlertTriangle size={20} />, color: 'text-destructive' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Tableau de bord — Réceptionniste</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={s.color}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Urgent notification */}
        {urgentsTransferes.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="text-destructive" size={24} />
              <div>
                <p className="font-semibold text-foreground">{urgentsTransferes.length} patient(s) urgent(s) en attente</p>
                <p className="text-sm text-muted-foreground">Fiches à créer en priorité</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="waiting">
          <TabsList>
            <TabsTrigger value="waiting">Salle d'attente</TabsTrigger>
            <TabsTrigger value="register">Enregistrement</TabsTrigger>
            <TabsTrigger value="all">Tous les patients</TabsTrigger>
          </TabsList>

          <TabsContent value="waiting" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Salle d'attente en temps réel</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patients.filter(p => p.status !== 'sorti').sort((a, b) => b.scoreUrgence - a.scoreUrgence).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-mono">{p.numeroPassage}</span>
                        <div>
                          <p className="font-medium text-foreground">{p.prenom} {p.nom}</p>
                          <p className="text-sm text-muted-foreground">{p.motif}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={urgencyBadgeClass[p.urgencyLevel]}>{urgencyLabels[p.urgencyLevel]}</Badge>
                        <Badge variant={statusBadgeVariant[p.status]}>{statusLabels[p.status]}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <Card className="max-w-lg">
              <CardHeader><CardTitle>Enregistrer un nouveau patient</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nom</Label><Input className="mt-1" value={newPatient.nom} onChange={e => setNewPatient({...newPatient, nom: e.target.value})} /></div>
                  <div><Label>Prénom</Label><Input className="mt-1" value={newPatient.prenom} onChange={e => setNewPatient({...newPatient, prenom: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Âge</Label><Input className="mt-1" type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} /></div>
                  <div><Label>Contact</Label><Input className="mt-1" value={newPatient.contact} onChange={e => setNewPatient({...newPatient, contact: e.target.value})} /></div>
                </div>
                <div><Label>Motif</Label><Input className="mt-1" value={newPatient.motif} onChange={e => setNewPatient({...newPatient, motif: e.target.value})} /></div>
                <Button className="w-full">Enregistrer le patient</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Liste complète des patients</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">N° Passage</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Patient</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Âge</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Motif</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Urgence</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map(p => (
                        <tr key={p.id} className="border-b border-border/50">
                          <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{p.numeroPassage}</td>
                          <td className="py-3 px-2 font-medium text-foreground">{p.prenom} {p.nom}</td>
                          <td className="py-3 px-2 text-muted-foreground">{p.age} ans</td>
                          <td className="py-3 px-2 text-muted-foreground">{p.motif}</td>
                          <td className="py-3 px-2"><Badge className={urgencyBadgeClass[p.urgencyLevel]}>{p.scoreUrgence}/10</Badge></td>
                          <td className="py-3 px-2"><Badge variant={statusBadgeVariant[p.status]}>{statusLabels[p.status]}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionnisteDashboard;
