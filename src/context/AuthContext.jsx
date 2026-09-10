import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

const LOCAL_STORAGE_DOCTOR_KEY = 'sehatnama_doctor_session';

const DEFAULT_DOCTOR_PROFILE = {
  id: 'd0c70000-0000-0000-0000-000000000001',
  full_name: 'Dr. Ananya Sharma',
  role: 'doctor',
  email: 'dr.sharma@sehatnama.in',
  specialization: 'General Physician & Cardiometabolic Care',
  hospital: 'All India Institute of Medical Sciences (AIIMS)',
  registration_no: 'MCI-2018-98421'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // First check local stored doctor session (for quick persistence/dev fallback)
        const localDoctorSession = localStorage.getItem(LOCAL_STORAGE_DOCTOR_KEY);
        if (localDoctorSession) {
          try {
            const parsed = JSON.parse(localDoctorSession);
            if (parsed && parsed.role === 'doctor') {
              if (isMounted) {
                setProfile(parsed);
                setRole(parsed.role || 'doctor');
                setUser({ id: parsed.id, email: parsed.email });
              }
            }
          } catch (e) {
            localStorage.removeItem(LOCAL_STORAGE_DOCTOR_KEY);
          }
        }

        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            if (isMounted) setUser(session.user);
            await fetchUserProfile(session.user.id, session.user.email);
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Auth initialization notice:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase Auth state changes if configured
    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id, session.user.email);
        } else if (event === 'SIGNED_OUT') {
          // If explicitly signed out of Supabase
          if (!localStorage.getItem(LOCAL_STORAGE_DOCTOR_KEY)) {
            setUser(null);
            setProfile(null);
            setRole(null);
          }
        }
      });
      subscription = data?.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  /**
   * Fetch profile from Supabase 'profiles' table
   */
  const fetchUserProfile = async (userId, email) => {
    if (!isSupabaseConfigured() || !userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setRole(data.role || 'patient');
      } else if (!error) {
        // Default role if no row exists yet
        const defaultRole = email?.toLowerCase().includes('doctor') ? 'doctor' : 'patient';
        setRole(defaultRole);
        setProfile({
          id: userId,
          email,
          role: defaultRole,
          full_name: email?.split('@')[0] || 'User'
        });
      }
    } catch (err) {
      console.warn('[AuthContext] Profile fetch notice:', err.message);
    }
  };

  /**
   * Log in with Email & Password
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data?.user) {
          setUser(data.user);
          await fetchUserProfile(data.user.id, data.user.email);
          return { user: data.user, error: null };
        }
      }

      // Offline / Local / Demo Fallback Mode
      if (email.toLowerCase().includes('doctor') || email.toLowerCase().includes('dr.')) {
        const docProfile = {
          ...DEFAULT_DOCTOR_PROFILE,
          email,
          full_name: email.startsWith('dr.') ? 'Dr. ' + email.split('@')[0].replace('dr.', '').replace('.', ' ').toUpperCase() : 'Dr. Ananya Sharma'
        };
        setUser({ id: docProfile.id, email: docProfile.email });
        setProfile(docProfile);
        setRole('doctor');
        localStorage.setItem(LOCAL_STORAGE_DOCTOR_KEY, JSON.stringify(docProfile));
        return { user: { id: docProfile.id, email }, error: null };
      }

      throw new Error('Invalid doctor credentials. Please use an authorized doctor account.');
    } catch (err) {
      console.error('[AuthContext.login] Error:', err.message);
      return { user: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Quick Demo Doctor Sign-In (For evaluation & testing)
   */
  const demoDoctorLogin = async () => {
    setIsLoading(true);
    try {
      const docProfile = DEFAULT_DOCTOR_PROFILE;
      setUser({ id: docProfile.id, email: docProfile.email });
      setProfile(docProfile);
      setRole('doctor');
      localStorage.setItem(LOCAL_STORAGE_DOCTOR_KEY, JSON.stringify(docProfile));
      return { user: { id: docProfile.id, email: docProfile.email }, error: null };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem(LOCAL_STORAGE_DOCTOR_KEY);
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
      setRole(null);
    } catch (err) {
      console.warn('[AuthContext.logout] Notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update Profile
   */
  const updateProfile = async (updates) => {
    if (!profile) return { error: 'No active profile' };

    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);

    if (role === 'doctor') {
      localStorage.setItem(LOCAL_STORAGE_DOCTOR_KEY, JSON.stringify(updated));
    }

    if (isSupabaseConfigured() && profile.id) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert(updated, { onConflict: 'id' })
          .select()
          .single();

        if (error) throw error;
        if (data) setProfile(data);
        return { data, error: null };
      } catch (err) {
        console.error('[AuthContext.updateProfile] Error:', err.message);
        return { data: updated, error: err.message };
      }
    }

    return { data: updated, error: null };
  };

  const isDoctor = role === 'doctor' || role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role,
      isDoctor,
      isLoading,
      login,
      demoDoctorLogin,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
