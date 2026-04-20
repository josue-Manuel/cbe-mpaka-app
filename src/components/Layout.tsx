import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Music, Bell, Heart, Phone, ImageIcon, Clock, ShieldAlert, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { useProfile } from '../context/ProfileContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile, logout, isAdmin } = useProfile();

  const navItems = [
    { path: '/app', icon: Home, label: 'Accueil' },
    { path: '/app/cantiques', icon: Music, label: 'Cantiques' },
    { path: '/app/gallery', icon: ImageIcon, label: 'Galerie' },
    { path: '/app/prayer', icon: Heart, label: 'Prière' },
    { path: '/app/contacts', icon: Phone, label: 'Contact' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (profile?.status === 'pending' && !isAdmin) {
    return (
      <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#0A192F] items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
          <Clock size={48} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Compte en attente</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">
          Votre inscription a bien été enregistrée. Un administrateur doit valider votre compte avant que vous puissiez accéder à l'application. Veuillez patienter.
        </p>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium active:scale-95 transition-transform"
        >
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>
      </div>
    );
  }

  if (profile?.status === 'blocked') {
    return (
      <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#0A192F] items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Compte bloqué</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">
          Votre compte a été suspendu par un administrateur. Vous ne pouvez plus accéder à l'application.
        </p>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium active:scale-95 transition-transform"
        >
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#0A192F] font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#F8FAFC] dark:bg-[#0A192F]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-full"
          >
            <Outlet context={{ setIsSidebarOpen }} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center pb-safe pt-2 px-1 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] shrink-0 z-10 relative">
        <div className="absolute -top-4 right-2 text-[8px] text-slate-400">v1.1 (Test)</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 min-w-[64px] transition-colors relative ${
                isActive ? 'text-[#1E3A8A] dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative p-1 z-10">
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium text-center leading-tight ${isActive ? 'font-bold' : ''}`}>
                  {item.label.split(' & ').map((line, i) => (
                    <span key={i} className="block">{line}{i === 0 && item.label.includes('&') ? ' &' : ''}</span>
                  ))}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
