
"use client";

import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDataStore } from '@/hooks/use-data-store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { initializeUserSession, clearUserSession } = useDataStore();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
      // setUser(null); // onAuthStateChanged handles this
      clearUserSession();
      throw error; 
    } finally {
      // setLoading(false); // onAuthStateChanged handles final loading state
    }
  };

  const signOut = async () => {
    // setLoading(true); // onAuthStateChanged handles loading state during user change
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle setting user to null and clearing session
    } catch (error) {
      console.error("Error signing out:", error);
      // setLoading(false); // Ensure loading is false if signOut itself errors before onAuthStateChanged
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
