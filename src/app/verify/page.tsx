'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { usePortalState } from '../../hooks/usePortalState';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function OtpVerification() {
  const router = useRouter();
  const { activeUser, verifyOTPCode } = usePortalState();
  
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(59);
  const [resending, setResending] = useState<boolean>(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Focus on first box on mount
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // take last digit
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace handling
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').trim();
    if (data.length === 6 && !isNaN(Number(data))) {
      const splitDigits = data.split('');
      setOtp(splitDigits);
      inputsRef.current[5]?.focus();
    }
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setTimer(59);
      setResending(false);
      toast.success('A new 6-digit OTP has been transmitted to your email.', {
        description: 'Please inspect your junk/spam folders if not received.'
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.warning('Please enter all 6 digits of the verification code.');
      return;
    }

    if (!activeUser) {
      toast.error('Session expired. Please fill out the registration form.');
      router.push('/register');
      return;
    }

    // Accept mock verification code (e.g. "123456" or any complete code for evaluation)
    const success = verifyOTPCode(activeUser.id);
    if (success) {
      // Trigger canvas-confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0B1F3A', '#1E4D8C', '#D4A017']
      });

      toast.success('Identity verified successfully!');
      router.push('/success');
    } else {
      toast.error('Verification failed. Please re-check code values.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-slate flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-blue-800/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-gold-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-white rounded-3xl premium-card premium-shadow border border-border-slate p-8 text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-navy-950/5 text-navy-950 flex items-center justify-center mx-auto border border-navy-950/10">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-outfit font-black text-2xl text-navy-950">Verify Your Identity</h1>
          <p className="text-xs font-semibold text-text-slate leading-relaxed">
            We have transmitted a 6-digit confirmation code to: <br />
            <span className="font-bold text-navy-950 underline">{activeUser?.personalInfo?.email || 'your registered email'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex gap-2.5 justify-center">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                ref={el => { inputsRef.current[idx] = el; }}
                maxLength={1}
                value={digit}
                onPaste={idx === 0 ? handlePaste : undefined}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold rounded-xl border border-border-slate focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 transition-all outline-none bg-bg-slate/50 focus:bg-white text-navy-950"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-navy-950 text-white font-extrabold text-[14px] hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            Confirm & Complete
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-border-slate/60 text-text-slate">
            <span>
              {timer > 0 ? (
                `Resend code in ${String(timer).padStart(2, '0')}s`
              ) : (
                'Didn\'t receive the code?'
              )}
            </span>
            <button
              type="button"
              disabled={timer > 0 || resending}
              onClick={handleResend}
              className="text-blue-800 hover:text-navy-950 disabled:text-text-slate flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              Resend Code
            </button>
          </div>
        </form>
      </motion.div>

    </div>
  );
}
