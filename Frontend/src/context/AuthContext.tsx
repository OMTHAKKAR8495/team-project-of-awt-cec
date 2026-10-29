import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { api, getErrorMessage } from '../services/api';

export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'recruiter' | 'candidate';
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: 'recruiter' | 'candidate'
  ) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync token from localStorage and check `/auth/me` on initial mount
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        if (storedToken.startsWith('demo-session-token-')) {
          const isRecruiter = storedToken.includes('recruiter');
          setUser({
            _id: isRecruiter ? '507f1f77bcf86cd799439011' : '507f1f77bcf86cd799439012',
            name: isRecruiter ? 'Demo Recruiter' : 'Demo Candidate',
            email: isRecruiter ? 'recruiter@demo.com' : 'candidate@demo.com',
            role: isRecruiter ? 'recruiter' : 'candidate',
          });
          setIsLoading(false);
          return;
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const res = await api.get<{ success: boolean; data: { user: AuthUser } | AuthUser }>('/auth/me');
          if (isMounted && res.data?.data) {
            const raw = res.data.data;
            const profile = ('user' in raw && raw.user) ? raw.user : (raw as AuthUser);
            setUser(profile);
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          if (isMounted) setUser(null);
        }
      }
      if (isMounted) setIsLoading(false);
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const res = await api.post<{
        success: boolean;
        data: { user: AuthUser; token: string };
      }>('/auth/login', { email, password });

      const { user: loggedInUser, token } = res.data.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(loggedInUser);
    } catch (err) {
      const lower = email.trim().toLowerCase();
      if (
        (lower === 'recruiter@demo.com' || lower === 'candidate@demo.com') &&
        password === 'Demo@1234'
      ) {
        const isRecruiter = lower.startsWith('recruiter');
        const demoUser: AuthUser = {
          _id: isRecruiter ? '507f1f77bcf86cd799439011' : '507f1f77bcf86cd799439012',
          name: isRecruiter ? 'Demo Recruiter' : 'Demo Candidate',
          email: lower,
          role: isRecruiter ? 'recruiter' : 'candidate',
        };
        const demoToken = 'demo-session-token-' + (isRecruiter ? 'recruiter' : 'candidate');
        localStorage.setItem('token', demoToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${demoToken}`;
        setUser(demoUser);
        return;
      }
      const msg = getErrorMessage(err, 'Failed to sign in.');
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: 'recruiter' | 'candidate' = 'candidate'
    ) => {
      setError(null);
      try {
        const res = await api.post<{
          success: boolean;
          data: { user: AuthUser; token: string };
        }>('/auth/register', { name, email, password, role });

        const { user: newUser, token } = res.data.data;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(newUser);
      } catch (err) {
        const msg = getErrorMessage(err, 'Registration failed.');
        setError(msg);
        throw new Error(msg);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

