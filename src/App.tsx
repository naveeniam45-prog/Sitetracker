import React from 'react';
import { useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { WorkerMobileView } from './components/worker/WorkerMobileView';
import { AdminLayout } from './components/admin/AdminLayout';
import { Smartphone, Shield, LogOut, ArrowLeftRight } from 'lucide-react';

export const MainApp: React.FC = () => {
  const { currentUser, viewMode, setViewMode, logout } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating Quick-Switch Pill for Reviewers & Testing */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 text-white p-1.5 rounded-full shadow-2xl backdrop-blur-md border border-slate-700 text-xs transition-all scale-90 sm:scale-100">
        <button
          onClick={() => setViewMode(viewMode === 'worker-mobile' ? 'admin' : 'worker-mobile')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 font-bold transition-all"
        >
          {viewMode === 'worker-mobile' ? (
            <>
              <Shield className="w-3.5 h-3.5" />
              <span>Switch to Admin Dashboard</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Switch to Worker Mobile View (Page 6)</span>
            </>
          )}
        </button>

        <button
          onClick={logout}
          title="Sign out to Login Page"
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {viewMode === 'worker-mobile' ? (
        <WorkerMobileView />
      ) : (
        <AdminLayout />
      )}
    </div>
  );
};

export default MainApp;
