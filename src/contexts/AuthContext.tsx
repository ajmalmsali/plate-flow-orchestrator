import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/restaurant';
import { users } from '@/data/mockData';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasKitchenAccess: (kitchenId: string) => boolean;
  getUserDashboards: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('restaurant_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        localStorage.removeItem('restaurant_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple authentication - in real app, this would be server-side
    const user = users.find(u => u.username === username && u.isActive);
    
    if (user && password === 'password') { // Simple password check
      const loggedInUser = { ...user, lastLogin: new Date() };
      
      localStorage.setItem('restaurant_user', JSON.stringify(loggedInUser));
      setAuthState({
        user: loggedInUser,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('restaurant_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const hasKitchenAccess = (kitchenId: string): boolean => {
    if (!authState.user) return false;
    if (authState.user.role === 'admin' || authState.user.role === 'manager') return true;
    return authState.user.kitchenAccess?.includes(kitchenId) || false;
  };

  const getUserDashboards = (): string[] => {
    if (!authState.user) return [];
    
    const dashboards: string[] = [];
    
    switch (authState.user.role) {
      case 'admin':
      case 'manager':
        dashboards.push('dashboard', 'captain', 'kitchen', 'users');
        break;
      case 'captain':
        dashboards.push('captain');
        break;
      case 'kitchen':
        dashboards.push('kitchen');
        break;
    }
    
    return dashboards;
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    hasKitchenAccess,
    getUserDashboards,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};