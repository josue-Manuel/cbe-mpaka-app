import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { MemberGender } from '../types/profile';
import { LogIn, Mail, User as UserIcon, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const { createProfile, login, loginWithEmail, registerWithEmail, user, profile, isLoading } = useProfile();
  const navigate = useNavigate();
  
  const [authMode, setAuthMode] = useState<'choice' | 'email_login' | 'email_register' | 'profile_setup'>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', gender: 'Homme' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (profile) { navigate('/app'); } 
      else { setAuthMode('profile_setup'); }
    }
  }, [user, profile, isLoading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await login();
    } catch (error: any) {
      alert("Erreur Google : " + (error.message || "Impossible d'ouvrir la page de connexion."));
    } finally { setIsSubmitting(false); }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) { alert("Veuillez remplir tous les champs."); return; }
    try {
      setIsSubmitting(true);
      await loginWithEmail(email, password);
    } catch (error: any) {
      alert("Erreur : Identifiants incorrects ou compte inexistant.");
    } finally { setIsSubmitting(false); }
  };

  const handleEmailRegister = async () => {
    if (!email || !password || !form.firstName || !form.lastName || !form.phone) {
      alert("Veuillez remplir tous les champs."); return;
    }
    if (password.length < 6) { alert("Le mot de passe doit faire au moins 6 caractères."); return; }

    try {
      setIsSubmitting(true);
      await registerWithEmail(email, password, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        gender: (form.gender === 'Homme' ? 'M' : 'F') as MemberGender,
        group: 'Jeunesse',
        function: 'Membre',
        role: 'member',
        privacyAccepted: true
      });
      // La navigation se fera via le useEffect une fois le profil créé
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert("Cet email est déjà utilisé. Essayez de vous connecter.");
      } else {
        alert("Erreur d'inscription : " + (error.message || "Une erreur est survenue."));
      }
    } finally { setIsSubmitting(false); }
  };

  const handleProfileSetup = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      alert("Information manquante."); return;
    }
    try {
      setIsSubmitting(true);
      await createProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        gender: (form.gender === 'Homme' ? 'M' : 'F') as MemberGender,
        group: 'Jeunesse',
        function: 'Membre',
        role: 'member',
        privacyAccepted: true
      });
    } catch (error) { alert("Erreur lors de la création du profil."); } 
    finally { setIsSubmitting(false); }
  };

  const renderChoice = () => (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4">
          <LogIn size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">Identification</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mt-2">Choisissez votre méthode de connexion</p>
      </div>
      <button onClick={handleGoogleLogin} disabled={isSubmitting} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center justify-center gap-3 shadow-sm active:scale-95 disabled:opacity-50">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" alt="Google" className="w-6 h-6" />
        <span className="text-slate-700 dark:text-slate-200 font-bold">Continuer avec Google</span>
      </button>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Ou</span></div>
      </div>
      <button onClick={() => setAuthMode('email_login')} className="w-full bg-slate-800 dark:bg-slate-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 shadow-sm active:scale-95">
        <Mail size={20} /> <span className="font-bold">Utiliser un Email</span>
      </button>
      <p className="text-center text-sm text-slate-500 mt-6">Pas encore de compte ? <button onClick={() => setAuthMode('email_register')} className="text-blue-600 font-bold">S'inscrire</button></p>
    </div>
  );

  const renderEmailLogin = () => (
    <div className="space-y-4">
      <button onClick={() => setAuthMode('choice')} className="flex items-center gap-2 text-slate-500 mb-4"><ArrowLeft size={16} /> <span className="text-sm font-bold">Retour</span></button>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Connexion par Email</h2>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
        <input type="email" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mot de passe</label>
        <input type="password" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button onClick={handleEmailLogin} disabled={isSubmitting} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold mt-4 shadow-lg active:scale-95 disabled:opacity-50">{isSubmitting ? 'Connexion...' : 'Se connecter'}</button>
    </div>
  );

  const renderEmailRegister = () => (
    <div className="space-y-4">
      <button onClick={() => setAuthMode('choice')} className="flex items-center gap-2 text-slate-500 mb-4"><ArrowLeft size={16} /> <span className="text-sm font-bold">Retour</span></button>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Créer un compte</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Prénom</label>
          <input className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="Jean" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nom</label>
          <input className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="Makosso" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Téléphone</label>
        <input className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="06 000 00 00" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
        <input type="email" className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mot de passe (min. 6 car.)</label>
        <input type="password" className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button onClick={handleEmailRegister} disabled={isSubmitting} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold mt-4 shadow-lg active:scale-95 disabled:opacity-50">{isSubmitting ? 'Inscription...' : "S'inscrire"}</button>
    </div>
  );

  const renderProfileSetup = () => (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4"><UserIcon size={32} className="text-blue-600 dark:text-blue-400" /></div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Complétez votre profil</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center">Presque fini !</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Prénom</label>
          <input className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="Jean" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nom</label>
          <input className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="Makosso" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Téléphone</label>
        <input className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500" placeholder="06 000 00 00" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      </div>
      <div className="flex gap-3 mt-2">
        {['Homme', 'Femme'].map((g) => (
          <button key={g} onClick={() => setForm({...form, gender: g})} className={`flex-1 p-3 rounded-xl flex items-center justify-center border transition-colors ${form.gender === g ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
            <span className={`font-bold ${form.gender === g ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>{g}</span>
          </button>
        ))}
      </div>
      <button onClick={handleProfileSetup} disabled={isSubmitting} className="w-full bg-blue-600 p-4 rounded-xl flex items-center justify-center mt-6 shadow-lg active:scale-95 disabled:opacity-50"><span className="text-white font-bold text-lg">Terminer</span></button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        {authMode === 'choice' && renderChoice()}
        {authMode === 'email_login' && renderEmailLogin()}
        {authMode === 'email_register' && renderEmailRegister()}
        {authMode === 'profile_setup' && renderProfileSetup()}
      </div>
    </div>
  );
        }
