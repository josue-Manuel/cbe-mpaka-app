import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Menu, Sparkles, BookOpen, ChevronRight, ArrowRight, Calendar, Bell, CloudOff, BellRing, Cake, Lock, MessageSquare, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { useNotification } from '../context/NotificationContext';
import { useAppData } from '../context/AppDataContext';

export default function Home() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (isOpen: boolean) => void }>();
  const { isPushEnabled, togglePushNotifications, notifications, clearNotifications } = useNotification();
  const { dailyMeditation, currentDailyVerse, weeklyTheme, leaderMessage, members } = useAppData();
  const [wished, setWished] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  // Calculate today's birthdays
  const birthdayMembers = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    return members.filter(m => {
      if (!m.birthDate || m.status !== 'active') return false;
      const [year, month, day] = m.birthDate.split('-');
      return parseInt(month) === currentMonth && parseInt(day) === currentDay;
    });
  }, [members]);

  const getBirthdayText = () => {
    if (birthdayMembers.length === 0) return "";
    if (birthdayMembers.length === 1) return `Joyeux anniversaire à ${birthdayMembers[0].firstName} ${birthdayMembers[0].lastName} !`;
    if (birthdayMembers.length === 2) return `Joyeux anniversaire à ${birthdayMembers[0].firstName} ${birthdayMembers[0].lastName} et ${birthdayMembers[1].firstName} ${birthdayMembers[1].lastName} !`;
    return `Joyeux anniversaire à ${birthdayMembers[0].firstName} ${birthdayMembers[0].lastName}, ${birthdayMembers[1].firstName} ${birthdayMembers[1].lastName} et ${birthdayMembers.length - 2} autres !`;
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-6">
      {/* Header Section */}
      <div className="bg-[#1E3A8A] dark:bg-slate-950 pt-6 pb-20 px-4 rounded-b-[32px] relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-[#D9A05B] flex flex-col items-center justify-center leading-none">
              <span className="text-[#D9A05B] text-[10px] font-bold leading-none">+</span>
              <span className="text-[#D9A05B] text-[8px] font-bold leading-none">CBE</span>
            </div>
            <span className="text-white font-bold text-sm">CBE Mpaka</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNotifs(true)}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center active:scale-95 transition-transform relative"
            >
              <Bell className="text-white" size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              <Menu className="text-white" size={24} />
            </button>
          </div>
        </div>

        {/* Center Logo & Titles */}
        <div className="flex flex-col items-center text-center mb-4">
          <motion.div 
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full border-2 border-[#D9A05B] flex flex-col items-center justify-center mb-4"
          >
            <span className="text-[#D9A05B] text-2xl font-bold leading-none">+</span>
            <span className="text-white font-bold text-sm mt-1">CBE</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-1">Sous-section CBE Mpaka</h1>
          {profile && (
            <p className="text-blue-200 text-sm mb-3">Bonjour, {profile.firstName} 👋</p>
          )}
          <p className="text-[#D9A05B] text-sm italic font-medium flex items-center gap-2">
            <Sparkles size={14} /> « CBE Dieu le veut, Cbeiste tiens bon ! » <Sparkles size={14} />
          </p>
        </div>
      </div>

      {/* Content Container (overlapping header) */}
      <div className="px-4 -mt-14 space-y-6 relative z-10">
        
        {/* Birthday Banner */}
        {birthdayMembers.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border-l-4 border-pink-400 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center text-pink-500 shrink-0">
              <Cake size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-sm">Anniversaire du jour 🎂</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{wished ? "Vœux envoyés ! ✨" : getBirthdayText()}</p>
            </div>
            <button 
              onClick={() => setWished(true)}
              disabled={wished}
              className={`${wished ? 'bg-emerald-500' : 'bg-pink-500'} text-white text-[10px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-all`}
            >
              {wished ? 'Envoyé' : 'Souhaiter'}
            </button>
          </div>
        )}

        {/* Notification Banner */}
        {!isPushEnabled && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <BellRing size={20} />
              </div>
              <div>
                <h3 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-sm">Activer les rappels</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Ne manquez aucun culte</p>
              </div>
            </div>
            <button 
              onClick={togglePushNotifications}
              className="bg-[#1E3A8A] text-white text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform"
            >
              Activer
            </button>
          </div>
        )}

        {/* Verset du Jour Card */}
        <div 
          onClick={() => navigate('/app/meditation')}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <BookOpen size={20} className="text-[#D9A05B]" />
              </div>
              <div>
                <h2 className="text-[#D9A05B] font-bold text-xs uppercase tracking-wider">Verset du jour</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs">{(currentDailyVerse || dailyMeditation).reference}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-slate-700 dark:text-slate-300 italic text-sm leading-relaxed mb-4 text-center max-w-md mx-auto">
              « {(currentDailyVerse || dailyMeditation).text.length > 120 ? (currentDailyVerse || dailyMeditation).text.substring(0, 120) + '...' : (currentDailyVerse || dailyMeditation).text} »
            </p>
            <button className="text-[#1E3A8A] dark:text-blue-400 text-sm font-semibold flex items-center gap-1">
              Touchez pour lire la méditation <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Accès Rapide */}
        <div>
          <h2 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-lg mb-4">Accès rapide</h2>
          <div className="grid grid-cols-3 gap-3">
            {/* Méditation */}
            <button onClick={() => navigate('/app/meditation')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="text-[#1E3A8A] dark:text-blue-400 font-bold text-[10px]">Méditation</span>
            </button>
            {/* Activités */}
            <button onClick={() => navigate('/app/activities')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-[#059669] rounded-xl flex items-center justify-center shadow-sm">
                <Calendar size={24} className="text-white" />
              </div>
              <span className="text-[#1E3A8A] dark:text-blue-400 font-bold text-[10px]">Agenda</span>
            </button>
            {/* Annonces */}
            <button onClick={() => navigate('/app/announcements')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-[#EA580C] rounded-xl flex items-center justify-center shadow-sm">
                <Bell size={24} className="text-white" />
              </div>
              <span className="text-[#1E3A8A] dark:text-blue-400 font-bold text-[10px]">Annonces</span>
            </button>
            {/* Prière */}
            <button onClick={() => navigate('/app/prayer')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-[#E11D48] rounded-xl flex items-center justify-center shadow-sm">
                <MessageSquare size={24} className="text-white" />
              </div>
              <span className="text-[#1E3A8A] dark:text-blue-400 font-bold text-[10px]">Prière</span>
            </button>
            {/* Galerie */}
            <button onClick={() => navigate('/app/gallery')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-[#D9A05B] rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles size={24} className="text-white" />
              </div>
              <span className="text-[#1E3A8A] dark:text-blue-400 font-bold text-[10px]">Galerie</span>
            </button>
            {/* Témoignages */}
            <button onClick={() => navigate('/app/testimonies')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles size={24} className="text-white" />
              </div>
              <span className="text-[#1E3A8A] dark:text-blue-400 font-bold text-[10px]">Témoignages</span>
            </button>
            {/* Offline */}
            <button onClick={() => navigate('/app/offline')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center shadow-sm">
                <CloudOff size={24} className="text-white" />
              </div>
              <span className="text-[#1E3A8A] dark:text-blue-400 font-bold text-[10px]">Offline</span>
            </button>
          </div>
        </div>

        {/* Thème de la semaine */}
        <div 
          onClick={() => navigate('/app/meditation')}
          className="bg-[#FFFAF0] dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 rounded-2xl p-5 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-[#D9A05B]" />
            <h2 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-lg">Thème de la semaine</h2>
          </div>
          <h3 className="text-[#2563EB] dark:text-blue-500 font-bold text-lg mb-1">{weeklyTheme.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{weeklyTheme.reference}</p>
          <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed mb-4">
            « {weeklyTheme.text.length > 120 ? weeklyTheme.text.substring(0, 120) + '...' : weeklyTheme.text} »
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {weeklyTheme.description.length > 150 ? weeklyTheme.description.substring(0, 150) + '...' : weeklyTheme.description}
          </p>
        </div>

        {/* Mot du Responsable */}
        <div className="bg-[#1E3A8A] dark:bg-slate-950 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h3 className="text-white font-bold text-xl mb-3 flex items-center gap-2 relative z-10">
            <MessageSquare size={20} className="text-[#D9A05B]" />
            {leaderMessage.title}
          </h3>
          <p className="text-blue-100 dark:text-blue-300 text-sm leading-relaxed mb-6 relative z-10">
            {leaderMessage.content}
          </p>
          <div className="flex items-center gap-3 relative z-10 border-t border-white/10 pt-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#D9A05B] font-bold text-lg">
              {leaderMessage.author.charAt(0)}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{leaderMessage.author}</p>
              <p className="text-blue-200 dark:text-blue-400 text-xs">{leaderMessage.date}</p>
            </div>
          </div>
        </div>

      </div>
      {/* Notification Center Modal */}
      {showNotifs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowNotifs(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Bell className="text-blue-600" size={20} />
                Notifications
              </h2>
              <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">{new Date(notif.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{notif.message}</p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Bell size={32} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Aucune notification pour le moment.</p>
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => { clearNotifications(); setShowNotifs(false); }}
                  className="w-full py-3 text-red-500 text-sm font-bold active:scale-95 transition-transform"
                >
                  Tout effacer
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
