import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { calculateAge } from '../utils/calculateAge';

import PageContainer from '../components/layout/PageContainer';
import BackButton from '../components/navigation/BackButton';
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';
import SelectInput from '../components/ui/SelectInput';
import RadioGroup from '../components/ui/RadioGroup';
import FormSection from '../components/ui/FormSection';
import ValidationMessage from '../components/ui/ValidationMessage';

const bloodGroupOptions = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "I don't know"
];

const genderOptions = [
  'Male', 'Female', 'Other', 'Prefer not to say'
];

const allergyOptions = [
  'Yes', 'No', "I don't know"
];

export const PatientDetails = () => {
  const navigate = useNavigate();
  const { patientData, updatePatientData, savePatientProfile } = usePatient();
  const [errors, setErrors] = useState({});

  // Auto-calculate age when DOB changes
  useEffect(() => {
    if (patientData.dateOfBirth) {
      const computedAge = calculateAge(patientData.dateOfBirth);
      if (computedAge !== null && computedAge >= 0) {
        updatePatientData({ age: computedAge });
      } else {
        updatePatientData({ age: null });
      }
    } else {
      updatePatientData({ age: null });
    }
  }, [patientData.dateOfBirth]);

  const validate = () => {
    const newErrors = {};
    if (!patientData.patientName?.trim()) {
      newErrors.patientName = 'Please enter your full name.';
    }
    
    if (!patientData.dateOfBirth) {
      newErrors.dateOfBirth = 'Please select your date of birth.';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (patientData.dateOfBirth > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future.';
      }
    }

    if (!patientData.gender) {
      newErrors.gender = 'Please select a gender.';
    }
    
    if (!patientData.mobileNumber?.trim() || !/^\d{10}$/.test(patientData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (validate()) {
      // Async background sync with Supabase
      savePatientProfile();
      navigate('/consent');
    }
  };

  const handleChange = (field, value) => {
    updatePatientData({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <PageContainer className="justify-between py-6">
      {/* Navigation Row */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <BackButton to="/language" />
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          Step 2 of 6
        </span>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full gap-8 mt-2 pb-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Tell us a little about yourself
          </h2>
          <p className="text-sm text-slate-500">
            This information helps your healthcare team better understand your health profile.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <FormSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <TextInput
                label="Full Name"
                id="patientName"
                placeholder="Enter your full name"
                required
                value={patientData.patientName || ''}
                onChange={(e) => handleChange('patientName', e.target.value)}
                error={errors.patientName}
              />

              {/* Mobile Number */}
              <TextInput
                label="Mobile Number"
                id="mobileNumber"
                placeholder="Enter your 10-digit mobile number"
                required
                type="tel"
                maxLength={10}
                value={patientData.mobileNumber || ''}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                error={errors.mobileNumber}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Date of Birth */}
              <div className="flex flex-col gap-1">
                <TextInput
                  label="Date of Birth"
                  id="dateOfBirth"
                  type="date"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  value={patientData.dateOfBirth || ''}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  error={errors.dateOfBirth}
                />
                {patientData.age !== null && patientData.age >= 0 && (
                  <span className="text-xs font-semibold text-teal-600 pl-1 mt-1">
                    Age: {patientData.age} years
                  </span>
                )}
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1">
                <SelectInput
                  label="Gender"
                  id="gender"
                  required
                  options={genderOptions}
                  value={patientData.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  error={errors.gender}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email Address */}
              <TextInput
                label="Email Address (Optional)"
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={patientData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />

              {/* City / Location */}
              <TextInput
                label="City / Location (Optional)"
                id="location"
                placeholder="Enter your city"
                value={patientData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
          </FormSection>

          {/* Optional Medical Profile Section */}
          <div className="border-t border-slate-100 pt-8 mt-2">
            <FormSection
              title="Basic Health Information"
              subtitle="This helps provide useful context for your healthcare consultation."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Blood Group */}
                <SelectInput
                  label="Blood Group (Optional)"
                  id="bloodGroup"
                  options={bloodGroupOptions}
                  value={patientData.bloodGroup || ''}
                  onChange={(e) => handleChange('bloodGroup', e.target.value)}
                />
              </div>

              {/* Allergies */}
              <div className="mt-2">
                <RadioGroup
                  label="Do you have any known allergies?"
                  options={allergyOptions}
                  value={patientData.hasAllergies || ''}
                  onChange={(val) => {
                    handleChange('hasAllergies', val);
                    if (val !== 'Yes') {
                      handleChange('allergies', '');
                    }
                  }}
                />
                
                {patientData.hasAllergies === 'Yes' && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <TextInput
                      id="allergies"
                      placeholder="Example: Penicillin, peanuts, dust"
                      value={patientData.allergies || ''}
                      onChange={(e) => handleChange('allergies', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </FormSection>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6">
          <Button
            size="lg"
            className="w-full py-4 text-base font-bold"
            onClick={handleContinue}
          >
            Continue
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <span role="img" aria-label="lock">🔒</span> 
              Your personal information is securely used to prepare your healthcare consultation.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PatientDetails;
