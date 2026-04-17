import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateAuthProfile,
  setPersistence,
  indexedDBLocalPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, addDoc, serverTimestamp, Timestamp, getDocFromServer, enableIndexedDbPersistence } from 'firebase/firestore';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
console.log("Firebase Config Loaded:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  databaseId: firebaseConfig.firestoreDatabaseId,
  appId: firebaseConfig.appId
});

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Enable offline persistence for WhatsApp-like experience
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence is not supported by this browser');
    }
  });
}

export const auth = getAuth(app);

// Connection test to verify Firestore connectivity
async function testConnection() {
  try {
    console.log("Testing Firestore connection with Database ID:", firebaseConfig.firestoreDatabaseId);
    // Use getDocFromServer to force a network request and bypass cache
    // Path matches firestore.rules: match /test/connection { allow read: if true; }
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection successful.");
  } catch (error) {
    console.error("Firestore connection test failed:", error);
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('offline') || msg.includes('Could not reach')) {
      console.error("Firestore Connection Failed: The client is offline or cannot reach the backend. This often indicates a project ID or database ID mismatch.");
    }
  }
}

testConnection();

// Set persistence explicitly
setPersistence(auth, indexedDBLocalPersistence)
  .catch(() => {
    // Fallback to browserLocalPersistence if indexedDB is not supported
    return setPersistence(auth, browserLocalPersistence);
  })
  .catch(err => console.error("Persistence error:", err));

export const googleProvider = new GoogleAuthProvider();

// Auth helpers
export const signInWithGoogle = () => {
  // Always use popup for Google login in this environment as Redirect often fails 
  // with "missing initial state" or storage partitioning issues in iframes/webviews.
  return signInWithPopup(auth, googleProvider);
};

export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);
export const getGoogleRedirectResult = () => getRedirectResult(auth);
export const logout = () => signOut(auth);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateAuthProfile
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  // We log the error but do not throw it to prevent Uncaught Errors from crashing the app.
  // The application should handle missing data gracefully.
}

export { 
  onAuthStateChanged, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  Timestamp
};
export type { User };
