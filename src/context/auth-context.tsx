
"use client";

import type { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Added db import
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, // Added for signup
  signOut as firebaseSignOut 
} from 'firebase/auth';
import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDataStore } from '@/hooks/use-data-store';
// No need to import doc or setDoc from firestore here as data store handles it

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<User | null>;
  signUp: (email: string, pass: string) => Promise<User | null>; // Added signUp
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { initializeUserSession, clearUserSession } = useDataStore();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); 
      setUser(currentUser);
      if (currentUser) {
        await initializeUserSession(currentUser.uid); 
      } else {
        clearUserSession();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [initializeUserSession, clearUserSession]);

  const signIn = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting user and initializing session
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      clearUserSession(); 
      setLoading(false); 
      throw error; 
    } 
  };

  const signUp = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting user and initializing session
      // No need to manually create a user document here for simple auth,
      // user-specific data is handled by useDataStore based on UID.
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up:", error);
      clearUserSession();
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle setting user to null and clearing session
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
