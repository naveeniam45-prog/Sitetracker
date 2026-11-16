import React from 'react';
import { useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { WorkerMobileView } from './components/worker/WorkerMobileView';

export const MainApp: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  // Purely Worker Check-In / Check-Out
  return <WorkerMobileView />;
};

export default MainApp;
