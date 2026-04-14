import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { MemberProfile } from '../types/profile';
import { auth, signInWithGoogle, logout, onAuthStateChanged, db, doc, getDoc, setDoc, updateDoc, User } from '../firebase';

interface ProfileContextType {
  profile: MemberProfile | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  updateProfile: (data: Partial<MemberProfile>) => Promise<void>;
  createProfile: (data: Omit<MemberProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProfile: () => Promise<void>;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, profileData: Omit<MemberProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  logout: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profileDoc = await getDoc(doc(db, 'members', currentUser.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data() as MemberProfile;
            setProfile(profileData);
            setIsAdmin(profileData.role === 'admin' || currentUser.email === 'josuemanueljsm@gmail.com');
          } else {
            setProfile(null);
            setIsAdmin(currentUser.email === 'josuemanueljsm@gmail.com');
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
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const { signInWithEmailAndPassword } = await import('../firebase');
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, profileData: Omit<MemberProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { createUserWithEmailAndPassword, updateAuthProfile } = await import('../firebase');
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;
      
      await updateAuthProfile(newUser, {
        displayName: `${profileData.firstName} ${profileData.lastName}`
      });

      const newProfile: MemberProfile = {
        ...profileData,
        id: newUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'members', newUser.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error("Email registration error:", error);
      throw error;
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
    const newProfile: MemberProfile = {
      ...data,
      id: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'members', user.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const updateProfile = async (data: Partial<MemberProfile>) => {
    if (!user || !profile) return;
    const updatedProfile = { ...data, updatedAt: new Date().toISOString() };
    try {
      await updateDoc(doc(db, 'members', user.uid), updatedProfile);
      setProfile({ ...profile, ...updatedProfile });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteProfile = async () => { if (!user) return; };

  return (
    <ProfileContext.Provider value={{ 
      profile, user, isLoading, isAdmin, updateProfile, createProfile, deleteProfile, login, loginWithEmail, registerWithEmail, logout: handleLogout 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
          }
