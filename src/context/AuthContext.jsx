import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { patientSupabase, doctorSupabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Patient Auth State
  const [patientSession, setPatientSession] = useState(null);
  const [patientUser, setPatientUser] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [isPatientLoading, setIsPatientLoading] = useState(true);

  // Doctor Auth State
  const [doctorSession, setDoctorSession] = useState(null);
  const [doctorUser, setDoctorUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isDoctorLoading, setIsDoctorLoading] = useState(true);

  /**
   * Fetch Patient Profile from public.profiles
   */
  const fetchPatientProfile = useCallback(async (authUser) => {
    if (!authUser || !isSupabaseConfigured()) {
      setPatientProfile(null);
      return null;
    }

    try {
      const { data, error } = await patientSupabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.warn('[AuthContext] Error fetching patient profile:', error.message);
      }

      if (data) {
        setPatientProfile(data);
        return data;
      }

      // If no profile row exists, create a default patient profile
      const defaultProfile = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        phone: authUser.user_metadata?.phone || null,
        role: 'patient',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: inserted, error: insertError } = await patientSupabase
        .from('profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (insertError) {
        console.warn('[AuthContext] Error creating patient fallback profile:', insertError.message);
        setPatientProfile(defaultProfile);
        return defaultProfile;
      }

      setPatientProfile(inserted);
      return inserted;
    } catch (err) {
      console.error('[AuthContext.fetchPatientProfile] Unexpected error:', err.message);
      return null;
    }
  }, []);

  /**
   * Fetch Doctor Profile from public.profiles
   */
  const fetchDoctorProfile = useCallback(async (authUser) => {
    if (!authUser || !isSupabaseConfigured()) {
      setDoctorProfile(null);
      return null;
    }

    try {
      const { data, error } = await doctorSupabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.warn('[AuthContext] Error fetching doctor profile:', error.message);
      }

      if (data) {
        setDoctorProfile(data);
        return data;
      }

      return null;
    } catch (err) {
      console.error('[AuthContext.fetchDoctorProfile] Unexpected error:', err.message);
      return null;
    }
  }, []);

  // Initialize Patient Auth Session
  useEffect(() => {
    let isMounted = true;

    const initPatientAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          if (isMounted) setIsPatientLoading(false);
          return;
        }

        const { data: { session: initialSession }, error } = await patientSupabase.auth.getSession();
        if (error) throw error;

        if (isMounted) {
          setPatientSession(initialSession);
          setPatientUser(initialSession?.user || null);
        }

        if (initialSession?.user) {
          const userProfile = await fetchPatientProfile(initialSession.user);
          if (isMounted && userProfile) {
            setPatientProfile(userProfile);
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Patient auth init error:', err.message);
        if (
          err.message?.includes('refresh_token') ||
          err.message?.includes('Refresh Token') ||
          err.message?.includes('Invalid Refresh Token')
        ) {
          try {
            await patientSupabase.auth.signOut({ scope: 'local' });
          } catch {
            try { localStorage.removeItem('sehatnama-patient-auth-token'); } catch {}
          }
          if (isMounted) {
            setPatientSession(null);
            setPatientUser(null);
            setPatientProfile(null);
          }
        }
      } finally {
        if (isMounted) setIsPatientLoading(false);
      }
    };

    initPatientAuth();

    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data } = patientSupabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;

        if (event === 'SIGNED_OUT' || !newSession) {
          setPatientSession(null);
          setPatientUser(null);
          setPatientProfile(null);
          setIsPatientLoading(false);
          return;
        }

        setPatientSession(newSession);
        setPatientUser(newSession?.user || null);

        if (newSession?.user) {
          await fetchPatientProfile(newSession.user);
        } else {
          setPatientProfile(null);
        }
        setIsPatientLoading(false);
      });
      subscription = data?.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [fetchPatientProfile]);

  // Initialize Doctor Auth Session
  useEffect(() => {
    let isMounted = true;

    const initDoctorAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          if (isMounted) setIsDoctorLoading(false);
          return;
        }

        const { data: { session: initialSession }, error } = await doctorSupabase.auth.getSession();
        if (error) throw error;

        if (isMounted) {
          setDoctorSession(initialSession);
          setDoctorUser(initialSession?.user || null);
        }

        if (initialSession?.user) {
          const userProfile = await fetchDoctorProfile(initialSession.user);
          if (isMounted && userProfile) {
            setDoctorProfile(userProfile);
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Doctor auth init error:', err.message);
        if (
          err.message?.includes('refresh_token') ||
          err.message?.includes('Refresh Token') ||
          err.message?.includes('Invalid Refresh Token')
        ) {
          try {
            await doctorSupabase.auth.signOut({ scope: 'local' });
          } catch {
            try { localStorage.removeItem('sehatnama-doctor-auth-token'); } catch {}
          }
          if (isMounted) {
            setDoctorSession(null);
            setDoctorUser(null);
            setDoctorProfile(null);
          }
        }
      } finally {
        if (isMounted) setIsDoctorLoading(false);
      }
    };

    initDoctorAuth();

    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data } = doctorSupabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;

        setDoctorSession(newSession);
        setDoctorUser(newSession?.user || null);

        if (newSession?.user) {
          await fetchDoctorProfile(newSession.user);
        } else {
          setDoctorProfile(null);
        }
        setIsDoctorLoading(false);
      });
      subscription = data?.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [fetchDoctorProfile]);

  /**
   * Patient Sign In
   */
  const signInPatient = async (email, password) => {
    setIsPatientLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase backend is not configured.');
      }

      const { data, error } = await patientSupabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      if (data?.user) {
        setPatientUser(data.user);
        setPatientSession(data.session);
        const userProfile = await fetchPatientProfile(data.user);
        return { user: data.user, profile: userProfile, error: null };
      }

      throw new Error('Unable to sign in. Please check your credentials.');
    } catch (err) {
      let friendlyMessage = err.message || 'Invalid credentials.';
      if (friendlyMessage.includes('Invalid login credentials')) {
        friendlyMessage = 'Invalid email or password. Please check and try again.';
      } else if (friendlyMessage.includes('Email not confirmed')) {
        friendlyMessage = 'Please confirm your email address before signing in.';
      }
      return { user: null, profile: null, error: friendlyMessage };
    } finally {
      setIsPatientLoading(false);
    }
  };

  /**
   * Doctor Sign In
   */
  const signInDoctor = async (email, password) => {
    setIsDoctorLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase backend is not configured.');
      }

      const { data, error } = await doctorSupabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      if (data?.user) {
        setDoctorUser(data.user);
        setDoctorSession(data.session);
        const userProfile = await fetchDoctorProfile(data.user);
        return { user: data.user, profile: userProfile, error: null };
      }

      throw new Error('Unable to sign in physician. Please check your credentials.');
    } catch (err) {
      let friendlyMessage = err.message || 'Invalid credentials.';
      if (friendlyMessage.includes('Invalid login credentials')) {
        friendlyMessage = 'Invalid email or password. Please check and try again.';
      } else if (friendlyMessage.includes('Email not confirmed')) {
        friendlyMessage = 'Please confirm your email address before signing in.';
      }
      return { user: null, profile: null, error: friendlyMessage };
    } finally {
      setIsDoctorLoading(false);
    }
  };

  /**
   * Patient Public Sign Up
   */
  const signUpPatient = async ({ email, password, fullName, phone }) => {
    setIsPatientLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase backend is not configured.');
      }

      const { data, error } = await patientSupabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone ? phone.trim() : null,
            role: 'patient'
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        const profilePayload = {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName.trim(),
          phone: phone ? phone.trim() : null,
          role: 'patient',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile } = await patientSupabase
          .from('profiles')
          .upsert(profilePayload, { onConflict: 'id' })
          .select()
          .single();

        if (createdProfile) {
          setPatientProfile(createdProfile);
        }

        const needsEmailConfirmation = !data.session;
        return { user: data.user, error: null, needsEmailConfirmation };
      }

      return { user: null, error: 'Registration failed. Please try again.' };
    } catch (err) {
      return { user: null, error: err.message || 'Registration failed' };
    } finally {
      setIsPatientLoading(false);
    }
  };

  /**
   * Send Password Reset Email
   */
  const resetPassword = async (email) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase backend is not configured.');
      }

      const { error } = await patientSupabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to send password reset email.' };
    }
  };

  /**
   * Sign Out Patient
   */
  const signOutPatient = async () => {
    setIsPatientLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await patientSupabase.auth.signOut();
      }
      setPatientUser(null);
      setPatientSession(null);
      setPatientProfile(null);
    } catch (err) {
      console.warn('[AuthContext.signOutPatient] Notice:', err.message);
    } finally {
      setIsPatientLoading(false);
    }
  };

  /**
   * Sign Out Doctor
   */
  const signOutDoctor = async () => {
    setIsDoctorLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await doctorSupabase.auth.signOut();
      }
      setDoctorUser(null);
      setDoctorSession(null);
      setDoctorProfile(null);
    } catch (err) {
      console.warn('[AuthContext.signOutDoctor] Notice:', err.message);
    } finally {
      setIsDoctorLoading(false);
    }
  };

  /**
   * Update Patient Profile
   */
  const updatePatientProfile = async (updates) => {
    if (!patientUser || !patientProfile) return { error: 'No active patient profile' };

    try {
      const safeUpdates = { ...updates };
      delete safeUpdates.role;
      delete safeUpdates.id;
      safeUpdates.updated_at = new Date().toISOString();

      const { data, error } = await patientSupabase
        .from('profiles')
        .update(safeUpdates)
        .eq('id', patientUser.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setPatientProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('[AuthContext.updatePatientProfile] Error:', err.message);
      return { data: null, error: err.message };
    }
  };

  /**
   * Update Doctor Profile
   */
  const updateDoctorProfile = async (updates) => {
    if (!doctorUser || !doctorProfile) return { error: 'No active doctor profile' };

    try {
      const safeUpdates = { ...updates };
      delete safeUpdates.role;
      delete safeUpdates.id;
      safeUpdates.updated_at = new Date().toISOString();

      const { data, error } = await doctorSupabase
        .from('profiles')
        .update(safeUpdates)
        .eq('id', doctorUser.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setDoctorProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('[AuthContext.updateDoctorProfile] Error:', err.message);
      return { data: null, error: err.message };
    }
  };

  const isDoctor = doctorProfile?.role === 'doctor' || doctorProfile?.role === 'admin';
  const isPatient = patientProfile?.role === 'patient' || (!isDoctor && Boolean(patientUser));

  // Determine fallback active user/profile/signIn/signOut based on window route
  const isDoctorRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/doctor');

  const activeUser = isDoctorRoute ? doctorUser : patientUser;
  const activeProfile = isDoctorRoute ? doctorProfile : patientProfile;
  const activeRole = isDoctorRoute ? (doctorProfile?.role || 'doctor') : (patientProfile?.role || 'patient');
  const activeLoading = isDoctorRoute ? isDoctorLoading : isPatientLoading;
  const activeSignIn = isDoctorRoute ? signInDoctor : signInPatient;
  const activeSignOut = isDoctorRoute ? signOutDoctor : signOutPatient;
  const activeUpdateProfile = isDoctorRoute ? updateDoctorProfile : updatePatientProfile;

  return (
    <AuthContext.Provider value={{
      // Shared / Route-aware default exports for backward compatibility
      user: activeUser,
      profile: activeProfile,
      role: activeRole,
      session: isDoctorRoute ? doctorSession : patientSession,
      isLoading: activeLoading,
      signIn: activeSignIn,
      signUp: signUpPatient,
      signOut: activeSignOut,
      logout: activeSignOut,
      login: activeSignIn,
      resetPassword,
      updateProfile: activeUpdateProfile,
      isDoctor,
      isPatient,

      // Explicit Patient Auth Exports
      patientSession,
      patientUser,
      patientProfile,
      isPatientLoading,
      signInPatient,
      signUpPatient,
      signOutPatient,
      updatePatientProfile,
      refreshPatientProfile: () => patientUser && fetchPatientProfile(patientUser),

      // Explicit Doctor Auth Exports
      doctorSession,
      doctorUser,
      doctorProfile,
      isDoctorLoading,
      signInDoctor,
      signOutDoctor,
      updateDoctorProfile,
      refreshDoctorProfile: () => doctorUser && fetchDoctorProfile(doctorUser)
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
