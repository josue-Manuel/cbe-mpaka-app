import { Phone, Mail, MapPin, Users, UserPlus, MessageCircle, Facebook, Youtube, Instagram, Globe, Clock, ChevronRight, ExternalLink, Send, CheckCircle } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, addDoc, collection, serverTimestamp, auth } from '../firebase';

export default function Contacts() {
  const { bureauMembers, socialLinks, officeHours, contactInfo } = useAppData();
  const navigate = useNavigate();
  const [activeDepartment, setActiveDepartment] = useState('Tous');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', subject: '', message: '' });

  const departments = ['Tous', ...new Set(bureauMembers.map(m => m.department).filter(Boolean))];
  
  const filteredMembers = activeDepartment === 'Tous' 
    ? bureauMembers 
    : bureauMembers.filter(m => m.department === activeDepartment);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        date: serverTimestamp(),
        userId: auth.currentUser?.uid || 'anonymous'
      });
      setIsSubmitted(true);
      setForm({ name: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Une erreur est survenue lors de l\'envoi du message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook size={20} />;
      case 'youtube': return <Youtube size={20} />;
      case 'instagram': return <Instagram size={20} />;
      case 'whatsapp': return <MessageCircle size={20} />;
      default: return <Globe size={20} />;
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#1E3A8A] pt-8 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-2 font-serif">Bureau & Contacts</h1>
          <p className="text-blue-100 text-sm max-w-xs">Restez en contact avec les responsables et les services de la sous-section.</p>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6 relative z-10">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={scrollToForm}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
              <Mail size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-white">Écrivez-nous</span>
          </button>
          <a 
            href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600">
              <MessageCircle size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-white">WhatsApp</span>
          </a>
        </div>

        {/* Bureau Members with Filtering */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-bold text-[#1E3A8A] dark:text-blue-400 flex items-center gap-2">
              <Users size={20} />
              Membres du Bureau
            </h2>
          </div>

          {/* Department Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
            {departments.map((dept) => (
              <button
                key={dept as string}
                onClick={() => setActiveDepartment(dept as string)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeDepartment === dept 
                    ? 'bg-[#1E3A8A] text-white shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredMembers.map((leader) => (
              <div key={leader.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 dark:border-slate-600">
                    {leader.imageUrl ? (
                      <img src={leader.imageUrl} alt={leader.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserPlus size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#D9A05B] uppercase tracking-wider mb-0.5">{leader.role}</p>
                    <h3 className="font-bold text-slate-800 dark:text-white truncate">{leader.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase">{leader.department}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <a href={`tel:${leader.phone.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-blue-600 dark:text-blue-400 active:scale-95 transition-transform">
                    <Phone size={16} />
                    <span className="text-[10px] font-bold">Appeler</span>
                  </a>
                  <a 
                    href={`https://wa.me/${(leader.whatsapp || leader.phone).replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-green-600 dark:text-green-400 active:scale-95 transition-transform"
                  >
                    <MessageCircle size={16} />
                    <span className="text-[10px] font-bold">WhatsApp</span>
                  </a>
                  {leader.email && (
                    <a href={`mailto:${leader.email}`} className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-orange-600 dark:text-orange-400 active:scale-95 transition-transform">
                      <Mail size={16} />
                      <span className="text-[10px] font-bold">Email</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-serif font-bold text-slate-800 dark:text-white mb-4">Suivez-nous</h2>
          <div className="grid grid-cols-1 gap-3">
            {socialLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-slate-600 dark:text-slate-400 group-hover:text-[#1E3A8A] transition-colors">
                    {getSocialIcon(link.platform)}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{link.label}</span>
                </div>
                <ExternalLink size={14} className="text-slate-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Location Map Simulation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-serif font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-rose-500" />
            Nous Trouver
          </h2>
          <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
            {/* Map Placeholder Visual */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="border border-slate-400"></div>
                ))}
              </div>
              <div className="absolute top-1/2 left-1/2 w-full h-1 bg-slate-400 -translate-y-1/2 rotate-12"></div>
              <div className="absolute top-1/2 left-1/2 w-full h-1 bg-slate-400 -translate-y-1/2 -rotate-45"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <MapPin size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">CBE Mpaka</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{contactInfo.address}</p>
          {contactInfo.googleMapsUrl && (
            <a 
              href={contactInfo.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Ouvrir dans Google Maps
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Contact Form Section */}
        <div ref={formRef} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-serif font-bold text-[#1E3A8A] dark:text-blue-400 text-xl mb-4 flex items-center gap-2">
            <Send size={20} />
            Envoyer un message
          </h2>
          
          {isSubmitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-3xl p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-emerald-800 dark:text-emerald-400 font-serif font-bold text-2xl mb-2">Message envoyé !</h3>
              <p className="text-emerald-600 dark:text-emerald-500 text-sm">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Nom complet</label>
                <input required type="text" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:focus:border-blue-500 dark:text-white transition-colors" placeholder="Votre nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Sujet</label>
                <input required type="text" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:focus:border-blue-500 dark:text-white transition-colors" placeholder="Sujet de votre message" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Message</label>
                <textarea required rows={5} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:focus:border-blue-500 resize-none dark:text-white transition-colors" placeholder="Comment pouvons-nous vous aider ?" value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-[#1E3A8A] dark:bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-900/20">
                <Send size={20} />
                {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
