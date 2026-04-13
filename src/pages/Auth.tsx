import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { MemberGender } from '../types/profile';
import { Lock, LogIn } from 'lucide-react';

export default function Auth() {
  const { createProfile, login, user, profile, isLoading } = useProfile();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'Homme'
  });

  useEffect(() => {
    if (!isLoading && user && profile) {
      navigate('/app');
    }
  }, [user, profile, isLoading, navigate]);

  const handleGoogleLogin = async () => {
    await login();
    // After login, if profile exists, useEffect will navigate to /app
    // If not, we stay here and the UI will show the registration form (step 2)
  };

  const handleRegister = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      alert("Information manquante\nVeuillez remplir tous les champs obligatoires.");
      return;
    }
    
    await createProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      gender: (form.gender === 'Homme' ? 'M' : 'F') as MemberGender,
      group: 'Jeunesse', // Default
      function: 'Membre', // Default
      privacyAccepted: true,
      status: 'pending' // Set to pending
    });
    
    navigate('/app');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4">
              <LogIn size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">Identification</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mt-2">Veuillez vous connecter pour continuer.</p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center justify-center gap-3 shadow-sm transition-transform active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" alt="Google" className="w-6 h-6" />
            <span className="text-slate-700 dark:text-slate-200 font-bold">Se connecter avec Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">CBE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bienvenue</h1>
          <p className="text-slate-500 dark:text-slate-400">Rejoignez la communauté Mpaka</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Prénom</label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                placeholder="Jean"
                value={form.firstName}
                onChange={e => setForm({...form, firstName: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Nom</label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                placeholder="Makosso"
                value={form.lastName}
                onChange={e => setForm({...form, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Téléphone</label>
            <input 
              className="w-full bg-slate-50 dark:bg-slate-800 p-4 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
              placeholder="06 000 00 00"
              type="tel"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
            />
          </div>

          <div className="flex gap-3 mt-2">
            {['Homme', 'Femme'].map((g) => (
              <button 
                key={g} 
                onClick={() => setForm({...form, gender: g})}
                className={`flex-1 p-3 rounded-xl flex items-center justify-center border transition-colors ${form.gender === g ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
              >
                <span className={`font-bold ${form.gender === g ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>{g}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleRegister}
            className="w-full bg-blue-600 p-4 rounded-xl flex items-center justify-center mt-6 shadow-lg shadow-blue-200/50 transition-transform active:scale-95"
          >
            <span className="text-white font-bold text-lg">Commencer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
