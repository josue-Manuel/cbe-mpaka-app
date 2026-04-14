import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  signInWithGoogle,
  logout as firebaseLogout,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateAuthProfile,
  User
} from '../firebase';
import { MemberProfile, MemberGender } from '../types/profile';

interface ProfileContextType {
  profile: MemberProfile | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  updateProfile: (data: Partial<MemberProfile>) => Promise<void>;
  createProfile: (data: Omit<MemberProfile, 'id' | 'role' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProfile: () => Promise<void>;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, profileData: any) => Promise<void>;
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
            setProfile({ ...profileData, id: currentUser.uid });
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
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, profileData: any) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    
    await updateAuthProfile(newUser, {
      displayName: `${profileData.firstName} ${profileData.lastName}`
    });

    const now = new Date().toISOString();
    const newProfile: MemberProfile = {
      ...profileData,
      id: newUser.uid,
      email: newUser.email,
      role: 'member',
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    await setDoc(doc(db, 'members', newUser.uid), newProfile);
    setProfile(newProfile);
  };

  const createProfile = async (data: Omit<MemberProfile, 'id' | 'role' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    const now = new Date().toISOString();
    const newProfile: MemberProfile = {
      ...data,
      id: user.uid,
      email: user.email || undefined,
      role: 'member',
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };
    await setDoc(doc(db, 'members', user.uid), newProfile);
    setProfile(newProfile);
  };

  const updateProfile = async (data: Partial<MemberProfile>) => {
    if (!user || !profile) return;
    const updatedProfile = { 
      ...profile, 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    await updateDoc(doc(db, 'members', user.uid), updatedProfile);
    setProfile(updatedProfile);
  };

  const deleteProfile = async () => {
    if (!user) return;
    await deleteDoc(doc(db, 'members', user.uid));
    setProfile(null);
  };

  const handleLogout = async () => {
    await firebaseLogout();
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
      loginWithEmail,
      registerWithEmail,
      logout: handleLogout 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
