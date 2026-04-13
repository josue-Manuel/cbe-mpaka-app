import { User, LogOut, Edit3, Heart, Phone, ChevronLeft, Camera, X, AlertTriangle, Bookmark, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useAppData } from '../context/AppDataContext';
import { useState } from 'react';

export default function Profile() {
  const { profile, deleteProfile } = useProfile();
  const { meditations, testimonies } = useAppData();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!profile) {
    return (
      <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-200 dark:text-blue-800 mb-4">
          <User size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-400">Aucun profil trouvé</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Créez votre identité spirituelle pour rejoindre la communauté.</p>
        </div>
        <button 
          onClick={() => navigate('/app/profile/edit')}
          className="bg-[#1E3A8A] dark:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-transform"
        >
          Créer mon profil
        </button>
      </div>
    );
  }

  const myTestimonies = testimonies.filter(t => t.author === `${profile.firstName} ${profile.lastName}`);
  const favoriteCount = profile.favoriteMeditations?.length || 0;

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium">
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg">Mon Profil</h1>
        <button onClick={() => navigate('/app/profile/edit')} className="text-[#D9A05B] font-medium flex items-center gap-1">
          <Edit3 size={20} />
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-[#1E3A8A] pt-6 pb-24 px-6 relative flex flex-col items-center rounded-b-[32px]">
        {/* Decorative background elements could go here */}
      </div>

      {/* Profile Info (Overlapping banner) */}
      <div className="px-4 -mt-16 relative z-10 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-lg mb-4 relative">
          <div className="w-full h-full rounded-full bg-[#F1F5F9] dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-600">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#1E3A8A] dark:text-blue-400 text-4xl font-bold">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </span>
            )}
          </div>
          <button 
            onClick={() => navigate('/app/profile/edit')}
            className="absolute bottom-1 right-1 w-8 h-8 bg-[#D9A05B] border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <Camera size={14} />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-400 text-center">{profile.firstName} {profile.lastName}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-blue-50 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {profile.function}
          </span>
        </div>
      </div>

      <div className="px-4 mt-8 space-y-6">
        {/* Spiritual Journey Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Favoris</p>
            <p className="text-xl font-bold text-[#1E3A8A] dark:text-blue-400">{favoriteCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Témoignages</p>
            <p className="text-xl font-bold text-[#D9A05B]">{myTestimonies.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Statut</p>
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">ACTIF</p>
          </div>
        </div>

        {/* Spiritual Message */}
        <div className="bg-[#FFFAF0] dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Heart size={80} className="text-[#D9A05B]" />
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm text-[#D9A05B] shrink-0">
              <Heart size={20} fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-[#D9A05B] text-xs uppercase tracking-wider mb-1">Message du jour</p>
              <p className="text-[#1E3A8A] dark:text-blue-400 font-serif italic text-lg leading-relaxed">
                « Que Dieu te fortifie aujourd’hui 🙏 »
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-lg mb-3 px-1">Informations</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b border-slate-50 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E3A8A] dark:text-blue-400">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Téléphone</p>
                <p className="font-bold text-slate-800 dark:text-white">{profile.phone || 'Non renseigné'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border-b border-slate-50 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E3A8A] dark:text-blue-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Email</p>
                <p className="font-bold text-slate-800 dark:text-white">{profile.email || 'Non renseigné'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border-b border-slate-50 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E3A8A] dark:text-blue-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Date de naissance</p>
                <p className="font-bold text-slate-800 dark:text-white">
                  {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non renseignée'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E3A8A] dark:text-blue-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Sexe</p>
                <p className="font-bold text-slate-800 dark:text-white">
                  {profile.gender === 'M' ? 'Homme' : profile.gender === 'F' ? 'Femme' : 'Non spécifié'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Meditations */}
        {profile.favoriteMeditations && profile.favoriteMeditations.length > 0 && (
          <div>
            <h3 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-lg mb-3 px-1 flex items-center gap-2">
              <Bookmark size={20} />
              Méditations favorites
            </h3>
            <div className="space-y-3">
              {profile.favoriteMeditations.map(id => {
                const med = meditations.find(m => m.id === id);
                if (!med) return null;
                return (
                  <div key={id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{med.date}</p>
                    <h4 className="font-bold text-[#1E3A8A] dark:text-blue-400 mb-2">{med.reference}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic line-clamp-2">« {med.text} »</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
          >
            <LogOut size={20} />
            Déconnexion (Supprimer le profil)
          </button>
          
          <p className="text-center text-[#D9A05B] mt-8 font-medium italic text-sm">
            « CBE Dieu le veut, Cbeiste tiens bon ! »
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">Supprimer votre profil ?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Cette action supprimera définitivement vos données locales sur cet appareil. Vous devrez recréer votre profil pour accéder à nouveau à toutes les fonctionnalités.
              </p>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 py-4 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    deleteProfile();
                    navigate('/app');
                  }}
                  className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

