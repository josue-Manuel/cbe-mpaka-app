import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronRight, User, Calendar, TrendingUp, Info, Search } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useProfile } from '../context/ProfileContext';

export default function Contributions() {
  const { contributionCategories, contributionRecords } = useAppData();
  const { profile } = useProfile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter records for the current user
  const myRecords = contributionRecords.filter(r => 
    profile && (r.memberName?.toLowerCase() || '') === `${profile.firstName} ${profile.lastName}`.toLowerCase()
  );

  const totalContributed = myRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const filteredCategories = contributionCategories.filter(c => 
    (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getCategoryTotal = (categoryId: string) => {
    return contributionRecords
      .filter(r => r.categoryId === categoryId)
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-[#1E3A8A] pt-12 pb-8 px-6 rounded-b-[30px] shadow-lg">
        <h1 className="text-white text-2xl font-bold flex items-center gap-2 mb-2">
          <Wallet size={24} />
          Contributions
        </h1>
        <p className="text-blue-100 text-sm opacity-90">
          Suivez vos versements et les projets de la sous-section.
        </p>
      </div>

      {/* Summary Card */}
      <div className="px-6 -mt-6">
        <div className="bg-gradient-to-br from-[#D9A05B] to-amber-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">Total versé par moi</p>
            <h2 className="text-3xl font-bold mb-4">{totalContributed.toLocaleString()} FCFA</h2>
            <div className="flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-full">
              <TrendingUp size={14} />
              <span>{myRecords.length} versements effectués</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Search */}
      <div className="px-6 mt-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          />
        </div>

        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Info size={18} className="text-[#1E3A8A]" />
          Projets en cours
        </h3>

        <div className="space-y-4">
          {filteredCategories.map(category => {
            const total = getCategoryTotal(category.id);
            const isSelected = selectedCategory === category.id;
            const categoryRecords = contributionRecords.filter(r => r.categoryId === category.id);

            return (
              <motion.div 
                key={category.id}
                layout
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div 
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  className="p-4 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{category.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{category.description}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold text-[#1E3A8A] text-sm">{total.toLocaleString()} FCFA</p>
                    {category.targetAmount && (
                      <p className="text-[10px] text-slate-400">Objectif: {category.targetAmount.toLocaleString()}</p>
                    )}
                  </div>
                  <ChevronRight size={18} className={`text-slate-300 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>

                {/* Progress Bar */}
                {category.targetAmount && (
                  <div className="px-4 pb-4">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((total / category.targetAmount) * 100, 100)}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Details / List of contributors */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-50 border-t border-slate-100"
                    >
                      <div className="p-4 space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Liste des contributeurs</p>
                        {categoryRecords.length > 0 ? (
                          categoryRecords.map(record => (
                            <div key={record.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1E3A8A]">
                                  <User size={14} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{record.memberName}</p>
                                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <Calendar size={10} />
                                    <span>{record.date}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="font-bold text-emerald-600 text-sm">+{record.amount.toLocaleString()}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-slate-400 text-sm py-4 italic">Aucun versement pour le moment.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* My History Section */}
      <div className="px-6 mt-10">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-[#D9A05B]" />
          Mon historique
        </h3>
        
        <div className="space-y-3">
          {myRecords.length > 0 ? (
            myRecords.map(record => {
              const category = contributionCategories.find(c => c.id === record.categoryId);
              return (
                <div key={record.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#D9A05B]">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{category?.name || 'Projet inconnu'}</p>
                      <p className="text-xs text-slate-400">{record.date}</p>
                    </div>
                  </div>
                  <p className="font-bold text-[#1E3A8A]">{record.amount.toLocaleString()} FCFA</p>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center">
              <p className="text-slate-400 text-sm italic">Vous n'avez pas encore effectué de versement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
