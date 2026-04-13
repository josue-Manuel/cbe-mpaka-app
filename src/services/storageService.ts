import { MemberProfile } from '../types/profile';

const PROFILE_KEY = 'cbe_mpaka_user_profile';
const HISTORY_KEY = 'cbe_mpaka_user_history';

// --- SYNC MEMORY ADAPTER ---
// Permet un accès synchrone aux données après le chargement initial.
const MEMORY_CACHE: Record<string, any> = {};

// Helper pour générer un UUID simple (évite Math.random)
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const storageService = {
  init: () => {
    try {
      const profile = localStorage.getItem(PROFILE_KEY);
      if (profile) MEMORY_CACHE[PROFILE_KEY] = JSON.parse(profile);
      
      const history = localStorage.getItem(HISTORY_KEY);
      if (history) MEMORY_CACHE[HISTORY_KEY] = JSON.parse(history);
    } catch (e) {
      console.error('❌ Storage init error', e);
    }
  },

  saveProfile: (profile: MemberProfile): void => {
    try {
      MEMORY_CACHE[PROFILE_KEY] = profile;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
    }
  },

  getProfile: (): MemberProfile | null => {
    if (MEMORY_CACHE[PROFILE_KEY] !== undefined) {
      return MEMORY_CACHE[PROFILE_KEY];
    }
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      const parsed = data ? JSON.parse(data) : null;
      MEMORY_CACHE[PROFILE_KEY] = parsed;
      return parsed;
    } catch (error) {
      return null;
    }
  },

  clearProfile: (): void => {
    delete MEMORY_CACHE[PROFILE_KEY];
    localStorage.removeItem(PROFILE_KEY);
  },

  hasProfile: (): boolean => {
    return storageService.getProfile() !== null;
  },

  logActivity: (type: string, label: string) => {
    try {
      const log = {
        id: generateUUID(),
        type,
        label,
        date: new Date().toISOString()
      };
      const history = MEMORY_CACHE[HISTORY_KEY] || JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      // Performance: Limitation stricte à 50 items pour éviter de saturer la RAM au démarrage
      const newHistory = [log, ...history].slice(0, 50);
      MEMORY_CACHE[HISTORY_KEY] = newHistory;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to log activity', e);
    }
  }
};
