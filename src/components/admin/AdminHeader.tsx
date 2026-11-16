import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Smartphone, User, ChevronDown, CheckCircle, LogOut } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { currentUser, setViewMode, logout, switchUser, recentActivities } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
      {/* Search Bar */}
      <div className="w-96 relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search workers, tools, sites..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Switch to Worker Check-In view button */}
        <button
          onClick={() => setViewMode('worker-mobile')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-all"
        >
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span>Launch Worker Mobile Screen</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                <span className="text-xs font-bold text-slate-800">Recent Operational Alerts</span>
                <span className="text-[10px] text-blue-600 font-medium">Clear all</span>
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {recentActivities.slice(0, 4).map((act) => (
                  <div key={act.id} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs">
                    <p className="font-semibold text-slate-800 text-[11px]">{act.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{act.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {currentUser?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {currentUser?.role || 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Admin Account</p>
                <p className="text-[11px] text-slate-500">Operations Control</p>
              </div>

              <div className="p-1 space-y-1">
                <button
                  onClick={() => {
                    setViewMode('worker-mobile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Switch to Worker Check-In</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
