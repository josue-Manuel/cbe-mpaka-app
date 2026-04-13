import { useState, useMemo } from 'react';
import { ChevronLeft, Menu, Image as ImageIcon, Video, X, Heart, Download, Sparkles, Calendar, Share2 } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAppData, GalleryEvent, GalleryMedia } from '../context/AppDataContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const navigate = useNavigate();
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (isOpen: boolean) => void }>();
  const { galleryEvents, likeMedia } = useAppData();
  
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<GalleryMedia | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('Tous');

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const handleShare = async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Regarde cette photo de la CBE Mpaka !',
          url: url,
        });
      } catch (error) {
        console.log('Erreur de partage', error);
      }
    } else {
      alert("Le partage n'est pas supporté sur ce navigateur.");
    }
  };

  const years = useMemo(() => {
    const extractedYears = galleryEvents.map(e => {
      const match = e.date.match(/\d{4}/);
      return match ? match[0] : null;
    }).filter(Boolean) as string[];
    return ['Tous', ...Array.from(new Set(extractedYears)).sort().reverse()];
  }, [galleryEvents]);

  const filteredEvents = useMemo(() => {
    if (selectedYear === 'Tous') return galleryEvents;
    return galleryEvents.filter(e => e.date.includes(selectedYear));
  }, [galleryEvents, selectedYear]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!selectedEvent || !lightboxMedia) return;
    const currentIndex = selectedEvent.media.findIndex(m => m.id === lightboxMedia.id);
    if (currentIndex === -1) return;

    if (direction === 'left' && currentIndex < selectedEvent.media.length - 1) {
      setLightboxMedia(selectedEvent.media[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setLightboxMedia(selectedEvent.media[currentIndex - 1]);
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button 
          onClick={() => selectedEvent ? setSelectedEvent(null) : navigate(-1)} 
          className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium"
        >
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg">Galerie</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-400 active:scale-95 transition-transform">
          <Menu size={24} />
        </button>
      </div>

      {!selectedEvent ? (
        <>
          {/* Header Banner */}
          <div className="bg-[#1E3A8A] pt-6 pb-16 px-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <ImageIcon size={24} className="text-[#D9A05B]" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">Souvenirs</h2>
                <p className="text-blue-100 text-sm flex items-center gap-1">
                  Ce que Dieu fait parmi nous <Sparkles size={12} className="text-[#D9A05B]" />
                </p>
              </div>
            </div>
          </div>

          {/* Year Filters */}
          <div className="px-4 -mt-8 relative z-10 mb-6 flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  selectedYear === year 
                    ? 'bg-[#D9A05B] text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="px-4 space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm border border-slate-100 dark:border-slate-700">
                <ImageIcon size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Aucun souvenir publié pour le moment.</p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="h-40 bg-slate-200 dark:bg-slate-700 relative">
                    {event.media.length > 0 ? (
                      <img src={event.media[0].url} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg leading-tight mb-1">{event.title}</h3>
                      <div className="flex items-center gap-3 text-xs font-medium opacity-90">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                        <span className="flex items-center gap-1"><ImageIcon size={12} /> {event.media.filter(m => m.type === 'photo').length}</span>
                        <span className="flex items-center gap-1"><Video size={12} /> {event.media.filter(m => m.type === 'video').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Event Detail View */}
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-400 mb-1">{selectedEvent.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <Calendar size={14} /> {selectedEvent.date} • {selectedEvent.location}
              </p>
            </div>

            {selectedEvent.media.length === 0 ? (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                Aucun média dans cet événement.
              </div>
            ) : (
              <div className="columns-2 gap-2 space-y-2">
                {selectedEvent.media.map(media => (
                  <div 
                    key={media.id}
                    onClick={() => setLightboxMedia(media)}
                    className="bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden relative active:scale-95 transition-transform cursor-pointer break-inside-avoid"
                  >
                    <img src={media.url} alt="" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                    {media.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Video size={16} className="text-[#1E3A8A]" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxMedia && selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
              <button onClick={() => setLightboxMedia(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95">
                <X size={24} />
              </button>
              <div className="flex gap-2">
                <button onClick={() => handleShare(lightboxMedia.url, selectedEvent.title)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95">
                  <Share2 size={20} />
                </button>
                <button onClick={() => handleDownload(lightboxMedia.url)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95">
                  <Download size={20} />
                </button>
              </div>
            </div>

            {/* Media Viewer */}
            <motion.div 
              className="flex-1 flex items-center justify-center overflow-hidden relative touch-none"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000 || offset.x < -50) {
                  handleSwipe('left');
                } else if (swipe > 10000 || offset.x > 50) {
                  handleSwipe('right');
                }
              }}
            >
              {lightboxMedia.type === 'photo' ? (
                <motion.img 
                  key={lightboxMedia.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={lightboxMedia.url} 
                  alt="Fullscreen" 
                  className="max-w-full max-h-full object-contain pointer-events-none" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="text-white text-center">
                  <Video size={48} className="mx-auto mb-4 opacity-50" />
                  <p>La lecture vidéo n'est pas supportée dans cette démo.</p>
                </div>
              )}
            </motion.div>

            {/* Lightbox Footer */}
            <div className="p-6 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => likeMedia(selectedEvent.id, lightboxMedia.id)}
                  className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full active:scale-95 transition-transform"
                >
                  <Heart size={20} className={lightboxMedia.likes > 0 ? "fill-[#E11D48] text-[#E11D48]" : ""} />
                  <span className="font-medium">Amen 🙏 ({lightboxMedia.likes})</span>
                </button>
                <div className="flex flex-col items-end">
                  <p className="text-white/50 text-xs italic">CBE Dieu le veut !</p>
                  <p className="text-white/30 text-[10px] mt-1">
                    {selectedEvent.media.findIndex(m => m.id === lightboxMedia.id) + 1} / {selectedEvent.media.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
