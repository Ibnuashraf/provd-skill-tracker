import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from './AuthService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocalAuth, setIsLocalAuth] = useState(false);

  useEffect(() => {
    let subscription = null;

    const bootstrap = async () => {
      const session = await AuthService.initAuth();
      if (session?.user) {
        setUser(session.user);
      }
      setIsLocalAuth(AuthService.isLocalAuth());
      setLoading(false);
    };

    bootstrap();

    subscription = AuthService.onAuthStateChange((nextUser) => {
      setUser(nextUser);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const signUp = async (email, password, name) => {
    const result = await AuthService.signUp(email, password, name);
    if (!result.error && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const signIn = async (email, password) => {
    const result = await AuthService.signIn(email, password);
    if (!result.error && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const signOut = async () => {
    const result = await AuthService.signOut();
    if (!result.error) {
      setUser(null);
    }
    return result;
  };

  const toggleLocalAuth = (value) => {
    AuthService.setLocalAuth(value);
    setIsLocalAuth(value);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLocalAuth,
      signUp,
      signIn,
      signOut,
      toggleLocalAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
