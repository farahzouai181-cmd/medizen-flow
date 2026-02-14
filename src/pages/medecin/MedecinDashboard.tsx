import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { mockPatients, urgencyLabels, statusLabels, type Patient, type UrgencyLevel } from '@/data/mockData';
import { Stethoscope, AlertTriangle, FileText, Users } from 'lucide-react';

const urgencyBadgeClass: Record<UrgencyLevel, string> = {
  critical: 'urgency-critical',
  high: 'urgency-high',
  moderate: 'urgency-moderate',
  low: 'urgency-low',
};

const MedecinDashboard = () => {
  const [patients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [noteText, setNoteText] = useState('');

  const mesPatients = patients.filter(p => p.assignedTo === 'Dr. Mansour');
  const urgentsNonVus = patients.filter(p => p.scoreUrgence >= 7 && p.status === 'en_attente');

  const stats = [
    { label: 'Mes patients', value: mesPatients.length, icon: <Stethoscope size={20} />, color: 'text-primary' },
    { label: 'Alertes urgentes', value: urgentsNonVus.length, icon: <AlertTriangle size={20} />, color: 'text-destructive' },
    { label: 'En consultation', value: mesPatients.filter(p => p.status === 'en_consultation').length, icon: <Users size={20} />, color: 'text-success' },
    { label: 'Consultés', value: patients.filter(p => p.status === 'sorti').length, icon: <FileText size={20} />, color: 'text-muted-foreground' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Tableau de bord — Médecin</h2>

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

        {urgentsNonVus.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="text-destructive" size={24} />
              <div>
                <p className="font-semibold text-foreground">{urgentsNonVus.length} patient(s) urgent(s) en attente de consultation</p>
                <p className="text-sm text-muted-foreground">Priorité immédiate requise</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient list */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader><CardTitle>File d'attente</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {patients.filter(p => p.status !== 'sorti').sort((a, b) => b.scoreUrgence - a.scoreUrgence).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPatient?.id === p.id ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30 hover:bg-secondary/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground text-sm">{p.prenom} {p.nom}</p>
                      <Badge className={`${urgencyBadgeClass[p.urgencyLevel]} text-xs`}>{p.scoreUrgence}/10</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.motif}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Patient details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedPatient.prenom} {selectedPatient.nom}</CardTitle>
                    <Badge className={urgencyBadgeClass[selectedPatient.urgencyLevel]}>
                      {urgencyLabels[selectedPatient.urgencyLevel]} — {selectedPatient.scoreUrgence}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="text-xs text-muted-foreground">Âge</p><p className="font-medium text-foreground">{selectedPatient.age} ans</p></div>
                    <div><p className="text-xs text-muted-foreground">N° Passage</p><p className="font-medium text-foreground font-mono">{selectedPatient.numeroPassage}</p></div>
                    <div><p className="text-xs text-muted-foreground">Arrivée</p><p className="font-medium text-foreground">{selectedPatient.heureArrivee}</p></div>
                    <div><p className="text-xs text-muted-foreground">Statut</p><p className="font-medium text-foreground">{statusLabels[selectedPatient.status]}</p></div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Motif de consultation</p>
                    <p className="text-foreground">{selectedPatient.motif}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Historique / Notes</p>
                    <div className="space-y-2">
                      {selectedPatient.notes.map((note, i) => (
                        <div key={i} className="p-2 rounded bg-secondary/50 text-sm text-foreground">{note}</div>
                      ))}
                    </div>
                  </div>

                  {selectedPatient.diagnostic && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Diagnostic</p>
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-sm text-foreground">
                        {selectedPatient.diagnostic}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Ajouter une note médicale</p>
                    <Textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="Observations, diagnostic, prescription..."
                      rows={3}
                    />
                    <Button className="mt-2" onClick={() => setNoteText('')}>Enregistrer la note</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Stethoscope className="mx-auto text-muted-foreground mb-3" size={40} />
                  <p className="text-muted-foreground">Sélectionnez un patient pour voir sa fiche</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedecinDashboard;
