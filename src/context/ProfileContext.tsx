import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { MemberProfile } from '../types/profile';
import { auth, signInWithGoogle, signInWithGoogleRedirect, getGoogleRedirectResult, logout, onAuthStateChanged, db, doc, getDoc, setDoc, updateDoc, User, onSnapshot } from '../firebase';
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
    // Handle redirect result for mobile
    const checkRedirect = async () => {
      try {
        const { getGoogleRedirectResult } = await import('../firebase');
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
        // Fetch profile from Firestore
        try {
          // Listen to profile changes in real-time
          const unsubscribeProfile = onSnapshot(
            doc(db, 'members', currentUser.uid),
            (profileDoc) => {
              if (profileDoc.exists()) {
                const profileData = profileDoc.data() as MemberProfile;
                setProfile(profileData);
                setIsAdmin(profileData.role === 'admin' || currentUser.email === 'josuemanueljsm@gmail.com');
              } else {
                setProfile(null);
                setIsAdmin(currentUser.email === 'josuemanueljsm@gmail.com');
              }
              setIsLoading(false);
            },
            (error) => {
              const msg = error instanceof Error ? error.message : String(error);
              if (msg.includes('offline')) {
                console.warn("Firestore is offline, using cached profile if available.");
              } else {
                console.error("Error fetching profile:", error);
              }
              setIsLoading(false);
            }
          );
          
          // Store the unsubscribe function to clean up when auth state changes
          (window as any)._unsubscribeProfile = unsubscribeProfile;
        } catch (error) {
          console.error("Error setting up profile listener:", error);
          setIsLoading(false);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsLoading(false);
        if ((window as any)._unsubscribeProfile) {
          (window as any)._unsubscribeProfile();
        }
      }
    });

    return () => {
      unsubscribe();
      if ((window as any)._unsubscribeProfile) {
        (window as any)._unsubscribeProfile();
      }
    };
  }, []);

  const login = async () => {
    try {
      const { signInWithGoogle } = await import('../firebase');
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
      
      // Update auth display name
      await updateAuthProfile(newUser, {
        displayName: `${profileData.firstName} ${profileData.lastName}`
      });

      // Create Firestore profile
      const newProfile: MemberProfile = {
        ...profileData,
        id: newUser.uid,
        email: email,
        status: 'pending', // IMPORTANT: Required by security rules
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
      group: 'Jeunesse', // Default group
      role: 'member', // Default role
      ...data,
      id: user.uid,
      email: data.email || user.email || undefined,
      photoUrl: data.photoUrl || user.photoURL || undefined,
      status: 'pending', // IMPORTANT: Required by security rules
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'members', user.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error; // Throw to handle in UI
    }
  };

  const updateProfile = async (data: Partial<MemberProfile>) => {
    if (!user || !profile) return;
    const updatedProfile = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'members', user.uid), updatedProfile);
      setProfile({ ...profile, ...updatedProfile });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteProfile = async () => {
    if (!user) return;
    // We don't actually delete the user from Auth here, just the Firestore doc
    try {
      // await deleteDoc(doc(db, 'members', user.uid));
      // setProfile(null);
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
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
