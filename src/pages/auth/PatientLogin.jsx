import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

import logoIcon from '../../assets/SehatNama_Logo.png';

export const PatientLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInPatient } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/patient/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    const { user, profile, error: loginError } = await signInPatient(email, password);

    if (loginError) {
      setError(loginError);
      setIsLoading(false);
    } else {
      // Role checking: If this user is a doctor, redirect them to doctor dashboard
      if (profile?.role === 'doctor' || profile?.role === 'admin') {
        navigate('/doctor/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-base)] flex flex-col items-center justify-center px-4 py-8 font-sans select-none">
      <div className="max-w-sm w-full flex flex-col gap-8">
        
        {/* Brand */}
        <div className="flex flex-col items-center text-center gap-3">
          <img src={logoIcon} alt="SehatNama Logo" className="h-12 w-auto object-contain" />
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Sign in to your patient portal
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] flex flex-col gap-5">
          
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50/60 border border-red-200/50 rounded-[var(--radius-sm)] flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-bg-base)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[var(--color-primary)] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-bg-base)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] focus:bg-white transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full mt-1"
              icon={<ArrowRight size={16} className="order-last" />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Footer links */}
        <div className="flex flex-col gap-2 text-center text-sm">
          <p className="text-[var(--color-text-muted)]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--color-primary)] font-medium hover:underline">
              Create one
            </Link>
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-[var(--color-text-muted)]">
            <Link to="/check-in" className="hover:text-[var(--color-text-secondary)] transition-colors">
              Walk-in Check-in
            </Link>
            <span>•</span>
            <Link to="/doctor/login" className="hover:text-[var(--color-text-secondary)] transition-colors">
              Doctor Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
