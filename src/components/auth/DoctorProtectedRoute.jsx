import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, ShieldAlert, ArrowLeft } from 'lucide-react';
import Loader from '../ui/Loader';
import Button from '../ui/Button';

export const DoctorProtectedRoute = ({ children }) => {
  const { doctorUser, isDoctor, isDoctorLoading } = useAuth();
  const location = useLocation();

  if (isDoctorLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <Stethoscope size={28} className="animate-pulse" />
          </div>
          <Loader message="Verifying clinical credentials..." className="text-slate-500 text-xs font-semibold" />
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to Doctor Login
  if (!doctorUser) {
    return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  }

  // Logged in but not a doctor -> Access Restricted screen
  if (!isDoctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <ShieldAlert size={36} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              This area is strictly restricted to licensed medical practitioners and verified clinical staff of SehatNama.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3 mt-2">
            <Link to="/doctor/login" className="w-full">
              <Button variant="primary" className="w-full py-3 font-bold">
                Sign in with Doctor Account
              </Button>
            </Link>

            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full py-3 border-slate-200 text-slate-600 hover:bg-slate-50" icon={<ArrowLeft size={16} />}>
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
