'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface UserContextType {
  email: string | null;
  progress: number;
  totalPairs: number;
  setEmail: (email: string) => void;
  setProgress: (progress: number) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const TOTAL_PAIRS = 378; // 28 choose 2 = (28 * 27) / 2 = 378

export function UserProvider({ children }: { children: ReactNode }) {
  const [email, setEmailState] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Load saved progress from storage on mount
  useEffect(() => {
    const savedEmail = Cookies.get('userEmail');
    const savedProgress = localStorage.getItem('quizProgress');
    
    if (savedEmail) setEmailState(savedEmail);
    if (savedProgress) setProgress(parseInt(savedProgress, 10));
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress > 0) {
      localStorage.setItem('quizProgress', progress.toString());
    }
  }, [progress]);

  const setEmail = (newEmail: string) => {
    setEmailState(newEmail);
    Cookies.set('userEmail', newEmail, { sameSite: 'strict' });
  };

  const clearUser = () => {
    setEmailState(null);
    setProgress(0);
    Cookies.remove('userEmail');
    localStorage.removeItem('quizProgress');
  };

  return (
    <UserContext.Provider 
      value={{ 
        email, 
        progress, 
        totalPairs: TOTAL_PAIRS,
        setEmail,
        setProgress,
        clearUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 