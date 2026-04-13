import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Bell, BellRing, CalendarPlus, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useState, useEffect } from 'react';

export default function Activities() {
  const { activities } = useAppData();
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Load reminders from local storage
  const [reminders, setReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem('cbe_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // Save reminders to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cbe_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(currentMonth);

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startOffset = (firstDayOfMonth(year, month) + 6) % 7; // Adjust for Monday start

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const getActivitiesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.filter(a => a.fullDate === dateStr);
  };

  const nextMonth = () => { setCurrentMonth(new Date(year, month + 1)); setSelectedDay(null); };
  const prevMonth = () => { setCurrentMonth(new Date(year, month - 1)); setSelectedDay(null); };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const addToCalendar = (activity: any) => {
    const dateStr = activity.fullDate.replace(/-/g, ''); // YYYYMMDD
    
    let startTime = "090000";
    let endTime = "110000";
    
    if (activity.time) {
      const timeParts = activity.time.split('-');
      if (timeParts.length > 0) {
        const startClean = timeParts[0].trim().replace(':', '');
        startTime = startClean.padEnd(6, '0');
      }
      if (timeParts.length > 1) {
        const endClean = timeParts[1].trim().replace(':', '');
        endTime = endClean.padEnd(6, '0');
      } else {
        // If no end time, assume 2 hours duration
        const startHour = parseInt(startTime.substring(0, 2));
        endTime = `${String(startHour + 2).padStart(2, '0')}${startTime.substring(2)}`;
      }
    }

    const startDateTime = `${dateStr}T${startTime}`;
    const endDateTime = `${dateStr}T${endTime}`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(activity.title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(activity.type)}&location=${encodeURIComponent(activity.location)}`;
    window.open(url, '_blank');
  };

  // Sort activities by date
  const sortedActivities = [...activities].sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  
  // Filter activities based on view and selected day
  let displayedActivities = sortedActivities;
  if (view === 'calendar') {
    if (selectedDay) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      displayedActivities = sortedActivities.filter(a => a.fullDate === dateStr);
    } else {
      // Show activities for the current month
      displayedActivities = sortedActivities.filter(a => {
        const aDate = new Date(a.fullDate);
        return aDate.getMonth() === month && aDate.getFullYear() === year;
      });
    }
  }

  return (
    <div className="p-4 bg-[#F8FAFC] dark:bg-[#0A192F] min-h-screen pb-24">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-400 mb-2">Agenda CBE</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Ne manquez aucun de nos rendez-vous.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => { setView('calendar'); setSelectedDay(null); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'calendar' ? 'bg-[#1E3A8A] dark:bg-blue-600 text-white shadow-md' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Calendrier
          </button>
          <button 
            onClick={() => { setView('list'); setSelectedDay(null); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'list' ? 'bg-[#1E3A8A] dark:bg-blue-600 text-white shadow-md' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Liste
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-lg capitalize">{monthName} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 active:scale-90 transition-transform">
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 active:scale-90 transition-transform">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const dayActivities = day ? getActivitiesForDay(day) : [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              const isSelected = day === selectedDay;
              
              return (
                <button 
                  key={idx} 
                  onClick={() => day && setSelectedDay(isSelected ? null : day)}
                  disabled={!day}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    day ? 'hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer' : 'opacity-0 cursor-default'
                  } ${
                    isSelected ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-[#2563EB] dark:ring-blue-500' : (day ? 'bg-slate-50/50 dark:bg-slate-700/50' : '')
                  }`}
                >
                  {day && (
                    <>
                      <span className={`text-sm font-bold ${isToday && !isSelected ? 'text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 w-7 h-7 flex items-center justify-center rounded-full' : (isSelected ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-700 dark:text-slate-300')}`}>
                        {day}
                      </span>
                      {dayActivities.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {dayActivities.slice(0, 3).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400 shadow-sm"></div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1 mb-2">
          <h3 className="text-[#1E3A8A] dark:text-blue-400 font-bold text-lg">
            {view === 'list' ? 'Toutes les activités à venir' : (selectedDay ? `Activités du ${selectedDay} ${monthName}` : 'Activités du mois')}
          </h3>
          {selectedDay && (
            <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {displayedActivities.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed">
            <CalendarIcon size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Aucune activité prévue.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-blue-100 dark:border-blue-900/50 ml-4 space-y-6">
            {displayedActivities.map((activity) => {
              const isReminded = reminders.includes(activity.id);
              return (
                <div key={activity.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#2563EB] dark:bg-blue-600 border-4 border-[#F8FAFC] dark:border-[#0A192F]"></div>
                  
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-[#D9A05B] text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">{activity.type}</span>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{activity.title}</h3>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 px-3 py-1.5 rounded-xl text-center min-w-[55px] border border-blue-100 dark:border-blue-800/50">
                        <p className="text-[10px] font-bold uppercase">{activity.day.substring(0, 3)}</p>
                        <p className="text-base font-black">{activity.date.split(' ')[0]}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                        <Clock size={16} className="text-slate-400" />
                        <span className="font-medium">{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                        <MapPin size={16} className="text-slate-400" />
                        <span className="font-medium">{activity.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <button 
                        onClick={() => addToCalendar(activity)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors active:scale-95"
                      >
                        <CalendarPlus size={16} />
                        Agenda
                      </button>
                      <button 
                        onClick={() => toggleReminder(activity.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          isReminded 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' 
                            : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isReminded ? <BellRing size={16} /> : <Bell size={16} />}
                        {isReminded ? 'Rappel activé' : 'M\'alerter'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
