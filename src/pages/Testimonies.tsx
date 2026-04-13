import { ChevronLeft, Sparkles, MessageSquare, Heart, Plus, Search, Filter, Share2, Send, Camera, X, CheckCircle2, User, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useProfile } from '../context/ProfileContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonies() {
  const navigate = useNavigate();
  const { testimonies, likeTestimony, addTestimony } = useAppData();
  const { profile } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Guérison',
    content: '',
    imageUrl: '',
    isAnonymous: false
  });

  const categories = ['Tous', 'Guérison', 'Provision', 'Protection', 'Délivrance', 'Autre'];
  const formCategories = ['Guérison', 'Provision', 'Protection', 'Délivrance', 'Autre'];
  
  const approvedTestimonies = testimonies.filter(t => t.status === 'approved');
  
  const filteredTestimonies = approvedTestimonies.filter(t => {
    const matchesSearch = (t.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (t.content?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (t.author?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Tous' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.content.trim() && formData.title.trim()) {
      addTestimony({
        author: profile ? `${profile.firstName} ${profile.lastName}` : 'Anonyme',
        date: new Date().toLocaleDateString('fr-FR'),
        title: formData.title,
        category: formData.category,
        content: formData.content,
        imageUrl: formData.imageUrl,
        isAnonymous: formData.isAnonymous
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setShowForm(false);
        setFormData({
          title: '',
          category: 'Guérison',
          content: '',
          imageUrl: '',
          isAnonymous: false
        });
      }, 2500);
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#1E3A8A] pt-8 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <button onClick={() => showForm ? setShowForm(false) : navigate(-1)} className="flex items-center text-blue-100 mb-4 hover:text-white transition-colors">
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <h1 className="text-2xl font-bold text-white mb-2">
            {showForm ? 'Mon Témoignage' : 'Témoignages'}
          </h1>
          <p className="text-blue-100 text-sm max-w-xs">
            {showForm 
              ? 'Partagez les merveilles que Dieu a accomplies dans votre vie.' 
              : 'Découvrez les merveilles que Dieu accomplit au milieu de nous.'}
          </p>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6 relative z-10">
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {isSubmitted ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow-xl border border-slate-100 dark:border-slate-700">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-slate-800 dark:text-white font-bold text-2xl mb-3">Gloire à Dieu !</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Votre témoignage a été envoyé avec succès. Il sera examiné par les responsables avant d'être publié.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-sm">
                    <Sparkles size={18} />
                    <span>Mise à jour de la liste...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-[#FFFAF0] dark:bg-amber-900/10 border border-[#FDE68A] dark:border-amber-900/20 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                      « Ils l'ont vaincu à cause du sang de l'agneau et à cause de la parole de leur témoignage » (Apocalypse 12:11).
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block ml-1">Titre</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: Une guérison miraculeuse"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block ml-1">Catégorie</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {formCategories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData({...formData, category: cat})}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                              formData.category === cat 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block ml-1">Votre récit</label>
                      <textarea
                        required
                        rows={6}
                        className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 resize-none dark:text-white"
                        placeholder="Racontez comment Dieu a agi..."
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                      ></textarea>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block ml-1">Image (Optionnel)</label>
                      {formData.imageUrl ? (
                        <div className="relative rounded-2xl overflow-hidden group">
                          <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, imageUrl: ''})}
                            className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-800 p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                            <Camera size={24} />
                          </div>
                          <span className="text-sm text-slate-500">{isUploading ? 'Chargement...' : 'Ajouter une photo'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isAnonymous ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                          {formData.isAnonymous ? <UserX size={20} /> : <User size={20} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Témoigner anonymement</h4>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, isAnonymous: !formData.isAnonymous})}
                        className={`w-12 h-6 rounded-full relative transition-colors ${formData.isAnonymous ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isAnonymous ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1E3A8A] dark:bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-900/20"
                  >
                    <Send size={20} />
                    Envoyer mon témoignage
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un témoignage..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 pl-11 pr-4 py-3.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat 
                          ? 'bg-[#1E3A8A] text-white shadow-md' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Testimonies List */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredTestimonies.map((testimony) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={testimony.id} 
                      className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {testimony.isAnonymous ? '?' : (testimony.author?.charAt(0) || 'M')}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                              {testimony.isAnonymous ? 'Membre Anonyme' : testimony.author}
                            </h3>
                            <p className="text-[10px] text-slate-400 uppercase font-medium">{testimony.date}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-lg uppercase">
                          {testimony.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-800 dark:text-white mb-2">{testimony.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {testimony.content}
                      </p>

                      {testimony.imageUrl && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                          <img src={testimony.imageUrl} alt="Témoignage" className="w-full h-48 object-cover" />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => likeTestimony(testimony.id)}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors"
                          >
                            <Heart size={18} className={testimony.likes > 0 ? 'fill-rose-500 text-rose-500' : ''} />
                            <span className="text-xs font-bold">{testimony.likes}</span>
                          </button>
                          <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors">
                            <Share2 size={18} />
                            <span className="text-xs font-bold">Partager</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Sparkles size={14} />
                          <span className="text-[10px] font-bold uppercase">Gloire à Dieu</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredTestimonies.length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search size={32} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Aucun témoignage trouvé.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      {!showForm && (
        <button 
          onClick={() => setShowForm(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#1E3A8A] text-white rounded-full shadow-lg shadow-blue-900/20 flex items-center justify-center active:scale-95 transition-transform z-40"
        >
          <Plus size={28} />
        </button>
      )}
    </div>
  );
}
