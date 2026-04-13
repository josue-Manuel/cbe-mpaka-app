import { ArrowLeft, Calendar, BookOpen, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function MeditationHistory() {
  const navigate = useNavigate();
  const { meditations, dailyVerses } = useAppData();
  const [selectedVerse, setSelectedVerse] = useState<any>(null);

  // Combine dailyVerses and meditations, removing duplicates by date
  const allVerses = [...dailyVerses, ...meditations].filter((v, i, a) => a.findIndex(t => t.date === v.date) === i);

  // Sort by date descending
  const sortedVerses = allVerses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#1E3A8A] dark:bg-slate-950 pt-6 pb-12 px-4 rounded-b-[32px]">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Historique des Versets</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 space-y-4">
        {sortedVerses.map((verse) => (
          <div 
            key={verse.id} 
            onClick={() => setSelectedVerse(verse)}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 items-center cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-[#D9A05B]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{verse.date}</p>
              <h4 className="font-bold text-[#1E3A8A] dark:text-blue-400">{verse.reference}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic line-clamp-1">« {verse.text} »</p>
            </div>
          </div>
        ))}
        {sortedVerses.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 mt-8">Aucun historique disponible.</p>
        )}
      </div>

      {/* Modal for viewing full verse */}
      {selectedVerse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <BookOpen size={20} className="text-[#D9A05B]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 text-lg">{selectedVerse.reference}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedVerse.date}</p>
                </div>
              </div>
              <button onClick={() => setSelectedVerse(null)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <span className="absolute -top-4 -left-2 text-4xl text-slate-100 dark:text-slate-700 font-serif">"</span>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed italic relative z-10 px-4">
                  {selectedVerse.text}
                </p>
                <span className="absolute -bottom-6 -right-2 text-4xl text-slate-100 dark:text-slate-700 font-serif">"</span>
              </div>

              {selectedVerse.exhortation && (
                <>
                  <div className="h-px bg-slate-100 dark:bg-slate-700"></div>
                  <div>
                    <h4 className="font-bold text-[#1E3A8A] dark:text-blue-400 mb-2 text-sm">Exhortation</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {selectedVerse.exhortation}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
