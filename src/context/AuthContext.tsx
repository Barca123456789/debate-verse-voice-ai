
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthStatus, User } from '@/types';

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: AuthStatus.IDLE,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.IDLE);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('debateHubToken');
      const storedUser = localStorage.getItem('debateHubUser');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setStatus(AuthStatus.AUTHENTICATED);
        } catch (err) {
          localStorage.removeItem('debateHubToken');
          localStorage.removeItem('debateHubUser');
          setStatus(AuthStatus.UNAUTHENTICATED);
        }
      } else {
        setStatus(AuthStatus.UNAUTHENTICATED);
      }
    };

    checkAuth();
  }, []);

  // Mock login function (would connect to backend in production)
  const login = async (email: string, password: string) => {
    setStatus(AuthStatus.LOADING);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, use mock data
      const mockUser: User = {
        id: '1',
        username: email.split('@')[0],
        email,
        score: 1200,
        debatesWon: 5,
        debatesParticipated: 10,
        rank: 42,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      
      // Store in localStorage
      localStorage.setItem('debateHubToken', 'mock-jwt-token');
      localStorage.setItem('debateHubUser', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setStatus(AuthStatus.AUTHENTICATED);
    } catch (err) {
      console.error(err);
      setStatus(AuthStatus.ERROR);
    }
  };

  // Mock register function (would connect to backend in production)
  const register = async (username: string, email: string, password: string) => {
    setStatus(AuthStatus.LOADING);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, use mock data
      const mockUser: User = {
        id: '1',
        username,
        email,
        score: 1000,
        debatesWon: 0,
        debatesParticipated: 0,
        rank: 100,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };
      
      // Store in localStorage
      localStorage.setItem('debateHubToken', 'mock-jwt-token');
      localStorage.setItem('debateHubUser', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setStatus(AuthStatus.AUTHENTICATED);
    } catch (err) {
      console.error(err);
      setStatus(AuthStatus.ERROR);
    }
  };

  const logout = () => {
    localStorage.removeItem('debateHubToken');
    localStorage.removeItem('debateHubUser');
    setUser(null);
    setStatus(AuthStatus.UNAUTHENTICATED);
  };

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
