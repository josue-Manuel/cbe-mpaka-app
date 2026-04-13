import { ChevronLeft, Info, MapPin, Clock, Users, Shield, Heart, Target, History, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppData } from '../context/AppDataContext';
import { APP_VERSION } from '../version';

export default function About() {
  const navigate = useNavigate();
  const { aboutInfo, bureauMembers } = useAppData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="text-red-500" />;
      case 'Shield': return <Shield className="text-blue-500" />;
      case 'Users': return <Users className="text-orange-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500';
      case 'blue': return 'bg-blue-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-slate-500';
    }
  };

  const getTextVariant = (color: string) => {
    switch (color) {
      case 'emerald': return 'text-emerald-600 dark:text-emerald-400';
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="flex-1 bg-[#FDFCFB] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium">
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg font-serif">À propos</h1>
        <div className="w-16"></div>
      </div>

      <motion.div 
        className="p-4 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Card */}
        <motion.div variants={itemVariants} className="bg-[#1E3A8A] dark:bg-slate-950 rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full border-2 border-[#D9A05B] flex flex-col items-center justify-center mx-auto mb-6 relative z-10 bg-[#1E3A8A] dark:bg-slate-950 shadow-2xl"
          >
            <span className="text-[#D9A05B] text-3xl font-bold leading-none">+</span>
            <span className="text-white font-bold text-sm mt-1">CBE</span>
          </motion.div>
          <h2 className="text-white font-serif font-bold text-3xl mb-2 relative z-10">CBE Mpaka</h2>
          <p className="text-[#D9A05B] italic text-base font-medium relative z-10 font-serif">
            « CBE Dieu le veut, Cbeiste tiens bon ! »
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E3A8A] dark:text-blue-400">
                <Target size={24} />
              </div>
              <h3 className="font-serif font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">Notre Vision</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {aboutInfo.vision}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E3A8A] dark:text-blue-400">
                <Info size={24} />
              </div>
              <h3 className="font-serif font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">Notre Mission</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {aboutInfo.mission}
            </p>
          </div>
        </motion.div>

        {/* Values Grid */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="font-serif font-bold text-[#1E3A8A] dark:text-blue-400 text-lg px-2">Nos Valeurs</h3>
          <div className="grid grid-cols-3 gap-3">
            {aboutInfo.values.map((val, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-2">
                  {getIcon(val.icon)}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-1">{val.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-tight">{val.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* History Section */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <History size={24} />
            </div>
            <h3 className="font-serif font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">Notre Histoire</h3>
          </div>
          <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-700 space-y-6">
            {aboutInfo.historyTimeline.map((event) => (
              <div key={event.id} className="relative">
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-800 ${getColorClass(event.color)}`}></div>
                <span className={`text-xs font-bold ${getTextVariant(event.color)}`}>{event.year}</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{event.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leadership */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-serif font-bold text-[#1E3A8A] dark:text-blue-400 text-lg">Direction</h3>
            <Award size={20} className="text-[#D9A05B]" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {bureauMembers.map((leader) => (
              <div key={leader.id} className="flex-shrink-0 w-40 bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <img 
                  src={leader.imageUrl || `https://picsum.photos/seed/${leader.id}/200/200`} 
                  alt={leader.name} 
                  className="w-20 h-20 rounded-2xl mx-auto mb-3 object-cover shadow-md"
                  referrerPolicy="no-referrer"
                />
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{leader.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1 uppercase tracking-wider">{leader.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Location & Contact */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
              <MapPin size={24} />
            </div>
            <h3 className="font-serif font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">Nous Trouver</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
            Quartier Mpaka, Avenue de la Paix, Temple CBE.
          </p>
          <div className="w-full h-48 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-3">
              <MapPin className="text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
              La carte interactive sera bientôt disponible.
            </p>
            <button className="mt-4 px-6 py-2 bg-[#1E3A8A] text-white rounded-full text-xs font-bold shadow-lg shadow-blue-900/20">
              Ouvrir dans Google Maps
            </button>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div variants={itemVariants} className="text-center py-6">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em]">
            Application Officielle • Version {APP_VERSION}
          </p>
          <div className="flex flex-col items-center gap-1 mt-2">
            <p className="text-slate-300 dark:text-slate-600 text-[10px]">
              © 2026 CBE Mpaka. Tous droits réservés.
            </p>
            <button 
              onClick={() => alert("Politique de Confidentialité :\n\nVos données (nom, prénom, téléphone) sont stockées de manière sécurisée sur Firebase et ne sont utilisées que pour le fonctionnement de l'application CBE Mpaka. Aucune donnée n'est partagée avec des tiers.")}
              className="text-blue-400 dark:text-blue-500 text-[10px] underline"
            >
              Confidentialité
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
