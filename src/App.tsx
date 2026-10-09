import React from 'react';
import { RouterProvider } from './lib/router';
import { useRouter } from './lib/useRouter';
import { LandingPage } from './pages/LandingPage';
import { ScanPage } from './pages/ScanPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  if (currentPath === '/scan') {
    return <ScanPage />;
  }

  return <LandingPage />;
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
};

export default App;
