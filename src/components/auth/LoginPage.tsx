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
  
  // Login page is always in sleek dark mode; toggle effect is shown after login
  const isDarkMode = true;

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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md relative z-10">

        {/* OUTSIDE THE BOX: SITETRACK BRAND & APP HEADING */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            {/* 3-Pillar Geometric Brand Logo */}
            <svg width="36" height="38" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="4" width="7.5" height="20" rx="3" fill="#2563EB" />
              <rect x="12" y="1" width="7.5" height="28" rx="3" fill="#2563EB" />
              <rect x="23" y="4" width="7.5" height="20" rx="3" fill="#2563EB" />
            </svg>
            <span className={`text-2xl font-extrabold tracking-tight block leading-none ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              SiteTrack
            </span>
          </div>
          <p className={`text-xs font-semibold tracking-wide ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Worker Attendance App
          </p>
        </div>

        {/* LOGIN BOX: Elevated Box with Hover Effect */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`border rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
            isDarkMode 
              ? `bg-slate-900/95 border-slate-800 ${isHovered ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10 -translate-y-0.5' : 'shadow-xl'}`
              : `bg-white border-slate-200 ${isHovered ? 'border-blue-400 shadow-2xl -translate-y-0.5' : 'shadow-lg'}`
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {error}
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${
                isDarkMode ? 'text-slate-200' : 'text-slate-700'
              }`}>
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
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500' 
                      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`block text-xs font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  Password
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); alert('Please contact your site administrator to reset your password.'); }} 
                  className="text-xs font-semibold text-blue-500 hover:text-blue-400"
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
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500' 
                      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between pt-1">
              <label className={`flex items-center gap-2 cursor-pointer text-xs font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className={`rounded border text-blue-600 focus:ring-blue-500 ${
                    isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-300'
                  }`} 
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group disabled:opacity-50"
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
