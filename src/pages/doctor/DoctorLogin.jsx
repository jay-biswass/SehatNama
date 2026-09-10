import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Mail, Key, ShieldCheck, ArrowRight, Heart, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

export const DoctorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoDoctorLogin } = useAuth();

  const [email, setEmail] = useState('dr.sharma@sehatnama.in');
  const [password, setPassword] = useState('doctor123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/doctor/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your medical ID / email and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    const { user, error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError);
      setIsLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    await demoDoctorLogin();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 select-none font-sans text-slate-100 relative overflow-hidden">
      {/* Background Subtle Blue Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Heart size={30} className="fill-white stroke-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <span>SehatNama</span>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Doctor
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Clinical Triage & Patient Case Management
            </p>
          </div>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Doctor Email / Registration ID
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.sharma@sehatnama.in"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <div className="relative">
              <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-lg shadow-blue-500/20"
            icon={<Stethoscope size={18} />}
          >
            {isLoading ? 'Authenticating...' : 'Sign in as Physician'}
          </Button>
        </form>

        {/* Quick Demo Doctor Sign-In Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Evaluation / Testing mode:</span>
            <span className="text-blue-400 font-bold">Instant Access</span>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <ShieldCheck size={16} className="text-blue-400" />
            <span>One-Click Demo Doctor Sign-In</span>
          </button>
        </div>

        {/* Footer Link to Patient Portal */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 font-medium"
          >
            <span>Are you a patient? Go to Patient Portal</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
