import React, { useState } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  UserCircle, 
  Stethoscope, 
  Building2, 
  Mail, 
  Award, 
  ShieldCheck, 
  Save, 
  Check, 
  LogOut,
  ExternalLink
} from 'lucide-react';
import Button from '../../components/ui/Button';

export const DoctorProfile = () => {
  const { doctorProfile: profile, doctorUser: user, updateDoctorProfile: updateProfile, signOutDoctor: logout } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [specialization, setSpecialization] = useState(profile?.specialization || '');
  const [hospital, setHospital] = useState(profile?.hospital || '');
  const [registrationNo, setRegistrationNo] = useState(profile?.registration_no || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever authenticated profile loads/updates
  React.useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.specialization) setSpecialization(profile.specialization);
      if (profile.hospital) setHospital(profile.hospital);
      if (profile.registration_no) setRegistrationNo(profile.registration_no);
      if (profile.phone) setPhone(profile.phone);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        full_name: fullName.trim(),
        specialization: specialization.trim(),
        hospital: hospital.trim(),
        registration_no: registrationNo.trim(),
        phone: phone.trim()
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-12">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCircle size={26} className="text-teal-700" />
            <span>Doctor Profile & Clinical Credentials</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Manage your medical practitioner profile and clinic/hospital details.
          </p>
        </div>

        {/* Credentials Header Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-teal-500/20 shrink-0">
            {fullName ? fullName.charAt(0).toUpperCase() : 'D'}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-slate-900">
                {fullName}
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                <ShieldCheck size={12} className="text-teal-600" />
                <span>Verified Physician</span>
              </span>
            </div>

            <p className="text-xs text-teal-700 font-semibold mt-1">
              {specialization}
            </p>

            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center justify-center sm:justify-start gap-1">
              <Building2 size={13} className="text-slate-400" />
              <span>{hospital}</span>
            </p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <h4 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Stethoscope size={16} className="text-teal-700" />
            <span>Practitioner Information</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Doctor Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800 font-medium transition-all"
              />
            </div>

            {/* Email (Readonly) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Email Address (Auth Identity)
              </label>
              <input
                type="email"
                value={profile?.email || user?.email || ''}
                disabled
                className="p-3 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
            </div>

            {/* Specialization */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Clinical Specialization
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Internal Medicine, Cardiology, General Physician"
                className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800 font-medium transition-all"
              />
            </div>

            {/* Hospital / Clinic */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Hospital / Organization
              </label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="e.g. AIIMS New Delhi / City General Clinic"
                className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800 font-medium transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800 font-medium transition-all"
              />
            </div>

            {/* Medical Registration Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Medical Council Registration No.
              </label>
              <input
                type="text"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                placeholder="e.g. MCI-2018-98421"
                className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800 font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
                <Check size={16} />
                <span>Profile updated successfully!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Changes will reflect on all case reviews
              </span>
            )}

            <Button
              type="submit"
              disabled={isSaving}
              icon={isSaving ? undefined : <Save size={16} />}
              className="px-5 py-2.5 text-xs font-bold"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
