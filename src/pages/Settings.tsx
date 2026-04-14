import { Settings as SettingsIcon, Moon, Globe, CircleHelp, Info, Bell, BellRing, Sun, User, Shield, Trash2, ChevronRight, CloudOff, RefreshCw, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { useState, useEffect } from 'react';
import { APP_VERSION } from '../version';

export default function Settings() {
  const navigate = useNavigate();
  const { isPushEnabled, togglePushNotifications, sendTestNotification } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const { profile, isAdmin } = useProfile();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'up-to-date' | 'error'>('idle');
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  const checkForUpdates = async () => {
    setUpdateStatus('checking');
    try {
      const response = await fetch(`/version.json?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch version info');
      const data = await response.json();
      setLatestVersion(data.version);
      if (data.version !== APP_VERSION) {
        setUpdateStatus('available');
      } else {
        setUpdateStatus('up-to-date');
        setTimeout(() => setUpdateStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Update check failed:', error);
      setUpdateStatus('error');
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }
  };

  const applyUpdate = () => {
    window.location.reload();
  };

  const handleClearCache = () => {
    const theme = localStorage.getItem('cbe_theme');
    const profile = localStorage.getItem('cbe_profile');
    localStorage.clear();
    if (theme) localStorage.setItem('cbe_theme', theme);
    if (profile) localStorage.setItem('cbe_profile', profile);
    setShowClearConfirm(false);
    alert("Cache vidé avec succès. L'application va se recharger.");
    window.location.reload();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-400 mb-2 flex items-center gap-2">
          <SettingsIcon size={24} />
          Paramètres
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Gérez vos préférences et votre compte.</p>
      </div>

      <h4 className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider px-2 mb-2">Compte & Sécurité</h4>
      <Card variant="elevated" className="border-0 p-2 dark:bg-slate-800 dark:border-slate-700 mb-6 shadow-sm">
        <div onClick={() => navigate('/app/profile')} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <User size={20} />
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-white block">Mon Profil</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {profile ? `${profile.firstName} ${profile.lastName}` : 'Non défini'}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-4"></div>

        <div onClick={() => navigate('/app/admin')} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAdmin ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
              <Shield size={20} />
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-white block">Espace Administrateur</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{isAdmin ? 'Connecté' : 'Accès restreint'}</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </div>
      </Card>

      <h4 className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider px-2 mb-2">Préférences</h4>
      <Card variant="elevated" className="border-0 p-2 dark:bg-slate-800 dark:border-slate-700 mb-6 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-50 text-slate-600 dark:bg-slate-700'}`}>
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-white block">Mode Sombre</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{theme === 'dark' ? 'Activé' : 'Désactivé'}</span>
            </div>
          </div>
          <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" name="toggle-theme" id="dark-mode" checked={theme === 'dark'} onChange={toggleTheme} className="sr-only" />
            <label htmlFor="dark-mode" className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${theme === 'dark' ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
            </label>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-4"></div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isPushEnabled ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-50 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
              <Bell size={20} />
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-white block">Notifications Push</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Rappels de cultes et annonces</span>
            </div>
          </div>
          <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" name="toggle-notif" id="notif-mode" checked={isPushEnabled} onChange={togglePushNotifications} className="sr-only" />
            <label htmlFor="notif-mode" className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${isPushEnabled ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${isPushEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </label>
          </div>
        </div>

        {isPushEnabled && (
          <div className="px-4 pb-4">
            <button onClick={sendTestNotification} className="w-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <BellRing size={16} />
              Tester une notification
            </button>
          </div>
        )}
      </Card>

      <h4 className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider px-2 mb-2">Données & Stockage</h4>
      <Card variant="elevated" className="border-0 p-2 dark:bg-slate-800 dark:border-slate-700 mb-6 shadow-sm">
        <div onClick={() => navigate('/app/offline')} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CloudOff size={20} />
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-white block">Mode Hors Ligne</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Gérer les données téléchargées</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-4"></div>

        <div onClick={() => setShowClearConfirm(true)} className="flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
              <Trash2 size={20} />
            </div>
            <div>
              <span className="font-semibold text-red-600 dark:text-red-400 block">Vider le cache</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Réinitialise les données locales (sauf profil)</span>
            </div>
          </div>
        </div>
      </Card>

      <h4 className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider px-2 mb-2">Support & À propos</h4>
      <Card variant="elevated" className="border-0 p-2 dark:bg-slate-800 dark:border-slate-700 shadow-sm mb-6">
        <div onClick={() => navigate('/app/contacts')} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <CircleHelp size={20} />
            </div>
            <span className="font-semibold text-slate-800 dark:text-white">Aide & Support</span>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-4"></div>

        <div onClick={() => navigate('/app/about')} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Info size={20} />
            </div>
            <span className="font-semibold text-slate-800 dark:text-white">À propos de l'application</span>
          </div>
          <span className="text-xs text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">v{APP_VERSION}</span>
        </div>
      </Card>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg text-center mb-2">Vider le cache ?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">
              Cette action va réinitialiser les annonces, activités et médias téléchargés. Votre profil et vos préférences seront conservés.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 active:scale-95 transition-transform">Annuler</button>
              <button onClick={handleClearCache} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-transform">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
              }
            
        
