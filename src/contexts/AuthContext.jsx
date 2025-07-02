import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import toast from 'react-hot-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const safeJSON = {
  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  },
  get(key, fallback = null) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  },
  remove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (_) {}
  },
};

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const saveDraft = useCallback(
    (key, payload) => safeJSON.set(key, payload),
    []
  );
  const loadDraft = useCallback(
    (key, fallback = null) => safeJSON.get(key, fallback),
    []
  );
  const clearDraft = useCallback((key) => safeJSON.remove(key), []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user: fbUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success('Logged in!');
      setUser(fbUser);
    } catch (err) {
      toast.error(
        err.code.replace('auth/', '').replace(/-/g, ' ') || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        role: 'author',
        createdAt: Date.now(),
      });
      toast.success('Registered!');
      setUser(cred.user);
      clearDraft('registerForm');
    } catch (err) {
      toast.error(
        err.code.replace('auth/', '').replace(/-/g, ' ') ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setUser(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        setUser({ uid: fbUser.uid, email: fbUser.email, ...snap.data() });
      } else {
        setUser(null);
      }
      setInitializing(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initializing,
        login,
        register,
        logout,
        saveDraft,
        loadDraft,
        clearDraft,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
