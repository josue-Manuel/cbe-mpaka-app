import { useState, useEffect } from 'react';
import { Search, Music, ChevronRight, X, Share2, Heart, Play, Pause, Type, Minus, Plus, Maximize, Minimize } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export default function Cantiques() {
  const { cantiques } = useAppData();
  const [search, setSearch] = useState('');
  const [selectedCantique, setSelectedCantique] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [fontSize, setFontSize] = useState(18); // Default font size for lyrics
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Persist favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('cbe_favorites_cantiques');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cbe_favorites_cantiques', JSON.stringify(favorites));
  }, [favorites]);
  
  // Reset playing state when changing cantique
  useEffect(() => {
    setIsPlaying(false);
    setIsFullscreen(false);
  }, [selectedCantique]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const handleShare = async (cantique: any) => {
    try {
      await navigator.share({
        title: `Cantique ${cantique.number}: ${cantique.title}`,
        text: cantique.lyrics,
        url: window.location.href
      });
    } catch (err) {
      console.log('Share failed', err);
    }
  };
  
  const categories = ['Tous', ...Array.from(new Set(cantiques.map(c => c.category)))];
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filtered = cantiques.filter(c => {
    const matchesSearch = (c.title?.toLowerCase() || '').includes(search.toLowerCase()) || (c.number || '').includes(search);
    const matchesTab = activeTab === 'all' || favorites.includes(c.id);
    const matchesCategory = selectedCategory === 'Tous' || c.category === selectedCategory;
    return matchesSearch && matchesTab && matchesCategory;
  });

  const renderLyrics = (text: string) => {
    const blocks = text.split('\n\n');
    return blocks.map((block, index) => {
      const isRefrain = block.toLowerCase().includes('[refrain]');
      const titleMatch = block.match(/\[(.*?)\]/);
      const title = titleMatch ? titleMatch[1] : '';
      const cleanBlock = block.replace(/\[(.*?)\]\n?/g, '');

      return (
        <div key={index} className={`mb-6 text-left ${isRefrain ? 'pl-4 border-l-4 border-[#2563EB] dark:border-blue-500 italic bg-blue-50/50 dark:bg-blue-900/20 py-3 pr-3 rounded-r-xl' : ''}`}>
          {title && <div className={`text-sm font-bold mb-2 ${isRefrain ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>{title}</div>}
          <div className="whitespace-pre-wrap leading-relaxed">{cleanBlock.trim()}</div>
        </div>
      );
    });
  };

  return (
    <div className="p-4 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-400 mb-2">Cantiques</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Louez l'Éternel avec des chants d'allégresse.</p>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          className="w-full bg-white dark:bg-slate-800 pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#2563EB] dark:focus:border-blue-500 shadow-sm dark:text-white"
          placeholder="Chercher par titre ou numéro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl mb-4">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-[#1E3A8A] dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          Tous les chants
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'favorites' ? 'bg-white dark:bg-slate-700 text-[#1E3A8A] dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Heart size={14} className={activeTab === 'favorites' ? "fill-current" : ""} /> Favoris
        </button>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-1">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category 
                ? 'bg-[#1E3A8A] dark:bg-blue-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(cantique => (
            <div 
              key={cantique.id} 
              onClick={() => setSelectedCantique(cantique)}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center relative">
                  <span className="text-[#2563EB] dark:text-blue-400 font-bold text-lg">{cantique.number}</span>
                  {favorites.includes(cantique.id) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                      <Heart size={8} className="text-white fill-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{cantique.title}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                    <Music size={12} /> {cantique.category}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 dark:text-slate-600" />
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Music size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Aucun cantique trouvé.</p>
          </div>
        )}
      </div>

      {/* Lyrics Modal */}
      {selectedCantique && (
        <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center ${isFullscreen ? '' : 'sm:p-4'}`}>
          <div className={`bg-white dark:bg-slate-900 flex flex-col transition-all duration-300 ${isFullscreen ? 'w-full h-full p-6 sm:p-8' : 'rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh]'}`}>
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <span className="text-[#2563EB] dark:text-blue-400 font-bold">{selectedCantique.number}</span>
                </div>
                <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 text-xl line-clamp-1 pr-2">{selectedCantique.title}</h3>
              </div>
              <button onClick={() => setSelectedCantique(null)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95 shrink-0"><X size={18} /></button>
            </div>
            
            {/* Toolbar: Audio & Font Size */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl mb-4 shrink-0 border border-slate-100 dark:border-slate-700 overflow-x-auto hide-scrollbar gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors shrink-0 ${isPlaying ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm'}`}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Lecture...' : 'Mélodie'}
              </button>
              
              <div className="flex items-center gap-1 shrink-0">
                <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-1 rounded-lg shadow-sm mr-1">
                  <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95"><Minus size={16} /></button>
                  <Type size={16} className="text-slate-400 mx-1" />
                  <button onClick={() => setFontSize(Math.min(28, fontSize + 2))} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95"><Plus size={16} /></button>
                </div>
                
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95"
                >
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar">
              <div className={`bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 min-h-full ${isFullscreen ? 'max-w-3xl mx-auto w-full' : ''}`}>
                <div 
                  className="text-slate-800 dark:text-slate-200 font-serif transition-all duration-200"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {renderLyrics(selectedCantique.lyrics)}
                </div>
              </div>
            </div>
              
            {!isFullscreen && (
              <div className="flex gap-3 shrink-0">
                <button 
                  onClick={() => toggleFavorite(selectedCantique.id)}
                  className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                    favorites.includes(selectedCantique.id) ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30' : 'bg-[#1E3A8A] dark:bg-blue-600 text-white'
                  }`}
                >
                  <Heart size={18} className={favorites.includes(selectedCantique.id) ? "fill-current" : ""} /> 
                  {favorites.includes(selectedCantique.id) ? 'Favori' : 'Favoris'}
                </button>
                <button 
                  onClick={() => handleShare(selectedCantique)}
                  className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Share2 size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
