import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Music, Bell, Heart, Phone, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: '/app', icon: Home, label: 'Accueil' },
    { path: '/app/cantiques', icon: Music, label: 'Cantiques' },
    { path: '/app/gallery', icon: ImageIcon, label: 'Galerie' },
    { path: '/app/prayer', icon: Heart, label: 'Prière' },
    { path: '/app/contacts', icon: Phone, label: 'Contact' },
  ];

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
      <nav className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center pb-safe pt-2 px-1 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] shrink-0 z-10">
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
