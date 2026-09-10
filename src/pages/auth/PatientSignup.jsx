import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';

import logoIcon from '../../assets/SehatNama_Logo.png';

export const PatientSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (phone && !/^\d{10}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setIsLoading(true);

    const { user, needsEmailConfirmation, error: signupError } = await signUp({
      fullName,
      email,
      phone,
      password
    });

    if (signupError) {
      setError(signupError);
      setIsLoading(false);
    } else if (needsEmailConfirmation) {
      setSuccessNotice(true);
      setIsLoading(false);
    } else {
      // Auto-authenticated -> Navigate to patient dashboard
      navigate('/patient/dashboard');
    }
  };

  const inputClass = "w-full pl-9 pr-3 py-2.5 bg-[var(--color-bg-base)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] focus:bg-white transition-all";

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-base)] flex flex-col items-center justify-center px-4 py-8 font-sans select-none">
      <div className="max-w-sm w-full flex flex-col gap-8">
        
        {/* Brand */}
        <div className="flex flex-col items-center text-center gap-3">
          <img src={logoIcon} alt="SehatNama Logo" className="h-12 w-auto object-contain" />
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Join SehatNama to manage your health records
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] flex flex-col gap-5">
          
          {/* Success Notice */}
          {successNotice ? (
            <div className="p-5 bg-emerald-50/60 border border-emerald-200/50 rounded-[var(--radius-md)] flex flex-col items-center text-center gap-3 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[var(--color-success)]">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-sm font-semibold text-emerald-900">
                Verification Email Sent
              </h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                We've sent a verification link to <strong>{email}</strong>. Check your inbox to continue.
              </p>
              <Link to="/login" className="w-full mt-1">
                <Button variant="primary" className="w-full text-xs">
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50/60 border border-red-200/50 rounded-[var(--radius-sm)] flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Full Name *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Ramesh Kumar" required className={inputClass} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Email *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ramesh@example.com" required className={inputClass} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Mobile Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" maxLength={10} className={inputClass} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Password *</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required className={inputClass} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Confirm Password *</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required className={inputClass} />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full mt-1"
                  icon={<ArrowRight size={16} className="order-last" />}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <p className="text-center text-sm text-[var(--color-text-muted)]">
                Already registered?{' '}
                <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;
