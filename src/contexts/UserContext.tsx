'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface UserContextType {
  email: string | null;
  progress: number;
  totalPairs: number;
  setUser: (email: string) => void;
  clearUser: () => void;
  updateProgress: (newProgress: number) => void;
  setTotalPairs: (total: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);

  // Load saved progress from storage on mount
  useEffect(() => {
    const savedEmail = Cookies.get('userEmail');
    const savedProgress = localStorage.getItem('quizProgress');
    
    if (savedEmail) setEmail(savedEmail);
    if (savedProgress) setProgress(parseInt(savedProgress, 10));
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress > 0) {
      localStorage.setItem('quizProgress', progress.toString());
    }
  }, [progress]);

  const setUser = (email: string) => {
    setEmail(email);
    setProgress(0); // Reset progress when user changes
    Cookies.set('userEmail', email, { sameSite: 'strict' });
  };

  const clearUser = () => {
    setEmail(null);
    setProgress(0);
    setTotalPairs(0);
    Cookies.remove('userEmail');
    localStorage.removeItem('quizProgress');
  };

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <UserContext.Provider 
      value={{ 
        email, 
        progress, 
        totalPairs,
        setUser, 
        clearUser,
        updateProgress,
        setTotalPairs
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 