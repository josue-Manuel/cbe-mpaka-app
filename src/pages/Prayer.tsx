import { useState, FormEvent } from 'react';
import { ChevronLeft, Menu, Heart, Plus, ThumbsUp, X, Send, Lock, Globe } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useProfile } from '../context/ProfileContext';

export default function Prayer() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (isOpen: boolean) => void }>();
  const { prayers, likePrayer, addPrayer, testimonies } = useAppData();

  const [activeTab, setActiveTab] = useState<'prayers' | 'testimonies'>('prayers');
  const categories = ["Toutes", "Santé", "Action de grâce", "Travail", "Famille", "Spirituel"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Spirituel', isUrgent: false, isPrivate: false, isAnonymous: false });

  const filteredPrayers = (activeCategory === 'Toutes' 
    ? prayers 
    : prayers.filter(p => p.category === activeCategory)).filter(p => p.status === 'approved');

  const approvedTestimonies = testimonies.filter(t => t.status === 'approved');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addPrayer({
      ...formData,
      author: formData.isAnonymous ? 'Anonyme' : (profile ? `${profile.firstName} ${profile.lastName}` : 'Anonyme'),
      date: new Date().toLocaleDateString('fr-FR'),
    });
    setShowAddModal(false);
    setFormData({ title: '', content: '', category: 'Spirituel', isUrgent: false, isPrivate: false, isAnonymous: false });
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium">
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg">Communauté</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-400 active:scale-95 transition-transform">
          <Menu size={24} />
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-[#E11D48] pt-6 pb-16 px-6 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">Mur Spirituel</h2>
            <p className="text-rose-100 text-sm">Portons nos fardeaux et nos joies</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-1 flex border border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('prayers')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'prayers' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Prières
          </button>
          <button 
            onClick={() => setActiveTab('testimonies')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'testimonies' ? 'bg-[#D9A05B] text-white shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Témoignages
          </button>
        </div>
      </div>

      {activeTab === 'prayers' ? (
        <>
          {/* Categories Section */}
          <div className="px-4 mt-6">
            <div className="flex overflow-x-auto hide-scrollbar gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-colors ${
                    activeCategory === cat 
                      ? 'bg-[#E11D48] text-white' 
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Prayer Request Button */}
          <div className="px-4 mt-6">
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-full bg-[#1E3A8A] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              <Plus size={18} /> Soumettre une requête
            </button>
          </div>

          {/* All Prayers List */}
          <div className="px-4 mt-6 space-y-4">
            {filteredPrayers.length === 0 ? (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                Aucune requête de prière dans cette catégorie.
              </div>
            ) : (
              filteredPrayers.map((prayer) => (
                <div key={prayer.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-white text-sm">{prayer.author}</span>
                      {prayer.isUrgent && (
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Urgent</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{prayer.date}</span>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-medium inline-block mb-2">
                    {prayer.category}
                  </div>
                  
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {prayer.content}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
                    <button 
                      onClick={() => likePrayer(prayer.id)}
                      className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#E11D48] dark:hover:text-rose-400 transition-colors active:scale-95"
                    >
                      <ThumbsUp size={16} />
                      <span className="text-xs font-medium">Je prie pour ça ({prayer.likes})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="px-4 mt-6 space-y-4">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6">
            <p className="text-orange-800 text-xs font-medium leading-relaxed">
              « Ils l'ont vaincu à cause du sang de l'agneau et à cause de la parole de leur témoignage »
            </p>
          </div>
          
          {approvedTestimonies.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              Aucun témoignage partagé pour le moment.
            </div>
          ) : (
            approvedTestimonies.map((testimony) => (
              <div key={testimony.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5">
                  <Globe size={40} className="text-[#D9A05B]" />
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-[#1E3A8A] dark:text-blue-400">{testimony.author}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{testimony.date}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
                  « {testimony.content} »
                </p>
              </div>
            ))
          )}
          
          <button 
            onClick={() => navigate('/app/testimonies')}
            className="w-full bg-[#D9A05B] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform mt-6"
          >
            <Plus size={18} /> Partager mon témoignage
          </button>
        </div>
      )}

      {/* Add Prayer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">Nouvelle requête</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre (Optionnel)</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white" placeholder="Ex: Pour ma famille" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Catégorie</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] text-sm dark:text-white">
                    {categories.filter(c => c !== 'Toutes').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Visibilité</label>
                  <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isPrivate: false})}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${!formData.isPrivate ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1E3A8A] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                      <Globe size={14} /> <span className="text-[10px] font-bold">Public</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isPrivate: true})}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${formData.isPrivate ? 'bg-white dark:bg-slate-700 shadow-sm text-orange-600' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                      <Lock size={14} /> <span className="text-[10px] font-bold">Privé</span>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Votre requête</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white resize-none" placeholder="Décrivez votre sujet de prière..."></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="urgent" checked={formData.isUrgent} onChange={e => setFormData({...formData, isUrgent: e.target.checked})} className="w-4 h-4 text-[#E11D48] border-slate-300 rounded focus:ring-[#E11D48]" />
                <label htmlFor="urgent" className="text-sm font-medium text-slate-700 dark:text-slate-300">Marquer comme urgent</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="anonymous" checked={formData.isAnonymous} onChange={e => setFormData({...formData, isAnonymous: e.target.checked})} className="w-4 h-4 text-[#1E3A8A] border-slate-300 rounded focus:ring-[#1E3A8A]" />
                <label htmlFor="anonymous" className="text-sm font-medium text-slate-700 dark:text-slate-300">Rester anonyme</label>
              </div>
              
              {formData.isPrivate && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl flex items-start gap-2 border border-orange-100 dark:border-orange-800">
                  <Lock size={16} className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-orange-800 dark:text-orange-300 leading-tight">
                    Cette requête sera envoyée confidentiellement au bureau de la sous-section et ne sera pas affichée sur le mur public.
                  </p>
                </div>
              )}

              <button type="submit" className="w-full bg-[#1E3A8A] text-white py-4 rounded-xl font-bold mt-2 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Send size={18} /> {formData.isPrivate ? 'Envoyer au bureau' : 'Soumettre la requête'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
