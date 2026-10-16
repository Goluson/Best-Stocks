import React, { useState, useEffect, useRef } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { 
  sendOtpToEmail, 
  getSavedEmailSettings, 
  saveEmailSettings,
  EmailServiceSettings 
} from '../../services/emailService';
import { 
  X, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Send,
  Smartphone,
  Settings,
  Sparkles,
  ExternalLink
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
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  
  // Email service settings state
  const [settings, setSettings] = useState<EmailServiceSettings>(getSavedEmailSettings());

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
      setErrorMessage('Please enter a valid, existing email address.');
      return;
    }

    setIsSending(true);

    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);

    // Attempt real email dispatch
    const result = await sendOtpToEmail(email.trim(), code);
    setIsSending(false);
    setIsConfigured(result.isConfigured);

    if (result.isConfigured && !result.success && result.error) {
      setErrorMessage(result.error);
    }

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
      setErrorMessage('Please enter all 6 digits of the OTP code.');
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
    }, 400);
  };

  const handleAutoFillOtp = () => {
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
    const result = await sendOtpToEmail(email.trim(), code);
    setIsConfigured(result.isConfigured);
    inputRefs.current[0]?.focus();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailSettings(settings);
    setShowConfig(false);
  };

  const handleClose = () => {
    setIsSignInModalOpen(false);
    setStep('ENTER_EMAIL');
    setEmail('');
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    setShowConfig(false);
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

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
            {step === 'ENTER_EMAIL' ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {step === 'ENTER_EMAIL' ? 'Email Sign In' : 'Enter 6-Digit OTP'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {step === 'ENTER_EMAIL'
              ? 'Enter your real email address to continue.'
              : `Verification code for ${email}`}
          </p>
        </div>

        {/* STEP 1: ENTER REAL EMAIL */}
        {step === 'ENTER_EMAIL' && !showConfig && (
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
                  <span>Send OTP</span>
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP (Clean, minimal, without long dispatch messages) */}
        {step === 'ENTER_OTP' && !showConfig && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            
            {/* 6 Discrete Digit Inputs */}
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

            {/* Error Message if wrong code */}
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
                  <span>Verify OTP &amp; Login</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Helper for seamless login */}
            {!isConfigured && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors"
                >
                  ⚡ Auto-fill OTP &amp; proceed to login
                </button>
              </div>
            )}

            {/* Resend & Change Email Controls */}
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
                <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Email Provider Configuration Drawer */}
        {showConfig && (
          <form onSubmit={handleSaveSettings} className="space-y-3.5 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <p className="font-semibold text-white mb-1">Live Email Delivery Settings</p>
              <p className="text-[11px] text-slate-400">
                Connect Resend or EmailJS to dispatch real emails directly to your Gmail inbox.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Provider</label>
              <select
                value={settings.provider}
                onChange={(e) => setSettings({ ...settings, provider: e.target.value as any })}
                className="w-full px-3 py-1.5 bg-slate-950 text-xs text-white rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="resend">Resend API (Instant &amp; Free)</option>
                <option value="emailjs">EmailJS</option>
              </select>
            </div>

            {settings.provider === 'resend' ? (
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Resend API Key</label>
                <input
                  type="password"
                  placeholder="re_xxxxxxxxxxxxxx"
                  value={settings.resendApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 text-xs text-white rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Service ID</label>
                  <input
                    type="text"
                    placeholder="service_xxxxxxx"
                    value={settings.emailjsServiceId || ''}
                    onChange={(e) => setSettings({ ...settings, emailjsServiceId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 text-xs text-white rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Template ID</label>
                  <input
                    type="text"
                    placeholder="template_xxxxxxx"
                    value={settings.emailjsTemplateId || ''}
                    onChange={(e) => setSettings({ ...settings, emailjsTemplateId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 text-xs text-white rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Public Key</label>
                  <input
                    type="text"
                    placeholder="Public Key"
                    value={settings.emailjsPublicKey || ''}
                    onChange={(e) => setSettings({ ...settings, emailjsPublicKey: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 text-xs text-white rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Save Delivery Settings
              </button>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Clean Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>BestStocks Security</span>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1 hover:text-slate-300 transition-colors text-slate-400"
          >
            <Settings className="w-3 h-3" />
            <span>Email Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
}
