import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  UserCredential,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'echo-prime-ai.firebaseapp.com',
  projectId: 'echo-prime-ai',
  storageBucket: 'echo-prime-ai.appspot.com',
  messagingSenderId: '249995513427',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  return { app, auth };
}

export interface EPTUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  emailVerified: boolean;
}

function detectProvider(user: User): string {
  if (!user.providerData || user.providerData.length === 0) return 'unknown';
  const providerId = user.providerData[0]?.providerId || 'unknown';
  const map: Record<string, string> = {
    'google.com': 'google',
    'apple.com': 'apple',
    'password': 'email',
  };
  return map[providerId] || providerId;
}

export function toEPTUser(user: User): EPTUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider: detectProvider(user),
    emailVerified: user.emailVerified,
  };
}

// Google
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Apple
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export async function signInWithGoogle(): Promise<EPTUser | null> {
  const { auth } = initFirebase();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return toEPTUser(result.user);
  } catch (error: any) {
    if (error?.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

export async function signInWithApple(): Promise<EPTUser | null> {
  const { auth } = initFirebase();
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return toEPTUser(result.user);
  } catch (error: any) {
    if (error?.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, appleProvider);
      return null;
    }
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<EPTUser> {
  const { auth } = initFirebase();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return toEPTUser(result.user);
}

export async function signUpWithEmail(email: string, password: string): Promise<EPTUser> {
  const { auth } = initFirebase();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  return toEPTUser(result.user);
}

export async function resetPassword(email: string): Promise<void> {
  const { auth } = initFirebase();
  await sendPasswordResetEmail(auth, email);
}

export async function handleRedirectResult(): Promise<EPTUser | null> {
  const { auth } = initFirebase();
  const result = await getRedirectResult(auth);
  if (result?.user) return toEPTUser(result.user);
  return null;
}

export async function signOut(): Promise<void> {
  const { auth } = initFirebase();
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: EPTUser | null) => void): () => void {
  const { auth } = initFirebase();
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? toEPTUser(firebaseUser) : null);
  });
}

export function getCurrentUser(): EPTUser | null {
  const { auth } = initFirebase();
  return auth.currentUser ? toEPTUser(auth.currentUser) : null;
}

initFirebase();
export { auth };
