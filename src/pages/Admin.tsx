import { 
  ChevronLeft, ShieldAlert, Lock, KeyRound, LogOut, 
  Users, Bell, Calendar, MessageSquare, Heart, Phone, Mail,
  Plus, AlertTriangle, Clock, MapPin, ChevronRight, Check, X, Image as ImageIcon, Upload, Wallet, FileText, Wand2, LogIn,
  BookOpen, Sparkles, Headphones, Archive, Briefcase, Settings, Trash2, Edit2, UserCheck, UserX, Shield, Edit3, Music, Globe, Info, Target,
  Search, Filter, Download, Activity as ActivityIcon, TrendingUp, PieChart, BarChart3, Wifi, WifiOff, Zap, Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, FormEvent, useRef, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useAppData, Member, BureauMember } from '../context/AppDataContext';
import { useNotification } from '../context/NotificationContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart as RePieChart, Pie
} from 'recharts';
import { AdminAssistant } from '../components/AdminAssistant';

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, login, logout, loginWithEmail } = useProfile();
  const { addNotification } = useNotification();
  const { 
    announcements, prayers, activities, testimonies, approveTestimony, deleteTestimony, 
    addAnnouncement, updateAnnouncement, deleteAnnouncement, addActivity, updateActivity, deleteActivity, addPrayer, updatePrayer, deletePrayer, galleryEvents, addGalleryEvent, updateGalleryEvent, deleteGalleryEvent, addMediaToEvent, deleteMediaFromEvent,
    contributionCategories, addContributionCategory, updateContributionCategory, deleteContributionCategory, contributionRecords, addContributionRecord, updateContributionRecord, deleteContributionRecord,
    meditations, addMeditation, updateMeditation, deleteMeditation,
    dailyMeditation,
    dailyVerses, addDailyVerse, updateDailyVerse, deleteDailyVerse, currentDailyVerse,
    weeklyThemes, addWeeklyTheme, updateWeeklyThemeById, deleteWeeklyTheme,
    weeklyTheme,
    members, updateMember, deleteMember,
    bureauMembers, addBureauMember, updateBureauMember, deleteBureauMember,
    socialLinks, addSocialLink, updateSocialLink, deleteSocialLink,
    leaderMessage, updateLeaderMessage,
    audios, addAudio, updateAudio, deleteAudio,
    archiveArticles, addArchiveArticle, updateArchiveArticle, deleteArchiveArticle,
    cantiques, addCantique, updateCantique, deleteCantique,
    history, updateHistory,
    bureaus, addBureau, updateBureau, deleteBureau,
    reports, addReport, updateReport, deleteReport,
    historicalPhotos, addHistoricalPhoto, updateHistoricalPhoto, deleteHistoricalPhoto,
    timelineEvents, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent,
    archiveAudios, addArchiveAudio, updateArchiveAudio, deleteArchiveAudio,
    archiveContributions, approveArchiveContribution, deleteArchiveContribution,
    aboutInfo, updateAboutInfo,
    contactInfo, updateContactInfo,
    isOnline, systemLogs, addLog,
    contactMessages, deleteContactMessage
  } = useAppData();
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeArchiveTab, setActiveArchiveTab] = useState('articles');
  const [activeBureauTab, setActiveBureauTab] = useState('members');

  // Search and Filter states
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [cantiqueSearch, setCantiqueSearch] = useState('');
  const [cantiqueFilter, setCantiqueFilter] = useState('all');

  // Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void}>({
    isOpen: false, title: '', message: '', onConfirm: () => {}
  });

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{type: string, data: any}>({type: '', data: null});
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddPrayer, setShowAddPrayer] = useState(false);
  const [showAddGalleryEvent, setShowAddGalleryEvent] = useState(false);
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [showEditMeditation, setShowEditMeditation] = useState(false);
  const [showEditWeeklyTheme, setShowEditWeeklyTheme] = useState(false);
  const [showDailyVerses, setShowDailyVerses] = useState(false);

  // Form states
  const [annFormData, setAnnFormData] = useState({ title: '', content: '', category: 'Spirituel', date: '', isUrgent: false });
  const [actFormData, setActFormData] = useState({ title: '', type: 'Culte', date: '', time: '', location: 'Temple CBE Mpaka', day: 'Dimanche' });
  const [prayFormData, setPrayFormData] = useState({ title: '', content: '', category: 'Spirituel', isUrgent: false });
  const [galFormData, setGalFormData] = useState({ title: '', date: '', location: '' });
  const [mediaFormData, setMediaFormData] = useState({ eventId: '', files: [] as File[] });
  
  const [medFormData, setMedFormData] = useState({ ...dailyMeditation });
  const [themeFormData, setThemeFormData] = useState({ ...weeklyTheme });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const pendingTestimonies = testimonies.filter(t => t.status === 'pending');

  // Chart Data Preparation
  const memberGrowthData = useMemo(() => {
    // Group members by month of joinDate
    const months: Record<string, number> = {};
    members.forEach(m => {
      if (!m.joinDate) return;
      const date = new Date(m.joinDate);
      if (isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, value]) => ({ name, value: isNaN(value) ? 0 : value }));
  }, [members]);

  const contributionData = useMemo(() => {
    return contributionCategories.map(cat => {
      const total = contributionRecords
        .filter(r => r.categoryId === cat.id)
        .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
      return {
        name: cat.name,
        total: isNaN(total) ? 0 : total,
        target: Number(cat.targetAmount) || 0
      };
    });
  }, [contributionCategories, contributionRecords]);

  // Export Functions
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('Exportation', `Exportation de ${filename} au format CSV`, 'info');
  };

  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      await login();
    } catch (error) {
      console.error("Login error", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) return;
    try {
      setIsLoggingIn(true);
      await loginWithEmail(adminEmail, adminPassword);
    } catch (error) {
      console.error("Email login error", error);
      setError(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 bg-white dark:bg-slate-900 min-h-screen pb-24">
        <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
            <ChevronLeft size={20} />
            <span>Retour</span>
          </button>
          <h1 className="text-[#1E3A8A] dark:text-white font-bold text-lg flex items-center gap-2">
            <ShieldAlert size={18} className="text-orange-500" />
            Administration
          </h1>
          <div className="w-16"></div>
        </div>

        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg shadow-orange-500/10 dark:shadow-orange-500/20">
            <Lock size={32} className="text-orange-500" />
          </div>
          
          <h2 className="text-[#1E3A8A] dark:text-white font-bold text-2xl mb-2 text-center">Accès Restreint</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8 max-w-xs">
            Cette zone est réservée aux administrateurs de la Sous-section CBE Mpaka.
          </p>

          <div className="w-full max-w-xs space-y-4">
            {!showEmailLogin ? (
              <>
                <button 
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" alt="Google" className="w-5 h-5" />
                  Se connecter avec Google
                </button>
                
                <button 
                  onClick={() => setShowEmailLogin(true)}
                  className="w-full text-slate-500 dark:text-slate-400 text-xs font-bold py-2 hover:text-blue-600 transition-colors"
                >
                  Utiliser un email et mot de passe
                </button>
              </>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-[10px] font-bold text-center">Identifiants incorrects ou accès refusé.</p>
                )}

                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isLoggingIn ? <Clock className="animate-spin" size={18} /> : <LogIn size={18} />}
                  Se connecter
                </button>

                <button 
                  type="button"
                  onClick={() => setShowEmailLogin(false)}
                  className="w-full text-slate-500 dark:text-slate-400 text-xs font-bold py-2"
                >
                  Retour aux options
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- MODULES VIEWS ---

  const renderMembersModule = () => {
    const filteredMembers = members.filter(m => {
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes((memberSearch || '').toLowerCase()) || 
                            (m.email || '').toLowerCase().includes((memberSearch || '').toLowerCase()) ||
                            (m.phone || '').includes(memberSearch || '');
      const matchesFilter = memberFilter === 'all' || m.status === memberFilter;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Gestion des Membres</h2>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 py-1 px-3 rounded-full text-xs font-bold">{filteredMembers.length} / {members.length}</span>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un membre..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 appearance-none transition-colors"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="pending">En attente</option>
              <option value="blocked">Bloqués</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredMembers.map(member => (
          <div key={member.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {member.firstName} {member.lastName}
                {member.role === 'admin' && <Shield size={14} className="text-orange-500" />}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {member.email} • {member.phone}
                {member.birthDate && !isNaN(new Date(member.birthDate).getTime()) && ` • Né(e) le ${new Date(member.birthDate).toLocaleDateString('fr-FR')}`}
              </p>
              <div className="mt-2 flex gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${member.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : member.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {member.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {member.status === 'pending' && (
                <button onClick={() => { updateMember(member.id, { status: 'active' }); addNotification('Membre Approuvé', `${member.firstName} ${member.lastName} est maintenant actif.`, 'success'); }} className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center active:scale-95" title="Approuver"><UserCheck size={16} /></button>
              )}
              {member.status === 'active' && (
                <button onClick={() => { updateMember(member.id, { status: 'blocked' }); addNotification('Membre Bloqué', `${member.firstName} ${member.lastName} a été bloqué.`, 'warning'); }} className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center active:scale-95" title="Bloquer"><UserX size={16} /></button>
              )}
              {member.status === 'blocked' && (
                <button onClick={() => { updateMember(member.id, { status: 'active' }); addNotification('Membre Débloqué', `${member.firstName} ${member.lastName} a été débloqué.`, 'success'); }} className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center active:scale-95" title="Débloquer"><UserCheck size={16} /></button>
              )}
              <button 
                onClick={() => {
                  setEditingItem({ type: 'member', data: member });
                  setIsModalOpen(true);
                }}
                className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center active:scale-95"
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={() => confirmAction('Supprimer le membre', `Êtes-vous sûr de vouloir supprimer ${member.firstName} ${member.lastName} ? Cette action est irréversible.`, () => {
                  deleteMember(member.id);
                  setConfirmDialog({...confirmDialog, isOpen: false});
                })} 
                className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center active:scale-95"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  const renderAdminsModule = () => {
    const adminMembers = members.filter(m => m.role === 'admin');
    const nonAdminMembers = members.filter(m => m.role !== 'admin' && m.status === 'active');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Administrateurs</h2>
          <span className={`py-1 px-3 rounded-full text-xs font-bold ${adminMembers.length >= 10 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
            {adminMembers.length}/10 Admins
          </span>
        </div>

        {/* Liste des admins actuels */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Admins Actuels</h3>
          {adminMembers.map(admin => (
            <div key={admin.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {admin.firstName} {admin.lastName}
                    {admin.id === '1' && <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-md">Fondateur</span>}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{admin.email}</p>
                </div>
              </div>
              {admin.id !== '1' && (
                <button 
                  onClick={() => confirmAction('Retirer les droits', `Voulez-vous retirer les droits d'administration à ${admin.firstName} ${admin.lastName} ?`, () => {
                    if (adminMembers.length <= 1) {
                      alert("Impossible de supprimer le dernier administrateur.");
                      return;
                    }
                    updateMember(admin.id, { role: 'user' });
                    setConfirmDialog({...confirmDialog, isOpen: false});
                  })}
                  className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center active:scale-95"
                >
                  <UserX size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Nommer un nouvel admin */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nommer un Administrateur</h3>
          {adminMembers.length >= 10 ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm text-center">
              La limite de 10 administrateurs a été atteinte.
            </div>
          ) : nonAdminMembers.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-slate-500 text-sm text-center">
              Aucun membre actif disponible pour être nommé administrateur.
            </div>
          ) : (
            <div className="space-y-2">
              {nonAdminMembers.map(member => (
                <div key={member.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{member.firstName} {member.lastName}</h4>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                  <button 
                    onClick={() => confirmAction('Nommer Administrateur', `Voulez-vous accorder les droits d'administration à ${member.firstName} ${member.lastName} ?`, () => {
                      updateMember(member.id, { role: 'admin' });
                      setConfirmDialog({...confirmDialog, isOpen: false});
                    })}
                    className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95"
                  >
                    Nommer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCommunicationModule = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Communication</h2>
        </div>

        {/* Mot du Responsable */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-[#D9A05B]" />
              Mot du Responsable
            </h3>
            <button 
              onClick={() => {
                setEditingItem({ type: 'leaderMessage', data: leaderMessage });
                setIsModalOpen(true);
              }}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold"
            >
              Modifier
            </button>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">{leaderMessage.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{leaderMessage.content}</p>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Par: {leaderMessage.author}</span>
              <span>{leaderMessage.date}</span>
            </div>
          </div>
        </div>

        {/* Annonces */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Bell size={18} className="text-blue-500" />
              Annonces
            </h3>
            <button 
              onClick={() => {
                setEditingItem({ type: 'announcement', data: null });
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 active:scale-95"
            >
              <Plus size={16} /> Nouvelle
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(announcement => (
              <div key={announcement.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {announcement.isUrgent && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Urgent</span>}
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{announcement.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingItem({ type: 'announcement', data: announcement });
                        setIsModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => confirmAction('Supprimer l\'annonce', 'Voulez-vous vraiment supprimer cette annonce ?', () => {
                        deleteAnnouncement(announcement.id);
                        setConfirmDialog({...confirmDialog, isOpen: false});
                      })}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{announcement.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{announcement.content}</p>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{announcement.date}</span>
                  <span>{announcement.author}</span>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                Aucune annonce publiée.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSpiritualModule = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Spiritualité</h2>
        </div>

        {/* Verset du jour */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BookOpen size={18} className="text-[#D9A05B]" />
              Verset du jour
            </h3>
            <button 
              onClick={() => {
                setMedFormData({ ...dailyMeditation });
                setShowEditMeditation(true);
              }}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold"
            >
              Modifier
            </button>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">{dailyMeditation.reference}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-3">« {dailyMeditation.text} »</p>
            <p className="text-xs text-slate-500 line-clamp-2">{dailyMeditation.exhortation}</p>
          </div>
        </div>

        {/* Thème de la semaine */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-blue-500" />
              Thème de la semaine
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const assistantBtn = document.querySelector('button[class*="fixed bottom-24"]') as HTMLButtonElement;
                  assistantBtn?.click();
                  // We can't easily set the input from here without a ref or global state, 
                  // but opening it is a good start. 
                  // Actually, I'll add a custom event to handle this.
                  window.dispatchEvent(new CustomEvent('open-assistant', { detail: { prompt: "Aide-moi à programmer le thème et les versets pour la semaine prochaine." } }));
                }}
                className="text-orange-600 dark:text-orange-400 text-sm font-bold flex items-center gap-1"
              >
                <Bot size={14} /> Déléguer à l'IA
              </button>
              <button 
                onClick={() => setShowDailyVerses(!showDailyVerses)}
                className="text-amber-600 dark:text-amber-400 text-sm font-bold"
              >
                {showDailyVerses ? 'Cacher Versets' : 'Gérer Versets'}
              </button>
              <button 
                onClick={() => {
                  setThemeFormData({ ...weeklyTheme });
                  setShowEditWeeklyTheme(true);
                }}
                className="text-blue-600 dark:text-blue-400 text-sm font-bold"
              >
                Modifier
              </button>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{weeklyTheme.title}</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-2">{weeklyTheme.reference}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-3">« {weeklyTheme.text} »</p>
            <p className="text-xs text-slate-500 line-clamp-2">{weeklyTheme.description}</p>
          </div>

          {showDailyVerses && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Versets Quotidiens du Thème</h4>
                <button 
                  onClick={() => {
                    setEditingItem({ type: 'dailyVerse', data: { themeId: weeklyTheme.id, date: new Date().toISOString().split('T')[0] } });
                    setIsModalOpen(true);
                  }}
                  className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-lg text-[10px] font-bold"
                >
                  + Ajouter un verset
                </button>
              </div>
              <div className="space-y-2">
                {dailyVerses.filter(v => v.themeId === weeklyTheme.id).sort((a, b) => a.date.localeCompare(b.date)).map(verse => (
                  <div key={verse.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">{verse.date}</span>
                        <span className="text-[10px] font-bold text-amber-600">{verse.reference}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-1">« {verse.text} »</p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          setEditingItem({ type: 'dailyVerse', data: verse });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => confirmAction('Supprimer le verset', 'Voulez-vous supprimer ce verset quotidien ?', () => {
                          deleteDailyVerse(verse.id);
                          setConfirmDialog({...confirmDialog, isOpen: false});
                        })}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {dailyVerses.filter(v => v.themeId === weeklyTheme.id).length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-4">Aucun verset programmé pour ce thème.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Prières Officielles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Heart size={18} className="text-rose-500" />
              Prières Officielles
            </h3>
            <button 
              onClick={() => {
                setEditingItem({ type: 'prayer', data: null });
                setIsModalOpen(true);
              }}
              className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 active:scale-95"
            >
              <Plus size={16} /> Nouvelle
            </button>
          </div>

          <div className="space-y-3">
            {prayers.filter(p => p.author === 'Administration').map(prayer => (
              <div key={prayer.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {prayer.isUrgent && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Urgent</span>}
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{prayer.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingItem({ type: 'prayer', data: prayer });
                        setIsModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => confirmAction('Supprimer la prière', 'Voulez-vous vraiment supprimer cette prière ?', () => {
                        deletePrayer(prayer.id);
                        setConfirmDialog({...confirmDialog, isOpen: false});
                      })}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{prayer.content}</p>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{prayer.date}</span>
                  <span className="flex items-center gap-1"><Heart size={10} /> {prayer.likes || 0}</span>
                </div>
              </div>
            ))}
            {prayers.filter(p => p.author === 'Administration').length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                Aucune prière officielle publiée.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2">
            <Zap size={18} className="text-amber-500" />
            Actions Rapides
          </h2>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                <Wifi size={12} /> En ligne
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                <WifiOff size={12} /> Hors ligne
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <button 
            onClick={() => { setEditingItem({ type: 'announcement', data: null }); setIsModalOpen(true); }}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center"><Bell size={20} /></div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Annonce</span>
          </button>
          <button 
            onClick={() => { setEditingItem({ type: 'activity', data: null }); setIsModalOpen(true); }}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center"><Calendar size={20} /></div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Activité</span>
          </button>
          <button 
            onClick={() => { setEditingItem({ type: 'prayer', data: null }); setIsModalOpen(true); }}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center"><Heart size={20} /></div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Prière</span>
          </button>
          <button 
            onClick={() => setActiveModule('messages')}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center"><MessageSquare size={20} /></div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Messages</span>
          </button>
          <button 
            onClick={() => exportToCSV(members, 'liste_membres')}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center"><Download size={20} /></div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Export</span>
          </button>
        </div>
      </div>

      {/* Statistiques Rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Membres Actifs</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{members.filter(m => m.status === 'active').length}</h4>
            <span className="text-[10px] text-emerald-500 font-bold">+{members.filter(m => {
              if (!m || typeof m.joinDate !== 'string') return false;
              try {
                console.log("Admin.tsx: m.joinDate", m.joinDate);
                console.log("Admin.tsx: m.joinDate", m.joinDate);
                return m.joinDate && m.joinDate.indexOf(new Date().toISOString().slice(0, 7)) === 0;
              } catch (e) {
                console.error("Error in Admin.tsx", e, m);
                return false;
              }
            }).length} ce mois</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">En attente</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-amber-500">{members.filter(m => m.status === 'pending').length}</h4>
            {members.filter(m => m.status === 'pending').length > 0 && (
              <button onClick={() => { setMemberFilter('pending'); setActiveModule('members'); }} className="text-[10px] text-blue-600 font-bold underline">Voir</button>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Messages</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-purple-500">{contactMessages.length}</h4>
            <button onClick={() => setActiveModule('messages')} className="text-[10px] text-blue-600 font-bold underline">Ouvrir</button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Témoignages</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-rose-500">{testimonies.length}</h4>
            <span className="text-[10px] text-slate-400 font-bold">{testimonies.filter(t => t.status === 'pending').length} à valider</span>
          </div>
        </div>
      </div>

      {/* Assistant Intelligent Intro Card */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 p-5 rounded-2xl shadow-lg border border-blue-400/20 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Bot size={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-amber-400" />
            <h3 className="font-bold text-lg">Assistant Intelligent CBE</h3>
          </div>
          <p className="text-blue-100 text-xs mb-4 max-w-[80%]">
            Besoin d'aide pour rédiger une annonce, analyser vos données ou résumer un témoignage ? Votre assistant IA est là pour vous accompagner.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                // This will be handled by the floating button which is always present
                // But we can trigger a custom event or just let the user know where it is
                const assistantBtn = document.querySelector('button[class*="fixed bottom-24"]') as HTMLButtonElement;
                assistantBtn?.click();
              }}
              className="bg-white text-[#1E3A8A] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md"
            >
              <Wand2 size={14} /> Démarrer l'assistant
            </button>
          </div>
        </div>
      </div>

      {/* Visualisation des données (Charts) */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            Croissance des Membres
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-teal-500" />
            Suivi des Contributions
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="total" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statistiques Rapides */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Membres</p>
            <p className="font-bold text-slate-800 dark:text-white text-lg">{members.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Projets</p>
            <p className="font-bold text-slate-800 dark:text-white text-lg">{contributionCategories.length}</p>
          </div>
        </div>
      </div>

      {/* Flux d'activité récente */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
          <ActivityIcon size={18} className="text-purple-500" />
          Activités Récentes
        </h3>
        <div className="space-y-4">
          {systemLogs.length > 0 ? systemLogs.slice(0, 5).map(log => (
            <div key={log.id} className="flex gap-3">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                log.type === 'success' ? 'bg-emerald-500' : 
                log.type === 'warning' ? 'bg-amber-500' : 
                log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{log.action}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{log.details}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          )) : (
            <p className="text-center py-4 text-xs text-slate-500">Aucune activité récente.</p>
          )}
        </div>
      </div>

      {/* Modules d'Administration */}
      <div>
        <h2 className="text-slate-800 dark:text-white font-bold text-base mb-3">Modules d'Administration</h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button onClick={() => setActiveModule('members')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform relative">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center"><Users size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Membres</span>
            {members.filter(m => m.status === 'pending').length > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {members.filter(m => m.status === 'pending').length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveModule('admins')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center"><KeyRound size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Admins</span>
          </button>
          <button onClick={() => setActiveModule('communication')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center"><Bell size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Comms</span>
          </button>
          <button onClick={() => setActiveModule('activities')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center"><Calendar size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Activités</span>
          </button>
          <button onClick={() => setActiveModule('spiritual')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center"><BookOpen size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Spirituel</span>
          </button>
          <button onClick={() => setActiveModule('audios')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center"><Headphones size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Audios</span>
          </button>
          <button onClick={() => setActiveModule('gallery')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-full flex items-center justify-center"><ImageIcon size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Galerie</span>
          </button>
          <button onClick={() => setActiveModule('archives')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center"><Archive size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Archives</span>
          </button>
          <button onClick={() => setActiveModule('bureau')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center"><Briefcase size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Bureau</span>
          </button>
          <button onClick={() => setActiveModule('contributions')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center"><Wallet size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Contribs</span>
          </button>
          <button onClick={() => setActiveModule('cantiques')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center"><Music size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Cantiques</span>
          </button>
          <button onClick={() => setActiveModule('testimonies')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center"><Sparkles size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Témoignages</span>
          </button>
          <button onClick={() => setActiveModule('about')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center"><Info size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">À Propos</span>
          </button>
          <button onClick={() => setActiveModule('messages')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform relative">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center"><MessageSquare size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Messages</span>
            {contactMessages.length > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {contactMessages.length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveModule('contact')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center"><Phone size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Contact</span>
          </button>
          <button onClick={() => navigate('/app/settings')} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center"><Settings size={20} /></div>
            <span className="text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center">Paramètres</span>
          </button>
        </div>
      </div>

      {/* Validation des témoignages (Quick Access) */}
      {pendingTestimonies.length > 0 && (
        <div>
          <h2 className="text-slate-800 dark:text-white font-bold text-base mb-3">Témoignages en attente</h2>
          <div className="space-y-3">
            {pendingTestimonies.map(t => (
              <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-800 dark:text-white text-sm">{t.author}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t.date}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{t.content}</p>
                <div className="flex gap-2">
                  <button onClick={() => { approveTestimony(t.id); addNotification('Témoignage Approuvé', `Le témoignage de ${t.author} a été approuvé.`, 'success'); }} className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                    <Check size={14} /> Approuver
                  </button>
                  <button onClick={() => deleteTestimony(t.id)} className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                    <X size={14} /> Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTestimoniesModule = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-800 dark:text-white font-bold text-lg">Gestion des Témoignages</h2>
      </div>

      <div className="space-y-6">
        {/* Pending Testimonies */}
        {pendingTestimonies.length > 0 && (
          <div>
            <h3 className="text-orange-600 dark:text-orange-400 font-bold text-sm mb-3 flex items-center gap-2">
              <Sparkles size={16} /> En attente d'approbation ({pendingTestimonies.length})
            </h3>
            <div className="space-y-3">
              {pendingTestimonies.map(t => (
                <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white text-sm">{t.author}</span>
                      <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded uppercase">{t.category}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{t.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">{t.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">{t.content}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { approveTestimony(t.id); addNotification('Témoignage Approuvé', `Le témoignage de ${t.author} a été approuvé.`, 'success'); }} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform">
                      <Check size={14} /> Approuver
                    </button>
                    <button onClick={() => deleteTestimony(t.id)} className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform">
                      <X size={14} /> Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Testimonies */}
        <div>
          <h3 className="text-slate-800 dark:text-white font-bold text-sm mb-3">Témoignages publiés</h3>
          <div className="space-y-3">
            {testimonies.filter(t => t.status === 'approved').map(t => (
              <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white text-sm">{t.author}</span>
                    <span className="ml-2 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase">{t.category}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{t.date}</span>
                </div>
                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">{t.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{t.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-rose-500">
                    <Heart size={14} className="fill-rose-500" />
                    <span className="text-xs font-bold">{t.likes || 0}</span>
                  </div>
                  <button onClick={() => deleteTestimony(t.id)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderContributionsModule = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-800 dark:text-white font-bold text-lg">Contributions</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV(contributionRecords, 'registre_contributions')}
            className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
            title="Exporter en CSV"
          >
            <Download size={16} />
          </button>
          <button 
            onClick={() => {
              setEditingItem({ type: 'contributionCategory', data: null });
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
          >
            <Plus size={16} className="hidden sm:block" /> Projet
          </button>
          <button 
            onClick={() => {
              setEditingItem({ type: 'contributionRecord', data: null });
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
          >
            <Plus size={16} className="hidden sm:block" /> Versement
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {contributionCategories.map(category => {
          const categoryRecords = contributionRecords.filter(r => r.categoryId === category.id);
          const totalAmount = categoryRecords.reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
          const targetAmount = Number(category.targetAmount) || 0;
          const progress = targetAmount > 0 ? Math.min(100, Math.round((totalAmount / targetAmount) * 100)) : 0;

          return (
            <div key={category.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base">{category.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{category.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setEditingItem({ type: 'contributionCategory', data: category });
                      setIsModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => confirmAction('Supprimer le projet', 'Voulez-vous vraiment supprimer ce projet et tous ses versements ?', () => {
                      deleteContributionCategory(category.id);
                      setConfirmDialog({...confirmDialog, isOpen: false});
                    })}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Total collecté</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{(totalAmount || 0).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  {targetAmount > 0 && (
                    <div className="text-right">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Objectif</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{targetAmount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  )}
                </div>
                {targetAmount > 0 && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress || 0}%` }}></div>
                  </div>
                )}
              </div>

              {categoryRecords.length > 0 ? (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Derniers versements</h5>
                  {categoryRecords.slice(0, 5).map(record => (
                    <div key={record.id} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-white">{record.memberName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{record.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">+{record.amount.toLocaleString('fr-FR')} FCFA</span>
                        <button 
                          onClick={() => confirmAction('Supprimer le versement', 'Voulez-vous vraiment annuler ce versement ?', () => {
                            deleteContributionRecord(record.id);
                            setConfirmDialog({...confirmDialog, isOpen: false});
                          })}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-2">Aucun versement pour ce projet.</p>
              )}
            </div>
          );
        })}
        {contributionCategories.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
            Aucun projet de contribution actif.
          </div>
        )}
      </div>
    </>
  );
        {/* Requêtes de Prière (Pending) */}
        <div className="space-y-4 mt-8">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            Requêtes en attente
          </h3>
          <div className="space-y-3">
            {prayers.filter(p => p.status === 'pending').map(prayer => (
              <div key={prayer.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{prayer.author}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{prayer.date} • {prayer.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updatePrayer(prayer.id, { status: 'approved' })}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={() => deletePrayer(prayer.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{prayer.content}</p>
              </div>
            ))}
            {prayers.filter(p => p.status === 'pending').length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 text-sm italic">Aucune requête en attente.</p>
            )}
          </div>
        </div>

  const renderBureauModule = () => {
    const tabs = [
      { id: 'members', label: 'Membres', icon: Users },
      { id: 'social', label: 'Réseaux Sociaux', icon: Globe },
    ];

    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveBureauTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeBureauTab === tab.id 
                  ? 'bg-cyan-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeBureauTab === 'members' && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-slate-800 dark:text-white font-bold text-sm">Membres du Bureau</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'bureau', data: null });
                  setIsModalOpen(true);
                }}
                className="bg-cyan-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold active:scale-95 transition-transform"
              >
                <Plus size={14} /> Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {bureauMembers.map(member => (
                <div key={member.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 overflow-hidden">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover" />
                    ) : (
                      <UserCheck size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{member.firstName} {member.lastName}</h4>
                        <p className="text-[10px] font-medium text-cyan-600 dark:text-cyan-400">{member.role} • {member.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem({ type: 'bureau', data: member });
                            setIsModalOpen(true);
                          }}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => confirmAction('Supprimer le membre', 'Voulez-vous vraiment retirer ce membre du bureau ?', () => {
                            deleteBureauMember(member.id);
                            setConfirmDialog({...confirmDialog, isOpen: false});
                          })}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{member.phone} {member.email && `• ${member.email}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeBureauTab === 'social' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-800 dark:text-white font-bold text-sm">Réseaux Sociaux</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'socialLink', data: null });
                  setIsModalOpen(true);
                }}
                className="bg-cyan-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold active:scale-95 transition-transform"
              >
                <Plus size={14} /> Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {socialLinks.map(link => (
                <div key={link.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-600"><Globe size={16} /></span>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{link.label}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem({ type: 'socialLink', data: link });
                          setIsModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmAction('Supprimer le lien', 'Voulez-vous vraiment supprimer ce lien social ?', () => {
                          deleteSocialLink(link.id);
                          setConfirmDialog({...confirmDialog, isOpen: false});
                        })}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{link.url}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  const renderArchivesModule = () => {
    const tabs = [
      { id: 'articles', label: 'Articles', icon: Archive },
      { id: 'history', label: 'Histoire', icon: BookOpen },
      { id: 'bureaus', label: 'Bureaux', icon: Briefcase },
      { id: 'reports', label: 'Rapports', icon: FileText },
      { id: 'photos', label: 'Photos', icon: ImageIcon },
      { id: 'timeline', label: 'Timeline', icon: Clock },
      { id: 'audios', label: 'Audios', icon: Headphones },
      { id: 'contributions', label: 'Contributions', icon: MessageSquare },
      { id: 'stats', label: 'Stats', icon: Shield },
    ];

    return (
      <div className="space-y-6">
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveArchiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeArchiveTab === tab.id 
                  ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeArchiveTab === 'articles' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-800 dark:text-white font-bold">Articles d'Archives</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'archive', data: null });
                  setIsModalOpen(true);
                }}
                className="bg-amber-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {archiveArticles.map(article => (
                <div key={article.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <Archive size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{article.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{article.date}</span>
                          <span>•</span>
                          <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{article.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem({ type: 'archive', data: article });
                          setIsModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmAction('Supprimer l\'archive', 'Voulez-vous vraiment supprimer cet article ?', () => {
                          deleteArchiveArticle(article.id);
                          setConfirmDialog({...confirmDialog, isOpen: false});
                        })}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 line-clamp-2">{article.summary}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeArchiveTab === 'history' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">Histoire de la Sous-section</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'history', data: history || { content: '', foundationDate: '', spiritualGoals: '', milestones: '' } });
                  setIsModalOpen(true);
                }}
                className="text-blue-600 dark:text-blue-400 text-sm font-bold"
              >
                Modifier
              </button>
            </div>
            {history ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Date de fondation</label>
                  <p className="text-slate-800 dark:text-white">{history.foundationDate}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Contenu</label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{history.content}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">Aucune donnée historique enregistrée.</p>
            )}
          </div>
        )}

        {activeArchiveTab === 'bureaus' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-800 dark:text-white font-bold">Anciens Bureaux</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'pastBureau', data: null });
                  setIsModalOpen(true);
                }}
                className="bg-indigo-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {bureaus.map(bureau => (
                <div key={bureau.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">Bureau {bureau.yearRange}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Leader: {bureau.leader}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem({ type: 'pastBureau', data: bureau });
                          setIsModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmAction('Supprimer le bureau', 'Voulez-vous vraiment supprimer cet ancien bureau ?', () => {
                          deleteBureau(bureau.id);
                          setConfirmDialog({...confirmDialog, isOpen: false});
                        })}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeArchiveTab === 'reports' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-800 dark:text-white font-bold">Rapports Annuels</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'report', data: null });
                  setIsModalOpen(true);
                }}
                className="bg-emerald-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {reports.map(report => (
                <div key={report.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FileText className="text-emerald-600" size={20} />
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{report.title}</h4>
                        <p className="text-xs text-slate-500">{report.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem({ type: 'report', data: report });
                          setIsModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmAction('Supprimer le rapport', 'Voulez-vous vraiment supprimer ce rapport ?', () => {
                          deleteReport(report.id);
                          setConfirmDialog({...confirmDialog, isOpen: false});
                        })}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeArchiveTab === 'photos' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-800 dark:text-white font-bold">Photos Historiques</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'photo', data: null });
                  setIsModalOpen(true);
                }}
                className="bg-orange-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {historicalPhotos.map(photo => (
                <div key={photo.id} className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 group relative">
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-24 object-cover rounded-lg" />
                  <div className="mt-2">
                    <h4 className="font-bold text-slate-800 dark:text-white text-[10px] truncate">{photo.title}</h4>
                    <p className="text-[10px] text-slate-500">{photo.year}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingItem({ type: 'photo', data: photo });
                        setIsModalOpen(true);
                      }}
                      className="w-6 h-6 bg-white/90 dark:bg-slate-800/90 rounded-md flex items-center justify-center text-blue-600 shadow-sm"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button 
                      onClick={() => confirmAction('Supprimer la photo', 'Voulez-vous vraiment supprimer cette photo ?', () => {
                        deleteHistoricalPhoto(photo.id);
                        setConfirmDialog({...confirmDialog, isOpen: false});
                      })}
                      className="w-6 h-6 bg-white/90 dark:bg-slate-800/90 rounded-md flex items-center justify-center text-red-600 shadow-sm"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeArchiveTab === 'timeline' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-800 dark:text-white font-bold">Timeline (Événements)</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'timeline', data: null });
                  setIsModalOpen(true);
                }}
                className="bg-rose-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {timelineEvents.sort((a, b) => parseInt(b.year) - parseInt(a.year)).map(event => (
                <div key={event.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="text-rose-600 font-bold text-sm pt-1">{event.year}</div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{event.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem({ type: 'timeline', data: event });
                          setIsModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmAction('Supprimer l\'événement', 'Voulez-vous vraiment supprimer cet événement ?', () => {
                          deleteTimelineEvent(event.id);
                          setConfirmDialog({...confirmDialog, isOpen: false});
                        })}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeArchiveTab === 'audios' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-800 dark:text-white font-bold">Archives Audio</h3>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'archiveAudio', data: null });
                  setIsModalOpen(true);
                }}
                className="bg-purple-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {archiveAudios.map(audio => (
                <div key={audio.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Headphones className="text-purple-600" size={20} />
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{audio.title}</h4>
                        <p className="text-xs text-slate-500">{audio.category} • {audio.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingItem({ type: 'archiveAudio', data: audio }); setIsModalOpen(true); }} className="text-slate-400 hover:text-blue-600"><Edit3 size={16} /></button>
                      <button onClick={() => confirmAction('Supprimer l\'audio', 'Voulez-vous vraiment supprimer cet audio ?', () => { deleteArchiveAudio(audio.id); setConfirmDialog({...confirmDialog, isOpen: false}); })} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeArchiveTab === 'contributions' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-800 dark:text-white font-bold">Contributions des Membres</h3>
            </div>
            <div className="space-y-3">
              {archiveContributions.map(contribution => (
                <div key={contribution.id} className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border ${contribution.status === 'pending' ? 'border-amber-200 dark:border-amber-900/30' : 'border-slate-100 dark:border-slate-700'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{contribution.author}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${contribution.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {contribution.status === 'pending' ? 'En attente' : 'Approuvé'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{contribution.content}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{contribution.date} • Type: {contribution.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {contribution.status === 'pending' && (
                        <button onClick={() => approveArchiveContribution(contribution.id)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-lg"><Check size={16} /></button>
                      )}
                      <button onClick={() => deleteArchiveContribution(contribution.id)} className="text-red-600 hover:bg-red-50 p-1 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {archiveContributions.length === 0 && <p className="text-center py-8 text-slate-500 text-sm italic">Aucune contribution pour le moment.</p>}
            </div>
          </>
        )}

        {activeArchiveTab === 'stats' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <Archive className="mx-auto text-amber-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{archiveArticles.length}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Articles</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <FileText className="mx-auto text-emerald-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{reports.length}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Rapports</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <ImageIcon className="mx-auto text-orange-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{historicalPhotos.length}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Photos</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <Headphones className="mx-auto text-purple-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{archiveAudios.length}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Audios</div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderGalleryModule = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-800 dark:text-white font-bold text-lg">Galerie & Médias</h2>
        <button 
          onClick={() => {
            setEditingItem({ type: 'galleryEvent', data: null });
            setIsModalOpen(true);
          }}
          className="bg-fuchsia-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
        >
          <Plus size={16} /> Nouvel Album
        </button>
      </div>

      <div className="space-y-4">
        {galleryEvents.map(event => (
          <div key={event.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{event.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{event.date} • {event.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setEditingItem({ type: 'galleryEvent', data: event });
                    setIsModalOpen(true);
                  }}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => confirmAction('Supprimer l\'album', 'Voulez-vous vraiment supprimer cet album et toutes ses photos ?', () => {
                    deleteGalleryEvent(event.id);
                    setConfirmDialog({...confirmDialog, isOpen: false});
                  })}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                {event.media.length} média(s)
              </span>
              <button 
                onClick={() => {
                  setEditingItem({ type: 'galleryMedia', data: { eventId: event.id } });
                  setIsModalOpen(true);
                }}
                className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 flex items-center gap-1 hover:underline"
              >
                <Upload size={12} /> Ajouter des photos
              </button>
            </div>

            {event.media.length > 0 && (
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                {event.media.map(media => (
                  <div key={media.id} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden group">
                    <img src={media.url} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => confirmAction('Supprimer la photo', 'Voulez-vous vraiment supprimer cette photo ?', () => {
                        deleteMediaFromEvent(event.id, media.id);
                        setConfirmDialog({...confirmDialog, isOpen: false});
                      })}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {galleryEvents.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
            Aucun album photo disponible.
          </div>
        )}
      </div>
    </>
  );
  const renderAudiosModule = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-800 dark:text-white font-bold text-lg">Audios Bibliques</h2>
        <button 
          onClick={() => {
            setEditingItem({ type: 'audio', data: null });
            setIsModalOpen(true);
          }}
          className="bg-purple-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {audios.map(audio => (
          <div key={audio.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <Headphones size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{audio.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{audio.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setEditingItem({ type: 'audio', data: audio });
                    setIsModalOpen(true);
                  }}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => confirmAction('Supprimer l\'audio', 'Voulez-vous vraiment supprimer cet audio ?', () => {
                    deleteAudio(audio.id);
                    setConfirmDialog({...confirmDialog, isOpen: false});
                  })}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{audio.description}</p>
            <div className="mt-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg text-xs text-slate-500 dark:text-slate-400 truncate border border-slate-100 dark:border-slate-700">
              {audio.url}
            </div>
          </div>
        ))}
        {audios.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
            Aucun audio biblique disponible.
          </div>
        )}
      </div>
    </>
  );
  const renderActivitiesModule = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-800 dark:text-white font-bold text-lg">Programme des Activités</h2>
        <button 
          onClick={() => {
            setEditingItem({ type: 'activity', data: null });
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {activities.map(activity => (
          <div key={activity.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex flex-col items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg leading-none">{activity.date.split(' ')[0]}</span>
              <span className="text-emerald-800 dark:text-emerald-500 text-[10px] font-medium uppercase">{activity.date.split(' ')[1]}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{activity.title}</h4>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setEditingItem({ type: 'activity', data: activity });
                      setIsModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => confirmAction('Supprimer l\'activité', 'Voulez-vous vraiment supprimer cette activité ?', () => {
                      deleteActivity(activity.id);
                      setConfirmDialog({...confirmDialog, isOpen: false});
                    })}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12} /> {activity.time}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {activity.location}</span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
            Aucune activité programmée.
          </div>
        )}
      </div>
    </>
  );
  const renderCantiquesModule = () => {
    const filteredCantiques = cantiques.filter(c => {
      const matchesSearch = (c.title || '').toLowerCase().includes((cantiqueSearch || '').toLowerCase()) || 
                            (c.number || '').includes(cantiqueSearch || '') ||
                            (c.lyrics || '').toLowerCase().includes((cantiqueSearch || '').toLowerCase());
      const matchesFilter = cantiqueFilter === 'all' || c.category === cantiqueFilter;
      return matchesSearch && matchesFilter;
    });

    const categories = Array.from(new Set(cantiques.map(c => c.category)));

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-slate-800 dark:text-white font-bold text-lg">Cantiques</h2>
          <button 
            onClick={() => {
              setEditingItem({ type: 'cantique', data: null });
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white p-2 rounded-xl flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un cantique..."
              value={cantiqueSearch}
              onChange={(e) => setCantiqueSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={cantiqueFilter}
              onChange={(e) => setCantiqueFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 appearance-none transition-colors"
            >
              <option value="all">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredCantiques.map(cantique => (
          <div key={cantique.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-[#2563EB] dark:text-blue-400 font-bold text-lg">{cantique.number}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{cantique.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cantique.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setEditingItem({ type: 'cantique', data: cantique });
                  setIsModalOpen(true);
                }}
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={() => confirmAction('Supprimer le cantique', 'Voulez-vous vraiment supprimer ce cantique ?', () => {
                  deleteCantique(cantique.id);
                  setConfirmDialog({...confirmDialog, isOpen: false});
                })}
                className="text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {cantiques.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
            Aucun cantique disponible.
          </div>
        )}
      </div>
    </div>
  );
};

  const renderMessagesModule = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Messages de Contact</h2>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 py-1 px-3 rounded-full text-xs font-bold">{contactMessages.length} messages</span>
        </div>

        <div className="space-y-3">
          {contactMessages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(msg => (
            <div key={msg.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{msg.subject}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">De: {msg.name}</p>
                </div>
                <button 
                  onClick={() => confirmAction('Supprimer le message', 'Voulez-vous vraiment supprimer ce message ?', () => {
                    deleteContactMessage(msg.id);
                    setConfirmDialog({...confirmDialog, isOpen: false});
                  })}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{msg.message}</p>
              <div className="text-[10px] text-slate-400">
                {new Date(msg.date).toLocaleString('fr-FR')}
              </div>
            </div>
          ))}
          {contactMessages.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
              Aucun message reçu.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactModule = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Gestion des Contacts</h2>
          <button 
            onClick={() => {
              setEditingItem({ type: 'contactInfo', data: JSON.parse(JSON.stringify(contactInfo)) });
              setIsModalOpen(true);
            }}
            className="bg-[#1E3A8A] text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform flex items-center gap-2"
          >
            <Edit3 size={16} /> Modifier les Infos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2 text-[#1E3A8A] dark:text-blue-400">
              <Phone size={18} />
              <h3 className="font-bold">Téléphone</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">{contactInfo.phone}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2 text-orange-600 dark:text-orange-400">
              <Mail size={18} />
              <h3 className="font-bold">Email</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">{contactInfo.email}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400">
              <MapPin size={18} />
              <h3 className="font-bold">Adresse</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">{contactInfo.address}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Lien Google Maps</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
            <Globe size={16} className="text-blue-500" />
            <p className="text-xs text-slate-500 truncate flex-1">{contactInfo.googleMapsUrl || 'Aucun lien défini'}</p>
            {contactInfo.googleMapsUrl && (
              <a href={contactInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-[10px] font-bold uppercase">Tester</a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAboutModule = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Gestion de la Section "À Propos"</h2>
          <button 
            onClick={() => {
              setEditingItem({ type: 'aboutInfo', data: JSON.parse(JSON.stringify(aboutInfo)) });
              setIsModalOpen(true);
            }}
            className="bg-[#1E3A8A] text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform flex items-center gap-2"
          >
            <Edit3 size={16} /> Modifier Tout
          </button>
        </div>

        {/* Vision & Mission Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 mb-2 flex items-center gap-2">
              <Target size={18} /> Vision
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{aboutInfo.vision}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 mb-2 flex items-center gap-2">
              <Info size={18} /> Mission
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{aboutInfo.mission}</p>
          </div>
        </div>

        {/* Values Preview */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 mb-4">Valeurs ({aboutInfo.values?.length || 0})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aboutInfo.values?.map((val, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#D9A05B] font-bold text-sm">{val.title}</span>
                </div>
                <p className="text-[10px] text-slate-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 mb-4">Timeline Historique</h3>
          <div className="space-y-3">
            {aboutInfo.historyTimeline?.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <span className="font-bold text-sm text-[#D9A05B] shrink-0 w-12">{event.year}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Header Admin */}
      <div className="bg-[#1E3A8A] dark:bg-slate-900 px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
          {activeModule ? (
            <button onClick={() => setActiveModule(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform">
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
              <ShieldAlert size={20} className="text-orange-400" />
            </div>
          )}
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              {activeModule === 'members' ? 'Membres' :
               activeModule === 'admins' ? 'Administrateurs' :
               activeModule === 'communication' ? 'Communication' :
               activeModule === 'activities' ? 'Activités' :
               activeModule === 'spiritual' ? 'Spiritualité' :
               activeModule === 'audios' ? 'Audios Bibliques' :
               activeModule === 'gallery' ? 'Galerie' :
               activeModule === 'archives' ? 'Archives' :
               activeModule === 'bureau' ? 'Bureau & Contacts' :
               activeModule === 'contributions' ? 'Contributions' :
               activeModule === 'cantiques' ? 'Cantiques' :
               activeModule === 'testimonies' ? 'Témoignages' :
               activeModule === 'about' ? 'À Propos' :
               'Dashboard'}
            </h1>
            <p className="text-blue-200 dark:text-blue-400 text-xs">Espace Administrateur</p>
          </div>
        </div>
        <button onClick={logout} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform">
          <LogOut size={18} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {!activeModule && renderDashboard()}
        {activeModule === 'members' && renderMembersModule()}
        {activeModule === 'admins' && renderAdminsModule()}
        {activeModule === 'communication' && renderCommunicationModule()}
        {activeModule === 'activities' && renderActivitiesModule()}
        {activeModule === 'spiritual' && renderSpiritualModule()}
        {activeModule === 'audios' && renderAudiosModule()}
        {activeModule === 'gallery' && renderGalleryModule()}
        {activeModule === 'archives' && renderArchivesModule()}
        {activeModule === 'bureau' && renderBureauModule()}
        {activeModule === 'contributions' && renderContributionsModule()}
        {activeModule === 'cantiques' && renderCantiquesModule()}
        {activeModule === 'testimonies' && renderTestimoniesModule()}
        {activeModule === 'about' && renderAboutModule()}
        {activeModule === 'contact' && renderContactModule()}
        {activeModule === 'messages' && renderMessagesModule()}
        {activeModule && activeModule !== 'members' && activeModule !== 'admins' && activeModule !== 'communication' && activeModule !== 'activities' && activeModule !== 'spiritual' && activeModule !== 'audios' && activeModule !== 'gallery' && activeModule !== 'archives' && activeModule !== 'bureau' && activeModule !== 'contributions' && activeModule !== 'cantiques' && activeModule !== 'about' && activeModule !== 'contact' && activeModule !== 'messages' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Module en construction</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ce module d'administration sera disponible prochainement.</p>
          </div>
        )}
      </div>

      {/* Assistant Intelligent */}
      <AdminAssistant />

      {/* GLOBAL CONFIRMATION MODAL */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg text-center mb-2">{confirmDialog.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">
              {confirmDialog.message}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})}
                className="flex-1 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 active:scale-95 transition-transform"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-transform"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Edit Modal */}
      {isModalOpen && editingItem.type === 'leaderMessage' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#D9A05B] text-xl">Mot du Responsable</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateLeaderMessage(editingItem.data);
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre</label>
                <input required type="text" value={editingItem.data.title} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#D9A05B] dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Contenu</label>
                <textarea required rows={5} value={editingItem.data.content} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#D9A05B] resize-none dark:text-white"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Auteur</label>
                  <input required type="text" value={editingItem.data.author} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, author: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#D9A05B] dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date</label>
                  <input required type="text" value={editingItem.data.date} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, date: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#D9A05B] dark:text-white" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#D9A05B] text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'announcement' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">{editingItem.data ? 'Modifier Annonce' : 'Nouvelle Annonce'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', content: '', category: 'Spirituel', date: '', isUrgent: false, author: 'Administration' };
              if (editingItem.data && editingItem.data.id) {
                updateAnnouncement(editingItem.data.id, formData);
              } else {
                addAnnouncement({ ...formData, author: 'Administration' });
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:focus:border-blue-500 dark:text-white" placeholder="Ex: Grande veillée..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Catégorie</label>
                  <select value={editingItem.data?.category || 'Spirituel'} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), category: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:focus:border-blue-500 dark:text-white">
                    <option>Spirituel</option><option>Organisation</option><option>Social</option><option>Formation</option><option>Évangélisation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date</label>
                  <input required type="text" value={editingItem.data?.date || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), date: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:focus:border-blue-500 dark:text-white" placeholder="Ex: 20 Janvier" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Contenu</label>
                <textarea required rows={4} value={editingItem.data?.content || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), content: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:focus:border-blue-500 resize-none dark:text-white" placeholder="Détails de l'annonce..."></textarea>
              </div>
              <label className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 cursor-pointer">
                <input type="checkbox" checked={editingItem.data?.isUrgent || false} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), isUrgent: e.target.checked}})} className="w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500" />
                <span className="text-red-700 dark:text-red-400 font-medium text-sm">Marquer comme Urgent</span>
              </label>
              <button type="submit" className="w-full bg-[#1E3A8A] dark:bg-blue-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Publier l\'annonce'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'audio' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-purple-600 dark:text-purple-400 text-xl">{editingItem.data ? 'Modifier Audio' : 'Nouvel Audio'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', description: '', url: '', date: new Date().toLocaleDateString('fr-FR') };
              
              if (editingItem.data && editingItem.data.id) {
                updateAudio(editingItem.data.id, formData);
              } else {
                addAudio({ ...formData, date: new Date().toLocaleDateString('fr-FR') });
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre de l'audio</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-500 dark:text-white" placeholder="Ex: Prédication du dimanche..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Description</label>
                <textarea required rows={3} value={editingItem.data?.description || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), description: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-500 resize-none dark:text-white" placeholder="Brève description de l'audio..."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">URL du fichier audio (MP3)</label>
                <input required type="url" value={editingItem.data?.url || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), url: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-500 dark:text-white" placeholder="https://..." />
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter l\'audio'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'aboutInfo' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 z-10 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">Modifier "À Propos"</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              updateAboutInfo(editingItem.data);
              setIsModalOpen(false);
            }} className="space-y-6">
              {/* Vision & Mission */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm border-b pb-1">Vision & Mission</h4>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Vision</label>
                  <textarea required rows={3} value={editingItem.data.vision} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, vision: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] resize-none dark:text-white text-sm"></textarea>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mission</label>
                  <textarea required rows={3} value={editingItem.data.mission} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, mission: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] resize-none dark:text-white text-sm"></textarea>
                </div>
              </div>

              {/* Values */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Valeurs</h4>
                  <button type="button" onClick={() => {
                    const newValues = [...editingItem.data.values, { icon: 'Info', title: 'Nouvelle Valeur', desc: '' }];
                    setEditingItem({...editingItem, data: {...editingItem.data, values: newValues}});
                  }} className="text-blue-600 text-xs font-bold">+ Ajouter</button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {editingItem.data.values.map((val: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <input required type="text" value={val.title} onChange={e => {
                          const newValues = [...editingItem.data.values];
                          newValues[idx].title = e.target.value;
                          setEditingItem({...editingItem, data: {...editingItem.data, values: newValues}});
                        }} className="bg-transparent font-bold text-sm text-[#1E3A8A] dark:text-blue-400 outline-none w-full" placeholder="Titre de la valeur" />
                        <button type="button" onClick={() => {
                          const newValues = editingItem.data.values.filter((_: any, i: number) => i !== idx);
                          setEditingItem({...editingItem, data: {...editingItem.data, values: newValues}});
                        }} className="text-red-500"><Trash2 size={14} /></button>
                      </div>
                      <input required type="text" value={val.desc} onChange={e => {
                        const newValues = [...editingItem.data.values];
                        newValues[idx].desc = e.target.value;
                        setEditingItem({...editingItem, data: {...editingItem.data, values: newValues}});
                      }} className="bg-transparent text-xs text-slate-600 dark:text-slate-400 outline-none w-full" placeholder="Description courte" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Timeline Historique</h4>
                  <button type="button" onClick={() => {
                    const newTimeline = [...editingItem.data.historyTimeline, { id: Date.now().toString(), year: '2026', description: '', color: 'blue' }];
                    setEditingItem({...editingItem, data: {...editingItem.data, historyTimeline: newTimeline}});
                  }} className="text-blue-600 text-xs font-bold">+ Ajouter</button>
                </div>
                <div className="space-y-3">
                  {editingItem.data.historyTimeline.map((event: any, idx: number) => (
                    <div key={event.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <input required type="text" value={event.year} onChange={e => {
                            const newTimeline = [...editingItem.data.historyTimeline];
                            newTimeline[idx].year = e.target.value;
                            setEditingItem({...editingItem, data: {...editingItem.data, historyTimeline: newTimeline}});
                          }} className="bg-transparent font-bold text-sm text-[#D9A05B] outline-none w-20" placeholder="Année" />
                          <select value={event.color} onChange={e => {
                            const newTimeline = [...editingItem.data.historyTimeline];
                            newTimeline[idx].color = e.target.value;
                            setEditingItem({...editingItem, data: {...editingItem.data, historyTimeline: newTimeline}});
                          }} className="bg-transparent text-[10px] font-bold uppercase outline-none">
                            <option value="emerald">Vert</option>
                            <option value="blue">Bleu</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                        <button type="button" onClick={() => {
                          const newTimeline = editingItem.data.historyTimeline.filter((_: any, i: number) => i !== idx);
                          setEditingItem({...editingItem, data: {...editingItem.data, historyTimeline: newTimeline}});
                        }} className="text-red-500"><Trash2 size={14} /></button>
                      </div>
                      <textarea required rows={2} value={event.description} onChange={e => {
                        const newTimeline = [...editingItem.data.historyTimeline];
                        newTimeline[idx].description = e.target.value;
                        setEditingItem({...editingItem, data: {...editingItem.data, historyTimeline: newTimeline}});
                      }} className="w-full bg-transparent text-xs text-slate-600 dark:text-slate-400 outline-none resize-none" placeholder="Description de l'événement..."></textarea>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-[#1E3A8A] text-white py-4 rounded-xl font-bold mt-4 active:scale-95 transition-transform shadow-lg shadow-blue-900/20 sticky bottom-0">Enregistrer les modifications</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'contactInfo' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1E3A8A] dark:text-blue-400 text-xl">Modifier Contacts</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              updateContactInfo(editingItem.data);
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Téléphone</label>
                <input required type="text" value={editingItem.data.phone} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, phone: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
                <input required type="email" value={editingItem.data.email} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, email: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Adresse</label>
                <textarea required rows={2} value={editingItem.data.address} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, address: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white text-sm resize-none"></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Lien Google Maps</label>
                <input type="url" value={editingItem.data.googleMapsUrl || ''} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, googleMapsUrl: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#1E3A8A] dark:text-white text-sm" placeholder="https://maps.google.com/..." />
              </div>
              <button type="submit" className="w-full bg-[#1E3A8A] text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'galleryEvent' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-fuchsia-600 dark:text-fuchsia-400 text-xl">{editingItem.data ? 'Modifier Album' : 'Nouvel Album'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', date: '', location: '' };
              
              if (editingItem.data && editingItem.data.id) {
                updateGalleryEvent(editingItem.data.id, formData);
              } else {
                addGalleryEvent(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre de l'album</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-fuchsia-500 dark:text-white" placeholder="Ex: Culte de Pâques 2026" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date (Mois Année)</label>
                  <input required type="text" value={editingItem.data?.date || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), date: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-fuchsia-500 dark:text-white" placeholder="Ex: Avril 2026" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Lieu</label>
                  <input required type="text" value={editingItem.data?.location || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), location: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-fuchsia-500 dark:text-white" placeholder="Ex: Temple CBE Mpaka" />
                </div>
              </div>
              <button type="submit" className="w-full bg-fuchsia-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Créer l\'album'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'galleryMedia' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-fuchsia-600 dark:text-fuchsia-400 text-xl">Ajouter des photos</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsCompressing(true);
              const files = editingItem.data.files || [];
              
              try {
                for (const file of files) {
                  // Compress image before adding
                  const compressedDataUrl = await compressImage(file);
                  addMediaToEvent(editingItem.data.eventId, { type: 'photo', url: compressedDataUrl });
                }
              } catch (error) {
                console.error("Error compressing image:", error);
                alert("Une erreur est survenue lors de la compression de l'image.");
              } finally {
                setIsCompressing(false);
                setIsModalOpen(false);
              }
            }} className="space-y-4">
              <div 
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) {
                      setEditingItem({...editingItem, data: {...editingItem.data, files: Array.from(e.target.files)}});
                    }
                  }}
                />
                <div className="w-16 h-16 bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} />
                </div>
                <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Cliquez pour sélectionner</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">ou glissez-déposez vos photos ici</p>
              </div>
              
              {editingItem.data?.files && editingItem.data.files.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{editingItem.data.files.length} fichier(s) sélectionné(s)</p>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                    {editingItem.data.files.map((file: File, index: number) => (
                      <div key={index} className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={!editingItem.data?.files || editingItem.data.files.length === 0 || isCompressing}
                className="w-full bg-fuchsia-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                {isCompressing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Compression et envoi...
                  </>
                ) : (
                  'Uploader les photos'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'archive' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 text-xl">{editingItem.data ? 'Modifier Archive' : 'Nouvelle Archive'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', summary: '', content: '', category: 'Histoire', date: new Date().toLocaleDateString('fr-FR') };
              
              if (editingItem.data && editingItem.data.id) {
                updateArchiveArticle(editingItem.data.id, formData);
              } else {
                addArchiveArticle({ ...formData, date: new Date().toLocaleDateString('fr-FR') });
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 dark:text-white" placeholder="Ex: Histoire de la sous-section..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Catégorie</label>
                <select value={editingItem.data?.category || 'Histoire'} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), category: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 dark:text-white">
                  <option>Histoire</option><option>Témoignage</option><option>Enseignement</option><option>Événement</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Résumé</label>
                <textarea required rows={2} value={editingItem.data?.summary || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), summary: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 resize-none dark:text-white" placeholder="Bref résumé..."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Contenu complet</label>
                <textarea required rows={5} value={editingItem.data?.content || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), content: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 resize-none dark:text-white" placeholder="Contenu détaillé..."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Image de l'article</label>
                <div className="space-y-3">
                  {editingItem.data?.imageUrl && (
                    <img src={editingItem.data.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                  )}
                  <label className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload size={20} className="text-amber-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Choisir une image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await handleFileUpload(file);
                          setEditingItem({...editingItem, data: {...(editingItem.data || {}), imageUrl: base64}});
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter l\'archive'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'member' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 text-xl">Modifier Informations</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingItem.data && editingItem.data.id) {
                updateMember(editingItem.data.id, editingItem.data);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Nom complet</label>
                <input required type="text" value={editingItem.data?.name || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), name: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Téléphone</label>
                  <input type="tel" value={editingItem.data?.phone || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), phone: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date de naissance</label>
                  <input type="date" value={editingItem.data?.birthDate || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), birthDate: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'bureau' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-cyan-600 dark:text-cyan-400 text-xl">{editingItem.data ? 'Modifier Membre' : 'Nouveau Membre'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { name: '', role: '', phone: '', email: '', whatsapp: '', department: 'Direction', imageUrl: '' };
              
              if (editingItem.data && editingItem.data.id) {
                updateBureauMember(editingItem.data.id, formData);
              } else {
                addBureauMember(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Nom complet</label>
                <input required type="text" value={editingItem.data?.name || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), name: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-500 dark:text-white" placeholder="Ex: Jean Dupont" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Rôle / Fonction</label>
                  <input required type="text" value={editingItem.data?.role || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), role: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-500 dark:text-white" placeholder="Ex: Pasteur Principal" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Département</label>
                  <input required type="text" value={editingItem.data?.department || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), department: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-500 dark:text-white" placeholder="Ex: Direction" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Téléphone</label>
                  <input required type="tel" value={editingItem.data?.phone || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), phone: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-500 dark:text-white" placeholder="+242 06 000 00 00" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">WhatsApp (Optionnel)</label>
                  <input type="tel" value={editingItem.data?.whatsapp || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), whatsapp: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-500 dark:text-white" placeholder="+242060000000" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Email (Optionnel)</label>
                <input type="email" value={editingItem.data?.email || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), email: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-500 dark:text-white" placeholder="email@exemple.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Photo du membre</label>
                <div className="flex items-center gap-3">
                  {editingItem.data?.imageUrl && (
                    <img src={editingItem.data.imageUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-500">Choisir une photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await handleFileUpload(file);
                          setEditingItem({...editingItem, data: {...(editingItem.data || {}), imageUrl: base64}});
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>
              <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter le membre'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'socialLink' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-cyan-600 dark:text-cyan-400 text-xl">{editingItem.data?.id ? 'Modifier Lien Social' : 'Nouveau Lien Social'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { platform: 'website', label: 'Site Web', url: '' };
              if (editingItem.data && editingItem.data.id) {
                updateSocialLink(editingItem.data.id, formData.url);
              } else {
                addSocialLink(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Plateforme</label>
                {editingItem.data?.id ? (
                  <div className="w-full bg-slate-100 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                    {editingItem.data?.platform}
                  </div>
                ) : (
                  <select required value={editingItem.data?.platform || 'website'} onChange={e => {
                    const platform = e.target.value;
                    let label = 'Site Web';
                    if (platform === 'facebook') label = 'Facebook';
                    if (platform === 'youtube') label = 'YouTube';
                    if (platform === 'whatsapp') label = 'WhatsApp';
                    if (platform === 'instagram') label = 'Instagram';
                    setEditingItem({...editingItem, data: {...(editingItem.data || {}), platform, label}});
                  }} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-500 dark:text-white">
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="website">Site Web</option>
                  </select>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">URL du lien</label>
                <input required type="url" value={editingItem.data?.url || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), url: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-500 dark:text-white" placeholder="https://..." />
              </div>
              <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'contributionCategory' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{editingItem.data ? 'Modifier Projet' : 'Nouveau Projet'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { name: '', description: '', targetAmount: '' };
              const payload = {
                name: formData.name,
                description: formData.description,
                targetAmount: formData.targetAmount ? parseInt(formData.targetAmount) : undefined
              };
              
              if (editingItem.data && editingItem.data.id) {
                updateContributionCategory(editingItem.data.id, payload);
              } else {
                addContributionCategory(payload);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Nom du projet</label>
                <input required type="text" value={editingItem.data?.name || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), name: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" placeholder="Ex: Construction du Temple" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Description</label>
                <textarea required rows={3} value={editingItem.data?.description || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), description: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 resize-none dark:text-white" placeholder="Objectif du projet..."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Objectif financier (Optionnel - FCFA)</label>
                <input type="number" value={editingItem.data?.targetAmount || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), targetAmount: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" placeholder="Ex: 5000000" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Créer le projet'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'contributionRecord' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">Nouveau Versement</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { categoryId: '', memberName: '', amount: '', date: new Date().toISOString().split('T')[0] };
              
              addContributionRecord({
                categoryId: formData.categoryId,
                memberName: formData.memberName,
                amount: parseInt(formData.amount),
                date: formData.date
              });
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Projet</label>
                <select required value={editingItem.data?.categoryId || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), categoryId: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-600 dark:focus:border-emerald-500 dark:text-white">
                  <option value="" disabled>Choisir un projet...</option>
                  {contributionCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Nom du membre</label>
                <input required type="text" value={editingItem.data?.memberName || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), memberName: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-600 dark:focus:border-emerald-500 dark:text-white" placeholder="Nom et Prénom" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Montant (FCFA)</label>
                  <input required type="number" value={editingItem.data?.amount || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), amount: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-600 dark:focus:border-emerald-500 dark:text-white" placeholder="Ex: 50000" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date</label>
                  <input required type="date" value={editingItem.data?.date || new Date().toISOString().split('T')[0]} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), date: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-600 dark:focus:border-emerald-500 dark:text-white" />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 dark:bg-emerald-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Enregistrer le versement</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'activity' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">{editingItem.data ? 'Modifier Activité' : 'Nouvelle Activité'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', type: 'Culte', date: '', time: '', location: 'Temple CBE Mpaka', day: 'Dimanche', fullDate: '' };
              
              // Format date
              const dateObj = new Date(formData.fullDate || new Date());
              const formattedDate = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).replace('.', '');
              const formattedDay = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
              const finalData = { ...formData, date: formattedDate, day: formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1) };

              if (editingItem.data && editingItem.data.id) {
                updateActivity(editingItem.data.id, finalData);
              } else {
                addActivity(finalData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre de l'activité</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 dark:text-white" placeholder="Ex: Culte d'Enseignement" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Type</label>
                  <select value={editingItem.data?.type || 'Culte'} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), type: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 dark:text-white">
                    <option>Culte</option><option>Prière</option><option>Répétition</option><option>Évangélisation</option><option>Réunion</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date</label>
                  <input required type="date" value={editingItem.data?.fullDate || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), fullDate: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Heure</label>
                  <input required type="text" value={editingItem.data?.time || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), time: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 dark:text-white" placeholder="Ex: 17:00 - 19:00" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Lieu</label>
                  <input required type="text" value={editingItem.data?.location || 'Temple CBE Mpaka'} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), location: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 dark:text-white" />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter l\'activité'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'prayer' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#E11D48] dark:text-rose-400 text-xl">{editingItem.data ? 'Modifier Prière' : 'Nouvelle Prière'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', content: '', category: 'Spirituel', isUrgent: false, author: 'Administration', date: new Date().toLocaleDateString('fr-FR') };
              if (editingItem.data && editingItem.data.id) {
                updatePrayer(editingItem.data.id, formData);
              } else {
                addPrayer({ ...formData, author: 'Administration', date: new Date().toLocaleDateString('fr-FR') });
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre de la prière</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#E11D48] dark:focus:border-rose-500 dark:text-white" placeholder="Ex: Prière pour la nation..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Catégorie</label>
                <select value={editingItem.data?.category || 'Spirituel'} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), category: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#E11D48] dark:focus:border-rose-500 dark:text-white">
                  <option>Santé</option><option>Action de grâce</option><option>Travail</option><option>Famille</option><option>Spirituel</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Contenu de la prière</label>
                <textarea required rows={5} value={editingItem.data?.content || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), content: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#E11D48] dark:focus:border-rose-500 resize-none dark:text-white" placeholder="Seigneur, nous te prions pour..."></textarea>
              </div>
              <label className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 cursor-pointer">
                <input type="checkbox" checked={editingItem.data?.isUrgent || false} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), isUrgent: e.target.checked}})} className="w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500" />
                <span className="text-red-700 dark:text-red-400 font-medium text-sm">Marquer comme Urgent</span>
              </label>
              <button type="submit" className="w-full bg-[#E11D48] dark:bg-rose-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Publier la prière'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'cantique' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 text-xl">{editingItem.data ? 'Modifier Cantique' : 'Nouveau Cantique'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', number: '', category: 'Louange', lyrics: '' };
              if (editingItem.data && editingItem.data.id) {
                updateCantique(editingItem.data.id, formData);
              } else {
                addCantique(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Numéro</label>
                  <input required type="text" value={editingItem.data?.number || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), number: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white" placeholder="Ex: 1" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre du cantique</label>
                  <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white" placeholder="Ex: À toi la gloire" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Catégorie</label>
                <select value={editingItem.data?.category || 'Louange'} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), category: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white">
                  <option>Louange</option><option>Adoration</option><option>Prière</option><option>Consolation</option><option>Appel</option><option>Soir</option><option>Guérison</option><option>Consécration</option><option>Grâce</option><option>Refuge</option><option>Présence</option><option>Joie</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Paroles</label>
                <p className="text-[10px] text-slate-400 mb-2">Utilisez [Couplet 1], [Refrain], etc. pour structurer le texte.</p>
                <textarea required rows={8} value={editingItem.data?.lyrics || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), lyrics: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 resize-none dark:text-white font-serif" placeholder="[Couplet 1]..."></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter le cantique'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'history' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 text-xl">Modifier l'Histoire</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateHistory(editingItem.data);
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date de fondation</label>
                <input required type="text" value={editingItem.data?.foundationDate || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), foundationDate: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-600 dark:focus:border-blue-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Contenu</label>
                <textarea required rows={5} value={editingItem.data?.content || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), content: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-600 dark:focus:border-blue-500 resize-none dark:text-white"></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Objectifs spirituels</label>
                <textarea required rows={3} value={editingItem.data?.spiritualGoals || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), spiritualGoals: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-600 dark:focus:border-blue-500 resize-none dark:text-white"></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Moments marquants</label>
                <textarea required rows={3} value={editingItem.data?.milestones || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), milestones: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-600 dark:focus:border-blue-500 resize-none dark:text-white"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'pastBureau' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{editingItem.data ? 'Modifier Bureau' : 'Nouveau Bureau'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { yearRange: '', leader: '', viceLeader: '', secretary: '', deputySecretary: '', treasurer: '', deputyTreasurer: '', description: '' };
              if (editingItem.data && editingItem.data.id) {
                updateBureau(editingItem.data.id, formData);
              } else {
                addBureau(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Années (Ex: 2018-2020)</label>
                <input required type="text" value={editingItem.data?.yearRange || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), yearRange: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Leader</label>
                <input required type="text" value={editingItem.data?.leader || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), leader: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Vice leader</label>
                <input required type="text" value={editingItem.data?.viceLeader || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), viceLeader: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Secrétaire générale</label>
                <input required type="text" value={editingItem.data?.secretary || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), secretary: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Secrétaire générale adjointe</label>
                <input required type="text" value={editingItem.data?.deputySecretary || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), deputySecretary: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Trésorière générale</label>
                <input required type="text" value={editingItem.data?.treasurer || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), treasurer: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Trésorier adjoint</label>
                <input required type="text" value={editingItem.data?.deputyTreasurer || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), deputyTreasurer: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Description</label>
                <textarea required rows={3} value={editingItem.data?.description || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), description: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 resize-none dark:text-white"></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter'}</button>
            </form>
          </div>
        </div>
      )}


      {isModalOpen && editingItem.type === 'report' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">{editingItem.data ? 'Modifier Rapport' : 'Nouveau Rapport'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', year: '', fileUrl: '' };
              if (editingItem.data && editingItem.data.id) {
                updateReport(editingItem.data.id, formData);
              } else {
                addReport(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-600 dark:focus:border-emerald-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Année</label>
                <input required type="text" value={editingItem.data?.year || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), year: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-600 dark:focus:border-emerald-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Fichier du rapport (PDF)</label>
                <label className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload size={20} className="text-emerald-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {editingItem.data?.fileUrl ? 'Fichier sélectionné' : 'Télécharger le PDF'}
                  </span>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await handleFileUpload(file);
                        setEditingItem({...editingItem, data: {...(editingItem.data || {}), fileUrl: base64}});
                      }
                    }} 
                  />
                </label>
              </div>
              <button type="submit" className="w-full bg-emerald-600 dark:bg-emerald-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'photo' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-orange-600 dark:text-orange-400 text-xl">{editingItem.data ? 'Modifier Photo' : 'Nouvelle Photo'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', description: '', year: '', imageUrl: '' };
              if (editingItem.data && editingItem.data.id) {
                updateHistoricalPhoto(editingItem.data.id, formData);
              } else {
                addHistoricalPhoto(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-orange-600 dark:focus:border-orange-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Description</label>
                <textarea required rows={3} value={editingItem.data?.description || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), description: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-orange-600 dark:focus:border-orange-500 resize-none dark:text-white"></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Année</label>
                <input required type="text" value={editingItem.data?.year || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), year: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-orange-600 dark:focus:border-orange-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Image historique</label>
                <div className="space-y-3">
                  {editingItem.data?.imageUrl && (
                    <img src={editingItem.data.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                  )}
                  <label className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload size={20} className="text-orange-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Choisir une image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await handleFileUpload(file);
                          setEditingItem({...editingItem, data: {...(editingItem.data || {}), imageUrl: base64}});
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>
              <button type="submit" className="w-full bg-orange-600 dark:bg-orange-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter'}</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'archiveAudio' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-purple-600 dark:text-purple-400 text-xl">{editingItem.data ? 'Modifier Audio' : 'Nouvel Audio'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', description: '', audioUrl: '', date: new Date().toLocaleDateString('fr-FR'), category: 'Enseignement' };
              if (editingItem.data && editingItem.data.id) {
                updateArchiveAudio(editingItem.data.id, formData);
              } else {
                addArchiveAudio(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-600 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Catégorie</label>
                <select value={editingItem.data?.category || 'Enseignement'} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), category: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-600 dark:text-white">
                  <option>Enseignement</option><option>Témoignage</option><option>Chant</option><option>Interview</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Fichier Audio</label>
                <label className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Music size={20} className="text-purple-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {editingItem.data?.audioUrl ? 'Audio sélectionné' : 'Choisir un fichier audio'}
                  </span>
                  <input 
                    type="file" 
                    accept="audio/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await handleFileUpload(file);
                        setEditingItem({...editingItem, data: {...(editingItem.data || {}), audioUrl: base64}});
                      }
                    }} 
                  />
                </label>
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && editingItem.type === 'timeline' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-rose-600 dark:text-rose-400 text-xl">{editingItem.data ? 'Modifier Événement' : 'Nouvel Événement'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { year: '', title: '', description: '' };
              if (editingItem.data && editingItem.data.id) {
                updateTimelineEvent(editingItem.data.id, formData);
              } else {
                addTimelineEvent(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Année</label>
                <input required type="text" value={editingItem.data?.year || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), year: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-600 dark:focus:border-rose-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-600 dark:focus:border-rose-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Description</label>
                <textarea required rows={3} value={editingItem.data?.description || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), description: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-600 dark:focus:border-rose-500 resize-none dark:text-white"></textarea>
              </div>
              <button type="submit" className="w-full bg-rose-600 dark:bg-rose-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter'}</button>
            </form>
          </div>
        </div>
      )}




      {/* MODALS DE CRÉATION */}
      
      {/* Modal Modifier Méditation */}
      {showEditMeditation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 text-xl">Verset du Jour</h3>
              <button onClick={() => setShowEditMeditation(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (medFormData.id) {
                updateMeditation(medFormData.id, medFormData);
              } else {
                addMeditation(medFormData);
              }
              setShowEditMeditation(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Référence</label>
                <input required type="text" value={medFormData.reference || ''} onChange={e => setMedFormData({...medFormData, reference: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:focus:border-amber-500 dark:text-white" placeholder="Ex: Jean 3:16" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Texte du verset</label>
                <textarea required rows={3} value={medFormData.text || ''} onChange={e => setMedFormData({...medFormData, text: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:focus:border-amber-500 resize-none dark:text-white" placeholder="Le texte du verset..."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Exhortation</label>
                <textarea required rows={5} value={medFormData.exhortation || ''} onChange={e => setMedFormData({...medFormData, exhortation: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:focus:border-amber-500 resize-none dark:text-white" placeholder="Votre message d'exhortation..."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date d'affichage</label>
                <input required type="date" value={medFormData.date || ''} onChange={e => setMedFormData({...medFormData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:focus:border-amber-500 dark:text-white" />
              </div>
              <button type="submit" className="w-full bg-amber-600 dark:bg-amber-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Mettre à jour le verset</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Daily Verse */}
      {isModalOpen && editingItem.type === 'dailyVerse' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 text-xl">{editingItem.data?.id ? 'Modifier Verset' : 'Nouveau Verset'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                date: (e.currentTarget.elements.namedItem('date') as HTMLInputElement).value,
                reference: (e.currentTarget.elements.namedItem('reference') as HTMLInputElement).value,
                text: (e.currentTarget.elements.namedItem('text') as HTMLTextAreaElement).value,
                themeId: (e.currentTarget.elements.namedItem('themeId') as HTMLInputElement).value,
              };
              if (editingItem.data?.id) {
                updateDailyVerse(editingItem.data.id, formData);
              } else {
                addDailyVerse(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <input type="hidden" name="themeId" defaultValue={editingItem.data?.themeId || ''} />
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date</label>
                <input required name="date" type="date" defaultValue={editingItem.data?.date || ''} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Référence</label>
                <input required name="reference" type="text" defaultValue={editingItem.data?.reference || ''} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:text-white" placeholder="Ex: Jean 3:16" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Texte</label>
                <textarea required name="text" rows={4} defaultValue={editingItem.data?.text || ''} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 resize-none dark:text-white" placeholder="Le texte du verset..."></textarea>
              </div>
              <button type="submit" className="w-full bg-amber-600 dark:bg-amber-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">
                {editingItem.data?.id ? 'Mettre à jour' : 'Ajouter au thème'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Archive */}
      {isModalOpen && editingItem.type === 'archive' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 text-xl">{editingItem.data ? 'Modifier Archive' : 'Nouvelle Archive'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = editingItem.data || { title: '', date: new Date().toLocaleDateString('fr-FR'), category: '', content: '', summary: '' };
              if (editingItem.data && editingItem.data.id) {
                updateArchiveArticle(editingItem.data.id, formData);
              } else {
                addArchiveArticle(formData);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre</label>
                <input required type="text" value={editingItem.data?.title || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), title: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:focus:border-amber-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Catégorie</label>
                <input required type="text" value={editingItem.data?.category || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), category: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:focus:border-amber-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Résumé</label>
                <textarea required rows={2} value={editingItem.data?.summary || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), summary: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:focus:border-amber-500 resize-none dark:text-white"></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Contenu complet</label>
                <textarea required rows={5} value={editingItem.data?.content || ''} onChange={e => setEditingItem({...editingItem, data: {...(editingItem.data || {}), content: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-600 dark:focus:border-amber-500 resize-none dark:text-white"></textarea>
              </div>
              <button type="submit" className="w-full bg-amber-600 dark:bg-amber-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">{editingItem.data?.id ? 'Enregistrer' : 'Ajouter l\'archive'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier Thème Semaine */}
      {showEditWeeklyTheme && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-cyan-600 dark:text-cyan-400 text-xl">Thème de la Semaine</h3>
              <button onClick={() => setShowEditWeeklyTheme(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (themeFormData.id) {
                updateWeeklyThemeById(themeFormData.id, themeFormData);
              } else {
                addWeeklyTheme(themeFormData);
              }
              setShowEditWeeklyTheme(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Titre du thème</label>
                <input required type="text" value={themeFormData.title || ''} onChange={e => setThemeFormData({...themeFormData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-600 dark:focus:border-cyan-500 dark:text-white" placeholder="Ex: La marche par l'Esprit" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Référence</label>
                <input required type="text" value={themeFormData.reference || ''} onChange={e => setThemeFormData({...themeFormData, reference: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-600 dark:focus:border-cyan-500 dark:text-white" placeholder="Ex: Galates 5:16" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Verset clé</label>
                <textarea required rows={3} value={themeFormData.text || ''} onChange={e => setThemeFormData({...themeFormData, text: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-600 dark:focus:border-cyan-500 resize-none dark:text-white" placeholder="Le verset clé du thème..."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Description / Méditation</label>
                <textarea required rows={4} value={themeFormData.description || ''} onChange={e => setThemeFormData({...themeFormData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-600 dark:focus:border-cyan-500 resize-none dark:text-white" placeholder="Développement du thème..."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date de début</label>
                <input required type="date" value={themeFormData.startDate || ''} onChange={e => setThemeFormData({...themeFormData, startDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-600 dark:focus:border-cyan-500 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date de fin</label>
                <input required type="date" value={themeFormData.endDate || ''} onChange={e => setThemeFormData({...themeFormData, endDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-600 dark:focus:border-cyan-500 dark:text-white" />
              </div>
              <button type="submit" className="w-full bg-cyan-600 dark:bg-cyan-700 text-white py-4 rounded-xl font-bold mt-2 active:scale-95 transition-transform">Mettre à jour le thème</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
