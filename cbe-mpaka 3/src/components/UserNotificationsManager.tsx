import { useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useProfile } from '../context/ProfileContext';
import { useNotification } from '../context/NotificationContext';

export function UserNotificationsManager() {
  const { testimonies, prayers, members, announcements } = useAppData();
  const { user, profile } = useProfile();
  const { addNotification } = useNotification();
  
  const lastTestimoniesRef = useRef<string[]>([]);
  const lastPrayersRef = useRef<string[]>([]);
  const lastStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !profile) return;

    // 1. Check for Testimony Approvals
    // ... (existing code)
    const userTestimonies = testimonies.filter(t => t.userId === user.uid);
    const approvedTestimonies = userTestimonies.filter(t => t.status === 'approved');
    
    const notifiedIds = JSON.parse(localStorage.getItem('cbe_notified_testimonies') || '[]');
    
    approvedTestimonies.forEach(t => {
      if (!notifiedIds.includes(t.id)) {
        addNotification(
          'Témoignage Approuvé ! ✨',
          `Votre témoignage "${t.title}" a été validé et est maintenant visible par la communauté.`,
          'success'
        );
        notifiedIds.push(t.id);
      }
    });
    localStorage.setItem('cbe_notified_testimonies', JSON.stringify(notifiedIds));

    // 2. Check for Prayer Approvals
    const userPrayers = prayers.filter(p => p.userId === user.uid);
    const approvedPrayers = userPrayers.filter(p => p.status === 'approved');
    
    const notifiedPrayerIds = JSON.parse(localStorage.getItem('cbe_notified_prayers') || '[]');
    
    approvedPrayers.forEach(p => {
      if (!notifiedPrayerIds.includes(p.id)) {
        addNotification(
          'Prière Approuvée ! 🙏',
          'Votre intention de prière a été validée. La communauté prie avec vous.',
          'success'
        );
        notifiedPrayerIds.push(p.id);
      }
    });
    localStorage.setItem('cbe_notified_prayers', JSON.stringify(notifiedPrayerIds));

    // 3. Check for Account Status Changes
    if (lastStatusRef.current === 'pending' && profile.status === 'active') {
      addNotification(
        'Compte Activé ! ✅',
        'Votre compte a été validé par l\'administrateur. Vous avez maintenant accès à toutes les fonctionnalités.',
        'success'
      );
    }
    lastStatusRef.current = profile.status;

    // 4. Check for New Announcements
    const notifiedAnnIds = JSON.parse(localStorage.getItem('cbe_notified_announcements') || '[]');
    announcements.forEach(ann => {
      if (!notifiedAnnIds.includes(ann.id)) {
        addNotification(
          ann.isUrgent ? 'Annonce Urgente ! 🚨' : 'Nouvelle Annonce 📢',
          ann.title,
          ann.isUrgent ? 'error' : 'info'
        );
        notifiedAnnIds.push(ann.id);
      }
    });
    localStorage.setItem('cbe_notified_announcements', JSON.stringify(notifiedAnnIds));

  }, [testimonies, prayers, profile, user, addNotification, announcements]);

  return null; // This component doesn't render anything
}
