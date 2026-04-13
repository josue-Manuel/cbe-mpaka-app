import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, ChevronLeft, ShieldCheck, X, Mail, Calendar } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useAppData } from '../context/AppDataContext';
import { MemberFunction, MemberGender } from '../types/profile';

export default function ProfileEdit() {
  const { profile, createProfile, updateProfile } = useProfile();
  const { addMember, updateMember, members } = useAppData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    gender: (profile?.gender || 'M') as MemberGender,
    phone: profile?.phone || '',
    email: profile?.email || '',
    birthDate: profile?.birthDate || '',
    function: (profile?.function || 'Membre') as MemberFunction,
    photoUrl: profile?.photoUrl || '',
    privacyAccepted: profile?.privacyAccepted || false,
  });

  const functions: MemberFunction[] = [
    'Membre', 'Responsable', 'Encadreur', 'Diacre'
  ];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAccepted) {
      alert("Veuillez accepter la mention de respect de la vie privée.");
      return;
    }

    setIsLoading(true);
    
    // Sync with AppDataContext members for admin dashboard
    const memberData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      birthDate: formData.birthDate,
      status: 'active' as const,
      role: 'user' as const,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setTimeout(() => {
      if (profile) {
        updateProfile(formData);
        // Update existing member in AppData if found by email or name
        const existingMember = members.find(m => m.email === profile.email || (m.firstName === profile.firstName && m.lastName === profile.lastName));
        if (existingMember) {
          updateMember(existingMember.id, memberData);
        } else {
          addMember(memberData);
        }
      } else {
        createProfile(formData);
        addMember(memberData);
      }
      setIsLoading(false);
      navigate('/app/profile');
    }, 800);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium">
          <ChevronLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg">
          {profile ? 'Modifier le profil' : 'Créer mon profil'}
        </h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>

      <form onSubmit={handleSubmit} className="px-4 mt-6 space-y-6">
        {/* Photo Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-blue-50 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-md flex items-center justify-center text-[#1E3A8A] dark:text-blue-400 overflow-hidden">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <User size={48} />
              )}
            </div>
            {formData.photoUrl ? (
              <button 
                type="button" 
                onClick={() => setFormData({...formData, photoUrl: ''})}
                className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 active:scale-95 transition-transform"
              >
                <X size={14} />
              </button>
            ) : (
              <label className="absolute bottom-0 right-0 bg-[#D9A05B] text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 active:scale-95 transition-transform cursor-pointer">
                <Camera size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
            {isUploading ? 'Chargement...' : 'Photo de profil (optionnelle)'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Prénom</label>
              <input
                required
                className="w-full bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white"
                placeholder="Jean"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Nom</label>
              <input
                required
                className="w-full bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white"
                placeholder="Makosso"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Sexe (Optionnel)</label>
            <div className="flex gap-3">
              {(['M', 'F'] as MemberGender[]).map((g) => (
                <button 
                  key={g} 
                  type="button"
                  onClick={() => setFormData({...formData, gender: g})}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center border transition-colors ${formData.gender === g ? 'bg-[#1E3A8A] dark:bg-blue-600 border-[#1E3A8A] dark:border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}
                >
                  <span className="font-bold">{g === 'M' ? 'Homme' : 'Femme'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center gap-1">
                <Mail size={12} /> Email
              </label>
              <input
                type="email"
                className="w-full bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white"
                placeholder="exemple@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center gap-1">
                <Calendar size={12} /> Date de naissance
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Téléphone (Optionnel)</label>
              <input
                type="tel"
                className="w-full bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white"
                placeholder="+242 00 000 00 00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Fonction</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] appearance-none dark:text-white"
                value={formData.function}
                onChange={(e) => setFormData({ ...formData, function: e.target.value as MemberFunction })}
                required
              >
                {functions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-2">
            <div className="flex items-start gap-3">
              <div className="relative flex items-center mt-0.5 shrink-0">
                <input 
                  type="checkbox" 
                  id="privacy" 
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 dark:border-slate-600 checked:border-[#1E3A8A] dark:checked:border-blue-600 checked:bg-[#1E3A8A] dark:checked:bg-blue-600 transition-all"
                  required
                />
                <ShieldCheck className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" />
              </div>
              <label htmlFor="privacy" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                J'accepte que mes informations soient stockées localement sur cet appareil pour personnaliser mon expérience. 
                <span className="text-[#1E3A8A] dark:text-blue-400 font-bold block mt-1">Respect de la vie privée garanti.</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#1E3A8A] dark:bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70 shadow-lg shadow-blue-900/20"
          >
            <Save size={20} />
            {isLoading ? 'Sauvegarde...' : (profile ? 'Sauvegarder les modifications' : 'Créer mon identité CBE')}
          </button>
          <p className="text-center text-[#D9A05B] mt-6 font-medium italic text-sm">
            « CBE Dieu le veut, Cbeiste tiens bon ! »
          </p>
        </div>
      </form>
    </div>
  );
}
