import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { MemberProfile } from '../types/profile';
import { auth, signInWithGoogle, signInWithGoogleRedirect, getGoogleRedirectResult, logout, onAuthStateChanged, db, doc, getDoc, setDoc, updateDoc, User } from '../firebase';
import { Capacitor } from '@capacitor/core';

interface ProfileContextType {
  profile: MemberProfile | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  updateProfile: (data: Partial<MemberProfile>) => Promise<void>;
  createProfile: (data: Omit<MemberProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProfile: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Handle redirect result for mobile
    const checkRedirect = async () => {
      try {
        const result = await getGoogleRedirectResult();
        if (result?.user) {
          console.log("Redirect sign-in success:", result.user.email);
        }
      } catch (error) {
        console.error("Redirect sign-in error:", error);
      }
    };
    
    if (Capacitor.isNativePlatform()) {
      checkRedirect();
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profileDoc = await getDoc(doc(db, 'members', currentUser.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data() as MemberProfile;
            setProfile(profileData);
            
            // Check if admin
            const adminEmails = ['josuemanueljsm@gmail.com'];
            setIsAdmin(adminEmails.includes(currentUser.email || '') || profileData.role === 'admin');
          } else {
            setProfile(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

 const login = async () => {
    try {
      // On force le popup même sur mobile pour voir si la WebView l'autorise
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      throw error; // On renvoie l'erreur pour l'afficher
    }
  };  

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const createProfile = async (data: Omit<MemberProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    const now = new Date().toISOString();
    const newProfile: MemberProfile = {
      ...data,
      id: user.uid,
      createdAt: now,
      updatedAt: now,
      role: 'member'
    };
    await setDoc(doc(db, 'members', user.uid), newProfile);
    setProfile(newProfile);
  };

  const updateProfile = async (data: Partial<MemberProfile>) => {
    if (!user || !profile) return;
    const updatedProfile = { ...profile, ...data, updatedAt: new Date().toISOString() };
    await updateDoc(doc(db, 'members', user.uid), data);
    setProfile(updatedProfile);
  };

  const deleteProfile = async () => {
    // Logic for deleting profile if needed
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      user, 
      isLoading, 
      isAdmin, 
      updateProfile, 
      createProfile, 
      deleteProfile,
      login, 
      logout: handleLogout 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 
