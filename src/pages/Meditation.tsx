import { BookOpen, Heart, Share2, ArrowLeft, Check, Sparkles, Bookmark, BookmarkCheck, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useProfile } from '../context/ProfileContext';

export default function Meditation() {
  const navigate = useNavigate();
  const { dailyMeditation, currentDailyVerse, weeklyTheme } = useAppData();
  const { profile, updateProfile } = useProfile();
  const [isBlessed, setIsBlessed] = useState(false);

  const displayVerse = currentDailyVerse || dailyMeditation;
  const isFavorite = profile?.favoriteMeditations?.includes(displayVerse.id) || false;

  const toggleFavorite = () => {
    if (!profile) return;
    
    const currentFavorites = profile.favoriteMeditations || [];
    const newFavorites = isFavorite 
      ? currentFavorites.filter(id => id !== displayVerse.id)
      : [...currentFavorites, displayVerse.id];
      
    updateProfile({ favoriteMeditations: newFavorites });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Méditation & Thème - CBE Mpaka',
          text: `Thème de la semaine : ${weeklyTheme.title}\n\nVerset du jour : ${displayVerse.reference} - "${displayVerse.text}"\n\nPartagé depuis l'application Sous-section CBE Mpaka.`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erreur lors du partage:', error);
      }
    } else {
      alert("Le partage natif n'est pas supporté sur votre navigateur.");
    }
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#1E3A8A] dark:bg-slate-950 pt-6 pb-12 px-4 rounded-b-[32px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-transform">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white">Méditation & Thème</h1>
          </div>
          <button 
            onClick={() => navigate('/app/meditation/history')}
            className="flex items-center gap-2 text-white/80 text-sm font-medium bg-white/10 px-4 py-2 rounded-xl active:scale-95 transition-transform"
          >
            <Calendar size={16} />
            Historique
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 space-y-6">
        {/* Thème de la Semaine */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Sparkles size={24} className="text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">Thème de la semaine</h2>
              <h3 className="text-[#2563EB] dark:text-blue-500 font-bold text-lg leading-tight">{weeklyTheme.title}</h3>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-6">
            <p className="text-[#1E3A8A] dark:text-blue-400 font-bold text-sm mb-2">{weeklyTheme.reference}</p>
            <p className="text-slate-700 dark:text-slate-300 italic text-sm leading-relaxed">
              « {weeklyTheme.text} »
            </p>
          </div>

          <h4 className="font-bold text-[#1E3A8A] dark:text-blue-400 mb-3 text-sm">Développement</h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {weeklyTheme.description}
          </p>
        </div>

        {/* Verset du Jour */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <BookOpen size={24} className="text-[#D9A05B]" />
            </div>
            <div>
              <h2 className="text-[#D9A05B] font-bold text-xs uppercase tracking-wider mb-1">Verset du jour</h2>
              <h3 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-lg">{displayVerse.reference}</h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{displayVerse.date}</p>
            </div>
          </div>

          <div className="relative mb-6">
            <span className="absolute -top-4 -left-2 text-6xl text-slate-100 dark:text-slate-700 font-serif">"</span>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic relative z-10 px-4">
              {displayVerse.text}
            </p>
            <span className="absolute -bottom-8 -right-2 text-6xl text-slate-100 dark:text-slate-700 font-serif">"</span>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700 my-6"></div>

          <h4 className="font-bold text-[#1E3A8A] dark:text-blue-400 mb-3 text-sm">Exhortation</h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
            {displayVerse.exhortation || (displayVerse === dailyMeditation ? dailyMeditation.exhortation : "Pas d'exhortation pour aujourd'hui.")}
          </p>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsBlessed(true)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all ${
                isBlessed ? 'bg-emerald-500 text-white' : 'bg-[#2563EB] dark:bg-blue-600 text-white'
              }`}
            >
              {isBlessed ? <Check size={18} /> : <Heart size={18} />}
              {isBlessed ? 'Amen !' : "J'ai été béni(e)"}
            </button>
            <button 
              onClick={toggleFavorite}
              className={`w-12 h-12 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
                isFavorite 
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              aria-label="Ajouter aux favoris"
            >
              {isFavorite ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
            <button 
              onClick={handleShare}
              className="w-12 h-12 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Partager la méditation"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
