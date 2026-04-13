import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, handleFirestoreError, OperationType, auth, getDoc, setDoc } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Types
export type Announcement = { id: string; title: string; date: string; category: string; content: string; author: string; isUrgent?: boolean };
export type Prayer = { id: string; author: string; date: string; content: string; category: string; likes: number; isUrgent?: boolean; status: 'pending' | 'approved'; isAnonymous: boolean };
export type Activity = { id: string; day: string; date: string; fullDate: string; title: string; time: string; location: string; type: string };
export type Testimony = { 
  id: string; 
  author: string; 
  date: string; 
  title: string;
  category: string;
  content: string; 
  imageUrl?: string;
  likes: number;
  isAnonymous: boolean;
  status: 'pending' | 'approved' 
};
export type GalleryMedia = { id: string; type: 'photo' | 'video'; url: string; likes: number };
export type GalleryEvent = { id: string; title: string; date: string; location: string; media: GalleryMedia[] };
export type ContributionCategory = { id: string; name: string; description: string; targetAmount?: number };
export type ContributionRecord = { id: string; categoryId: string; memberName: string; amount: number; date: string };
export type ArchiveArticle = { id: string; title: string; date: string; content: string; summary: string; imageUrl?: string; category: string };
export type DailyMeditation = { id: string; reference: string; text: string; exhortation: string; date: string };
export type DailyVerse = { id: string; date: string; reference: string; text: string; exhortation?: string; themeId?: string };
export type WeeklyTheme = { id: string; title: string; reference: string; text: string; description: string; startDate: string; endDate: string };
export type Member = { id: string; firstName: string; lastName: string; email: string; phone: string; status: 'pending' | 'active' | 'blocked'; role: 'user' | 'admin'; joinDate: string; birthDate?: string };
export type AudioMessage = { id: string; title: string; description: string; url: string; date: string };
export type BureauMember = { id: string; role: string; name: string; phone: string; email?: string; whatsapp?: string; imageUrl?: string; department?: string };
export type SocialLink = { id: string; platform: 'facebook' | 'youtube' | 'whatsapp' | 'instagram' | 'website'; url: string; label: string };
export type LeaderMessage = { title: string; content: string; author: string; date: string };
export type Cantique = { id: string; title: string; number: string; category: string; lyrics: string };
export type ContactMessage = { id: string; name: string; subject: string; message: string; date: string; userId?: string };

// New Archive Types
export type HistoryEntry = { id: string; content: string; foundationDate: string; spiritualGoals: string; milestones: string };
export type Bureau = { id: string; yearRange: string; leader: string; viceLeader: string; secretary: string; deputySecretary: string; treasurer: string; deputyTreasurer: string; imageUrl?: string; description: string };
export type ArchiveReport = { id: string; title: string; year: string; fileUrl: string };
export type HistoricalPhoto = { id: string; title: string; description: string; year: string; imageUrl: string };
export type TimelineEvent = { id: string; year: string; title: string; description: string };
export type ArchiveAudio = { id: string; title: string; description: string; audioUrl: string; date: string; category: string };
export type ArchiveContribution = { id: string; author: string; type: 'photo' | 'testimony' | 'document'; content: string; fileUrl?: string; date: string; status: 'pending' | 'approved' };

export type AboutValue = { icon: string; title: string; desc: string };
export type AboutTimelineEvent = { id: string; year: string; description: string; color: string };
export type AboutInfo = {
  vision: string;
  mission: string;
  values: AboutValue[];
  historyTimeline: AboutTimelineEvent[];
};

export type ContactInfo = {
  phone: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
};

export type SystemLog = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

interface AppDataContextType {
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, 'id'>) => Promise<string | null>;
  updateAnnouncement: (id: string, a: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  prayers: Prayer[];
  addPrayer: (p: Omit<Prayer, 'id' | 'likes' | 'status'>) => Promise<string | null>;
  updatePrayer: (id: string, p: Partial<Prayer>) => void;
  deletePrayer: (id: string) => void;
  likePrayer: (id: string) => void;

  activities: Activity[];
  addActivity: (a: Omit<Activity, 'id'>) => Promise<string | null>;
  updateActivity: (id: string, a: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;

  testimonies: Testimony[];
  addTestimony: (t: Omit<Testimony, 'id' | 'status' | 'likes'>) => Promise<string | null>;
  approveTestimony: (id: string) => void;
  deleteTestimony: (id: string) => void;
  likeTestimony: (id: string) => void;

  galleryEvents: GalleryEvent[];
  addGalleryEvent: (e: Omit<GalleryEvent, 'id' | 'media'>) => void;
  updateGalleryEvent: (id: string, e: Partial<GalleryEvent>) => void;
  addMediaToEvent: (eventId: string, media: Omit<GalleryMedia, 'id' | 'likes'>) => void;
  likeMedia: (eventId: string, mediaId: string) => void;
  deleteGalleryEvent: (eventId: string) => void;
  deleteMediaFromEvent: (eventId: string, mediaId: string) => void;

  contributionCategories: ContributionCategory[];
  addContributionCategory: (c: Omit<ContributionCategory, 'id'>) => Promise<string | null>;
  updateContributionCategory: (id: string, c: Partial<ContributionCategory>) => void;
  deleteContributionCategory: (id: string) => void;

  contributionRecords: ContributionRecord[];
  addContributionRecord: (r: Omit<ContributionRecord, 'id'>) => Promise<string | null>;
  updateContributionRecord: (id: string, r: Partial<ContributionRecord>) => void;
  deleteContributionRecord: (id: string) => void;

  archiveArticles: ArchiveArticle[];
  addArchiveArticle: (a: Omit<ArchiveArticle, 'id'>) => void;
  updateArchiveArticle: (id: string, a: Partial<ArchiveArticle>) => void;
  deleteArchiveArticle: (id: string) => void;

  meditations: DailyMeditation[];
  addMeditation: (m: Omit<DailyMeditation, 'id'>) => Promise<string | null>;
  updateMeditation: (id: string, m: Partial<DailyMeditation>) => void;
  deleteMeditation: (id: string) => void;
  dailyMeditation: DailyMeditation;
  
  dailyVerses: DailyVerse[];
  addDailyVerse: (v: Omit<DailyVerse, 'id'>) => Promise<string | null>;
  updateDailyVerse: (id: string, v: Partial<DailyVerse>) => void;
  deleteDailyVerse: (id: string) => void;
  currentDailyVerse: DailyVerse | null;
  
  weeklyThemes: WeeklyTheme[];
  addWeeklyTheme: (t: Omit<WeeklyTheme, 'id'>) => Promise<string | null>;
  updateWeeklyThemeById: (id: string, t: Partial<WeeklyTheme>) => void;
  deleteWeeklyTheme: (id: string) => void;
  weeklyTheme: WeeklyTheme;
  updateWeeklyTheme: (t: WeeklyTheme) => void; // Deprecated

  members: Member[];
  addMember: (m: Omit<Member, 'id'>) => Promise<string | null>;
  updateMember: (id: string, m: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  audios: AudioMessage[];
  addAudio: (a: Omit<AudioMessage, 'id'>) => void;
  updateAudio: (id: string, a: Partial<AudioMessage>) => void;
  deleteAudio: (id: string) => void;

  bureauMembers: BureauMember[];
  addBureauMember: (b: Omit<BureauMember, 'id'>) => void;
  updateBureauMember: (id: string, b: Partial<BureauMember>) => void;
  deleteBureauMember: (id: string) => void;

  socialLinks: SocialLink[];
  addSocialLink: (s: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (id: string, url: string) => void;
  deleteSocialLink: (id: string) => void;

  leaderMessage: LeaderMessage;
  updateLeaderMessage: (m: LeaderMessage) => void;

  cantiques: Cantique[];
  addCantique: (c: Omit<Cantique, 'id'>) => void;
  updateCantique: (id: string, c: Partial<Cantique>) => void;
  deleteCantique: (id: string) => void;

  contactMessages: ContactMessage[];
  deleteContactMessage: (id: string) => void;

  // New Archive State
  history: HistoryEntry | null;
  updateHistory: (h: HistoryEntry) => void;

  bureaus: Bureau[];
  addBureau: (b: Omit<Bureau, 'id'>) => void;
  updateBureau: (id: string, b: Partial<Bureau>) => void;
  deleteBureau: (id: string) => void;

  reports: ArchiveReport[];
  addReport: (r: Omit<ArchiveReport, 'id'>) => void;
  deleteReport: (id: string) => void;

  historicalPhotos: HistoricalPhoto[];
  addHistoricalPhoto: (p: Omit<HistoricalPhoto, 'id'>) => void;
  deleteHistoricalPhoto: (id: string) => void;

  timelineEvents: TimelineEvent[];
  addTimelineEvent: (e: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (id: string, e: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;

  archiveAudios: ArchiveAudio[];
  addArchiveAudio: (a: Omit<ArchiveAudio, 'id'>) => void;
  updateArchiveAudio: (id: string, a: Partial<ArchiveAudio>) => void;
  deleteArchiveAudio: (id: string) => void;

  archiveContributions: ArchiveContribution[];
  addArchiveContribution: (c: Omit<ArchiveContribution, 'id' | 'status'>) => void;
  approveArchiveContribution: (id: string) => void;
  deleteArchiveContribution: (id: string) => void;

  aboutInfo: AboutInfo;
  updateAboutInfo: (info: Partial<AboutInfo>) => void;

  contactInfo: ContactInfo;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  isOnline: boolean;
  systemLogs: SystemLog[];
  addLog: (action: string, details: string, type?: SystemLog['type']) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const initialAnnouncements: Announcement[] = [
  { id: '1', title: 'Réunion du Bureau', date: 'Aujourd\'hui', category: 'Organisation', content: 'Réunion extraordinaire de tous les membres du bureau local à 16h00.', author: 'Secrétariat', isUrgent: true },
  { id: '2', title: 'Jeûne et Prière', date: 'Demain', category: 'Spirituel', content: 'Programme spécial de jeûne et prière pour la jeunesse de 09h à 12h.', author: 'Département Jeunesse' },
  { id: '3', title: 'Visite aux malades', date: 'Samedi', category: 'Social', content: 'L\'équipe sociale organise une descente à l\'hôpital de base. Départ à 14h00.', author: 'Département Social' },
];

const initialPrayers: Prayer[] = [
  { id: '1', author: 'Frère Marc', date: 'Il y a 2h', content: 'Priez pour ma mère qui doit subir une opération chirurgicale demain matin.', category: 'Santé', likes: 12, isUrgent: true, status: 'approved', isAnonymous: false },
  { id: '2', author: 'Sœur Sarah', date: 'Il y a 5h', content: 'Je rends grâce à Dieu pour la réussite de mes examens d\'État !', category: 'Action de grâce', likes: 45, status: 'approved', isAnonymous: false },
  { id: '3', author: 'Anonyme', date: 'Hier', content: 'Que le Seigneur m\'aide à trouver un emploi stable pour soutenir ma famille.', category: 'Travail', likes: 28, status: 'approved', isAnonymous: true },
];

const initialActivities: Activity[] = [
  { id: '1', day: 'Mardi', date: '26 Fév', fullDate: '2026-02-26', title: 'Culte d\'Enseignement', time: '17:00 - 19:00', location: 'Temple CBE Mpaka', type: 'Culte' },
  { id: '2', day: 'Jeudi', date: '28 Fév', fullDate: '2026-02-28', title: 'Réunion de la Chorale', time: '16:30 - 18:30', location: 'Salle Annexe', type: 'Répétition' },
  { id: '3', day: 'Vendredi', date: '01 Mar', fullDate: '2026-03-01', title: 'Prière d\'Intercession', time: '15:00 - 17:00', location: 'Temple CBE Mpaka', type: 'Prière' },
  { id: '4', day: 'Dimanche', date: '03 Mar', fullDate: '2026-03-03', title: 'Culte d\'Adoration', time: '09:00 - 12:30', location: 'Temple CBE Mpaka', type: 'Culte' }
];

const initialTestimonies: Testimony[] = [
  { 
    id: '1', 
    author: 'Frère Jean', 
    date: '15/03/2026', 
    title: 'Guérison Miraculeuse',
    category: 'Guérison',
    content: 'Je rends grâce à Dieu pour m\'avoir guéri d\'une maladie chronique qui me fatiguait depuis des années. Après la prière de dimanche dernier, je me sens totalement restauré.',
    likes: 12,
    isAnonymous: false,
    status: 'approved' 
  },
  { 
    id: '2', 
    author: 'Sœur Marie', 
    date: '10/03/2026', 
    title: 'Provision Divine',
    category: 'Provision',
    content: 'Dieu a pourvu à mes besoins financiers au moment où je m\'y attendais le moins. Gloire à Son Nom !',
    likes: 8,
    isAnonymous: false,
    status: 'approved' 
  }
];

const initialGalleryEvents: GalleryEvent[] = [
  {
    id: '1',
    title: 'Culte spécial de Louange',
    date: 'Janvier 2026',
    location: 'Temple CBE Mpaka',
    media: [
      { id: 'm1', type: 'photo', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80', likes: 12 },
      { id: 'm2', type: 'photo', url: 'https://images.unsplash.com/photo-1519682683838-895ed114170a?w=800&q=80', likes: 8 },
      { id: 'm3', type: 'photo', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', likes: 25 },
    ]
  },
  {
    id: '2',
    title: 'Campagne d\'Évangélisation',
    date: 'Décembre 2025',
    location: 'Quartier Mpaka',
    media: [
      { id: 'm4', type: 'photo', url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80', likes: 34 },
      { id: 'm5', type: 'photo', url: 'https://images.unsplash.com/photo-1544427920-c49ccfaf8c56?w=800&q=80', likes: 19 },
    ]
  }
];

const initialContributionCategories: ContributionCategory[] = [
  { id: '1', name: 'Construction du Temple', description: 'Fonds pour l\'agrandissement du temple principal.', targetAmount: 5000000 },
  { id: '2', name: 'Fête de la Jeunesse', description: 'Contributions pour l\'organisation de la fête annuelle.', targetAmount: 500000 },
  { id: '3', name: 'Caisse Sociale', description: 'Soutien aux membres en difficulté.' },
];

const initialContributionRecords: ContributionRecord[] = [
  { id: '1', categoryId: '1', memberName: 'Josué Manuel', amount: 50000, date: '2026-03-15' },
  { id: '2', categoryId: '2', memberName: 'Josué Manuel', amount: 10000, date: '2026-03-20' },
  { id: '3', categoryId: '1', memberName: 'Sœur Marie', amount: 25000, date: '2026-03-10' },
];

const initialArchiveArticles: ArchiveArticle[] = [
  { 
    id: '1', 
    title: 'La Fondation de la Sous-section', 
    date: '12 Mars 2010', 
    summary: 'Les débuts de notre communauté à Mpaka.',
    category: 'Histoire',
    content: 'La sous-section CBE Mpaka a été fondée avec une vision claire : évangéliser le quartier et encadrer la jeunesse. Les premiers cultes se tenaient sous une tonnelle...',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
  },
  { 
    id: '2', 
    title: 'Inauguration du Premier Temple', 
    date: '20 Juin 2015', 
    summary: 'Un jalon important dans notre croissance physique.',
    category: 'Événement',
    content: 'Après des années de prière et de contributions, nous avons inauguré notre premier bâtiment en dur. Ce fut un moment de joie immense pour toute la communauté.',
    imageUrl: 'https://images.unsplash.com/photo-1548625361-195feee10f8c?w=800&q=80'
  },
  { 
    id: '3', 
    title: 'Première Campagne d\'Évangélisation', 
    date: '05 Août 2012', 
    summary: 'Le réveil spirituel de notre quartier.',
    category: 'Événement',
    content: 'Une semaine mémorable où plus de 100 âmes ont accepté le Seigneur. Les membres étaient mobilisés jour et nuit pour la réussite de cet événement.',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80'
  }
];

const defaultMeditation: DailyMeditation = {
  id: '1',
  reference: 'Ésaïe 41:10',
  text: 'Ne crains rien, car je suis avec toi ; ne promène pas des regards inquiets, car je suis ton Dieu ; je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante.',
  exhortation: 'Bien-aimé(e), face aux défis de la vie, il est facile de céder à la peur et à l\'inquiétude. Mais Dieu nous rappelle aujourd\'hui qu\'Il est notre force. Sa présence est la garantie de notre victoire. Ne regarde pas à la grandeur de ton problème, mais à la grandeur de ton Dieu. Il te soutient de sa droite triomphante.',
  date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
};

const defaultWeeklyTheme: WeeklyTheme = {
  id: '1',
  title: 'La persévérance dans la foi',
  reference: 'Hébreux 12:1-2',
  text: 'Nous donc aussi, puisque nous sommes environnés d\'une si grande nuée de témoins, rejetons tout fardeau, et le péché qui nous enveloppe si facilement, et courons avec persévérance dans la carrière qui nous est ouverte...',
  description: 'Cette semaine, méditons sur l\'importance de la persévérance dans notre marche chrétienne. Comme des athlètes spirituels, nous sommes appelés à courir avec détermination, les yeux fixés sur Jésus.',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
};

const initialMeditations: DailyMeditation[] = [defaultMeditation];
const initialWeeklyThemes: WeeklyTheme[] = [defaultWeeklyTheme];

const initialMembers: Member[] = [
  { id: '1', firstName: 'Josué', lastName: 'Manuel', email: 'josue@example.com', phone: '+242 06 000 0000', status: 'active', role: 'admin', joinDate: '2023-01-15', birthDate: '1990-01-01' },
  { id: '2', firstName: 'Sœur', lastName: 'Marie', email: 'marie@example.com', phone: '+242 05 000 0000', status: 'active', role: 'user', joinDate: '2023-05-20', birthDate: '1995-04-09' },
  { id: '3', firstName: 'Frère', lastName: 'Jean', email: 'jean@example.com', phone: '+242 04 000 0000', status: 'pending', role: 'user', joinDate: '2026-04-01', birthDate: '1988-04-09' },
];

const initialAudios: AudioMessage[] = [
  { id: '1', title: 'La foi qui déplace les montagnes', description: 'Prédication du culte de dimanche dernier.', url: '#', date: '2026-04-05' }
];

const initialBureau: BureauMember[] = [
  { id: '1', role: 'Leader', name: 'Frère Josué', phone: '+242 06 123 4567', email: 'josue@cbempaka.org', whatsapp: '+242061234567', department: 'Direction' },
  { id: '2', role: 'Vice Leader', name: 'Sœur Marie', phone: '+242 05 987 6543', email: 'marie@cbempaka.org', department: 'Direction' },
  { id: '3', role: 'Secrétariat Général', name: 'Frère Paul', phone: '+242 04 111 2233', department: 'Administration' },
  { id: '4', role: 'Secrétariat Général Adjoint', name: 'Sœur Anne', phone: '+242 06 444 5566', department: 'Administration' },
  { id: '5', role: 'Trésorier Général', name: 'Frère Marc', phone: '+242 05 777 8899', department: 'Finances' },
  { id: '6', role: 'Trésorier Général Adjoint', name: 'Sœur Sarah', phone: '+242 04 000 1122', department: 'Finances' },
];

const initialSocialLinks: SocialLink[] = [
  { id: 'fb', platform: 'facebook', url: 'https://facebook.com/cbempaka', label: 'Facebook' },
  { id: 'yt', platform: 'youtube', url: 'https://youtube.com/cbempaka', label: 'YouTube' },
  { id: 'wa', platform: 'whatsapp', url: 'https://wa.me/242060000000', label: 'WhatsApp' },
];

const initialLeaderMessage: LeaderMessage = {
  title: "Mot du Responsable",
  content: "Bien-aimés dans le Seigneur, je vous salue dans le précieux nom de notre Seigneur Jésus-Christ. Que la grâce et la paix vous soient multipliées. En cette nouvelle semaine, je nous exhorte à demeurer fermes dans la prière et la méditation de la Parole.",
  author: "Frère Josué Manuel",
  date: "09 Avril 2026"
};

const initialCantiques: Cantique[] = [
  { id: '1', title: 'À toi la gloire', number: '1', category: 'Louange', lyrics: "[Couplet 1]\nÀ toi la gloire, Ô Ressuscité !\nÀ toi la victoire pour l'éternité !\nBrillant de lumière, l'ange est descendu,\nIl roule la pierre du tombeau vaincu.\n\n[Refrain]\nÀ toi la gloire, Ô Ressuscité !\nÀ toi la victoire pour l'éternité !\n\n[Couplet 2]\nVoir le Prince de la vie,\nSur le bois maudit,\nPour nous il s'humilie,\nPour nous il a souffert." }
];

const initialAboutInfo: AboutInfo = {
  vision: "Devenir un phare spirituel dans le quartier Mpaka, où chaque âme trouve refuge, enseignement et croissance en Christ. Nous aspirons à bâtir une communauté transformée par la puissance de la Parole.",
  mission: "La Sous-section CBE Mpaka a pour mission d'accompagner spirituellement ses membres, de renforcer la vie communautaire et de propager l'évangile de Jésus-Christ. Nous formons une famille unie par la foi et l'amour fraternel.",
  values: [
    { icon: "Heart", title: "Amour", desc: "Aimer son prochain comme soi-même." },
    { icon: "Shield", title: "Intégrité", desc: "Vivre selon les principes bibliques." },
    { icon: "Users", title: "Unité", desc: "Un seul corps, un seul esprit." },
  ],
  historyTimeline: [
    { id: '1', year: "2010", description: "Fondation de la cellule de prière à Mpaka avec 12 membres dévoués.", color: "emerald" },
    { id: '2', year: "2015", description: "Inauguration du Temple actuel et structuration de la sous-section.", color: "blue" },
    { id: '3', year: "Aujourd'hui", description: "Une communauté vibrante de plus de 500 membres actifs.", color: "orange" },
  ]
};

const initialContactInfo: ContactInfo = {
  phone: "+242 06 000 00 00",
  email: "contact@cbempaka.org",
  address: "Quartier Mpaka, Avenue de la Paix, Temple CBE",
  googleMapsUrl: "https://maps.google.com"
};

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('cbe_announcements');
    return saved ? JSON.parse(saved) : [];
  });
  const [prayers, setPrayers] = useState<Prayer[]>(() => {
    const saved = localStorage.getItem('cbe_prayers');
    return saved ? JSON.parse(saved) : [];
  });
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('cbe_activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [testimonies, setTestimonies] = useState<Testimony[]>(() => {
    const saved = localStorage.getItem('cbe_testimonies');
    return saved ? JSON.parse(saved) : [];
  });
  const [contributionCategories, setContributionCategories] = useState<ContributionCategory[]>(() => {
    const saved = localStorage.getItem('cbe_contribution_categories');
    return saved ? JSON.parse(saved) : [];
  });
  const [contributionRecords, setContributionRecords] = useState<ContributionRecord[]>(() => {
    const saved = localStorage.getItem('cbe_contribution_records');
    return saved ? JSON.parse(saved) : [];
  });
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('cbe_members');
    return saved ? JSON.parse(saved) : [];
  });
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>(() => {
    const saved = localStorage.getItem('cbe_gallery');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [archiveArticles, setArchiveArticles] = useState<ArchiveArticle[]>(() => {
    const saved = localStorage.getItem('cbe_archives');
    return saved ? JSON.parse(saved) : initialArchiveArticles;
  });

  const [meditations, setMeditations] = useState<DailyMeditation[]>(() => {
    const saved = localStorage.getItem('cbe_meditations_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [dailyVerses, setDailyVerses] = useState<DailyVerse[]>(() => {
    const saved = localStorage.getItem('cbe_daily_verses');
    return saved ? JSON.parse(saved) : [];
  });
  const [weeklyThemes, setWeeklyThemes] = useState<WeeklyTheme[]>(() => {
    const saved = localStorage.getItem('cbe_weekly_themes_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [audios, setAudios] = useState<AudioMessage[]>(() => {
    const saved = localStorage.getItem('cbe_audios');
    return saved ? JSON.parse(saved) : initialAudios;
  });

  const [bureauMembers, setBureauMembers] = useState<BureauMember[]>(() => {
    const saved = localStorage.getItem('cbe_bureau_members');
    return saved ? JSON.parse(saved) : [];
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    const saved = localStorage.getItem('cbe_social_links');
    return saved ? JSON.parse(saved) : [];
  });
  const [leaderMessage, setLeaderMessage] = useState<LeaderMessage>(() => {
    const saved = localStorage.getItem('cbe_leader_message');
    return saved ? JSON.parse(saved) : initialLeaderMessage;
  });

  const [history, setHistory] = useState<HistoryEntry | null>(() => {
    const saved = localStorage.getItem('cbe_history');
    return saved ? JSON.parse(saved) : null;
  });

  const [bureaus, setBureaus] = useState<Bureau[]>(() => {
    const saved = localStorage.getItem('cbe_bureaus');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<ArchiveReport[]>(() => {
    const saved = localStorage.getItem('cbe_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [historicalPhotos, setHistoricalPhotos] = useState<HistoricalPhoto[]>(() => {
    const saved = localStorage.getItem('cbe_historical_photos');
    return saved ? JSON.parse(saved) : [];
  });

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem('cbe_timeline_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [archiveAudios, setArchiveAudios] = useState<ArchiveAudio[]>(() => {
    const saved = localStorage.getItem('cbe_archive_audios');
    return saved ? JSON.parse(saved) : [];
  });

  const [archiveContributions, setArchiveContributions] = useState<ArchiveContribution[]>(() => {
    const saved = localStorage.getItem('cbe_archive_contributions');
    return saved ? JSON.parse(saved) : [];
  });

  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(() => {
    const saved = localStorage.getItem('cbe_about_info');
    return saved ? JSON.parse(saved) : initialAboutInfo;
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('cbe_contact_info');
    return saved ? JSON.parse(saved) : initialContactInfo;
  });

  const [cantiques, setCantiques] = useState<Cantique[]>(() => {
    const saved = localStorage.getItem('cbe_cantiques');
    return saved ? JSON.parse(saved) : [];
  });
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('cbe_system_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const dailyMeditation = useMemo(() => {
    const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    return meditations.find(m => m.date === today) || meditations[0] || defaultMeditation;
  }, [meditations]);

  const currentDailyVerse = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return dailyVerses.find(v => v.date === today) || null;
  }, [dailyVerses]);

  const weeklyTheme = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return weeklyThemes.find(t => today >= t.startDate && today <= t.endDate) || weeklyThemes[0] || defaultWeeklyTheme;
  }, [weeklyThemes]);

  const addLog = (action: string, details: string, type: SystemLog['type'] = 'info') => {
    const newLog: SystemLog = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString(),
      type
    };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time Firestore Listeners
  useEffect(() => {
    const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'announcements'));

    const unsubPrayers = onSnapshot(collection(db, 'prayers'), (snapshot) => {
      setPrayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prayer)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'prayers'));

    const unsubActivities = onSnapshot(collection(db, 'activities'), (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'activities'));

    const unsubTestimonies = onSnapshot(collection(db, 'testimonies'), (snapshot) => {
      setTestimonies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimony)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'testimonies'));

    const unsubMeditations = onSnapshot(collection(db, 'meditations'), (snapshot) => {
      setMeditations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyMeditation)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'meditations'));

    const unsubDailyVerses = onSnapshot(collection(db, 'dailyVerses'), (snapshot) => {
      setDailyVerses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyVerse)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'dailyVerses'));

    const unsubWeeklyThemes = onSnapshot(collection(db, 'weeklyThemes'), (snapshot) => {
      setWeeklyThemes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WeeklyTheme)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'weeklyThemes'));

    const unsubSocialLinks = onSnapshot(collection(db, 'socialLinks'), (snapshot) => {
      setSocialLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialLink)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'socialLinks'));

    const unsubGalleryEvents = onSnapshot(collection(db, 'galleryEvents'), (snapshot) => {
      setGalleryEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryEvent)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'galleryEvents'));

    const unsubBureauMembers = onSnapshot(collection(db, 'bureauMembers'), (snapshot) => {
      setBureauMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BureauMember)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'bureauMembers'));

    const unsubCantiques = onSnapshot(collection(db, 'cantiques'), (snapshot) => {
      setCantiques(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cantique)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'cantiques'));

    const unsubContactMessages = onSnapshot(collection(db, 'contactMessages'), (snapshot) => {
      setContactMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'contactMessages'));

    const unsubLeaderMessage = onSnapshot(doc(db, 'leaderMessage', 'current'), (docSnap) => {
      if (docSnap.exists()) {
        setLeaderMessage(docSnap.data() as LeaderMessage);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'leaderMessage'));

    const unsubAboutInfo = onSnapshot(doc(db, 'aboutInfo', 'current'), (docSnap) => {
      if (docSnap.exists()) {
        setAboutInfo(docSnap.data() as AboutInfo);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'aboutInfo'));

    const unsubContactInfo = onSnapshot(doc(db, 'contactInfo', 'current'), (docSnap) => {
      if (docSnap.exists()) {
        setContactInfo(docSnap.data() as ContactInfo);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'contactInfo'));

    let unsubMembers: () => void = () => {};
    let unsubCategories: () => void = () => {};
    let unsubRecords: () => void = () => {};

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin
        let isAdmin = false;
        try {
          const docRef = doc(db, 'members', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().role === 'admin' || user.email === 'josuemanueljsm@gmail.com') {
            isAdmin = true;
          }
        } catch (e) {
          console.error("Error checking admin status", e);
        }

        unsubMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
          setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
        }, (error: any) => {
          // Ignore permission errors for non-admins if they try to list all members
          if (error.code !== 'permission-denied' && !String(error.message || '').toLowerCase().includes('permission')) {
            handleFirestoreError(error, OperationType.LIST, 'members');
          }
        });

        unsubCategories = onSnapshot(collection(db, 'contributionCategories'), (snapshot) => {
          setContributionCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContributionCategory)));
        }, (error: any) => {
          if (error.code !== 'permission-denied' && !String(error.message || '').toLowerCase().includes('permission')) {
            handleFirestoreError(error, OperationType.LIST, 'contributionCategories');
          }
        });

        const recordsQuery = isAdmin ? collection(db, 'contributionRecords') : query(collection(db, 'contributionRecords'), where('userId', '==', user.uid));
        unsubRecords = onSnapshot(recordsQuery, (snapshot) => {
          setContributionRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContributionRecord)));
        }, (error: any) => {
          if (error.code !== 'permission-denied' && !String(error.message || '').toLowerCase().includes('permission')) {
            handleFirestoreError(error, OperationType.LIST, 'contributionRecords');
          }
        });
      } else {
        unsubMembers();
        unsubCategories();
        unsubRecords();
        setMembers([]);
        setContributionCategories([]);
        setContributionRecords([]);
      }
    });

    return () => {
      unsubAnnouncements();
      unsubPrayers();
      unsubActivities();
      unsubTestimonies();
      unsubMeditations();
      unsubDailyVerses();
      unsubWeeklyThemes();
      unsubSocialLinks();
      unsubGalleryEvents();
      unsubBureauMembers();
      unsubCantiques();
      unsubContactMessages();
      unsubLeaderMessage();
      unsubAboutInfo();
      unsubContactInfo();
      unsubMembers();
      unsubCategories();
      unsubRecords();
      unsubAuth();
    };
  }, []);

  useEffect(() => { localStorage.setItem('cbe_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('cbe_bureaus', JSON.stringify(bureaus)); }, [bureaus]);
  useEffect(() => { localStorage.setItem('cbe_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('cbe_historical_photos', JSON.stringify(historicalPhotos)); }, [historicalPhotos]);
  useEffect(() => { localStorage.setItem('cbe_timeline_events', JSON.stringify(timelineEvents)); }, [timelineEvents]);
  useEffect(() => { localStorage.setItem('cbe_archive_audios', JSON.stringify(archiveAudios)); }, [archiveAudios]);
  useEffect(() => { localStorage.setItem('cbe_archive_contributions', JSON.stringify(archiveContributions)); }, [archiveContributions]);
  useEffect(() => { localStorage.setItem('cbe_system_logs', JSON.stringify(systemLogs)); }, [systemLogs]);
  useEffect(() => { localStorage.setItem('cbe_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('cbe_meditations_list', JSON.stringify(meditations)); }, [meditations]);
  useEffect(() => { localStorage.setItem('cbe_weekly_themes_list', JSON.stringify(weeklyThemes)); }, [weeklyThemes]);

  useEffect(() => { localStorage.setItem('cbe_prayers', JSON.stringify(prayers)); }, [prayers]);
  useEffect(() => { localStorage.setItem('cbe_activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('cbe_testimonies', JSON.stringify(testimonies)); }, [testimonies]);
  useEffect(() => { localStorage.setItem('cbe_gallery', JSON.stringify(galleryEvents)); }, [galleryEvents]);
  useEffect(() => { localStorage.setItem('cbe_contribution_categories', JSON.stringify(contributionCategories)); }, [contributionCategories]);
  useEffect(() => { localStorage.setItem('cbe_contribution_records', JSON.stringify(contributionRecords)); }, [contributionRecords]);
  useEffect(() => { localStorage.setItem('cbe_archives', JSON.stringify(archiveArticles)); }, [archiveArticles]);
  useEffect(() => { localStorage.setItem('cbe_meditation', JSON.stringify(dailyMeditation)); }, [dailyMeditation]);
  useEffect(() => { localStorage.setItem('cbe_weekly_theme', JSON.stringify(weeklyTheme)); }, [weeklyTheme]);
  useEffect(() => { localStorage.setItem('cbe_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('cbe_audios', JSON.stringify(audios)); }, [audios]);
  useEffect(() => { localStorage.setItem('cbe_cantiques', JSON.stringify(cantiques)); }, [cantiques]);
  useEffect(() => { localStorage.setItem('cbe_daily_verses', JSON.stringify(dailyVerses)); }, [dailyVerses]);
  useEffect(() => { localStorage.setItem('cbe_leader_message', JSON.stringify(leaderMessage)); }, [leaderMessage]);
  useEffect(() => { localStorage.setItem('cbe_about_info', JSON.stringify(aboutInfo)); }, [aboutInfo]);
  useEffect(() => { localStorage.setItem('cbe_contact_info', JSON.stringify(contactInfo)); }, [contactInfo]);
  useEffect(() => { localStorage.setItem('cbe_social_links', JSON.stringify(socialLinks)); }, [socialLinks]);
  useEffect(() => { localStorage.setItem('cbe_bureau_members', JSON.stringify(bureauMembers)); }, [bureauMembers]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addAnnouncement = async (a: Omit<Announcement, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'announcements'), a);
      addLog('Annonce', `Nouvelle annonce : ${a.title}`, 'success');
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'announcements');
      return null;
    }
  };
  const updateAnnouncement = async (id: string, a: Partial<Announcement>) => {
    try {
      await updateDoc(doc(db, 'announcements', id), a);
      addLog('Annonce', `Mise à jour de l'annonce : ${a.title || id}`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'announcements');
    }
  };
  const deleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      addLog('Annonce', `Suppression de l'annonce : ${id}`, 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'announcements');
    }
  };

  const addPrayer = async (p: Omit<Prayer, 'id' | 'likes' | 'status'>) => {
    try {
      const docRef = await addDoc(collection(db, 'prayers'), { ...p, likes: 0, status: 'pending' });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'prayers');
      return null;
    }
  };
  const updatePrayer = async (id: string, p: Partial<Prayer>) => {
    try {
      await updateDoc(doc(db, 'prayers', id), p);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'prayers');
    }
  };
  const deletePrayer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'prayers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'prayers');
    }
  };
  const likePrayer = async (id: string) => {
    const prayer = prayers.find(p => p.id === id);
    if (!prayer) return;
    try {
      await updateDoc(doc(db, 'prayers', id), { likes: (prayer.likes || 0) + 1 });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'prayers');
    }
  };

  const addActivity = async (a: Omit<Activity, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'activities'), a);
      addLog('Activité', `Nouvelle activité : ${a.title}`, 'success');
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'activities');
      return null;
    }
  };
  const updateActivity = async (id: string, a: Partial<Activity>) => {
    try {
      await updateDoc(doc(db, 'activities', id), a);
      addLog('Activité', `Mise à jour de l'activité : ${a.title || id}`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'activities');
    }
  };
  const deleteActivity = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'activities', id));
      addLog('Activité', `Suppression de l'activité : ${id}`, 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'activities');
    }
  };

  const addTestimony = async (t: Omit<Testimony, 'id' | 'status' | 'likes'>) => {
    try {
      const docRef = await addDoc(collection(db, 'testimonies'), { ...t, status: 'pending', likes: 0 });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'testimonies');
      return null;
    }
  };
  const approveTestimony = async (id: string) => {
    try {
      await updateDoc(doc(db, 'testimonies', id), { status: 'approved' });
      addLog('Témoignage', `Approbation du témoignage : ${id}`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'testimonies');
    }
  };
  const deleteTestimony = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonies', id));
      addLog('Témoignage', `Suppression du témoignage : ${id}`, 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'testimonies');
    }
  };
  const likeTestimony = async (id: string) => {
    const testimony = testimonies.find(t => t.id === id);
    if (!testimony) return;
    try {
      await updateDoc(doc(db, 'testimonies', id), { likes: (testimony.likes || 0) + 1 });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'testimonies');
    }
  };

  const addGalleryEvent = async (e: Omit<GalleryEvent, 'id' | 'media'>) => {
    try {
      await addDoc(collection(db, 'galleryEvents'), { ...e, media: [] });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'galleryEvents');
    }
  };

  const updateGalleryEvent = async (id: string, e: Partial<GalleryEvent>) => {
    try {
      await updateDoc(doc(db, 'galleryEvents', id), e);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'galleryEvents');
    }
  };

  const deleteGalleryEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, 'galleryEvents', eventId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'galleryEvents');
    }
  };

  const addMediaToEvent = async (eventId: string, media: Omit<GalleryMedia, 'id' | 'likes'>) => {
    try {
      const event = galleryEvents.find(e => e.id === eventId);
      if (!event) return;
      const newMedia = { ...media, id: generateId(), likes: 0 };
      await updateDoc(doc(db, 'galleryEvents', eventId), {
        media: [newMedia, ...event.media]
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'galleryEvents');
    }
  };

  const deleteMediaFromEvent = async (eventId: string, mediaId: string) => {
    try {
      const event = galleryEvents.find(e => e.id === eventId);
      if (!event) return;
      await updateDoc(doc(db, 'galleryEvents', eventId), {
        media: event.media.filter(m => m.id !== mediaId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'galleryEvents');
    }
  };

  const likeMedia = async (eventId: string, mediaId: string) => {
    try {
      const event = galleryEvents.find(e => e.id === eventId);
      if (!event) return;
      const updatedMedia = event.media.map(m => m.id === mediaId ? { ...m, likes: m.likes + 1 } : m);
      await updateDoc(doc(db, 'galleryEvents', eventId), {
        media: updatedMedia
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'galleryEvents');
    }
  };

  const updateHistory = (h: HistoryEntry) => setHistory(h);

  const addBureau = (b: Omit<Bureau, 'id'>) => setBureaus([...bureaus, { ...b, id: generateId() }]);
  const updateBureau = (id: string, b: Partial<Bureau>) => setBureaus(bureaus.map(item => item.id === id ? { ...item, ...b } : item));
  const deleteBureau = (id: string) => setBureaus(bureaus.filter(b => b.id !== id));

  const addReport = (r: Omit<ArchiveReport, 'id'>) => setReports([...reports, { ...r, id: generateId() }]);
  const updateReport = (id: string, r: Partial<ArchiveReport>) => setReports(reports.map(item => item.id === id ? { ...item, ...r } : item));
  const deleteReport = (id: string) => setReports(reports.filter(r => r.id !== id));

  const addHistoricalPhoto = (p: Omit<HistoricalPhoto, 'id'>) => setHistoricalPhotos([...historicalPhotos, { ...p, id: generateId() }]);
  const updateHistoricalPhoto = (id: string, p: Partial<HistoricalPhoto>) => setHistoricalPhotos(historicalPhotos.map(item => item.id === id ? { ...item, ...p } : item));
  const deleteHistoricalPhoto = (id: string) => setHistoricalPhotos(historicalPhotos.filter(p => p.id !== id));

  const addTimelineEvent = (e: Omit<TimelineEvent, 'id'>) => setTimelineEvents([...timelineEvents, { ...e, id: generateId() }]);
  const updateTimelineEvent = (id: string, e: Partial<TimelineEvent>) => setTimelineEvents(timelineEvents.map(item => item.id === id ? { ...item, ...e } : item));
  const deleteTimelineEvent = (id: string) => setTimelineEvents(timelineEvents.filter(e => e.id !== id));

  const addArchiveAudio = (a: Omit<ArchiveAudio, 'id'>) => setArchiveAudios([{ ...a, id: generateId() }, ...archiveAudios]);
  const updateArchiveAudio = (id: string, a: Partial<ArchiveAudio>) => setArchiveAudios(archiveAudios.map(item => item.id === id ? { ...item, ...a } : item));
  const deleteArchiveAudio = (id: string) => setArchiveAudios(archiveAudios.filter(a => a.id !== id));

  const addArchiveContribution = (c: Omit<ArchiveContribution, 'id' | 'status'>) => setArchiveContributions([{ ...c, id: generateId(), status: 'pending' }, ...archiveContributions]);
  const approveArchiveContribution = (id: string) => {
    const contribution = archiveContributions.find(c => c.id === id);
    if (!contribution) return;

    // Logic to move to respective category could be added here if needed
    // For now just mark as approved
    setArchiveContributions(archiveContributions.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };
  const deleteArchiveContribution = (id: string) => setArchiveContributions(archiveContributions.filter(c => c.id !== id));

  const updateAboutInfo = async (info: Partial<AboutInfo>) => {
    try {
      await setDoc(doc(db, 'aboutInfo', 'current'), { ...aboutInfo, ...info });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'aboutInfo');
    }
  };

  const updateContactInfo = async (info: Partial<ContactInfo>) => {
    try {
      await setDoc(doc(db, 'contactInfo', 'current'), { ...contactInfo, ...info });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'contactInfo');
    }
  };

  const addContributionCategory = async (c: Omit<ContributionCategory, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'contributionCategories'), c);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contributionCategories');
      return null;
    }
  };
  const updateContributionCategory = async (id: string, c: Partial<ContributionCategory>) => {
    try {
      await updateDoc(doc(db, 'contributionCategories', id), c);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'contributionCategories');
    }
  };
  const deleteContributionCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contributionCategories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'contributionCategories');
    }
  };

  const addContributionRecord = async (r: Omit<ContributionRecord, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'contributionRecords'), r);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contributionRecords');
      return null;
    }
  };
  const updateContributionRecord = async (id: string, r: Partial<ContributionRecord>) => {
    try {
      await updateDoc(doc(db, 'contributionRecords', id), r);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'contributionRecords');
    }
  };
  const deleteContributionRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contributionRecords', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'contributionRecords');
    }
  };

  const addArchiveArticle = (a: Omit<ArchiveArticle, 'id'>) => setArchiveArticles([{ ...a, id: generateId() }, ...archiveArticles]);
  const updateArchiveArticle = (id: string, a: Partial<ArchiveArticle>) => setArchiveArticles(archiveArticles.map(item => item.id === id ? { ...item, ...a } : item));
  const deleteArchiveArticle = (id: string) => setArchiveArticles(archiveArticles.filter(a => a.id !== id));

  const addMeditation = async (m: Omit<DailyMeditation, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'meditations'), m);
      addLog('Méditation', `Nouvelle méditation : ${m.reference}`, 'success');
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'meditations');
      return null;
    }
  };
  const updateMeditation = async (id: string, m: Partial<DailyMeditation>) => {
    try {
      await updateDoc(doc(db, 'meditations', id), m);
      addLog('Méditation', `Mise à jour de la méditation : ${m.reference || id}`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'meditations');
    }
  };
  const deleteMeditation = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'meditations', id));
      addLog('Méditation', `Suppression de la méditation : ${id}`, 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'meditations');
    }
  };

  const addDailyVerse = async (v: Omit<DailyVerse, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'dailyVerses'), v);
      addLog('Verset', `Nouveau verset : ${v.reference}`, 'success');
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'dailyVerses');
      return null;
    }
  };
  const updateDailyVerse = async (id: string, v: Partial<DailyVerse>) => {
    try {
      await updateDoc(doc(db, 'dailyVerses', id), v);
      addLog('Verset', `Mise à jour du verset : ${v.reference || id}`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'dailyVerses');
    }
  };
  const deleteDailyVerse = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'dailyVerses', id));
      addLog('Verset', `Suppression du verset : ${id}`, 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'dailyVerses');
    }
  };

  const addWeeklyTheme = async (t: Omit<WeeklyTheme, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'weeklyThemes'), t);
      addLog('Thème', `Nouveau thème : ${t.title}`, 'success');
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'weeklyThemes');
      return null;
    }
  };
  const updateWeeklyThemeById = async (id: string, t: Partial<WeeklyTheme>) => {
    try {
      await updateDoc(doc(db, 'weeklyThemes', id), t);
      addLog('Thème', `Mise à jour du thème : ${t.title || id}`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'weeklyThemes');
    }
  };
  const deleteWeeklyTheme = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'weeklyThemes', id));
      addLog('Thème', `Suppression du thème : ${id}`, 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'weeklyThemes');
    }
  };

  const addMember = async (m: Omit<Member, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'members'), m);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'members');
      return null;
    }
  };
  const updateMember = async (id: string, m: Partial<Member>) => {
    try {
      await updateDoc(doc(db, 'members', id), m);
      addLog('Membre', `Mise à jour du membre : ${m.firstName ? `${m.firstName} ${m.lastName}` : id} (${m.status || m.role || 'info'})`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'members');
    }
  };
  const deleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'members', id));
      addLog('Membre', `Suppression du membre : ${id}`, 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'members');
    }
  };

  const addAudio = (a: Omit<AudioMessage, 'id'>) => setAudios([{ ...a, id: generateId() }, ...audios]);
  const updateAudio = (id: string, a: Partial<AudioMessage>) => setAudios(audios.map(item => item.id === id ? { ...item, ...a } : item));
  const deleteAudio = (id: string) => setAudios(audios.filter(a => a.id !== id));

  const addBureauMember = async (b: Omit<BureauMember, 'id'>) => {
    try {
      await addDoc(collection(db, 'bureauMembers'), b);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bureauMembers');
    }
  };

  const updateBureauMember = async (id: string, b: Partial<BureauMember>) => {
    try {
      await updateDoc(doc(db, 'bureauMembers', id), b);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'bureauMembers');
    }
  };

  const deleteBureauMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bureauMembers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'bureauMembers');
    }
  };

  const addSocialLink = async (s: Omit<SocialLink, 'id'>) => {
    try {
      await addDoc(collection(db, 'socialLinks'), s);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'socialLinks');
    }
  };

  const updateSocialLink = async (id: string, url: string) => {
    try {
      await updateDoc(doc(db, 'socialLinks', id), { url });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'socialLinks');
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'socialLinks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'socialLinks');
    }
  };

  const updateLeaderMessage = async (m: LeaderMessage) => {
    try {
      await setDoc(doc(db, 'leaderMessage', 'current'), m);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'leaderMessage');
    }
  };

  const addCantique = async (c: Omit<Cantique, 'id'>) => {
    try {
      await addDoc(collection(db, 'cantiques'), c);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'cantiques');
    }
  };

  const updateCantique = async (id: string, c: Partial<Cantique>) => {
    try {
      await updateDoc(doc(db, 'cantiques', id), c);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'cantiques');
    }
  };

  const deleteCantique = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cantiques', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'cantiques');
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
      addLog('Message', `Suppression du message : ${id}`, 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'contactMessages');
    }
  };

  return (
    <AppDataContext.Provider value={{
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
      prayers, addPrayer, updatePrayer, deletePrayer, likePrayer,
      activities, addActivity, updateActivity, deleteActivity,
      testimonies, addTestimony, approveTestimony, deleteTestimony, likeTestimony,
      galleryEvents, addGalleryEvent, updateGalleryEvent, addMediaToEvent, likeMedia, deleteGalleryEvent, deleteMediaFromEvent,
      contributionCategories, addContributionCategory, updateContributionCategory, deleteContributionCategory,
      contributionRecords, addContributionRecord, updateContributionRecord, deleteContributionRecord,
      archiveArticles, addArchiveArticle, updateArchiveArticle, deleteArchiveArticle,
      meditations, addMeditation, updateMeditation, deleteMeditation,
      dailyMeditation,
      dailyVerses, addDailyVerse, updateDailyVerse, deleteDailyVerse, currentDailyVerse,
      weeklyThemes, addWeeklyTheme, updateWeeklyThemeById, deleteWeeklyTheme,
      weeklyTheme,
      members, addMember, updateMember, deleteMember,
      audios, addAudio, updateAudio, deleteAudio,
      bureauMembers, addBureauMember, updateBureauMember, deleteBureauMember,
      socialLinks, updateSocialLink,
      leaderMessage, updateLeaderMessage,
      cantiques, addCantique, updateCantique, deleteCantique,
      history, updateHistory,
      bureaus, addBureau, updateBureau, deleteBureau,
      reports, addReport, updateReport, deleteReport,
      historicalPhotos, addHistoricalPhoto, updateHistoricalPhoto, deleteHistoricalPhoto,
      timelineEvents, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent,
      archiveAudios, addArchiveAudio, updateArchiveAudio, deleteArchiveAudio,
      archiveContributions, addArchiveContribution, approveArchiveContribution, deleteArchiveContribution,
      aboutInfo, updateAboutInfo,
      contactInfo, updateContactInfo,
      contactMessages, deleteContactMessage,
      isOnline,
      systemLogs, addLog
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
