import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Droplet, 
  AlertCircle
} from 'lucide-react';

export const PatientInfoCard = ({ patient = {} }) => {
  if (!patient || Object.keys(patient).length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center text-slate-400 text-xs shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]">
        No patient demographic profile linked to this case.
      </div>
    );
  }

  const renderField = (label, value, icon, badge = null) => {
    const isProvided = value !== null && value !== undefined && String(value).trim() !== '';

    return (
      <div className="flex flex-col gap-1 p-3.5 bg-slate-50/80 border border-slate-100/80 rounded-2xl">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          {isProvided ? (
            <span className="text-xs font-extrabold text-slate-900 break-words">
              {String(value)}
            </span>
          ) : (
            <span className="text-xs italic text-slate-400 font-medium">
              Not provided
            </span>
          )}
          {badge}
        </div>
      </div>
    );
  };

  const hasAllergiesValue = patient.has_allergies || (patient.allergies ? 'Yes' : 'No');
  const allergiesDetail = patient.allergies ? ` (${patient.allergies})` : '';

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex flex-col gap-4">
      {/* Header with Avatar & Name */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-blue-500/20 shrink-0">
          {patient.full_name ? patient.full_name.charAt(0).toUpperCase() : <User size={24} />}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
            {patient.full_name || 'Patient'}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {patient.age ? `${patient.age} years old` : 'Age not provided'} • <span className="capitalize">{patient.gender || 'Gender not provided'}</span>
          </p>
        </div>
      </div>

      {/* Demographics & Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {renderField('Mobile Number', patient.mobile_number ? `+91 ${patient.mobile_number}` : null, <Phone size={13} className="text-blue-600" />)}
        {renderField('Email Address', patient.email, <Mail size={13} className="text-blue-600" />)}
        {renderField('Location', patient.location, <MapPin size={13} className="text-blue-600" />)}
        {renderField('Preferred Language', patient.preferred_language, <Globe size={13} className="text-blue-600" />)}
        {renderField('Blood Group', patient.blood_group, <Droplet size={13} className="text-rose-600" />)}
        {renderField(
          'Allergies Reported', 
          hasAllergiesValue === 'Yes' || patient.allergies ? `Yes${allergiesDetail}` : 'No known allergies', 
          <AlertCircle size={13} className={hasAllergiesValue === 'Yes' ? 'text-amber-600' : 'text-slate-400'} />,
          hasAllergiesValue === 'Yes' ? <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Allergy Flag</span> : null
        )}
      </div>
    </div>
  );
};

export default PatientInfoCard;
