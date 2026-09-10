import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';

import logoIcon from '../../assets/SehatNama_Logo.png';

export const ForgotPassword = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    const { success, error: resetErr } = await resetPassword(email);

    if (resetErr) {
      setError(resetErr);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
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
              Reset your password
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              We'll send you a recovery link
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] flex flex-col gap-5">
          
          {isSuccess ? (
            <div className="p-5 bg-emerald-50/60 border border-emerald-200/50 rounded-[var(--radius-md)] flex flex-col items-center text-center gap-3 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[var(--color-success)]">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-sm font-semibold text-emerald-900">
                Recovery Link Sent
              </h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                If an account exists with <strong>{email}</strong>, a reset link has been sent.
              </p>
              <Link to="/login" className="w-full mt-1">
                <Button variant="primary" className="w-full text-xs">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 bg-red-50/60 border border-red-200/50 rounded-[var(--radius-sm)] flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">
                    Email Address
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

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full mt-1"
                  icon={<ArrowRight size={16} className="order-last" />}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
