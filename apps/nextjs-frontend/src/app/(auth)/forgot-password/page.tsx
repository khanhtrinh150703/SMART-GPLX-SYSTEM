'use client';

import { EmailStep } from '@/components/features/auth/EmailStep';
import { ResetStep } from '@/components/features/auth/ResetStep';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-soft border border-slate-100">
        {step === 1 ? (
          <EmailStep 
            onSuccess={(validEmail) => {
              setEmail(validEmail);
              setStep(2);
            }} 
          />
        ) : (
          <ResetStep 
            email={email} 
            onBack={() => setStep(1)} 
          />
        )}
      </div>
    </div>
  );
}