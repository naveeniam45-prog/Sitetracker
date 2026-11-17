import React from 'react';
import { useApp, ActiveAdminTab } from '../../context/AppContext';
import { 
  LayoutDashboard, Building2, Users, Wrench, CalendarCheck2, 
  BarChart3, Settings, HardHat, Smartphone, LogOut
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab, setViewMode, logout } = useApp();

  const navItems: Array<{ id: ActiveAdminTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sites', label: 'Sites', icon: Building2 },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-navy-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none text-white">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block leading-none">
                Sitetrack
              </span>
              <span className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold mt-1 block">
                TOOLS. PEOPLE. PROGRESS.
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id || (item.id === 'tools' && activeAdminTab === 'tool-detail');
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Mobile Switcher */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Quick Launch Worker Mobile View Button */}
        <button
          onClick={() => setViewMode('worker-mobile')}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/40 flex items-center justify-center gap-2"
        >
          <Smartphone className="w-4 h-4" />
          <span>Worker Check-In App</span>
        </button>

        <div className="px-2 py-1">
          <p className="text-[11px] font-medium text-slate-400">
            Building Safer Sites Together.
          </p>
          <p className="text-[10px] text-slate-400">
            Stronger Sites Smarter Tracking.
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
