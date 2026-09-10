import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, Stethoscope, ArrowRight, UserCheck } from 'lucide-react';
import Loader from '../ui/Loader';
import Button from '../ui/Button';

export const PatientProtectedRoute = ({ children }) => {
  const { patientUser, isPatient, isDoctor, isPatientLoading } = useAuth();
  const location = useLocation();

  if (isPatientLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
            <Heart size={28} className="animate-pulse fill-teal-600" />
          </div>
          <Loader message="Loading your health portal..." className="text-slate-500 text-xs font-semibold" />
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to Patient Login
  if (!patientUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in as doctor attempting to open patient protected dashboard
  if (isDoctor && !isPatient) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Stethoscope size={36} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Physician Account Detected</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              You are currently logged in with clinical doctor credentials. Patient dashboard and intake history are reserved for patient accounts.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3 mt-2">
            <Link to="/doctor/dashboard" className="w-full">
              <Button variant="primary" className="w-full py-3 font-bold bg-blue-600 hover:bg-blue-700" icon={<ArrowRight size={16} />}>
                Go to Doctor Dashboard
              </Button>
            </Link>

            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full py-3 border-slate-200 text-slate-600 hover:bg-slate-50">
                Sign in with Patient Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated patient
  return children;
};

export default PatientProtectedRoute;
