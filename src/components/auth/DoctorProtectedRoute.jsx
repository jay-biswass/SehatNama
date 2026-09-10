import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, ShieldAlert, ArrowLeft } from 'lucide-react';
import Loader from '../ui/Loader';
import Button from '../ui/Button';

export const DoctorProtectedRoute = ({ children }) => {
  const { user, isDoctor, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Stethoscope size={28} className="animate-pulse" />
          </div>
          <Loader message="Verifying clinical credentials..." className="text-slate-400" />
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to Doctor Login
  if (!user) {
    return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  }

  // Logged in but not a doctor -> Access Restricted screen
  if (!isDoctor) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert size={36} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              This area is strictly restricted to licensed medical practitioners and verified clinical staff of SehatNama.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3 mt-2">
            <Link to="/doctor/login" className="w-full">
              <Button variant="primary" className="w-full py-3">
                Sign in with Doctor Account
              </Button>
            </Link>

            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full py-3 border-slate-600 text-slate-300 hover:bg-slate-700" icon={<ArrowLeft size={16} />}>
                Return to Patient Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized doctor -> Render protected contents
  return children;
};

export default DoctorProtectedRoute;
