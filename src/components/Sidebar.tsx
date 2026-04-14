import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Home, BookOpen, Bell, Calendar, Heart, 
  Music, Image as ImageIcon, Users, Sparkles, Plus,
  User, Info, Phone, CloudOff, Shield, Book, ListTodo, HelpCircle, Wallet, Settings as SettingsIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const menuItems = [
    { path: '/app', icon: Home, label: 'Accueil', color: 'text-blue-600' },
    { path: '/app/meditation', icon: BookOpen, label: 'Méditation', color: 'text-indigo-600' },
    { path: '/app/announcements', icon: Bell, label: 'Annonces', color: 'text-orange-500' },
    { path: '/app/activities', icon: Calendar, label: 'Activités', color: 'text-emerald-600' },
    { path: '/app/contributions', icon: Wallet, label: 'Contributions', color: 'text-indigo-600' },
    { path: '/app/prayer', icon: Heart, label: 'Prière', color: 'text-slate-600' },
    { path: '/app/cantiques', icon: Music, label: 'Cantiques', color: 'text-purple-500' },
    { path: '/app/gallery', icon: ImageIcon, label: 'Galerie', color: 'text-fuchsia-500' },
    { path: '/app/archives', icon: Book, label: 'Archives', color: 'text-amber-600' },
    { path: '/app/contacts', icon: Phone, label: 'Contact & Bureau', color: 'text-orange-600' },
    { path: '/app/testimonies', icon: Sparkles, label: 'Témoignages', color: 'text-amber-500' },
    { path: '/app/profile', icon: User, label: 'Profil', color: 'text-purple-600' },
    { path: '/app/settings', icon: SettingsIcon, label: 'Paramètres', color: 'text-slate-600' },
    { path: '/app/about', icon: Info, label: 'À propos', color: 'text-slate-700' },
    { path: '/app/offline', icon: CloudOff, label: 'Mode Hors Ligne', color: 'text-indigo-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#1E3A8A] dark:bg-slate-950 pt-12 pb-6 px-6 relative flex flex-col items-center shrink-0">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 rounded-full border-2 border-[#D9A05B] flex flex-col items-center justify-center mb-3">
                <span className="text-[#D9A05B] text-xl font-bold leading-none">+</span>
                <span className="text-white font-bold text-[10px] mt-0.5">CBE</span>
              </div>
              <h2 className="text-white font-bold text-lg">CBE Mpaka</h2>
            </div>

            {/* Scrollable Menu */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path === '/app' && location.pathname === '/app/');
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors ${
                      isActive ? 'bg-[#1E3A8A] dark:bg-blue-600 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'text-white' : item.color} ${isActive ? '' : 'bg-slate-50 dark:bg-slate-800'}`}>
                      <item.icon size={18} />
                    </div>
                    <span className="font-semibold text-[15px]">{item.label}</span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className="py-4 px-4">
                <div className="border-t border-dashed border-slate-200 dark:border-slate-700"></div>
              </div>

              {/* Admin Section */}
              <div className="px-4 pb-4 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 mt-4">Administration</p>
                <button 
                  onClick={() => navigate('/app/admin')}
                  className="w-full bg-[#F59E0B] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-200 dark:shadow-none active:scale-95 transition-transform"
                >
                  <Shield size={18} />
                  Mode Admin 👑
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 shrink-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-[#FFFAF0] dark:bg-slate-800 rounded-xl p-3 text-center border border-[#FDE68A]/50 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium flex items-center justify-center gap-1 mb-1">
                  🕊️ Sous-section CBE Mpaka
                </p>
                <p className="text-[#1E3A8A] dark:text-blue-400 text-xs font-bold italic">
                  « CBE Dieu le veut, Cbeiste tiens bon ! »
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
