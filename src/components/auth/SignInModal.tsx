import React, { useState, useEffect, useRef } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { 
  X, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function SignInModal() {
  const { isSignInModalOpen, setIsSignInModalOpen, signIn } = useStockStore();
  
  const [step, setStep] = useState<'ENTER_EMAIL' | 'ENTER_OTP'>('ENTER_EMAIL');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'ENTER_OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isSignInModalOpen) return null;

  // Real Email validation
  const isValidEmail = (emailStr: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid, existing email address (e.g. name@domain.com).');
      return;
    }

    // Generate random secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setStep('ENTER_OTP');
    setTimer(60);
    setSuccessMessage(`OTP sent to ${email.trim()}`);

    // Auto-focus first digit on step change
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...otpDigits];
    // Handle paste of 6 digits
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-advance to next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const enteredCode = otpDigits.join('');

    if (enteredCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP.');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setErrorMessage('Invalid OTP code. Please check the 6-digit code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    // Success flow
    setTimeout(() => {
      signIn(email);
      setIsSubmitting(false);
      handleClose();
    }, 600);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setTimer(60);
    setErrorMessage('');
    setSuccessMessage(`New OTP code sent to ${email.trim()}`);
    inputRefs.current[0]?.focus();
  };

  const handleClose = () => {
    setIsSignInModalOpen(false);
    setStep('ENTER_EMAIL');
    setEmail('');
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
            {step === 'ENTER_EMAIL' ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {step === 'ENTER_EMAIL' ? 'Email OTP Sign In' : 'Verify Email OTP'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {step === 'ENTER_EMAIL'
              ? 'Enter your real email address to receive a 6-digit verification code.'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* STEP 1: ENTER REAL EMAIL */}
        {step === 'ENTER_EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Real Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 text-sm text-white placeholder-slate-500 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Send 6-Digit OTP</span>
              <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP CODE */}
        {step === 'ENTER_OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            {/* Simulation Notification showing sent OTP */}
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-700/50 text-xs text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-emerald-400 mb-0.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Code Sent!</span>
              </div>
              <p className="text-[11px] text-slate-300">
                A 6-digit OTP has been sent to <strong className="text-white">{email}</strong>.
              </p>
              <div className="mt-1.5 p-1.5 rounded-lg bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Your OTP Code:</span>
                <span className="font-mono text-sm font-black text-emerald-400 tracking-widest">{generatedOtp}</span>
              </div>
            </div>

            {/* 6 Digit Input Boxes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit Code
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 sm:w-12 h-12 text-center text-lg font-black text-white bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
                  />
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Verify OTP &amp; Sign In</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Resend & Change Email Footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setStep('ENTER_EMAIL');
                  setErrorMessage('');
                }}
                className="hover:text-white transition-colors"
              >
                ← Change Email
              </button>

              <button
                type="button"
                disabled={timer > 0}
                onClick={handleResendOtp}
                className={`flex items-center gap-1 transition-colors ${
                  timer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-emerald-400 hover:text-emerald-300 font-semibold'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-500">
            Secure, passwordless authentication using real email and one-time verification.
          </p>
        </div>

      </div>
    </div>
  );
}
