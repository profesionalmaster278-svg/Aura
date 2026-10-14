import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleAuthProvider = new GoogleAuthProvider();
// Add Gmail scopes
googleAuthProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleAuthProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/gmail.compose');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Attempt silent re-auth if possible or trigger onAuthFailure
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token');
    }
    cachedAccessToken = credential.accessToken;

    // Record user profile in Firestore
    try {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Stylist / Client',
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not sync user profile to Firestore:', e);
    }

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sign In failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
