import { ChevronLeft, CloudOff, CheckCircle2, Database, WifiOff, Wifi, RefreshCw, Trash2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useState, useEffect } from 'react';

export default function Offline() {
  const navigate = useNavigate();
  const { isOnline } = useAppData();
  const [storageSize, setStorageSize] = useState<string>('0 KB');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    calculateStorage();
  }, []);

  const calculateStorage = () => {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2;
      }
    }
    setStorageSize((total / 1024).toFixed(2) + ' KB');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      calculateStorage();
      setIsRefreshing(false);
    }, 1000);
  };

  const clearCache = () => {
    if (confirm('Voulez-vous vraiment vider le cache ? Cela supprimera toutes les données stockées localement.')) {
      localStorage.clear();
      calculateStorage();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium">
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg">Mode Hors Ligne</h1>
        <div className="w-16"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <div className={`${isOnline ? 'bg-emerald-600' : 'bg-[#1E3A8A]'} dark:bg-slate-950 rounded-3xl p-8 text-center shadow-lg transition-colors duration-500`}>
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            {isOnline ? <Wifi size={32} className="text-white" /> : <CloudOff size={32} className="text-white" />}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${isOnline ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'} rounded-full border-2 ${isOnline ? 'border-emerald-600' : 'border-[#1E3A8A]'} dark:border-slate-950 flex items-center justify-center`}>
              <CheckCircle2 size={12} />
            </div>
          </div>
          <h2 className="text-white font-serif font-bold text-2xl mb-2">
            {isOnline ? 'Vous êtes en ligne' : 'Prêt pour le hors ligne'}
          </h2>
          <p className="text-blue-100 text-sm">
            {isOnline 
              ? 'Votre connexion est active. Les données sont synchronisées.' 
              : 'Votre application fonctionne même sans connexion internet.'}
          </p>
        </div>

        {/* Storage Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Database size={18} className="text-blue-500" />
              Stockage Local
            </h3>
            <button 
              onClick={handleRefresh}
              className={`text-blue-600 dark:text-blue-400 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={16} />
            </button>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-[#1E3A8A] dark:text-blue-400">{storageSize}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">Espace utilisé par l'application</p>
            </div>
            <button 
              onClick={clearCache}
              className="flex items-center gap-1.5 text-red-500 text-xs font-bold px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl active:scale-95 transition-transform"
            >
              <Trash2 size={14} />
              Vider
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
          <h3 className="font-serif font-bold text-[#1E3A8A] dark:text-blue-400 text-lg">Fonctionnalités disponibles</h3>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Profil & Préférences</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Vos informations et réglages sont toujours accessibles.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Contenu mis en cache</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Les cantiques, prières et textes consultés récemment sont sauvegardés.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center shrink-0">
              <WifiOff size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Navigation fluide</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">L'interface reste réactive même sans réseau.</p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-[#FFFAF0] dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 rounded-3xl p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Info size={40} className="text-amber-600" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 italic text-sm font-medium relative z-10">
            « L'Esprit de Dieu n'est pas limité par la connexion internet. »
          </p>
        </div>
      </div>
    </div>
  );
}
