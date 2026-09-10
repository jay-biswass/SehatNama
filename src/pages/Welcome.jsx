import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import { Mic, Globe, Shield, ArrowRight } from 'lucide-react';

import logoWithName from '../assets/SehatNama_Logo_With_Name.png';

export const Welcome = () => {
  const navigate = useNavigate();
  const { patientUser: user, isPatient } = useAuth();

  return (
    <PageContainer className="justify-center items-center text-center py-12 md:py-20 gap-8">
      {/* Brand & Logo */}
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <img src={logoWithName} alt="SehatNama Logo" className="h-24 md:h-32 w-auto object-contain mx-auto" />
        <p className="text-[var(--color-text-muted)] font-medium text-base tracking-wide">
          Your health story, understood.
        </p>
      </div>

      {/* Intro Copy */}
      <div className="max-w-md animate-fade-in">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Welcome to SehatNama
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Let's understand your health concerns before you meet your doctor. 
          Speak or answer using simple touch options. Your details are summarized securely for your clinical team.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg animate-fade-in">
        {[
          { icon: <Mic size={18} />, title: 'Speak Naturally', desc: 'Answer by voice or taps' },
          { icon: <Globe size={18} />, title: 'Multilingual', desc: 'Hindi, English, Bengali...' },
          { icon: <Shield size={18} />, title: 'Secure & Private', desc: 'Your data is protected' }
        ].map((f, i) => (
          <div key={i} className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 flex flex-col items-center gap-2 shadow-[var(--shadow-xs)]">
            <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-primary-muted)] flex items-center justify-center text-[var(--color-primary)]">
              {f.icon}
            </div>
            <span className="font-semibold text-sm text-[var(--color-text-primary)]">{f.title}</span>
            <span className="text-xs text-[var(--color-text-muted)]">{f.desc}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs flex flex-col gap-3 animate-fade-in">
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate('/check-in')}
          icon={<ArrowRight size={16} className="order-last" />}
        >
          Start Health Check-in
        </Button>

        {user && isPatient ? (
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => navigate('/patient/dashboard')}
          >
            Open Patient Dashboard
          </Button>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            Have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[var(--color-primary)] font-medium hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        )}

        <button
          type="button"
          onClick={() => navigate('/doctor/login')}
          className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] py-1.5 transition-colors cursor-pointer"
        >
          Doctor Portal →
        </button>
      </div>
    </PageContainer>
  );
};

export default Welcome;
