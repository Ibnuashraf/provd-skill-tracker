import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

let supabase = null;
let useLocalAuth = false;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase initialized');
  } catch (error) {
    useLocalAuth = true;
    console.warn('⚠️  Supabase initialization failed:', error.message);
  }
} else {
  useLocalAuth = true;
  console.log('ℹ️  Using local authentication (Supabase not configured)');
}

const LOCAL_USERS_KEY = 'provd_users';
const LOCAL_SESSION_KEY = 'provd_session';

const getLocalUsers = () => {
  try {
    const users = localStorage.getItem(LOCAL_USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch {
    return {};
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const getDisplayName = (user) =>
  user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

export const AuthService = {
  async initAuth() {
    if (useLocalAuth) {
      const session = localStorage.getItem(LOCAL_SESSION_KEY);
      return session ? JSON.parse(session) : null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          user: session.user,
          source: 'supabase'
        };
      }
    } catch (error) {
      console.error('Failed to get Supabase session:', error);
    }
    return null;
  },

  onAuthStateChange(callback) {
    if (useLocalAuth || !supabase) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return subscription;
  },

  async signUp(email, password, name) {
    if (useLocalAuth) {
      const users = getLocalUsers();

      if (users[email]) {
        return {
          error: { message: 'Email already exists' },
          data: null
        };
      }

      if (password.length < 8) {
        return {
          error: { message: 'Password must be at least 8 characters' },
          data: null
        };
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        passwordHash: hashPassword(password),
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
      };

      users[email] = newUser;
      saveLocalUsers(users);

      const session = {
        user: { id: newUser.id, email, user_metadata: { name: newUser.name } },
        source: 'local'
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));

      return {
        error: null,
        data: { user: session.user }
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) return { error, data: null };

      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          name: name || email.split('@')[0],
          created_at: new Date().toISOString()
        });

        if (profileError && profileError.code !== '23505') {
          console.warn('Could not create user profile:', profileError.message);
        }
      }

      return { error: null, data };
    } catch (error) {
      console.error('Signup error:', error);
      return { error, data: null };
    }
  },

  async signIn(email, password) {
    if (useLocalAuth) {
      const users = getLocalUsers();
      const user = users[email];

      if (!user) {
        return {
          error: { message: 'Invalid email or password' },
          data: null
        };
      }

      if (hashPassword(password) !== user.passwordHash) {
        return {
          error: { message: 'Invalid email or password' },
          data: null
        };
      }

      const session = {
        user: { id: user.id, email, user_metadata: { name: user.name } },
        source: 'local'
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));

      return {
        error: null,
        data: { user: session.user }
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { error, data: null };
      return { error: null, data };
    } catch (error) {
      console.error('Signin error:', error);
      return { error, data: null };
    }
  },

  async signOut() {
    if (useLocalAuth) {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Signout error:', error);
      return { error };
    }
  },

  getDisplayName,

  async storeUserData(userId, data) {
    if (useLocalAuth) {
      const userDataKey = `provd_user_${userId}`;
      localStorage.setItem(userDataKey, JSON.stringify(data));
      return { error: null };
    }

    try {
      const { error } = await supabase.from('user_data').upsert({
        user_id: userId,
        data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      return { error };
    } catch (error) {
      return { error };
    }
  },

  async getUserData(userId) {
    if (useLocalAuth) {
      const userDataKey = `provd_user_${userId}`;
      const data = localStorage.getItem(userDataKey);
      return { data: data ? JSON.parse(data) : null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('data')
        .eq('user_id', userId)
        .single();

      if (error?.code === 'PGRST116') {
        return { data: null, error: null };
      }

      return { data: data?.data || null, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  isLocalAuth() {
    return useLocalAuth;
  }
};
