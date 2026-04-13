import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronLeft, Menu, X, Download, FileText, BookOpen, Headphones, Music, Send, Upload, ImageIcon } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArchivesCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (isOpen: boolean) => void }>();
  const { history, bureaus, reports, historicalPhotos, timelineEvents, archiveAudios, addArchiveContribution } = useAppData();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [contributionForm, setContributionForm] = useState({ author: '', type: 'photo' as 'photo' | 'testimony' | 'document', content: '', fileUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmitContribution = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      addArchiveContribution({
        ...contributionForm,
        date: new Date().toLocaleDateString('fr-FR')
      });
      setShowSuccess(true);
      setContributionForm({ author: '', type: 'photo', content: '', fileUrl: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (categoryId) {
      case 'history': 
        return history ? (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Histoire de la Sous-section</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Fondée le : {history.foundationDate}</p>
            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">{history.content}</p>
              <h3 className="font-bold text-lg mb-2">Objectifs spirituels</h3>
              <p className="mb-4">{history.spiritualGoals}</p>
              <h3 className="font-bold text-lg mb-2">Moments marquants</h3>
              <p>{history.milestones}</p>
            </div>
          </div>
        ) : <div>Aucune histoire disponible.</div>;
      case 'bureaus': 
        return (
          <div className="space-y-4">
            {bureaus.map(bureau => (
              <div key={bureau.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Bureau {bureau.yearRange}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{bureau.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-bold">Leader :</span> {bureau.leader}</p>
                  <p><span className="font-bold">Vice leader :</span> {bureau.viceLeader}</p>
                  <p><span className="font-bold">Secrétaire générale :</span> {bureau.secretary}</p>
                  <p><span className="font-bold">Secrétaire générale adjointe :</span> {bureau.deputySecretary}</p>
                  <p><span className="font-bold">Trésorière générale :</span> {bureau.treasurer}</p>
                  <p><span className="font-bold">Trésorier adjoint :</span> {bureau.deputyTreasurer}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'reports': 
        return (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{report.title}</h4>
                      <p className="text-xs text-slate-500">{report.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={report.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Lire le PDF"
                    >
                      <BookOpen size={18} />
                    </a>
                    <a 
                      href={report.fileUrl} 
                      download 
                      className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'photos': 
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {historicalPhotos.map(photo => (
              <div 
                key={photo.id} 
                className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform"
                onClick={() => setSelectedPhoto(photo.imageUrl)}
              >
                <img src={photo.imageUrl} alt={photo.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{photo.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{photo.year}</p>
              </div>
            ))}
          </div>
        );
      case 'timeline': 
        return (
          <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-700 ml-4 pl-6">
            {timelineEvents.sort((a, b) => parseInt(a.year) - parseInt(b.year)).map(event => (
              <div key={event.id} className="relative">
                <div className="absolute -left-[33px] top-1 w-4 h-4 bg-[#1E3A8A] rounded-full"></div>
                <h4 className="font-bold text-slate-800 dark:text-white">{event.year} - {event.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{event.description}</p>
              </div>
            ))}
          </div>
        );
      case 'audios':
        return (
          <div className="space-y-4">
            {archiveAudios.map(audio => (
              <div key={audio.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600">
                    <Headphones size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{audio.title}</h4>
                    <p className="text-xs text-slate-500">{audio.category} • {audio.date}</p>
                  </div>
                </div>
                <audio controls className="w-full h-10">
                  <source src={audio.audioUrl} />
                  Votre navigateur ne supporte pas l'élément audio.
                </audio>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{audio.description}</p>
              </div>
            ))}
            {archiveAudios.length === 0 && <p className="text-center py-12 text-slate-500 italic">Aucun enregistrement audio pour le moment.</p>}
          </div>
        );
      case 'contributions':
        return (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Partagez l'Histoire</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Vous possédez des photos, des témoignages ou des documents historiques ? Partagez-les avec nous.</p>
              
              <form onSubmit={handleSubmitContribution} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Votre Nom</label>
                  <input required type="text" value={contributionForm.author} onChange={e => setContributionForm({...contributionForm, author: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 dark:text-white" placeholder="Nom et Prénom" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Type de contribution</label>
                  <select value={contributionForm.type} onChange={e => setContributionForm({...contributionForm, type: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 dark:text-white">
                    <option value="photo">Photo historique</option>
                    <option value="testimony">Témoignage écrit</option>
                    <option value="document">Document d'archive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description / Témoignage</label>
                  <textarea required rows={4} value={contributionForm.content} onChange={e => setContributionForm({...contributionForm, content: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 resize-none dark:text-white" placeholder="Racontez-nous l'histoire derrière ce partage..."></textarea>
                </div>
                {contributionForm.type !== 'testimony' && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fichier</label>
                    <label className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                      <Upload size={20} className="text-rose-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {contributionForm.fileUrl ? 'Fichier sélectionné' : 'Choisir un fichier'}
                      </span>
                      <input 
                        type="file" 
                        accept={contributionForm.type === 'photo' ? 'image/*' : '*'} 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await handleFileUpload(file);
                            setContributionForm({...contributionForm, fileUrl: base64});
                          }
                        }} 
                      />
                    </label>
                  </div>
                )}
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi en cours...' : (
                    <>
                      <Send size={18} />
                      Envoyer ma contribution
                    </>
                  )}
                </button>
              </form>

              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-center text-sm font-bold"
                >
                  Merci ! Votre contribution a été envoyée pour validation.
                </motion.div>
              )}
            </div>
          </div>
        );

      default: return <div>Catégorie non trouvée</div>;
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => navigate('/app/archives')} className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium">
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg capitalize">
          {categoryId === 'history' ? 'Histoire' : 
           categoryId === 'bureaus' ? 'Anciens Bureaux' :
           categoryId === 'reports' ? 'Rapports' :
           categoryId === 'photos' ? 'Photos Historiques' :
           categoryId === 'audios' ? 'Archives Audio' :
           categoryId === 'contributions' ? 'Contribuer' :
           categoryId === 'timeline' ? 'Timeline' : categoryId}
        </h1>
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-400 active:scale-95 transition-transform">
          <Menu size={24} />
        </button>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>

      {/* Image Zoom Overlay */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full backdrop-blur-md"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedPhoto} 
              alt="Agrandissement" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
