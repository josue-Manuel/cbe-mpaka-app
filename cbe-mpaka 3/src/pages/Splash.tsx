import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';

export default function Splash() {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (profile) {
        navigate('/app');
      } else {
        navigate('/auth');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, profile, isLoading]);

  return (
    <div className="min-h-screen bg-[#0D47A1] flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10"
      >
        <motion.div 
          className="w-32 h-32 bg-white rounded-[32px] mx-auto flex items-center justify-center shadow-2xl mb-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-[#0D47A1] font-heading font-bold text-5xl">CBE</span>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-heading font-bold text-white mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          CBE Mpaka
        </motion.h1>
        
        <motion.p 
          className="text-[#FFD54F] font-medium text-lg italic tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          "Dieu le veut, Cbeiste tiens bon !"
        </motion.p>
      </motion.div>

      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="w-8 h-8 border-4 border-[#1565C0] border-t-white rounded-full animate-spin"></div>
      </motion.div>
    </div>
  );
}
