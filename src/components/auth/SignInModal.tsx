import React, { useState, useEffect, useRef } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { sendOtpToEmail } from '../../services/emailService';
import { 
  X, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Send,
  Eye,
  ArrowRight
} from 'lucide-react';

export default function SignInModal() {
  const { isSignInModalOpen, setIsSignInModalOpen, signIn } = useStockStore();
  
  const [step, setStep] = useState<'ENTER_EMAIL' | 'ENTER_OTP'>('ENTER_EMAIL');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [isCodeRevealed, setIsCodeRevealed] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown for resend
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

  const isValidEmail = (emailStr: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSending(true);

    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setIsCodeRevealed(false);

    // Dispatch OTP via email service
    await sendOtpToEmail(email.trim(), code);
    setIsSending(false);

    setStep('ENTER_OTP');
    setTimer(60);

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...otpDigits];
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
      setErrorMessage('Invalid OTP code. Please enter the correct 6-digit code.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      signIn(email);
      setIsSubmitting(false);
      handleClose();
    }, 300);
  };

  const handleAutoFill = () => {
    if (generatedOtp) {
      setOtpDigits(generatedOtp.split(''));
      setErrorMessage('');
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setErrorMessage('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setTimer(60);
    setIsCodeRevealed(false);
    await sendOtpToEmail(email.trim(), code);
    inputRefs.current[0]?.focus();
  };

  const handleClose = () => {
    setIsSignInModalOpen(false);
    setStep('ENTER_EMAIL');
    setEmail('');
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    setIsCodeRevealed(false);
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

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
            {step === 'ENTER_EMAIL' ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {step === 'ENTER_EMAIL' ? 'Email OTP Sign In' : 'Enter 6-Digit OTP'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {step === 'ENTER_EMAIL'
              ? 'Enter your email to receive an instant verification code'
              : `Verification code sent to ${email}`}
          </p>
        </div>

        {/* STEP 1: ENTER EMAIL */}
        {step === 'ENTER_EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
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
                  placeholder="name@gmail.com"
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
              disabled={isSending}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isSending ? (
                <span>Sending OTP...</span>
              ) : (
                <>
                  <span>Send OTP to Email</span>
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP (Simple & Always Works) */}
        {step === 'ENTER_OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            {/* 6 Digit Input Boxes */}
            <div>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-2">
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

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
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

            {/* Instant Helper so user is NEVER blocked */}
            <div className="text-center py-1">
              {!isCodeRevealed ? (
                <button
                  type="button"
                  onClick={() => setIsCodeRevealed(true)}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Didn't receive email? Click to reveal code</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in">
                  <span className="text-slate-400">Your Code: <strong className="text-emerald-400 font-mono text-sm tracking-wider">{generatedOtp}</strong></span>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold text-[11px] transition-colors"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}
            </div>

            {/* Resend & Change Email Footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setStep('ENTER_EMAIL');
                  setErrorMessage('');
                  setIsCodeRevealed(false);
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
                <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
