import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { mockPatients, triageQuestions, getUrgencyLevel, urgencyLabels, type Patient, type UrgencyLevel } from '@/data/mockData';
import { Users, AlertTriangle, Clock, Activity } from 'lucide-react';

const urgencyBadgeClass: Record<UrgencyLevel, string> = {
  critical: 'urgency-critical',
  high: 'urgency-high',
  moderate: 'urgency-moderate',
  low: 'urgency-low',
};

const UrgentisteDashboard = () => {
  const [patients] = useState<Patient[]>(mockPatients);
  const [triageAnswers, setTriageAnswers] = useState<Record<string, number | boolean>>({});
  const [patientInfo, setPatientInfo] = useState({ nom: '', prenom: '', age: '', motif: '', contact: '' });
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  const enAttente = patients.filter(p => p.status === 'en_attente');
  const urgents = enAttente.filter(p => p.scoreUrgence >= 7);
  const normaux = enAttente.filter(p => p.scoreUrgence < 7);

  const calculateScore = () => {
    let score = 0;
    triageQuestions.forEach(q => {
      const answer = triageAnswers[q.id];
      if (q.type === 'number' && typeof answer === 'number') {
        score += Math.min(answer, 10) * q.weight * 0.3;
      } else if (q.type === 'boolean' && answer === true) {
        score += q.weight;
      }
    });
    setCalculatedScore(Math.min(Math.round(Math.max(score, 1)), 10));
  };

  const stats = [
    { label: 'Patients en attente', value: enAttente.length, icon: <Users size={20} />, color: 'text-primary' },
    { label: 'Urgences', value: urgents.length, icon: <AlertTriangle size={20} />, color: 'text-destructive' },
    { label: 'Circuit normal', value: normaux.length, icon: <Clock size={20} />, color: 'text-success' },
    { label: 'Triés aujourd\'hui', value: patients.length, icon: <Activity size={20} />, color: 'text-warning' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Tableau de bord — Urgentiste</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="triage">
          <TabsList>
            <TabsTrigger value="triage">Pré-triage</TabsTrigger>
            <TabsTrigger value="urgents">Urgences ({urgents.length})</TabsTrigger>
            <TabsTrigger value="normaux">Circuit normal ({normaux.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="triage" className="mt-4">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Patient info */}
              <Card>
                <CardHeader><CardTitle>Informations du patient</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nom</Label>
                      <Input className="mt-1" value={patientInfo.nom} onChange={e => setPatientInfo({...patientInfo, nom: e.target.value})} placeholder="Nom" />
                    </div>
                    <div>
                      <Label>Prénom</Label>
                      <Input className="mt-1" value={patientInfo.prenom} onChange={e => setPatientInfo({...patientInfo, prenom: e.target.value})} placeholder="Prénom" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Âge</Label>
                      <Input className="mt-1" type="number" value={patientInfo.age} onChange={e => setPatientInfo({...patientInfo, age: e.target.value})} placeholder="Âge" />
                    </div>
                    <div>
                      <Label>Contact</Label>
                      <Input className="mt-1" value={patientInfo.contact} onChange={e => setPatientInfo({...patientInfo, contact: e.target.value})} placeholder="+216..." />
                    </div>
                  </div>
                  <div>
                    <Label>Motif de consultation</Label>
                    <Input className="mt-1" value={patientInfo.motif} onChange={e => setPatientInfo({...patientInfo, motif: e.target.value})} placeholder="Décrivez le motif" />
                  </div>
                </CardContent>
              </Card>

              {/* Triage questions */}
              <Card>
                <CardHeader><CardTitle>Questionnaire de pré-triage</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {triageQuestions.map(q => (
                    <div key={q.id} className="flex items-center justify-between">
                      <Label className="flex-1">{q.question}</Label>
                      {q.type === 'number' ? (
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          className="w-20"
                          value={(triageAnswers[q.id] as number) || ''}
                          onChange={e => setTriageAnswers({...triageAnswers, [q.id]: parseInt(e.target.value) || 0})}
                        />
                      ) : (
                        <Switch
                          checked={!!triageAnswers[q.id]}
                          onCheckedChange={v => setTriageAnswers({...triageAnswers, [q.id]: v})}
                        />
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t border-border">
                    <Button onClick={calculateScore} className="w-full">Calculer le score d'urgence</Button>
                  </div>

                  {calculatedScore !== null && (
                    <div className="text-center p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground mb-1">Score d'urgence calculé</p>
                      <span className="text-4xl font-bold text-foreground">{calculatedScore}</span>
                      <span className="text-lg text-muted-foreground">/10</span>
                      <div className="mt-2">
                        <Badge className={urgencyBadgeClass[getUrgencyLevel(calculatedScore)]}>
                          {urgencyLabels[getUrgencyLevel(calculatedScore)]}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {calculatedScore >= 7 ? '→ Transfert direct à la réceptionniste' : '→ Circuit normal'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="urgents" className="mt-4">
            <PatientList patients={urgents} title="Patients urgents" />
          </TabsContent>

          <TabsContent value="normaux" className="mt-4">
            <PatientList patients={normaux} title="Patients en circuit normal" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const PatientList = ({ patients, title }: { patients: Patient[]; title: string }) => (
  <Card>
    <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
    <CardContent>
      {patients.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center">Aucun patient dans cette catégorie</p>
      ) : (
        <div className="space-y-3">
          {patients.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="font-medium text-foreground">{p.prenom} {p.nom}</p>
                <p className="text-sm text-muted-foreground">{p.motif}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{p.heureArrivee}</span>
                <Badge className={urgencyBadgeClass[p.urgencyLevel]}>
                  {p.scoreUrgence}/10
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default UrgentisteDashboard;
