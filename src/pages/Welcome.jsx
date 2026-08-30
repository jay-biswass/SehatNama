import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import { Mic, Globe, Shield, ArrowRight, Heart } from 'lucide-react';

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <PageContainer className="justify-between items-center text-center py-10 md:py-16">
      {/* Brand & Logo */}
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-teal-600 flex items-center justify-center text-white shadow-xl shadow-teal-600/20">
          <Heart size={44} className="fill-white stroke-teal-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-teal-800 md:text-5xl mt-2 mb-1">
            SehatNama
          </h1>
          <p className="text-slate-500 font-medium text-lg tracking-wide">
            Your health story, understood.
          </p>
        </div>
      </div>

      {/* Intro Copy */}
      <div className="max-w-md my-8 animate-fade-in delay-100">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
          Welcome to SehatNama
        </h2>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Let's understand your health concerns before you meet your doctor. 
          You can speak or answer using simple touch options. Your details will be summarized securely for your clinical team.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mb-10 animate-fade-in delay-200">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
            <Mic size={20} />
          </div>
          <span className="font-bold text-sm text-slate-800">Speak Naturally</span>
          <span className="text-xs text-slate-500">Answer by voice or simple taps</span>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
            <Globe size={20} />
          </div>
          <span className="font-bold text-sm text-slate-800">Multilingual</span>
          <span className="text-xs text-slate-500">Hindi, English, Bengali, Tamil...</span>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
            <Shield size={20} />
          </div>
          <span className="font-bold text-sm text-slate-800">Secure & Private</span>
          <span className="text-xs text-slate-500">Your medical data is protected</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-xs animate-fade-in delay-300">
        <Button
          size="lg"
          className="w-full py-4 text-base"
          onClick={() => navigate('/check-in')}
          icon={<ArrowRight size={18} className="order-last ml-1" />}
        >
          Start Health Check-in
        </Button>
      </div>
    </PageContainer>
  );
};

export default Welcome;
