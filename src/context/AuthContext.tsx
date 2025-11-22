import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE } from '../utils/api';

interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  totalDistance: number;
  friendsCount: number;
  posts: number;
  bio: string;
  totalRides?: number;
  totalTime?: number;
  avgSpeed?: number;
  carbonSaved?: number;
  greenEnergy?: number;
  backgroundImage?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  accessToken: string | null;
  login: (userData: Partial<User>, token?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if user was previously logged in
    const saved = localStorage.getItem('blitz_auth');
    return saved === 'true';
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('blitz_access_token');
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Load saved user data
    const savedUser = localStorage.getItem('blitz_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: Partial<User>, token?: string) => {
    // Helper to generate a random rider name
    const generateRiderName = () => {
      const adjectives = ['Speedy', 'Eco', 'Green', 'Urban', 'Electric', 'Smart', 'Bold', 'Swift'];
      const nouns = ['Rider', 'Cyclist', 'Commuter', 'Explorer', 'Voyager', 'Sprinter', 'Pacer'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      return `${adj}${noun}${Math.floor(Math.random() * 1000)}`;
    };

    const defaultName = generateRiderName();

    const user: User = {
      id: userData.id || Date.now().toString(),
      email: userData.email || '',
      phone: userData.phone,
      name: userData.name || userData.username || 'BESV Rider',
      username: userData.username || defaultName,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      location: userData.location || 'Downtown Area',
      totalDistance: userData.totalDistance || 0,
      totalRides: userData.totalRides || 0,
      totalTime: userData.totalTime || 0,
      avgSpeed: userData.avgSpeed || 0,
      carbonSaved: userData.carbonSaved || 0,
      friendsCount: userData.friendsCount || 0,
      posts: userData.posts || 0,
      greenEnergy: userData.greenEnergy || 0,
      bio: userData.bio || 'BESV rider 🚴‍♂️',
      backgroundImage: userData.backgroundImage,
    };
    
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('blitz_auth', 'true');
    localStorage.setItem('blitz_user', JSON.stringify(user));
    
    if (token) {
      setAccessToken(token);
      localStorage.setItem('blitz_access_token', token);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAccessToken(null);
    localStorage.removeItem('blitz_auth');
    localStorage.removeItem('blitz_user');
    localStorage.removeItem('blitz_access_token');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser || !accessToken) return;

    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData.error);
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      
      const updatedUser = { ...currentUser, ...data.user };
      setCurrentUser(updatedUser);
      localStorage.setItem('blitz_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        // If unauthorized, log out without error logging
        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }

        const errorData = await response.json();
        
        // Check for credential-related errors even if status isn't 401 (e.g. 400)
        if (errorData.error && (
          errorData.error.includes('Invalid') || 
          errorData.error.includes('credentials') || 
          errorData.error.includes('expired')
        )) {
          logout();
          return;
        }

        console.error('Failed to refresh user:', errorData.error);
        return;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const user = data.user;
        setCurrentUser(user);
        localStorage.setItem('blitz_user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  // Refresh user data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      refreshUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, accessToken, login, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}