import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, User as UserIcon, Eye, EyeOff, ArrowRight
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username);
      if (!success) {
        setError('Invalid username or password. Please verify your credentials.');
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-200/90 shadow-sm mb-4">
            {/* 3-Pillar Geometric Brand Logo matching PDF Page 6 */}
            <svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="4" width="7.5" height="20" rx="3" fill="#2563EB" />
              <rect x="12" y="1" width="7.5" height="28" rx="3" fill="#2563EB" />
              <rect x="23" y="4" width="7.5" height="20" rx="3" fill="#2563EB" />
            </svg>
            <div className="text-left">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
                SiteTrack
              </span>
              <span className="text-[8px] uppercase tracking-widest text-blue-600 font-bold">
                TOOLS. PEOPLE. PROGRESS.
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
            Worker Sign In
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to access worksite Check-In & Check-Out
          </p>
        </div>

        {/* Elevated Login Card with Box & Hover Effect */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-white border rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
            isHovered 
              ? 'border-blue-400 shadow-2xl -translate-y-0.5' 
              : 'border-slate-200 shadow-lg'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username or Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. EMP001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); alert('Please contact your site administrator to reset your password.'); }} 
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
