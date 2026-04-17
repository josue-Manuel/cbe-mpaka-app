import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppData } from './AppDataContext';

interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface NotificationContextType {
  isPushEnabled: boolean;
  togglePushNotifications: () => Promise<void>;
  sendTestNotification: () => void;
  notifications: InAppNotification[];
  addNotification: (title: string, message: string, type?: InAppNotification['type']) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { activities } = useAppData();
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cbe_push_enabled') === 'true';
  });
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('cbe_in_app_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cbe_in_app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (title: string, message: string, type: InAppNotification['type'] = 'info') => {
    const newNotif: InAppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Register Service Worker for background notifications
  useEffect(() => {
    // Already handled in main.tsx
  }, []);

  const togglePushNotifications = async () => {
    try {
      if (!('Notification' in window)) {
        console.warn("Notifications not supported in this browser");
        return;
      }

      if (!isPushEnabled) {
        // If already denied, we can't request again
        if (Notification.permission === 'denied') {
          console.warn("Notification permission was previously denied");
          // We still toggle the UI state so the user can see it's "off" or try to enable
          // but we should inform them
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setIsPushEnabled(true);
          localStorage.setItem('cbe_push_enabled', 'true');
          
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification("Notifications activées ✅", {
              body: "Vous recevrez désormais des rappels pour les cultes et la méditation quotidienne.",
              icon: '/vite.svg'
            });
          }
        }
      } else {
        setIsPushEnabled(false);
        localStorage.setItem('cbe_push_enabled', 'false');
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }
  };

  const sendTestNotification = async () => {
    if (isPushEnabled && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification("Rappel : Culte d'Enseignement 📖", {
          body: "N'oubliez pas le culte d'enseignement ce soir à 17h au Temple CBE Mpaka.",
          icon: '/vite.svg'
        });
      } else {
        new Notification("Rappel : Culte d'Enseignement 📖", {
          body: "N'oubliez pas le culte d'enseignement ce soir à 17h au Temple CBE Mpaka.",
        });
      }
    } else {
      alert("Les notifications ne sont pas activées. Veuillez les activer d'abord.");
    }
  };

  // Helper to schedule OS-level notification using Notification Triggers API (if supported)
  const scheduleOSNotification = async (id: string, title: string, body: string, timestamp: number) => {
    if (!('serviceWorker' in navigator)) return false;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already scheduled
      const scheduled = JSON.parse(localStorage.getItem('cbe_scheduled_notifs') || '{}');
      if (scheduled[id] === timestamp) return true; // Already scheduled for this exact time
      
      // Use Notification Triggers API if available (OS-level scheduling)
      if ('showTrigger' in Notification.prototype && 'TimestampTrigger' in window) {
        // @ts-ignore
        await registration.showNotification(title, {
          tag: id,
          body: body,
          icon: '/vite.svg',
          // @ts-ignore
          showTrigger: new window.TimestampTrigger(timestamp)
        });
        
        scheduled[id] = timestamp;
        localStorage.setItem('cbe_scheduled_notifs', JSON.stringify(scheduled));
        return true;
      }
    } catch (e) {
      console.error("OS Scheduling failed", e);
    }
    return false;
  };

  // Background task simulator & OS Scheduler
  useEffect(() => {
    if (!isPushEnabled || Notification.permission !== 'granted') return;

    const scheduleAll = async () => {
      const now = new Date();
      
      // 1. Schedule Daily Meditation for the next 7 days (OS-level)
      for (let i = 0; i < 7; i++) {
        const medDate = new Date(now);
        medDate.setDate(now.getDate() + i);
        medDate.setHours(8, 0, 0, 0);
        
        if (medDate.getTime() > now.getTime()) {
          const id = `meditation_${medDate.toDateString()}`;
          await scheduleOSNotification(
            id, 
            "Méditation Quotidienne 🙏", 
            "Il est l'heure de votre méditation quotidienne. Prenez un moment avec Dieu.", 
            medDate.getTime()
          );
        }
      }

      // 2. Schedule Activities (1 hour before)
      activities.forEach(async (activity) => {
        const timeParts = activity.time.split(' - ')[0].split(':');
        if (timeParts.length === 2) {
          const actHour = parseInt(timeParts[0], 10);
          const actMin = parseInt(timeParts[1], 10);
          
          // Try to guess the date from "26 Fév"
          const dateParts = activity.date.split(' ');
          if (dateParts.length >= 2) {
            const day = parseInt(dateParts[0], 10);
            const monthStr = (dateParts[1] || '').toLowerCase();
            const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
            const month = months.findIndex(m => {
              if (!monthStr) return false;
              try {
                return monthStr && monthStr.indexOf(m) === 0;
              } catch (e) {
                console.error("Error in NotificationContext.tsx", e, monthStr, m);
                return false;
              }
            });
            
            if (month !== -1 && !isNaN(day)) {
              const actDate = new Date();
              actDate.setMonth(month);
              actDate.setDate(day);
              actDate.setHours(actHour - 1, actMin, 0, 0); // 1 hour before
              
              // If it's in the past but the month is early next year
              if (actDate.getTime() < now.getTime() && now.getMonth() > 10 && month < 2) {
                actDate.setFullYear(now.getFullYear() + 1);
              }
              
              if (actDate.getTime() > now.getTime()) {
                const id = `act_${activity.id}_${actDate.getTime()}`;
                await scheduleOSNotification(
                  id,
                  `Rappel : ${activity.title} ⏰`,
                  `N'oubliez pas : ${activity.title} commence dans 1 heure à ${activity.location}.`,
                  actDate.getTime()
                );
              }
            }
          }
        }
      });
    };

    scheduleAll();

    // Fallback for browsers that don't support OS-level scheduling (setInterval)
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // 1. Rappel de Méditation Quotidienne (ex: 08:00)
      if (hours === 8 && minutes === 0) {
        const lastMeditationNotif = localStorage.getItem('cbe_last_meditation_notif');
        const todayStr = now.toDateString();
        if (lastMeditationNotif !== todayStr) {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(reg => reg.showNotification("Méditation Quotidienne 🙏", {
              body: "Il est l'heure de votre méditation quotidienne. Prenez un moment avec Dieu.",
              icon: '/vite.svg'
            }));
          } else {
            new Notification("Méditation Quotidienne 🙏", {
              body: "Il est l'heure de votre méditation quotidienne. Prenez un moment avec Dieu.",
            });
          }
          localStorage.setItem('cbe_last_meditation_notif', todayStr);
        }
      }

      // 2. Rappels d'Activités (1 heure avant)
      activities.forEach(activity => {
        const timeParts = activity.time.split(' - ')[0].split(':');
        if (timeParts.length === 2) {
          const actHour = parseInt(timeParts[0], 10);
          const actMin = parseInt(timeParts[1], 10);

          // Si l'activité est dans exactement 1 heure
          if (actHour - 1 === hours && actMin === minutes) {
            const notifKey = `cbe_notif_${activity.id}_${now.toDateString()}`;
            if (!localStorage.getItem(notifKey)) {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(reg => reg.showNotification(`Rappel : ${activity.title} ⏰`, {
                  body: `N'oubliez pas : ${activity.title} commence dans 1 heure à ${activity.location}.`,
                  icon: '/vite.svg'
                }));
              } else {
                new Notification(`Rappel : ${activity.title} ⏰`, {
                  body: `N'oubliez pas : ${activity.title} commence dans 1 heure à ${activity.location}.`,
                });
              }
              localStorage.setItem(notifKey, 'true');
            }
          }
        }
      });

    }, 60000); // Vérification toutes les minutes

    return () => clearInterval(interval);
  }, [isPushEnabled, activities]);

  return (
    <NotificationContext.Provider value={{ 
      isPushEnabled, 
      togglePushNotifications, 
      sendTestNotification,
      notifications,
      addNotification,
      removeNotification,
      clearNotifications
    }}>
      {children}
      
      {/* In-App Notification Overlay */}
      <div className="fixed top-4 right-4 left-4 z-[9999] pointer-events-none flex flex-col gap-2 items-center md:items-end">
        {notifications.slice(0, 3).map((notif, index) => (
          <div 
            key={notif.id}
            className={`pointer-events-auto w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-xl border-l-4 p-4 flex gap-3 animate-in slide-in-from-right-full duration-300 ${
              notif.type === 'success' ? 'border-emerald-500' :
              notif.type === 'warning' ? 'border-amber-500' :
              notif.type === 'error' ? 'border-red-500' : 'border-blue-500'
            }`}
            style={{ zIndex: 10000 - index }}
          >
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">{notif.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{notif.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
