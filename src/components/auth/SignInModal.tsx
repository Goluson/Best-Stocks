import React, { useState } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { 
  X, 
  LogIn, 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export default function SignInModal() {
  const { isSignInModalOpen, setIsSignInModalOpen, signIn } = useStockStore();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!isSignInModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    signIn(email.trim(), name.trim() || undefined);
  };

  const handleGuestLogin = () => {
    signIn('investor@beststocks.ai', 'Pro Investor');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={() => setIsSignInModalOpen(false)}
          className="absolute right-5 top-5 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
            <LogIn className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Sign In to BestStocks</h3>
          <p className="text-xs text-slate-400 mt-1">
            Save screener presets, bookmark stocks, and track live prices
          </p>
        </div>

        {/* 1-Click Guest Sign In Option */}
        <button
          onClick={handleGuestLogin}
          type="button"
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mb-4 group"
        >
          <Zap className="w-4 h-4 fill-current text-slate-950" />
          <span>Quick 1-Click Investor Demo Login</span>
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 absolute">
            Or Sign In With Email
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
              Your Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Warren Sharma"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 text-xs text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@example.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 text-xs text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 text-xs text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue</span>
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            By signing in, you access real-time NSE/BSE stock screening rules.
          </p>
        </div>

      </div>
    </div>
  );
}
