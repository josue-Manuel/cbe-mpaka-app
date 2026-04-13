import { ChevronLeft, Menu, Book, Users, FileText, Image as ImageIcon, Clock, X, Search, Headphones, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Archives() {
  const navigate = useNavigate();
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (isOpen: boolean) => void }>();
  const { timelineEvents, archiveArticles, reports, historicalPhotos, archiveAudios } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'history', title: 'Histoire', icon: Book, color: 'bg-blue-600' },
    { id: 'bureaus', title: 'Anciens Bureaux', icon: Users, color: 'bg-indigo-600' },
    { id: 'reports', title: 'Rapports', icon: FileText, color: 'bg-emerald-600' },
    { id: 'photos', title: 'Photos Historiques', icon: ImageIcon, color: 'bg-fuchsia-600' },
    { id: 'timeline', title: 'Événements Marquants', icon: Clock, color: 'bg-amber-600' },
    { id: 'audios', title: 'Archives Audio', icon: Headphones, color: 'bg-purple-600' },
    { id: 'contributions', title: 'Contribuer', icon: MessageSquare, color: 'bg-rose-600' },
  ];

  // Simple "On This Day" logic - just pick a random event or one matching current month/day if possible
  const today = new Date();
  const onThisDay = timelineEvents.length > 0 ? timelineEvents[Math.floor(Math.random() * timelineEvents.length)] : null;

  const allItems = [
    ...archiveArticles.map(a => ({ ...a, type: 'article' })),
    ...reports.map(r => ({ ...r, type: 'report' })),
    ...historicalPhotos.map(p => ({ ...p, type: 'photo' })),
    ...timelineEvents.map(e => ({ ...e, type: 'timeline' })),
    ...archiveAudios.map(au => ({ ...au, type: 'audio' })),
  ];

  const filteredItems = searchQuery.trim() === '' 
    ? [] 
    : allItems.filter(item => 
        ((item as any).title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        ((item as any).description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        ((item as any).summary?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium">
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg">Archives</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-400 active:scale-95 transition-transform">
          <Menu size={24} />
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-[#1E3A8A] pt-6 pb-20 px-6 relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Book size={24} className="text-[#D9A05B]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">Notre Histoire</h2>
            <p className="text-blue-100 text-sm">Connaître notre histoire renforce notre communion.</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher dans les archives..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-blue-200 outline-none focus:bg-white/20 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="px-4 -mt-6 mb-6 relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Résultats de recherche ({filteredItems.length})</h3>
            </div>
            <div className="max-h-64 overflow-y-auto p-2 space-y-2">
              {filteredItems.map((item: any) => (
                <button 
                  key={item.id} 
                  onClick={() => navigate(`/app/archives/${item.type === 'timeline' ? 'timeline' : item.type + 's'}`)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    {item.type === 'photo' ? <ImageIcon size={16} /> : item.type === 'audio' ? <Headphones size={16} /> : <FileText size={16} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase">{item.type}</p>
                  </div>
                </button>
              ))}
              {filteredItems.length === 0 && <p className="text-center py-4 text-slate-500 text-xs italic">Aucun résultat trouvé.</p>}
            </div>
          </div>
        </div>
      )}

      {/* On This Day Section */}
      {!searchQuery && onThisDay && (
        <div className="px-4 -mt-8 mb-6 relative z-10">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-amber-100 dark:border-amber-900/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Ce jour-là</span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[10px] font-bold text-slate-500">{onThisDay.year}</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{onThisDay.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{onThisDay.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className={`px-4 ${!searchQuery && !onThisDay ? '-mt-8' : ''} relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4`}>
        {categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => navigate(`/app/archives/${cat.id}`)}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 active:scale-[0.98] transition-transform"
          >
            <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center text-white`}>
              <cat.icon size={24} />
            </div>
            <span className="font-bold text-slate-800 dark:text-white">{cat.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
