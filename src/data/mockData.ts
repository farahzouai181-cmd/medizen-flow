export type UrgencyLevel = 'critical' | 'high' | 'moderate' | 'low';
export type PatientStatus = 'en_attente' | 'en_consultation' | 'sorti' | 'transfere';
export type UserRole = 'urgentiste' | 'medecin' | 'receptionniste' | 'admin';

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  motif: string;
  contact: string;
  scoreUrgence: number;
  urgencyLevel: UrgencyLevel;
  status: PatientStatus;
  numeroPassage: string;
  heureArrivee: string;
  notes: string[];
  diagnostic?: string;
  assignedTo?: string;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  actif: boolean;
}

export const getUrgencyLevel = (score: number): UrgencyLevel => {
  if (score >= 9) return 'critical';
  if (score >= 7) return 'high';
  if (score >= 4) return 'moderate';
  return 'low';
};

export const urgencyLabels: Record<UrgencyLevel, string> = {
  critical: 'Critique',
  high: 'Élevé',
  moderate: 'Modéré',
  low: 'Faible',
};

export const statusLabels: Record<PatientStatus, string> = {
  en_attente: 'En attente',
  en_consultation: 'En consultation',
  sorti: 'Sorti',
  transfere: 'Transféré',
};

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    nom: 'Khelifa',
    prenom: 'Molka',
    age: 34,
    motif: 'Douleur thoracique aiguë',
    contact: '+216 55 123 456',
    scoreUrgence: 9,
    urgencyLevel: 'critical',
    status: 'en_consultation',
    numeroPassage: 'URG-2026-001',
    heureArrivee: '08:15',
    notes: ['Douleur thoracique depuis 2h', 'Antécédents cardiaques familiaux'],
    assignedTo: 'Dr. Mansour',
  },
  {
    id: 'P002',
    nom: 'Fattalah',
    prenom: 'Ahmed',
    age: 45,
    motif: 'Fracture suspectée au bras droit',
    contact: '+216 98 765 432',
    scoreUrgence: 6,
    urgencyLevel: 'moderate',
    status: 'en_attente',
    numeroPassage: 'URG-2026-002',
    heureArrivee: '09:30',
    notes: ['Chute en escalier'],
  },
  {
    id: 'P003',
    nom: 'Ben Ali',
    prenom: 'Fatma',
    age: 28,
    motif: 'Fièvre élevée et maux de tête',
    contact: '+216 22 334 556',
    scoreUrgence: 5,
    urgencyLevel: 'moderate',
    status: 'en_attente',
    numeroPassage: 'URG-2026-003',
    heureArrivee: '10:00',
    notes: ['Fièvre 39.5°C depuis hier'],
  },
  {
    id: 'P004',
    nom: 'Trabelsi',
    prenom: 'Omar',
    age: 62,
    motif: 'Difficulté respiratoire sévère',
    contact: '+216 50 112 233',
    scoreUrgence: 10,
    urgencyLevel: 'critical',
    status: 'en_attente',
    numeroPassage: 'URG-2026-004',
    heureArrivee: '10:45',
    notes: ['BPCO connu', 'Saturation O2: 88%'],
    assignedTo: 'Dr. Bouazizi',
  },
  {
    id: 'P005',
    nom: 'Ben Youssef',
    prenom: 'Sana',
    age: 19,
    motif: 'Entorse de la cheville',
    contact: '+216 93 445 667',
    scoreUrgence: 3,
    urgencyLevel: 'low',
    status: 'en_attente',
    numeroPassage: 'URG-2026-005',
    heureArrivee: '11:20',
    notes: ['Accident sportif'],
  },
  {
    id: 'P006',
    nom: 'Hammami',
    prenom: 'Yassine',
    age: 50,
    motif: 'Douleur abdominale intense',
    contact: '+216 27 889 001',
    scoreUrgence: 7,
    urgencyLevel: 'high',
    status: 'en_consultation',
    numeroPassage: 'URG-2026-006',
    heureArrivee: '07:50',
    notes: ['Vomissements depuis ce matin', 'Suspicion appendicite'],
    diagnostic: 'Appendicite aiguë - Chirurgie programmée',
    assignedTo: 'Dr. Mansour',
  },
  {
    id: 'P007',
    nom: 'Saidi',
    prenom: 'Rim',
    age: 41,
    motif: 'Coupure profonde à la main',
    contact: '+216 54 667 889',
    scoreUrgence: 4,
    urgencyLevel: 'moderate',
    status: 'sorti',
    numeroPassage: 'URG-2026-007',
    heureArrivee: '06:30',
    notes: ['Accident domestique', 'Sutures effectuées'],
    diagnostic: 'Plaie suturée - Contrôle J+7',
  },
];

export const mockUsers: User[] = [
  { id: 'U001', nom: 'Mansour', prenom: 'Karim', email: 'k.mansour@hopital-teboulba.tn', role: 'medecin', actif: true },
  { id: 'U002', nom: 'Bouazizi', prenom: 'Leila', email: 'l.bouazizi@hopital-teboulba.tn', role: 'medecin', actif: true },
  { id: 'U003', nom: 'Chaabane', prenom: 'Nizar', email: 'n.chaabane@hopital-teboulba.tn', role: 'urgentiste', actif: true },
  { id: 'U004', nom: 'Gharbi', prenom: 'Amira', email: 'a.gharbi@hopital-teboulba.tn', role: 'receptionniste', actif: true },
  { id: 'U005', nom: 'Mejri', prenom: 'Sofiane', email: 's.mejri@hopital-teboulba.tn', role: 'admin', actif: true },
  { id: 'U006', nom: 'Nasri', prenom: 'Hana', email: 'h.nasri@hopital-teboulba.tn', role: 'medecin', actif: false },
];

export const triageQuestions = [
  { id: 'q1', question: 'Niveau de douleur (1-10)', type: 'number' as const, weight: 1 },
  { id: 'q2', question: 'Difficulté respiratoire', type: 'boolean' as const, weight: 2 },
  { id: 'q3', question: 'Saignement actif', type: 'boolean' as const, weight: 1.5 },
  { id: 'q4', question: 'Perte de conscience', type: 'boolean' as const, weight: 3 },
  { id: 'q5', question: 'Fièvre élevée (>39°C)', type: 'boolean' as const, weight: 1 },
  { id: 'q6', question: 'Traumatisme grave', type: 'boolean' as const, weight: 2 },
];
