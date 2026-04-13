import { useState } from 'react';
import { Bell, ChevronRight, ChevronLeft, Menu, Calendar as CalendarIcon, FileText, X, Share2 } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAppData, Announcement } from '../context/AppDataContext';

export default function Announcements() {
  const navigate = useNavigate();
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (isOpen: boolean) => void }>();
  const { announcements } = useAppData();
  const [activeTab, setActiveTab] = useState('Toutes');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const tabs = ['Toutes', 'Spirituel', 'Organisation', 'Social', 'Formation', 'Évangélisation'];

  const filteredAnnouncements = activeTab === 'Toutes' 
    ? announcements 
    : announcements.filter(a => a.category === activeTab);

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium">
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg">Annonces</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-400 active:scale-95 transition-transform">
          <Menu size={24} />
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-[#D97706] pt-6 pb-16 px-6 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Bell size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">Annonces</h2>
            <p className="text-orange-100 text-sm">Restez informés des nouvelles</p>
          </div>
        </div>
      </div>

      {/* Tabs Section (Overlapping banner) */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar p-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#D97706] text-white' 
                    : 'bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab === 'Toutes' && <FileText size={14} />}
                {tab}
              </button>
            ))}
          </div>
          {/* Decorative bottom bar for tabs */}
          <div className="px-3 pb-3">
            <div className="h-2 bg-[#CBD5E1] dark:bg-slate-700 rounded-full w-full opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="px-4 mt-6 space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            Aucune annonce dans cette catégorie.
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedAnnouncement(item)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* Priority Badge */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.isUrgent ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${item.isUrgent ? 'bg-red-600' : 'bg-blue-600'}`}></div>
                    {item.isUrgent ? 'Urgent' : 'Normal'}
                  </div>
                  {/* Category Badge */}
                  <div className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
              </div>
              
              <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 text-base mb-2">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                {item.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium">
                  <CalendarIcon size={14} />
                  <span>{item.date}</span>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 italic">
                  Par {item.author}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedAnnouncement.isUrgent ? 'bg-red-600' : 'bg-blue-600'}`}></div>
                <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">Détails de l'annonce</h3>
              </div>
              <button onClick={() => setSelectedAnnouncement(null)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{selectedAnnouncement.category}</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">{selectedAnnouncement.date}</span>
              </div>
              
              <h4 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{selectedAnnouncement.title}</h4>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Publié par <span className="font-bold text-slate-700 dark:text-slate-300">{selectedAnnouncement.author}</span>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title: selectedAnnouncement.title,
                        text: selectedAnnouncement.content,
                        url: window.location.href
                      });
                    } catch (err) {
                      console.log('Share failed', err);
                    }
                  }}
                  className="flex items-center gap-2 text-[#D97706] dark:text-orange-400 font-bold text-sm active:scale-95 transition-transform"
                >
                  <Share2 size={16} /> Partager
                </button>
              </div>
              
              <button onClick={() => setSelectedAnnouncement(null)} className="w-full bg-[#1E3A8A] dark:bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 active:scale-95 transition-transform">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
