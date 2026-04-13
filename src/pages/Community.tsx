import { Users, MessageCircle, Heart, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Community() {
  const navigate = useNavigate();
  const members = [
    { id: 1, name: "Frère Jean", role: "Président des Jeunes", avatar: "J" },
    { id: 2, name: "Sœur Marie", role: "Choriste", avatar: "M" },
    { id: 3, name: "Papa Paul", role: "Ancien", avatar: "P" },
    { id: 4, name: "Maman Sarah", role: "Intercession", avatar: "S" },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-heading font-bold text-[#0A192F] dark:text-blue-400 flex items-center gap-2">
        <Users className="text-[#6A1B9A] dark:text-purple-400" />
        Communauté
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Card variant="elevated" className="border-0 bg-gradient-to-br from-[#F3E5F5] to-white dark:from-slate-800 dark:to-slate-900 text-center p-6">
          <MessageCircle className="mx-auto text-[#6A1B9A] dark:text-purple-400 mb-3" size={32} />
          <h3 className="font-heading font-bold text-[#0A192F] dark:text-white mb-1">Forum</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Discussions et partages</p>
          <Button variant="outline" size="sm" className="w-full border-[#6A1B9A] dark:border-purple-400 text-[#6A1B9A] dark:text-purple-400 hover:bg-[#F3E5F5] dark:hover:bg-purple-900/20 focus:ring-[#6A1B9A]">Rejoindre</Button>
        </Card>

        <Card variant="elevated" className="border-0 bg-gradient-to-br from-[#FFF8E1] to-white dark:from-slate-800 dark:to-slate-900 text-center p-6">
          <Star className="mx-auto text-[#F57F17] dark:text-amber-400 mb-3" size={32} />
          <h3 className="font-heading font-bold text-[#0A192F] dark:text-white mb-1">Témoignages</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Ce que Dieu a fait</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-[#F57F17] dark:border-amber-400 text-[#F57F17] dark:text-amber-400 hover:bg-[#FFF8E1] dark:hover:bg-amber-900/20 focus:ring-[#F57F17]"
            onClick={() => navigate('/app/testimonies')}
          >
            Lire
          </Button>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-heading font-bold text-[#0A192F] dark:text-white">Membres Actifs</h3>
        </div>
        
        <Card variant="elevated" className="border-0 p-2 dark:bg-slate-800">
          {members.map((member, index) => (
            <div key={member.id} className={`flex items-center justify-between p-3 ${index !== members.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E3F2FD] dark:bg-blue-900/20 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center font-heading font-bold text-lg">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-heading font-bold text-[#0A192F] dark:text-white">{member.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{member.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full dark:text-slate-400">
                <MessageCircle size={18} />
              </Button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
